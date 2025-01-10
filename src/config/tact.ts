export default {
  language: {
    defaultToken: '',
    tokenPostfix: '.tact',
    keywords: [
      "import", "const", "let", "as", "is", "in", "self", "require", "send", "this",
      "if", "else", "try", "catch", "repeat", "do", "until", "while", "foreach",
      "return", "struct", "message", "trait", "contract", "native", "inline", "with",
      "inline_ref", "extend", "public", "abstract", "virtual", "override", "get", "asm",
      "mutates", "extends", "fun", "init", "receive", "bounced", "external", "primitive",
      "function", "for", "break", "continue", "from", "pragma", "private", "internal",
      "view", "pure", "payable", "constant", "event", "emit", "constructor"
    ],
    typeKeywords: [
      'Int', 'Bool', 'Address', 'Cell', 'String', 'StringBuilder', 'Builder', 'Slice'
    ],
    operators: [
      '=', '+=', '-=', '*=', '/=', '%=', '==', '!=', '<', '<=', '>', '>=',
      '&&', '||', '!', '++', '--', '+', '-', '*', '/', '%', '&', '|', '^', '~',
      '<<', '>>'
    ],
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
    tokenizer: {
      root: [
        [/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'keyword', '@keywords': 'keyword', '@default': 'identifier' } }],
        [/[A-Z][\w\$]*/, 'type.identifier'],
        [/\b\d+(\.\d+)?\b/, 'number'],
        [/"/, { token: 'string.quote', next: '@string' }],
        [/\/\/.*/, 'comment'],
        [/[{}()[\]]/, '@brackets'],
        [/[=+\-*/%&|^!<>]=?|[~?]/, 'operator'],
        [/[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/, 'function']
      ],
      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, { token: 'string.quote', next: '@pop' }]
      ]
    }
  },
  config: {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' }
    ]
  }
}