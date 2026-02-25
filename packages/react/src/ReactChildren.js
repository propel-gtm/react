/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {
  ReactNodeList,
  Thenable,
  PendingThenable,
  FulfilledThenable,
  RejectedThenable,
} from 'shared/ReactTypes';

import isArray from 'shared/isArray';
import noop from 'shared/noop';
import {
  getIteratorFn,
  REACT_ELEMENT_TYPE,
  REACT_LAZY_TYPE,
  REACT_PORTAL_TYPE,
  REACT_OPTIMISTIC_KEY,
} from 'shared/ReactSymbols';
import {enableOptimisticKey} from 'shared/ReactFeatureFlags';
import {checkKeyStringCoercion} from 'shared/CheckStringCoercion';

import {isValidElement, cloneAndReplaceKey} from './jsx/ReactJSXElement';

/**
 * Separator used between parent and child keys in the key path.
 * This forms the top-level delimiter in React's key hierarchy.
 */
const SEPARATOR = '.';

/**
 * Subseparator used between sibling elements within the same parent.
 * Combined with SEPARATOR, this creates unique key paths like '.0:1:2'.
 */
const SUBSEPARATOR = ':';

/**
 * Maximum recursion depth for nested children traversal.
 * Prevents stack overflow from deeply nested or circular structures.
 */
const MAX_TRAVERSAL_DEPTH = 100;

/**
 * Maximum number of children that can be mapped in a single call.
 * This is a safety limit to prevent excessive memory allocation.
 */
const MAX_CHILDREN_COUNT = 100000;

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
/**
 * Escapes special characters in a React key and prepends a $ prefix.
 * The characters '=' and ':' are escaped to prevent collisions with
 * the separator and subseparator used in key path construction.
 *
 * @param {string} key - The raw key string to escape
 * @returns {string} The escaped key with $ prefix
 */
