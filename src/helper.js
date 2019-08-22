import Vue from 'vue'
import { getMinutes, getHours } from 'date-fns'
/**
 * the time formate of "date-fns" based on 24hr
 * i.e. 13:23, 23:17 ...
 */
function getCurrentTime () {
  const today = Date.now()
  let [hr, min] = [getHours(today), getMinutes(today)]

  if (hr.toString().length === 1) hr = '0' + hr
  if (min.toString().length === 1) min = '0' + min

  return hr + ':' + min
}
export { getCurrentTime }
export default {
  install () {
    Vue.prototype.$helper = {
      getCurrentTime
    }
  }
}
