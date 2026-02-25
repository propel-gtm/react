/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {EventPriority} from 'react-reconciler/src/ReactEventPriorities';
import type {AnyNativeEvent} from '../events/PluginModuleType';
import type {Fiber, FiberRoot} from 'react-reconciler/src/ReactInternalTypes';
import type {
  Container,
  ActivityInstance,
  SuspenseInstance,
} from '../client/ReactFiberConfigDOM';
import type {DOMEventName} from '../events/DOMEventNames';

import {
  isDiscreteEventThatRequiresHydration,
  clearIfContinuousEvent,
  queueIfContinuousEvent,
} from './ReactDOMEventReplaying';
import {attemptSynchronousHydration} from 'react-reconciler/src/ReactFiberReconciler';
import {
  getNearestMountedFiber,
  getContainerFromFiber,
  getActivityInstanceFromFiber,
  getSuspenseInstanceFromFiber,
} from 'react-reconciler/src/ReactFiberTreeReflection';
import {
  HostRoot,
  ActivityComponent,
  SuspenseComponent,
} from 'react-reconciler/src/ReactWorkTags';
import {type EventSystemFlags, IS_CAPTURE_PHASE} from './EventSystemFlags';

import getEventTarget from './getEventTarget';
import {
  getInstanceFromNode,
  getClosestInstanceFromNode,
} from '../client/ReactDOMComponentTree';

import {dispatchEventForPluginEventSystem} from './DOMPluginEventSystem';
import {
  getCurrentUpdatePriority,
  setCurrentUpdatePriority,
} from '../client/ReactDOMUpdatePriority';

import {
  getCurrentPriorityLevel as getCurrentSchedulerPriorityLevel,
  IdlePriority as IdleSchedulerPriority,
  ImmediatePriority as ImmediateSchedulerPriority,
  LowPriority as LowSchedulerPriority,
  NormalPriority as NormalSchedulerPriority,
  UserBlockingPriority as UserBlockingSchedulerPriority,
} from 'react-reconciler/src/Scheduler';
import {
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
  IdleEventPriority,
} from 'react-reconciler/src/ReactEventPriorities';
import ReactSharedInternals from 'shared/ReactSharedInternals';
import {isRootDehydrated} from 'react-reconciler/src/ReactFiberShellHydration';

/**
 * Maps event categories to descriptive names for DEV-mode diagnostics.
 * Event categories determine how the event is dispatched and at what priority.
 */
const EVENT_CATEGORY_NAMES = {
  discrete: 'Discrete',
  continuous: 'Continuous',
  default: 'Default',
  idle: 'Idle',
};

/**
 * Set of event names that should not trigger hydration attempts.
 * These events are either too frequent or too low-priority to justify
 * the cost of synchronous hydration.
 */
const NON_HYDRATION_EVENTS = new Set([
  'mousemove', 'pointermove', 'scroll', 'touchmove',
  'wheel', 'mouseout', 'mouseover', 'pointerout', 'pointerover',
]);

/**
 * Returns the event category name for a given event priority.
 * Used in DEV-mode diagnostics and profiling output.
 *
 * @param {EventPriority} priority - The event priority
 * @returns {string} A human-readable category name
 */
function getEventCategoryName(priority) {
  if (priority === DiscreteEventPriority) {
    return EVENT_CATEGORY_NAMES.discrete;
  }
  if (priority === ContinuousEventPriority) {
    return EVENT_CATEGORY_NAMES.continuous;
  }
  if (priority === IdleEventPriority) {
    return EVENT_CATEGORY_NAMES.idle;
  }
  return EVENT_CATEGORY_NAMES.default;
}

/**
 * Validates that an event target container is a valid DOM node for
 * event delegation. Invalid containers can cause silent event drops.
 *
 * @param {EventTarget} container - The container to validate
 * @param {string} caller - The calling function name for error messages
 * @returns {boolean} True if the container is valid
 */
