module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    /**
     * Permit to use tab
     */
    "no-tabs": 0,
    /**
     * Do not place bracket(i.e. `}` ) right before `else`, `else-if`
     */
    // 'brace-style': [4, "stroustrup"],
    /**
     *  only accept use tab as indentation
     */
    "indent": [2, 'tab', {"SwitchCase": 1}]

  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
