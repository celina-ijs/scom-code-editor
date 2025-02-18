const keywords = [
  "int", "var", "cell", "slice", "builder", "return", "if", "else", "while", "do", 
  "repeat", "continue", "break", "begin", "end", "global", "inline", "asm", "impure", 
  "pure", "forall", "throw"
];

const config = {
  language: {
    keywords,
    operators: [
      "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=", "&&", "||", 
      "++", "--", "+", "-", "*", "/", "&", "|", "^", "%", "<<", ">>", ">>>"
    ],
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" }
    ],
    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }],
        [/\/\/.*/, "comment"], // Single-line comment
        [/\/\*/, "comment", "@comment"], // Multi-line comment start
        [/"([^"\\]|\\.)*$/, "string.invalid"], // Non-terminated string
        [/"/, "string", "@string"],
        [/[{}()\[\]]/, "@brackets"],
        [/[<>!=]=?/, "operator"],
        [/[\+\-\*/%&|\^~!]/, "operator"],
        [/\d+/, "number"]
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\/\*/, "comment", "@push"], // Nested comment
        ["\\*/", "comment", "@pop"],
        [/[\/*]/, "comment"]
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string", "@pop"]
      ]
    },
  },
  config: {
    comments: {
      lineComment: ';;',
      blockComment: ['{-', '-}'],
    },
    indentationRules: {
      decreaseIndentPattern: /^\s*\}.*$/,
      increaseIndentPattern: /^.*\{[^}]*$/,
    },
  }
}

const globalMethods = ['get_data', 'set_data', 'begin_cell', 'throw'];

const messageMethods = ['recv_internal', 'recv_external'];

export {
  config,
  keywords,
  globalMethods,
  messageMethods
}