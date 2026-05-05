'use client';

import Editor, { type OnMount } from '@monaco-editor/react';
import { useCallback, useEffect, useRef } from 'react';

import { GLSL_LANGUAGE_ID, GLSL_THEME_ID, registerGlslLanguage } from './glsl-language';

type MonacoEditorInstance = Parameters<OnMount>[0];
type DecorationsCollection = ReturnType<MonacoEditorInstance['createDecorationsCollection']>;

type ShaderEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  height?: number | string;
  /** 1-based, inclusive. When set, the range is highlighted and revealed. */
  highlightRange?: [number, number];
};

export function ShaderEditor({
  value,
  onChange,
  readOnly = false,
  className,
  height = '100%',
  highlightRange,
}: ShaderEditorProps) {
  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const decorationCollectionRef = useRef<DecorationsCollection | null>(null);
  const lastRangeRef = useRef<[number, number] | undefined>(highlightRange);

  const applyHighlight = useCallback((range: [number, number] | undefined) => {
    const editor = editorRef.current;
    if (!editor) return;

    const collection = decorationCollectionRef.current;
    if (!collection) return;

    if (!range) {
      collection.clear();
      return;
    }

    const [start, end] = range;
    const model = editor.getModel();
    const lineCount = model?.getLineCount() ?? end;
    const startLine = Math.max(1, Math.min(start, lineCount));
    const endLine = Math.max(startLine, Math.min(end, lineCount));

    collection.set([
      {
        range: {
          startLineNumber: startLine,
          startColumn: 1,
          endLineNumber: endLine,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: 'sg-tutorial-line',
          linesDecorationsClassName: 'sg-tutorial-line-gutter',
        },
      },
    ]);

    editor.revealLinesInCenterIfOutsideViewport(startLine, endLine, 0);
  }, []);

  const handleMount = useCallback<OnMount>(
    (editor, monaco) => {
      registerGlslLanguage(monaco);
      monaco.editor.setTheme(GLSL_THEME_ID);

      editorRef.current = editor;
      decorationCollectionRef.current = editor.createDecorationsCollection();

      if (lastRangeRef.current) applyHighlight(lastRangeRef.current);
    },
    [applyHighlight],
  );

  useEffect(() => {
    lastRangeRef.current = highlightRange;
    applyHighlight(highlightRange);
  }, [highlightRange, applyHighlight]);

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
