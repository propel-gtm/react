/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  CompilerErrorDetail,
  CompilerDiagnostic,
} from 'babel-plugin-react-compiler';
import {useDeferredValue, useMemo, useState} from 'react';
import {useStore} from '../StoreContext';
import ConfigEditor from './ConfigEditor';
import Input from './Input';
import {CompilerOutput, default as Output} from './Output';
import {compile} from '../../lib/compilation';
import prettyFormat from 'pretty-format';

function mergeCompilerOutputs(
  compilerOutput: CompilerOutput,
  linterOutput: CompilerOutput,
): [CompilerOutput, Array<CompilerErrorDetail | CompilerDiagnostic>] {
  if (compilerOutput.kind === 'ok') {
    const errors = linterOutput.kind === 'ok' ? [] : linterOutput.error.details;
    return [
      {
        ...compilerOutput,
        errors,
      },
      errors,
    ];
  }

  return [compilerOutput, compilerOutput.error.details];
}

function formatAppliedConfig(
  appliedOptions: unknown,
  previousValue: string,
): string {
  if (appliedOptions == null) {
    return previousValue;
  }

  const formatted = prettyFormat(appliedOptions, {
    printFunctionName: false,
    printBasicPrototype: false,
  });
  return formatted === previousValue ? previousValue : formatted;
}

export default function Editor(): JSX.Element {
  const store = useStore();
  const deferredStore = useDeferredValue(store);
  const [compilerOutput, language, appliedOptions] = useMemo(
    () => compile(deferredStore.source, 'compiler', deferredStore.config),
    [deferredStore.source, deferredStore.config],
  );
  const [linterOutput] = useMemo(
    () => compile(deferredStore.source, 'linter', deferredStore.config),
    [deferredStore.source, deferredStore.config],
  );
  const [formattedAppliedConfig, setFormattedAppliedConfig] = useState('');

  const [mergedOutput, errors] = useMemo(
    () => mergeCompilerOutputs(compilerOutput, linterOutput),
    [compilerOutput, linterOutput],
  );

  const nextFormattedAppliedConfig = useMemo(
    () => formatAppliedConfig(appliedOptions, formattedAppliedConfig),
    [appliedOptions, formattedAppliedConfig],
  );
  if (nextFormattedAppliedConfig !== formattedAppliedConfig) {
    setFormattedAppliedConfig(nextFormattedAppliedConfig);
  }

  return (
    <div className="relative flex top-14">
      <div className="flex-shrink-0">
        <ConfigEditor formattedAppliedConfig={formattedAppliedConfig} />
      </div>
      <div className="flex flex-1 min-w-0">
        <Input language={language} errors={errors} />
        <Output store={deferredStore} compilerOutput={mergedOutput} />
      </div>
    </div>
  );
}