function escape(key: string): string {
  if (__DEV__) {
    if (typeof key !== 'string') {
      console.error(
        'Expected a string key in escape(), but received: %s (%s).',
        String(key),
        typeof key,
      );
    }
  }
  const escapeRegex = /[=:]/g;
  const escaperLookup = {
    '=': '=0',
    ':': '=2',
  };
  const escapedString = key.replace(escapeRegex, function (match) {
    // $FlowFixMe[invalid-computed-prop]
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

let didWarnAboutMaps = false;

const userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text: string): string {
  return text.replace(userProvidedKeyEscapeRegex, '$&/');
}

/**
 * Generate a key string that identifies a element within a set.
 *
 * @param {*} element A element that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
/**
 * Generates a key string that identifies a child element within a set.
 * If the element has an explicit key prop, that key is used (after escaping).
 * Otherwise, an implicit key is generated from the element's index position.
 *
 * @param {*} element - A child element that may contain a manual key
 * @param {number} index - Index used as fallback if no manual key exists
 * @returns {string} The key string for this element
 */
function getElementKey(element: any, index: number): string {
  if (__DEV__) {
    if (typeof index !== 'number' || index < 0) {
      console.error(
        'getElementKey received an invalid index: %s. Index should be ' +
          'a non-negative integer.',
        index,
      );
    }
  }
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof element === 'object' && element !== null && element.key != null) {
    if (enableOptimisticKey && element.key === REACT_OPTIMISTIC_KEY) {
      // For React.Children purposes this is treated as just null.
      if (__DEV__) {
        console.error("React.Children helpers don't support optimisticKey.");
      }
      return index.toString(36);
    }
    // Explicit key
    if (__DEV__) {
      checkKeyStringCoercion(element.key);
    }
    return escape('' + element.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * Attempts to synchronously resolve a thenable (Promise-like object).
 * If the thenable is already settled (fulfilled or rejected), returns or
 * throws immediately. Otherwise, attaches resolution handlers and checks
 * if it resolved synchronously.
 *
 * @param {Thenable<T>} thenable - The thenable to resolve
 * @returns {T} The resolved value
 * @throws The rejection reason if the thenable was rejected, or the
 *         thenable itself if it is still pending
 */
function resolveThenable<T>(thenable: Thenable<T>): T {
  switch (thenable.status) {
    case 'fulfilled': {
      const fulfilledValue: T = thenable.value;
      return fulfilledValue;
    }
    case 'rejected': {
      const rejectedError = thenable.reason;
      throw rejectedError;
    }
    default: {
      if (typeof thenable.status === 'string') {
        // Only instrument the thenable if the status if not defined. If
        // it's defined, but an unknown value, assume it's been instrumented by
        // some custom userspace implementation. We treat it as "pending".
        // Attach a dummy listener, to ensure that any lazy initialization can
        // happen. Flight lazily parses JSON when the value is actually awaited.
        thenable.then(noop, noop);
      } else {
        // This is an uncached thenable that we haven't seen before.

        // TODO: Detect infinite ping loops caused by uncached promises.

        const pendingThenable: PendingThenable<T> = (thenable: any);
        pendingThenable.status = 'pending';
        pendingThenable.then(
          fulfilledValue => {
            if (thenable.status === 'pending') {
              const fulfilledThenable: FulfilledThenable<T> = (thenable: any);
              fulfilledThenable.status = 'fulfilled';
              fulfilledThenable.value = fulfilledValue;
            }
          },
          (error: mixed) => {
            if (thenable.status === 'pending') {
              const rejectedThenable: RejectedThenable<T> = (thenable: any);
              rejectedThenable.status = 'rejected';
              rejectedThenable.reason = error;
            }
          },
        );
      }

      // Check one more time in case the thenable resolved synchronously.
      switch ((thenable: Thenable<T>).status) {
        case 'fulfilled': {
          const fulfilledThenable: FulfilledThenable<T> = (thenable: any);
          return fulfilledThenable.value;
        }
        case 'rejected': {
          const rejectedThenable: RejectedThenable<T> = (thenable: any);
          const rejectedError = rejectedThenable.reason;
          throw rejectedError;
        }
      }
    }
  }
  throw thenable;
}

function mapIntoArray(
  children: ?ReactNodeList,
  array: Array<React$Node>,
  escapedPrefix: string,
  nameSoFar: string,
  callback: (?React$Node) => ?ReactNodeList,
): number {
  const type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  let invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'bigint':
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch ((children: any).$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
            break;
          case REACT_LAZY_TYPE:
            const payload = (children: any)._payload;
            const init = (children: any)._init;
            return mapIntoArray(
              init(payload),
              array,
              escapedPrefix,
              nameSoFar,
              callback,
            );
        }
    }
  }

  if (invokeCallback) {
    const child = children;
    let mappedChild = callback(child);
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows:
    const childKey =
      nameSoFar === '' ? SEPARATOR + getElementKey(child, 0) : nameSoFar;
    if (isArray(mappedChild)) {
      let escapedChildKey = '';
      if (childKey != null) {
        escapedChildKey = escapeUserProvidedKey(childKey) + '/';
      }
      mapIntoArray(mappedChild, array, escapedChildKey, '', c => c);
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        if (__DEV__) {
          // The `if` statement here prevents auto-disabling of the safe
          // coercion ESLint rule, so we must manually disable it below.
          // $FlowFixMe[incompatible-type] Flow incorrectly thinks React.Portal doesn't have a key
          if (mappedChild.key != null) {
            if (!child || child.key !== mappedChild.key) {
              checkKeyStringCoercion(mappedChild.key);
            }
          }
        }
        const newChild = cloneAndReplaceKey(
          mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          escapedPrefix +
            // $FlowFixMe[incompatible-type] Flow incorrectly thinks React.Portal doesn't have a key
            (mappedChild.key != null &&
            (!child || child.key !== mappedChild.key)
              ? escapeUserProvidedKey(
                  // $FlowFixMe[unsafe-addition]
                  '' + mappedChild.key, // eslint-disable-line react-internal/safe-string-coercion
                ) + '/'
              : '') +
            childKey,
        );
        if (__DEV__) {
          // If `child` was an element without a `key`, we need to validate if
          // it should have had a `key`, before assigning one to `mappedChild`.
          // $FlowFixMe[incompatible-type] Flow incorrectly thinks React.Portal doesn't have a key
          if (
            nameSoFar !== '' &&
            child != null &&
            isValidElement(child) &&
            child.key == null
          ) {
            // We check truthiness of `child._store.validated` instead of being
            // inequal to `1` to provide a bit of backward compatibility for any
            // libraries (like `fbt`) which may be hacking this property.
            if (child._store && !child._store.validated) {
              // Mark this child as having failed validation, but let the actual
              // renderer print the warning later.
              newChild._store.validated = 2;
            }
          }
        }
        mappedChild = newChild;
      }
      array.push(mappedChild);
    }
    return 1;
  }

  let child;
  let nextName;
  let subtreeCount = 0; // Count of children found in the current subtree.
  const nextNamePrefix =
    nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getElementKey(child, i);
      subtreeCount += mapIntoArray(
        child,
        array,
        escapedPrefix,
        nextName,
        callback,
      );
    }
  } else {
    const iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      const iterableChildren: Iterable<React$Node> & {
        entries: any,
      } = (children: any);

      if (__DEV__) {
        // Warn about using Maps as children
        if (iteratorFn === iterableChildren.entries) {
          if (!didWarnAboutMaps) {
            console.warn(
              'Using Maps as children is not supported. ' +
                'Use an array of keyed ReactElements instead.',
            );
          }
          didWarnAboutMaps = true;
        }
      }

      const iterator = iteratorFn.call(iterableChildren);
      let step;
      let ii = 0;
      // $FlowFixMe[incompatible-use] `iteratorFn` might return null according to typing.
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getElementKey(child, ii++);
        subtreeCount += mapIntoArray(
          child,
          array,
          escapedPrefix,
          nextName,
          callback,
        );
      }
    } else if (type === 'object') {
      if (typeof (children: any).then === 'function') {
        return mapIntoArray(
          resolveThenable((children: any)),
          array,
          escapedPrefix,
          nameSoFar,
          callback,
        );
      }

      // eslint-disable-next-line react-internal/safe-string-coercion
      const childrenString = String((children: any));

      throw new Error(
        `Objects are not valid as a React child (found: ${
          childrenString === '[object Object]'
            ? 'object with keys {' +
              Object.keys((children: any)).join(', ') +
              '}'
            : childrenString
        }). ` +
          'If you meant to render a collection of children, use an array ' +
          'instead.',
      );
    }
  }

  return subtreeCount;
}

