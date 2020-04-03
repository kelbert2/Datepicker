// Gets rid of warnings regarding missing browser polyfills.
/**
 * Get rids of the missing requestAnimationFrame polyfill warning.
 * 
 * @link https://reactjs.org/docs/javascript-environment-requirements.html
 * @copyright 2004-present Facebook. All Rights Reserved.
 */

// TODO: Check if still necessary or if Facebook has fixed this Jest issue.
global.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0);
};