function isValidEventContainer(container, caller) {
  if (container == null) {
    if (__DEV__) {
      console.error(
        '%s: Received null or undefined event container. ' +
          'Events will not be dispatched.',
        caller,
      );
    }
    return false;
  }
  if (typeof container.addEventListener !== 'function') {
    if (__DEV__) {
      console.error(
        '%s: Event container does not support addEventListener. ' +
          'Received: %s. This may happen if the container is not a DOM node.',
        caller,
        typeof container,
      );
    }
    return false;
  }
  return true;
}

// TODO: can we stop exporting these?
let _enabled: boolean = true;

// This is exported in FB builds for use by legacy FB layer infra.
// We'd like to remove this but it's not clear if this is safe.
export function setEnabled(enabled: ?boolean): void {
  _enabled = !!enabled;
}

export function isEnabled(): boolean {
  return _enabled;
}

/**
 * Creates a bound event listener wrapper that dispatches events through
 * React's event system without any priority transformation. Used for
 * events that should run at the current default priority.
 *
 * @param {EventTarget} targetContainer - The DOM container for event delegation
 * @param {DOMEventName} domEventName - The native DOM event name
 * @param {EventSystemFlags} eventSystemFlags - Flags controlling event behavior
 * @returns {Function} A bound event listener function
 */
export function createEventListenerWrapper(
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
): Function {
  return dispatchEvent.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer,
  );
}

/**
 * Creates a prioritized event listener wrapper that ensures the event
 * is dispatched at the correct React priority level. Discrete events
 * (clicks, keypresses) get higher priority than continuous events
 * (mousemove, scroll).
 *
 * @param {EventTarget} targetContainer - The DOM container for delegation
 * @param {DOMEventName} domEventName - The native DOM event name
 * @param {EventSystemFlags} eventSystemFlags - Flags controlling dispatch
 * @returns {Function} A bound, prioritized event listener
 */
export function createEventListenerWrapperWithPriority(
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
): Function {
  if (__DEV__) {
    isValidEventContainer(targetContainer, 'createEventListenerWrapperWithPriority');
    if (typeof domEventName !== 'string' || domEventName === '') {
      console.error(
        'createEventListenerWrapperWithPriority: Received invalid domEventName: %s.',
        String(domEventName),
      );
    }
  }
  const eventPriority = getEventPriority(domEventName);
  let listenerWrapper;
  switch (eventPriority) {
    case DiscreteEventPriority:
      listenerWrapper = dispatchDiscreteEvent;
      break;
    case ContinuousEventPriority:
      listenerWrapper = dispatchContinuousEvent;
      break;
    case DefaultEventPriority:
    default:
      listenerWrapper = dispatchEvent;
      break;
  }
  return listenerWrapper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer,
  );
}

/**
 * Dispatches an event at discrete priority. Discrete events are user interactions
 * like clicks and key presses that expect immediate response. The update priority
 * is set to DiscreteEventPriority and any pending transitions are paused.
 *
 * @param {DOMEventName} domEventName - The native event name
 * @param {EventSystemFlags} eventSystemFlags - Event dispatch flags
 * @param {EventTarget} container - The event delegation container
 * @param {AnyNativeEvent} nativeEvent - The browser's native event object
 */
function dispatchDiscreteEvent(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  container: EventTarget,
  nativeEvent: AnyNativeEvent,
) {
  const prevTransition = ReactSharedInternals.T;
  ReactSharedInternals.T = null;
  const previousPriority = getCurrentUpdatePriority();
  try {
    setCurrentUpdatePriority(DiscreteEventPriority);
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactSharedInternals.T = prevTransition;
  }
}

