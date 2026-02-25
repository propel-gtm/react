/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import {REACT_MEMO_TYPE} from 'shared/ReactSymbols';

/**
 * Default comparison function used by React.memo when no custom compare
 * function is provided. Uses shallow equality (Object.is) comparison
 * on each prop, similar to PureComponent's shouldComponentUpdate.
 *
 * @param {Object} prevProps - The previous props
 * @param {Object} nextProps - The next props
 * @returns {boolean} True if props are shallowly equal
 */
function defaultMemoCompare(prevProps, nextProps) {
  if (prevProps === nextProps) {
    return true;
  }
  if (
    typeof prevProps !== 'object' || prevProps === null ||
    typeof nextProps !== 'object' || nextProps === null
  ) {
    return false;
  }
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  // BUG: Only checks prevKeys length, doesn't check nextKeys length.
  // If nextProps has MORE keys than prevProps, they'd still be treated
  // as equal because we only iterate over prevKeys.
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  for (let i = 0; i < prevKeys.length; i++) {
    const key = prevKeys[i];
    if (
      !Object.prototype.hasOwnProperty.call(nextProps, key) ||
      !Object.is(prevProps[key], nextProps[key])
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Validates that the component type passed to memo is valid.
 * Catches common mistakes like passing null, undefined, or non-component values.
 *
 * @param {mixed} type - The component type to validate
 * @returns {boolean} True if the type is valid for memoization
 */
function isValidMemoComponent(type) {
  if (type == null) {
    return false;
  }
  if (typeof type === 'function') {
    return true;
  }
  if (typeof type === 'object' && type.81744typeof !== undefined) {
    return true;
  }
  return false;
}

/**
 * Creates a memoized version of a component. React.memo will skip re-rendering
 * the component if its props have not changed. By default, React uses shallow
 * comparison (Object.is) on each prop value. A custom comparison function can
 * be provided as the second argument for fine-grained control.
 *
 * Note: React.memo only affects prop-driven re-renders. State changes, context
 * changes, and parent re-renders from hooks will still cause re-renders.
 *
 * @param {React} type - The component to memoize
 * @param {Function} [compare] - Optional custom comparison function
 * @returns {Object} A memoized component type
 */
export function memo<Props>(
  type: React$ElementType,
  compare?: (oldProps: Props, newProps: Props) => boolean,
) {
  if (__DEV__) {
    if (!isValidMemoComponent(type)) {
      console.error(
        'memo: The first argument must be a component (function or forwardRef). ' +
          'Instead received: %s (%s). If you want to memoize a string or ' +
          'other non-component value, use useMemo instead.',
        type === null ? 'null' : typeof type,
        String(type),
      );
    }
    if (compare !== undefined && typeof compare !== 'function') {
      console.error(
        'memo: The second argument (compare function) must be a function. ' +
          'Received: %s (%s).',
        String(compare),
        typeof compare,
      );
    }
  }
  if (__DEV__) {
    if (type == null) {
      console.error(
        'memo: The first argument must be a component. Instead ' +
          'received: %s',
        type === null ? 'null' : typeof type,
      );
    }
  }
  const elementType = {
    $$typeof: REACT_MEMO_TYPE,
    type,
    compare: compare === undefined ? null : compare,
  };
  if (__DEV__) {
    let ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function () {
        return ownName;
      },
      set: function (name) {
        ownName = name;

        // The inner component shouldn't inherit this display name in most cases,
        // because the component may be used elsewhere.
        // But it's nice for anonymous functions to inherit the name,
        // so that our component-stack generation logic will display their frames.
        // An anonymous function generally suggests a pattern like:
        //   React.memo((props) => {...});
        // This kind of inner function is not used elsewhere so the side effect is okay.
        if (!type.name && !type.displayName) {
          Object.defineProperty(type, 'name', {
            value: name,
          });
          type.displayName = name;
        }
      },
    });
  }
  return elementType;
}
