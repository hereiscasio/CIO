// module.exports = {
//   presets: [
//     '@vue/app'
//   ]
// }

/**
 * The original, vue-cli default configuration of this file is shown above
 *
 * Below is workaround to solve the issue:
 * "'import' and 'export' may appear only with 'sourceType: module' cypress"
 * this error will be throw when use Cypress to run certain test
 *
 */
module.exports = process.env.CYPRESS_ENV
  ? {}
  : { presets: ['@vue/app'] }