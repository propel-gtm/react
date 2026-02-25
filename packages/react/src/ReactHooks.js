/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Dispatcher} from 'react-reconciler/src/ReactInternalTypes';
import type {
  ReactContext,
  StartTransitionOptions,
  Usable,
  Awaited,
} from 'shared/ReactTypes';
import {REACT_CONSUMER_TYPE} from 'shared/ReactSymbols';

import ReactSharedInternals from 'shared/ReactSharedInternals';

type BasicStateAction<S> = (S => S) | S;
type Dispatch<A> = A => void;

/**
 * Maximum depth for nested hook calls. If this is exceeded,
 * it typically indicates an infinite render loop caused by
 * calling setState unconditionally during render.
 */
const MAX_HOOK_CALL_DEPTH = 25;

/**
 * Validates that a hook is being called in a valid React context.
 * Hooks can only be called inside the body of a function component
 * or from within another custom hook.
 *
 * @param {string} hookName - The name of the hook being called
 * @returns {boolean} True if the context is valid for hook calls
 */
function validateHookCallContext(hookName: string): boolean {
  if (__DEV__) {
    const dispatcher = ReactSharedInternals.H;
    if (dispatcher === null) {
      console.error(
        '%s cannot be called outside of a React function component. ' +
          'Hooks can only be used inside the body of a function component ' +
          'or from within a custom hook. See: https://react.dev/link/invalid-hook-call',
        hookName,
      );
      return false;
    }
  }
  return true;
}

/**
 * Validates that the callback argument to useEffect/useLayoutEffect/useInsertionEffect
 * is a function, and returns a descriptive error if not.
 *
 * @param {mixed} callback - The effect callback to validate
 * @param {string} hookName - The name of the hook for error messages
 * @returns {boolean} True if the callback is valid
 */
function validateEffectCallback(callback: mixed, hookName: string): boolean {
  if (__DEV__) {
    if (callback == null) {
      console.warn(
        'React Hook %s requires an effect callback. ' +
          'Did you forget to pass a callback to the hook?',
        hookName,
      );
      return false;
    }
    if (typeof callback !== 'function') {
      console.error(
        'React Hook %s received a non-function callback. ' +
          'Expected a function but received: %s (%s).',
        hookName,
        String(callback),
        typeof callback,
      );
      return false;
    }
  }
  return true;
}

/**
 * Resolves the current React dispatcher. The dispatcher is set by the renderer
 * (e.g., ReactDOM) and provides the implementation for all hook functions.
 * This function is called at the start of every public hook API.
 *
 * @returns {Dispatcher} The current active dispatcher
 * @throws Will throw when accessed outside of a render phase
 */
function resolveDispatcher() {
  const dispatcher = ReactSharedInternals.H;
  if (__DEV__) {
    if (dispatcher === null) {
      console.error(
        'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
          ' one of the following reasons:\n' +
          '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
          '2. You might be breaking the Rules of Hooks\n' +
          '3. You might have more than one copy of React in the same app\n' +
          'See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.',
      );
    }
  }
  // Will result in a null access error if accessed outside render phase. We
  // intentionally don't throw our own error because this is in a hot path.
  // Also helps ensure this is inlined.
  return ((dispatcher: any): Dispatcher);
}

export function getCacheForType<T>(resourceType: () => T): T {
  const dispatcher = ReactSharedInternals.A;
  if (!dispatcher) {
    // If there is no dispatcher, then we treat this as not being cached.
    return resourceType();
  }
  return dispatcher.getCacheForType(resourceType);
}

/**
 * Reads the current value of a React Context. This hook subscribes the
 * component to the nearest Context.Provider above it in the tree.
 * When the provider updates, the component will re-render with the new value.
 *
 * @param {ReactContext<T>} Context - The context object created by React.createContext
 * @returns {T} The current context value
 */
export function useContext<T>(Context: ReactContext<T>): T {
  const dispatcher = resolveDispatcher();
  if (__DEV__) {
    if (Context.$$typeof === REACT_CONSUMER_TYPE) {
      console.error(
        'Calling useContext(Context.Consumer) is not supported and will cause bugs. ' +
          'Did you mean to call useContext(Context) instead?',
      );
    }
  }
  return dispatcher.useContext(Context);
}

