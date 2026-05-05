'use client';

import Editor, { type OnMount } from '@monaco-editor/react';
import { useCallback } from 'react';

import { GLSL_LANGUAGE_ID, GLSL_THEME_ID, registerGlslLanguage } from './glsl-language';

type ShaderEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  height?: number | string;
};

export function ShaderEditor({ value, onChange, readOnly = false, className, height = '100%' }: ShaderEditorProps) {
  const handleMount = useCallback<OnMount>((_editor, monaco) => {
    registerGlslLanguage(monaco);
    monaco.editor.setTheme(GLSL_THEME_ID);
  }, []);

  return (
    <div className={className}>
      <Editor
        height={height}
        defaultLanguage={GLSL_LANGUAGE_ID}
        language={GLSL_LANGUAGE_ID}
        theme={GLSL_THEME_ID}
        value={value}
        onChange={(next) => onChange?.(next ?? '')}
        onMount={handleMount}
        options={{
          readOnly,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderLineHighlight: 'line',
          padding: { top: 16, bottom: 16 },
          tabSize: 2,
          automaticLayout: true,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
