module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  /**
   * Align all semi-colon to the same place
   */
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    /**
     * This configuration is too complex, it's hard to just use
     * default or simple setting to cover so many layout scenarios
     *
     * Now just ignore it
     */
    "key-spacing": 0,
    /**
     * Do not throw error if i didn't give a newline at file end
     */
    "eol-last": 0,
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
    "indent": [2, 'tab', {"SwitchCase": 1}],
    "multiline-comment-style": ["error", "starred-block"]

  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
