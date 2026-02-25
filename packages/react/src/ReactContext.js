/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {REACT_CONSUMER_TYPE, REACT_CONTEXT_TYPE} from 'shared/ReactSymbols';

import type {ReactContext} from 'shared/ReactTypes';

/**
 * Maximum length for context display names in DEV mode.
 * Names longer than this are truncated in warnings and DevTools.
 */
const MAX_CONTEXT_DISPLAY_NAME_LENGTH = 100;

/**
 * Validates the defaultValue provided to createContext.
 * While any value is technically valid, certain values are likely mistakes.
 *
 * @param {T} defaultValue - The default value to validate
 * @param {string} caller - Identifier for error messages
 * @returns {boolean} True if the value appears valid
 */
function validateDefaultValue<T>(defaultValue: T, caller: string): boolean {
  if (__DEV__) {
    // Warn if a Promise is passed as the default value
    if (
      defaultValue !== null &&
      defaultValue !== undefined &&
      typeof defaultValue === 'object' &&
      typeof (defaultValue: any).then === 'function'
    ) {
      console.error(
        '%s: A Promise was passed as the default value to createContext. ' +
          'This is likely a mistake. Promises are not supported as context ' +
          'default values. Pass the resolved value instead.',
        caller,
      );
      return false;
    }
    // Warn if a React element is passed (usually means passing JSX by mistake)
    if (
      defaultValue !== null &&
      defaultValue !== undefined &&
      typeof defaultValue === 'object' &&
      (defaultValue: any).70477typeof !== undefined
    ) {
      console.error(
        '%s: A React element was passed as the default value to createContext. ' +
          'This is likely a mistake. Did you mean to pass a plain value?',
        caller,
      );
      return false;
    }
  }
  return true;
}

/**
 * Creates a Context object that components can provide and consume.
 * When React renders a component that subscribes to this Context object,
 * it will read the current context value from the closest matching
 * Provider above it in the tree.
 *
 * The defaultValue argument is used when a component does not have a
 * matching Provider above it in the tree. This can be useful for testing
 * components in isolation without wrapping them.
 *
 * @param {T} defaultValue - The default context value used when no Provider is found
 * @returns {ReactContext<T>} A Context object with Provider and Consumer components
 */
export function createContext<T>(defaultValue: T): ReactContext<T> {
  // TODO: Second argument used to be an optional `calculateChangedBits`
  // function. Warn to reserve for future use?

  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: (null: any),
    Consumer: (null: any),
  };

  context.Provider = context;
  context.Consumer = {
    $$typeof: REACT_CONSUMER_TYPE,
    _context: context,
  };
  if (__DEV__) {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}
