/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {EditorProps} from '@monaco-editor/react';

type MonacoOptions = Partial<EditorProps['options']>;

const baseScrollbarOptions = {
  verticalScrollbarSize: 10,
  horizontalScrollbarSize: 10,
  alwaysConsumeMouseWheel: false,
};

const sharedMonacoOptions: MonacoOptions = {
  fontSize: 14,
  padding: {top: 8},
  scrollbar: baseScrollbarOptions,
  minimap: {
    enabled: false,
  },
  formatOnPaste: true,
  formatOnType: true,
  fontFamily: '"Source Code Pro", monospace',
  glyphMargin: true,
  autoClosingBrackets: 'languageDefined',
  autoClosingDelete: 'always',
  autoClosingOvertype: 'always',
  automaticLayout: true,
  wordWrap: 'on',
  wrappingIndent: 'same',
  tabSize: 2,
};

export const monacoOptions: MonacoOptions = {
  ...sharedMonacoOptions,
};

export const monacoConfigOptions: MonacoOptions = {
  ...sharedMonacoOptions,
  lineNumbers: 'off',
  renderLineHighlight: 'none',
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  fontSize: 12,
  scrollBeyondLastLine: false,
  glyphMargin: false,
};