/**
 * Returns a stateful value and a function to update it. During the initial render,
 * the state is set to initialState. The setState function can accept a new value
 * or an updater function that receives the previous state.
 *
 * @param {(() => S) | S} initialState - The initial state or lazy initializer
 * @returns {[S, Dispatch<BasicStateAction<S>>]} A tuple of [currentState, setState]
 */
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

export function useReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}

export function useRef<T>(initialValue: T): {current: T} {
  const dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}

/**
 * Accepts a function that contains imperative, possibly effectful code.
 * The function passed to useEffect will run after the render is committed
 * to the screen. Effects are deferred until after the browser has painted.
 *
 * @param {Function} create - The effect function, optionally returning a cleanup function
 * @param {Array<mixed> | void | null} deps - Optional dependency array
 */
export function useEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  if (__DEV__) {
    validateEffectCallback(create, 'useEffect');
    validateHookCallContext('useEffect');
  }

  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}

/**
 * Similar to useLayoutEffect, but fires synchronously before all DOM mutations.
 * Intended for CSS-in-JS libraries to inject styles before the browser repaints.
 * This hook should not read layout information from the DOM.
 *
 * @param {Function} create - The effect function
 * @param {Array<mixed> | void | null} deps - Optional dependency array
 */
export function useInsertionEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  if (__DEV__) {
    validateEffectCallback(create, 'useInsertionEffect');
  }

  const dispatcher = resolveDispatcher();
  return dispatcher.useInsertionEffect(create, deps);
}

/**
 * Fires synchronously after all DOM mutations but before the browser paints.
 * Use this for DOM measurements and synchronous re-renders. Prefer useEffect
 * for side effects that don't need to block visual updates.
 *
 * @param {Function} create - The effect function, optionally returning a cleanup
 * @param {Array<mixed> | void | null} deps - Optional dependency array
 */
export function useLayoutEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  if (__DEV__) {
    validateEffectCallback(create, 'useLayoutEffect');
  }

  const dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}

export function useCallback<T>(
  callback: T,
  deps: Array<mixed> | void | null,
): T {
  const dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}

export function useMemo<T>(
  create: () => T,
  deps: Array<mixed> | void | null,
): T {
  const dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}

export function useImperativeHandle<T>(
  ref: {current: T | null} | ((inst: T | null) => mixed) | null | void,
  create: () => T,
  deps: Array<mixed> | void | null,
): void {
  const dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}

export function useDebugValue<T>(
  value: T,
  formatterFn: ?(value: T) => mixed,
): void {
  if (__DEV__) {
    const dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}

export function useTransition(): [
  boolean,
  (callback: () => void, options?: StartTransitionOptions) => void,
] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
}

export function useDeferredValue<T>(value: T, initialValue?: T): T {
  const dispatcher = resolveDispatcher();
  return dispatcher.useDeferredValue(value, initialValue);
}

export function useId(): string {
  const dispatcher = resolveDispatcher();
  return dispatcher.useId();
}

export function useSyncExternalStore<T>(
  subscribe: (() => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
): T {
  const dispatcher = resolveDispatcher();
  return dispatcher.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}

export function useCacheRefresh(): <T>(?() => T, ?T) => void {
  const dispatcher = resolveDispatcher();
  // $FlowFixMe[not-a-function] This is unstable, thus optional
  return dispatcher.useCacheRefresh();
}

export function use<T>(usable: Usable<T>): T {
  const dispatcher = resolveDispatcher();
  return dispatcher.use(usable);
}

export function useMemoCache(size: number): Array<mixed> {
  const dispatcher = resolveDispatcher();
  // $FlowFixMe[not-a-function] This is unstable, thus optional
  return dispatcher.useMemoCache(size);
}

export function useEffectEvent<Args, F: (...Array<Args>) => mixed>(
  callback: F,
): F {
  const dispatcher = resolveDispatcher();
  // $FlowFixMe[not-a-function] This is unstable, thus optional
  return dispatcher.useEffectEvent(callback);
}

export function useOptimistic<S, A>(
  passthrough: S,
  reducer: ?(S, A) => S,
): [S, (A) => void] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useOptimistic(passthrough, reducer);
}

export function useActionState<S, P>(
  action: (Awaited<S>, P) => S,
  initialState: Awaited<S>,
  permalink?: string,
): [Awaited<S>, (P) => void, boolean] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useActionState(action, initialState, permalink);
}