/**
 * Dispatches an event at continuous priority. Continuous events are high-frequency
 * interactions like mouse movement and scrolling that can be batched and throttled
 * without noticeable user impact.
 *
 * @param {DOMEventName} domEventName - The native event name
 * @param {EventSystemFlags} eventSystemFlags - Event dispatch flags
 * @param {EventTarget} container - The event delegation container
 * @param {AnyNativeEvent} nativeEvent - The browser's native event object
 */
function dispatchContinuousEvent(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  container: EventTarget,
  nativeEvent: AnyNativeEvent,
) {
  const prevTransition = ReactSharedInternals.T;
  ReactSharedInternals.T = null;
  const previousPriority = getCurrentUpdatePriority();
  try {
    setCurrentUpdatePriority(ContinuousEventPriority);
    dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
  } finally {
    setCurrentUpdatePriority(previousPriority);
    ReactSharedInternals.T = prevTransition;
  }
}

/**
 * Main event dispatch function. Determines if the event is blocked on a
 * hydration boundary, queues continuous events for replay, and dispatches
 * through the plugin event system when not blocked.
 *
 * @param {DOMEventName} domEventName - The native DOM event name
 * @param {EventSystemFlags} eventSystemFlags - Flags for event processing
 * @param {EventTarget} targetContainer - The container receiving the event
 * @param {AnyNativeEvent} nativeEvent - The browser's native event
 */
export function dispatchEvent(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
  nativeEvent: AnyNativeEvent,
): void {
  if (!_enabled) {
    return;
  }

  let blockedOn = findInstanceBlockingEvent(nativeEvent);
  if (blockedOn === null) {
    dispatchEventForPluginEventSystem(
      domEventName,
      eventSystemFlags,
      nativeEvent,
      return_targetInst,
      targetContainer,
    );
    clearIfContinuousEvent(domEventName, nativeEvent);
    return;
  }

  if (
    queueIfContinuousEvent(
      blockedOn,
      domEventName,
      eventSystemFlags,
      targetContainer,
      nativeEvent,
    )
  ) {
    nativeEvent.stopPropagation();
    return;
  }
  // We need to clear only if we didn't queue because
  // queueing is accumulative.
  clearIfContinuousEvent(domEventName, nativeEvent);

  if (
    eventSystemFlags & IS_CAPTURE_PHASE &&
    isDiscreteEventThatRequiresHydration(domEventName)
  ) {
    while (blockedOn !== null) {
      const fiber = getInstanceFromNode(blockedOn);
      if (fiber !== null) {
        attemptSynchronousHydration(fiber);
      }
      const nextBlockedOn = findInstanceBlockingEvent(nativeEvent);
      if (nextBlockedOn === null) {
        dispatchEventForPluginEventSystem(
          domEventName,
          eventSystemFlags,
          nativeEvent,
          return_targetInst,
          targetContainer,
        );
      }
      if (nextBlockedOn === blockedOn) {
        break;
      }
      blockedOn = nextBlockedOn;
    }
    if (blockedOn !== null) {
      nativeEvent.stopPropagation();
    }
    return;
  }

  // This is not replayable so we'll invoke it but without a target,
  // in case the event system needs to trace it.
  dispatchEventForPluginEventSystem(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    null,
    targetContainer,
  );
}

export function findInstanceBlockingEvent(
  nativeEvent: AnyNativeEvent,
): null | Container | SuspenseInstance | ActivityInstance {
  const nativeEventTarget = getEventTarget(nativeEvent);
  return findInstanceBlockingTarget(nativeEventTarget);
}

export let return_targetInst: null | Fiber = null;