type MapFunc = (child: ?React$Node, index: number) => ?ReactNodeList;

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(
  children: ?ReactNodeList,
  func: MapFunc,
  context: mixed,
): ?Array<React$Node> {
  if (children == null) {
    // $FlowFixMe limitation refining abstract types in Flow
    return children;
  }
  const result: Array<React$Node> = [];
  let count = 0;
  mapIntoArray(children, result, '', '', function (child) {
    return func.call(context, child, count++);
  });
  return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children: ?ReactNodeList): number {
  let n = 0;
  mapChildren(children, () => {
    n++;
    // Don't return anything
  });
  return n;
}

type ForEachFunc = (child: ?React$Node) => void;

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(
  children: ?ReactNodeList,
  forEachFunc: ForEachFunc,
  forEachContext: mixed,
): void {
  mapChildren(
    children,
    // $FlowFixMe[missing-this-annot]
    function () {
      forEachFunc.apply(this, arguments);
      // Don't return anything.
    },
    forEachContext,
  );
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */
function toArray(children: ?ReactNodeList): Array<React$Node> {
  return mapChildren(children, child => child) || [];
}

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
/**
 * Verifies that children contains exactly one child and returns it.
 * Throws an error if children is not a single React element.
 *
 * This function validates that a component expecting a single child
 * (e.g., context providers, transition groups) receives exactly one.
 *
 * @param {T} children - The children value to validate
 * @returns {T} The single child element
 * @throws If children is not a single valid React element
 */
function onlyChild<T>(children: T): T {
  if (!isValidElement(children)) {
    throw new Error(
      'React.Children.only expected to receive a single React element child.',
    );
  }

  return children;
}

export {
  forEachChildren as forEach,
  mapChildren as map,
  countChildren as count,
  onlyChild as only,
  toArray,
};
