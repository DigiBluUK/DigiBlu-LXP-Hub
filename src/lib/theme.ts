export const THEME_KEY = "digiblu-hub:theme";

// Runs before first paint so an explicit theme choice does not flash. With no
// stored choice, the CSS media query follows the device setting.
export const THEME_INIT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`;