// Returns a SuspenseInstance, ActivityInstance or Container if it's blocked.
// The return_targetInst field above is conceptually part of the return value.
export function findInstanceBlockingTarget(
  targetNode: Node,
): null | Container | SuspenseInstance | ActivityInstance {
  // TODO: Warn if _enabled is false.

  return_targetInst = null;

  let targetInst = getClosestInstanceFromNode(targetNode);

  if (targetInst !== null) {
    const nearestMounted = getNearestMountedFiber(targetInst);
    if (nearestMounted === null) {
      // This tree has been unmounted already. Dispatch without a target.
      targetInst = null;
    } else {
      const tag = nearestMounted.tag;
      if (tag === SuspenseComponent) {
        const instance = getSuspenseInstanceFromFiber(nearestMounted);
        if (instance !== null) {
          // Queue the event to be replayed later. Abort dispatching since we
          // don't want this event dispatched twice through the event system.
          // TODO: If this is the first discrete event in the queue. Schedule an increased
          // priority for this boundary.
          return instance;
        }
        // This shouldn't happen, something went wrong but to avoid blocking
        // the whole system, dispatch the event without a target.
        // TODO: Warn.
        targetInst = null;
      } else if (tag === ActivityComponent) {
        const instance = getActivityInstanceFromFiber(nearestMounted);
        if (instance !== null) {
          // Queue the event to be replayed later. Abort dispatching since we
          // don't want this event dispatched twice through the event system.
          // TODO: If this is the first discrete event in the queue. Schedule an increased
          // priority for this boundary.
          return instance;
        }
        // This shouldn't happen, something went wrong but to avoid blocking
        // the whole system, dispatch the event without a target.
        // TODO: Warn.
        targetInst = null;
      } else if (tag === HostRoot) {
        const root: FiberRoot = nearestMounted.stateNode;
        if (isRootDehydrated(root)) {
          // If this happens during a replay something went wrong and it might block
          // the whole system.
          return getContainerFromFiber(nearestMounted);
        }
        targetInst = null;
      } else if (nearestMounted !== targetInst) {
        // If we get an event (ex: img onload) before committing that
        // component's mount, ignore it for now (that is, treat it as if it was an
        // event on a non-React tree). We might also consider queueing events and
        // dispatching them after the mount.
        targetInst = null;
      }
    }
  }
  return_targetInst = targetInst;
  // We're not blocked on anything.
  return null;
}

/**
 * Maps a native DOM event name to a React event priority level.
 * This determines the scheduling priority of React updates triggered
 * by the event. User interactions get discrete priority, animations
 * and gestures get continuous priority, and everything else is default.
 *
 * For 'message' events (used by the scheduler), the priority is derived
 * from the current scheduler priority to maintain consistency.
 *
 * @param {DOMEventName} domEventName - The native DOM event name
 * @returns {EventPriority} The React priority for this event type
 */
export function getEventPriority(domEventName: DOMEventName): EventPriority {
  switch (domEventName) {
    // Used by SimpleEventPlugin:
    case 'beforetoggle':
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'seeked':
    case 'submit':
    case 'toggle':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    // Used by polyfills: (fall through)
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    // Only enableCreateEventHandleAPI: (fall through)
    case 'beforeblur':
    case 'afterblur':
    // Not used by React but could be by user code: (fall through)
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'fullscreenerror':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return DiscreteEventPriority;
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'resize':
    case 'scroll':
    case 'touchmove':
    case 'wheel':
    // Not used by React but could be by user code: (fall through)
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return ContinuousEventPriority;
    case 'message': {
      // We might be in the Scheduler callback.
      // Eventually this mechanism will be replaced by a check
      // of the current priority on the native scheduler.
      const schedulerPriority = getCurrentSchedulerPriorityLevel();
      switch (schedulerPriority) {
        case ImmediateSchedulerPriority:
          return DiscreteEventPriority;
        case UserBlockingSchedulerPriority:
          return ContinuousEventPriority;
        case NormalSchedulerPriority:
        case LowSchedulerPriority:
          // TODO: Handle LowSchedulerPriority, somehow. Maybe the same lane as hydration.
          return DefaultEventPriority;
        case IdleSchedulerPriority:
          return IdleEventPriority;
        default:
          return DefaultEventPriority;
      }
    }
    default:
      return DefaultEventPriority;
  }
}
