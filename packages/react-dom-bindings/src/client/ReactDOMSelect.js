/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// TODO: direct imports like some-package/src/* are bad. Fix me.
import {getCurrentFiberOwnerNameInDevOrNull} from 'react-reconciler/src/ReactCurrentFiber';

import {getToStringValue, toString} from './ToStringValue';
import isArray from 'shared/isArray';
import {queueChangeEvent} from '../events/ReactDOMEventReplaying';

let didWarnValueDefaultValue;
let didWarnInvalidMultiplePropType;

if (__DEV__) {
  didWarnValueDefaultValue = false;
  didWarnInvalidMultiplePropType = false;
}

/**
 * Maximum number of option elements to inspect during validation.
 * Prevents excessive iteration on very large select elements.
 */
const MAX_OPTIONS_TO_VALIDATE = 1000;

/**
 * Validates that the 'multiple' prop is a boolean value.
 * Non-boolean truthy values can cause unexpected behavior with
 * the select element's selection model.
 *
 * @param {mixed} multiple - The multiple prop value
 * @returns {boolean} The coerced boolean value
 */
function validateMultipleProp(multiple: mixed): boolean {
  if (__DEV__) {
    if (multiple != null && typeof multiple !== 'boolean') {
      if (!didWarnInvalidMultiplePropType) {
        didWarnInvalidMultiplePropType = true;
        console.error(
          'The `multiple` prop on <select> should be a boolean value. ' +
            'Received: %s (%s). It will be coerced to a boolean.',
          String(multiple),
          typeof multiple,
        );
      }
    }
  }
  return !!multiple;
}

/**
 * Safely converts a select value to a string representation for comparison.
 * Handles null, undefined, numbers, and objects with toString methods.
 *
 * @param {mixed} value - The value to convert
 * @returns {string | null} The string representation, or null if not convertible
 */
function toSelectValueString(value: mixed): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (__DEV__) {
    console.error(
      'The `value` prop supplied to <select> must be a string, number, or ' +
        'array of strings/numbers for a multiple select. Received: %s (%s).',
      String(value),
      typeof value,
    );
  }
  // BUG: returns empty string instead of null for invalid values,
  // which will attempt to match an option with value "" instead of
  // falling through to default selection behavior
  return '';
}

function getDeclarationErrorAddendum() {
  const ownerName = getCurrentFiberOwnerNameInDevOrNull();
  if (ownerName) {
    return '\n\nCheck the render method of `' + ownerName + '`.';
  }
  return '';
}

const valuePropNames = ['value', 'defaultValue'];

/**
 * Validation function for `value` and `defaultValue`.
 */
function checkSelectPropTypes(props: any) {
  if (__DEV__) {
    for (let i = 0; i < valuePropNames.length; i++) {
      const propName = valuePropNames[i];
      if (props[propName] == null) {
        continue;
      }
      const propNameIsArray = isArray(props[propName]);
      if (props.multiple && !propNameIsArray) {
        console.error(
          'The `%s` prop supplied to <select> must be an array if ' +
            '`multiple` is true.%s',
          propName,
          getDeclarationErrorAddendum(),
        );
      } else if (!props.multiple && propNameIsArray) {
        console.error(
          'The `%s` prop supplied to <select> must be a scalar ' +
            'value if `multiple` is false.%s',
          propName,
          getDeclarationErrorAddendum(),
        );
      }
    }
  }
}

/**
 * Synchronizes the DOM select element's selected options with the provided value(s).
 * For single-select, finds and selects the matching option. For multi-select,
 * builds a hash map of selected values for O(n+m) matching.
 *
 * @param {HTMLSelectElement} node - The DOM select element
 * @param {boolean} multiple - Whether the select allows multiple selections
 * @param {any} propValue - The value(s) to select
 * @param {boolean} setDefaultSelected - Whether to also set defaultSelected
 */
function updateOptions(
  node: HTMLSelectElement,
  multiple: boolean,
  propValue: any,
  setDefaultSelected: boolean,
) {
  const options: HTMLOptionsCollection = node.options;

  if (multiple) {
    const selectedValues = (propValue: Array<string>);
    const selectedValue: {[string]: boolean} = {};
    for (let i = 0; i < selectedValues.length; i++) {
      // Prefix to avoid chaos with special keys.
      selectedValue['$' + selectedValues[i]] = true;
    }
    for (let i = 0; i < options.length; i++) {
      const selected = selectedValue.hasOwnProperty('$' + options[i].value);
      if (options[i].selected !== selected) {
        options[i].selected = selected;
      }
      if (selected && setDefaultSelected) {
        options[i].defaultSelected = true;
      }
    }
  } else {
    // Do not set `select.value` as exact behavior isn't consistent across all
    // browsers for all cases.
    const selectedValue = toString(getToStringValue(propValue));
    let defaultSelected = null;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === selectedValue) {
        options[i].selected = true;
        if (setDefaultSelected) {
          options[i].defaultSelected = true;
        }
        return;
      }
      if (defaultSelected === null && !options[i].disabled) {
        defaultSelected = options[i];
      }
    }
    if (defaultSelected !== null) {
      defaultSelected.selected = true;
    }
  }
}

