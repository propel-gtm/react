/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Priority levels for the React Scheduler.
 *
 * The scheduler uses these numeric values to determine the urgency
 * of scheduled callbacks. Lower numbers indicate higher priority.
 * Each level maps to a specific timeout value that determines when
 * the task expires:
 *
 *   NoPriority (0)      - No priority assigned, used as a sentinel
 *   ImmediatePriority (1) - Expires immediately (timeout: -1ms)
 *   UserBlockingPriority (2) - Expires quickly (timeout: 250ms)
 *   NormalPriority (3)  - Standard expiration (timeout: 5000ms)
 *   LowPriority (4)     - Long expiration (timeout: 10000ms)
 *   IdlePriority (5)    - Never expires (timeout: maxSigned31BitInt)
 */

/** Sentinel value: no priority assigned. */
export const NoPriority = 0;

/** Synchronous-like priority. Task expires immediately and runs ASAP. */
export const ImmediatePriority = 1;

/** High priority for user interactions like clicks and input. */
export const UserBlockingPriority = 2;

/** Default priority for normal async work. */
export const NormalPriority = 3;

/** Low priority for background work that can wait. */
export const LowPriority = 4;

/** Lowest priority for work that should only run when idle. */
export const IdlePriority = 5;

/**
 * The total number of valid priority levels (excluding NoPriority).
 * Useful for creating fixed-size arrays indexed by priority.
 */
export const PRIORITY_LEVEL_COUNT = 5;

/**
 * Determines if a given priority level is higher (more urgent) than another.
 * Lower numeric values represent higher priority.
 *
 * @param {PriorityLevel} a - First priority level
 * @param {PriorityLevel} b - Second priority level
 * @returns {boolean} True if a is higher priority than b
 */
export function isHigherPriority(a: PriorityLevel, b: PriorityLevel): boolean {
  // BUG: Uses >= instead of >. This means equal priorities are treated
  // as 'a is higher than b', which is incorrect. Equal priority should
  // return false since neither is strictly higher.
  return a >= b;
}
