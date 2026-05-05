import type { Monaco } from '@monaco-editor/react';

export const GLSL_LANGUAGE_ID = 'glsl';
export const GLSL_THEME_ID = 'shader-garden-dark';

const KEYWORDS = [
  'attribute',
  'break',
  'case',
  'centroid',
  'const',
  'continue',
  'default',
  'discard',
  'do',
  'else',
  'flat',
  'for',
  'if',
  'in',
  'inout',
  'invariant',
  'layout',
  'lowp',
  'mediump',
  'highp',
  'noperspective',
  'out',
  'precision',
  'return',
  'smooth',
  'struct',
  'switch',
  'uniform',
  'varying',
  'void',
  'while',
];

const TYPES = [
  'bool',
  'float',
  'double',
  'int',
  'uint',
  'vec2',
  'vec3',
  'vec4',
  'bvec2',
  'bvec3',
  'bvec4',
  'ivec2',
  'ivec3',
  'ivec4',
  'uvec2',
  'uvec3',
  'uvec4',
  'mat2',
  'mat3',
  'mat4',
  'mat2x2',
  'mat2x3',
  'mat2x4',
  'mat3x2',
  'mat3x3',
  'mat3x4',
  'mat4x2',
  'mat4x3',
  'mat4x4',
  'sampler1D',
  'sampler2D',
  'sampler3D',
  'samplerCube',
  'sampler2DArray',
];

const BUILTIN_FUNCTIONS = [
  'abs',
  'acos',
  'all',
  'any',
  'asin',
  'atan',
  'ceil',
  'clamp',
  'cos',
  'cross',
  'degrees',
  'distance',
  'dot',
  'exp',
  'exp2',
  'faceforward',
  'floor',
  'fract',
  'inversesqrt',
  'length',
  'log',
  'log2',
  'max',
  'min',
  'mix',
  'mod',
  'normalize',
  'pow',
  'radians',
  'reflect',
  'refract',
  'sign',
  'sin',
  'smoothstep',
  'sqrt',
  'step',
  'tan',
  'texture',
  'texture2D',
  'textureCube',
  'textureLod',
];

const BUILTIN_VARS = [
  'gl_FragColor',
  'gl_FragCoord',
  'gl_Position',
  'gl_PointCoord',
  'gl_PointSize',
  'gl_VertexID',
];

export function registerGlslLanguage(monaco: Monaco): void {
  const alreadyRegistered = monaco.languages
    .getLanguages()
    .some((lang: { id: string }) => lang.id === GLSL_LANGUAGE_ID);
  if (alreadyRegistered) return;

  monaco.languages.register({ id: GLSL_LANGUAGE_ID, extensions: ['.glsl', '.frag', '.vert'] });

  monaco.languages.setLanguageConfiguration(GLSL_LANGUAGE_ID, {
    comments: { lineComment: '//', blockComment: ['/*', '*/'] },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
  });

  monaco.languages.setMonarchTokensProvider(GLSL_LANGUAGE_ID, {
    defaultToken: '',
    tokenPostfix: '.glsl',
    keywords: KEYWORDS,
    types: TYPES,
    builtinFunctions: BUILTIN_FUNCTIONS,
    builtinVariables: BUILTIN_VARS,
    operators: ['=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=', '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%', '<<', '>>'],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    tokenizer: {
      root: [
        [/#\s*[a-zA-Z]+\b/, 'keyword.directive'],
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@types': 'type',
              '@builtinFunctions': 'predefined',
              '@builtinVariables': 'variable.predefined',
              '@default': 'identifier',
            },
          },
        ],
        { include: '@whitespace' },
        [/[{}()[\]]/, '@brackets'],
        [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],
        [/\d+\.\d*([eE][+-]?\d+)?[fF]?/, 'number.float'],
        [/\.\d+([eE][+-]?\d+)?[fF]?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],
      ],
      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],
    },
  });

  monaco.editor.defineTheme(GLSL_THEME_ID, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'c4b1ff', fontStyle: 'bold' },
      { token: 'keyword.directive', foreground: 'f78c6c' },
      { token: 'type', foreground: '5eead4' },
      { token: 'predefined', foreground: 'f7c873' },
      { token: 'variable.predefined', foreground: 'ff8fb1' },
      { token: 'number', foreground: 'b3f5a4' },
      { token: 'number.float', foreground: 'b3f5a4' },
      { token: 'comment', foreground: '5b6076', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#0d0e15',
      'editor.foreground': '#e7e8ee',
      'editorLineNumber.foreground': '#3a3f55',
      'editorLineNumber.activeForeground': '#9aa0b4',
      'editorCursor.foreground': '#9d7bff',
      'editor.selectionBackground': '#2a2350',
      'editor.lineHighlightBackground': '#11131c',
    },
  });
}
