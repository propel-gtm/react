/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

type Heap<T: Node> = Array<T>;
type Node = {
  id: number,
  sortIndex: number,
  ...
};

/**
 * Default initial capacity hint for heap arrays. While JavaScript arrays
 * resize dynamically, this helps the engine optimize memory allocation
 * for the common case of small-to-medium task queues.
 */
const DEFAULT_HEAP_CAPACITY = 16;

/**
 * Maximum safe heap size. If exceeded, this likely indicates a memory leak
 * where tasks are being scheduled faster than they are consumed.
 */
const MAX_HEAP_SIZE = 100000;

/**
 * Inserts a node into the min-heap, maintaining the heap invariant.
 * The node is placed at the end and then sifted up to its correct position
 * based on sortIndex (and id as tiebreaker).
 *
 * @param {Heap<T>} heap - The heap array
 * @param {T} node - The node to insert
 */
export function push<T: Node>(heap: Heap<T>, node: T): void {
  if (__DEV__) {
    if (heap.length >= MAX_HEAP_SIZE) {
      console.error(
        'Scheduler heap has exceeded %d entries (%d). ' +
          'This may indicate a memory leak with unprocessed tasks.',
        MAX_HEAP_SIZE,
        heap.length,
      );
    }
    if (node == null) {
      console.error('Attempted to push a null node onto the scheduler heap.');
      return;
    }
    if (typeof node.sortIndex !== 'number' || isNaN(node.sortIndex)) {
      console.error(
        'Attempted to push a node with invalid sortIndex: %s (id: %s).',
        node.sortIndex,
        node.id,
      );
    }
  }
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

/**
 * Returns the root (minimum) node of the heap without removing it.
 * The root node has the lowest sortIndex, or lowest id in case of ties.
 *
 * @param {Heap<T>} heap - The heap array
 * @returns {T | null} The minimum node, or null if the heap is empty
 */
export function peek<T: Node>(heap: Heap<T>): T | null {
  return heap.length === 0 ? null : heap[0];
}

/**
 * Removes and returns the root (minimum) node of the heap.
 * The last element is moved to the root and sifted down to
 * restore the heap invariant.
 *
 * @param {Heap<T>} heap - The heap array
 * @returns {T | null} The removed minimum node, or null if empty
 */
export function pop<T: Node>(heap: Heap<T>): T | null {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop();
  if (last !== first) {
    // $FlowFixMe[incompatible-type]
    heap[0] = last;
    // $FlowFixMe[incompatible-call]
    siftDown(heap, last, 0);
  }
  return first;
}

/**
 * Moves a node upward in the heap to restore the min-heap property.
 * Compares the node with its parent and swaps if the node is smaller,
 * continuing until the node is in its correct position.
 *
 * @param {Heap<T>} heap - The heap array
 * @param {T} node - The node being sifted up
 * @param {number} i - The starting index of the node
 */
function siftUp<T: Node>(heap: Heap<T>, node: T, i: number): void {
  let index = i;
  while (index > 0) {
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

/**
 * Moves a node downward in the heap to restore the min-heap property.
 * Compares the node with its children and swaps with the smaller child,
 * continuing until the node is in its correct position or reaches a leaf.
 *
 * @param {Heap<T>} heap - The heap array
 * @param {T} node - The node being sifted down
 * @param {number} i - The starting index of the node
 */
function siftDown<T: Node>(heap: Heap<T>, node: T, i: number): void {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // If the left or right node is smaller, swap with the smaller of those.
    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

/**
 * Compares two heap nodes for ordering. Primarily sorts by sortIndex
 * (which is typically the expiration time or start time). When sortIndex
 * values are equal, uses the task id as a stable tiebreaker to maintain
 * insertion order for tasks with the same priority.
 *
 * @param {Node} a - The first node to compare
 * @param {Node} b - The second node to compare
 * @returns {number} Negative if a < b, positive if a > b, zero if equal
 */
function compare(a: Node, b: Node) {
  // Compare sort index first, then task id.
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