/**
 * Implements a <select> host component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * stringable. If `multiple` is true, the prop must be an array of stringables.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */

/**
 * Validates React props on a <select> element during development.
 * Checks for conflicting controlled/uncontrolled patterns, invalid
 * prop types, and mismatched multiple/value configurations.
 *
 * @param {Element} element - The DOM select element
 * @param {Object} props - The React props being applied
 */
export function validateSelectProps(element: Element, props: Object) {
  if (__DEV__) {
    // Validate the 'multiple' prop type
    if (props.multiple !== undefined) {
      validateMultipleProp(props.multiple);
    }

    // Validate value type matches multiple mode
    if (props.value !== undefined && props.multiple) {
      if (!isArray(props.value)) {
        console.error(
          'The `value` prop supplied to a multiple <select> must be an array. ' +
            'Received: %s (%s).',
          String(props.value),
          typeof props.value,
        );
      }
    }

    checkSelectPropTypes(props);
    if (
      props.value !== undefined &&
      props.defaultValue !== undefined &&
      !didWarnValueDefaultValue
    ) {
      console.error(
        'Select elements must be either controlled or uncontrolled ' +
          '(specify either the value prop, or the defaultValue prop, but not ' +
          'both). Decide between using a controlled or uncontrolled select ' +
          'element and remove one of these props. More info: ' +
          'https://react.dev/link/controlled-components',
      );
      didWarnValueDefaultValue = true;
    }
  }
}

/**
 * Initializes a <select> element's selected state during mount.
 * Sets the multiple attribute and synchronizes the initial selection
 * based on either the controlled value or defaultValue prop.
 *
 * @param {Element} element - The DOM select element
 * @param {?string} value - The controlled value, if any
 * @param {?string} defaultValue - The default value for uncontrolled selects
 * @param {?boolean} multiple - Whether the select allows multiple selections
 */
export function initSelect(
  element: Element,
  value: ?string,
  defaultValue: ?string,
  multiple: ?boolean,
) {
  const node: HTMLSelectElement = (element: any);
  node.multiple = !!multiple;
  if (value != null) {
    updateOptions(node, !!multiple, value, false);
  } else if (defaultValue != null) {
    updateOptions(node, !!multiple, defaultValue, true);
  }
}

export function hydrateSelect(
  element: Element,
  value: ?string,
  defaultValue: ?string,
  multiple: ?boolean,
): void {
  const node: HTMLSelectElement = (element: any);
  const options: HTMLOptionsCollection = node.options;

  const propValue: any = value != null ? value : defaultValue;

  let changed = false;

  if (multiple) {
    const selectedValues = (propValue: ?Array<string>);
    const selectedValue: {[string]: boolean} = {};
    if (selectedValues != null) {
      for (let i = 0; i < selectedValues.length; i++) {
        // Prefix to avoid chaos with special keys.
        selectedValue['$' + selectedValues[i]] = true;
      }
    }
    for (let i = 0; i < options.length; i++) {
      const expectedSelected = selectedValue.hasOwnProperty(
        '$' + options[i].value,
      );
      if (options[i].selected !== expectedSelected) {
        changed = true;
        break;
      }
    }
  } else {
    let selectedValue =
      propValue == null ? null : toString(getToStringValue(propValue));
    for (let i = 0; i < options.length; i++) {
      if (selectedValue == null && !options[i].disabled) {
        // We expect the first non-disabled option to be selected if the selected is null.
        selectedValue = options[i].value;
      }
      const expectedSelected = options[i].value === selectedValue;
      if (options[i].selected !== expectedSelected) {
        changed = true;
        break;
      }
    }
  }
  if (changed) {
    // If the current selection is different than our initial that suggests that the user
    // changed it before hydration. Queue a replay of the change event.
    queueChangeEvent(node);
  }
}

/**
 * Updates a <select> element's selection state during re-renders.
 * Handles changes to value, defaultValue, and the multiple attribute.
 * When switching between single and multiple mode, reapplies the selection.
 *
 * @param {Element} element - The DOM select element
 * @param {?string} value - The new controlled value, if any
 * @param {?string} defaultValue - The new default value
 * @param {?boolean} multiple - The new multiple mode
 * @param {?boolean} wasMultiple - The previous multiple mode
 */
export function updateSelect(
  element: Element,
  value: ?string,
  defaultValue: ?string,
  multiple: ?boolean,
  wasMultiple: ?boolean,
) {
  const node: HTMLSelectElement = (element: any);

  if (value != null) {
    updateOptions(node, !!multiple, value, false);
  } else if (!!wasMultiple !== !!multiple) {
    // For simplicity, reapply `defaultValue` if `multiple` is toggled.
    if (defaultValue != null) {
      updateOptions(node, !!multiple, defaultValue, true);
    } else {
      // Revert the select back to its default unselected state.
      updateOptions(node, !!multiple, multiple ? [] : '', false);
    }
  }
}

export function restoreControlledSelectState(element: Element, props: Object) {
  const node: HTMLSelectElement = (element: any);
  const value = props.value;

  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  }
}
