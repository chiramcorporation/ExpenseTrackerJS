/**
 * loader.js — Dynamic Asset Loader with Cache-Busting
 *
 * This script MUST be loaded before any other CSS or JS assets.
 * It reads version strings from APP_VERSION (defined in version.js)
 * and dynamically injects <link> and <script> tags with ?v= query params
 * to bust the browser cache whenever a version is bumped.
 *
 * Usage in index.html (only these two scripts should be in <head> / top of <body>):
 *   <script src="js/version.js"></script>
 *   <script src="js/loader.js"></script>
 *
 * All CSS and application JS are loaded by this loader — do NOT add
 * hard-coded <link> or <script> tags for managed assets.
 *
 * To force a cache refresh for a specific file, bump its version in version.js.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   *  Asset manifest — list assets in load order.                        *
   *  Each entry: { type: 'css'|'js', path: 'relative/path/to/file' }  *
   *  The ?v= suffix is appended automatically from APP_VERSION.assets. *
   * ------------------------------------------------------------------ */
  var ASSETS = [
    { type: 'css', path: 'css/expense_v4.css' },
    { type: 'js',  path: 'js/expense_v4.js'   }
  ];

  /* ------------------------------------------------------------------ *
   *  Helpers                                                             *
   * ------------------------------------------------------------------ */

  /**
   * Returns the versioned URL for a given asset path.
   * Falls back to APP_VERSION.app if no per-asset version exists.
   */
  function versionedUrl(path) {
    var v = (APP_VERSION.assets && APP_VERSION.assets[path])
      ? APP_VERSION.assets[path]
      : APP_VERSION.app;
    return path + '?v=' + v;
  }

  /** Injects a <link rel="stylesheet"> tag into <head>. */
  function loadCSS(path) {
    var link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = versionedUrl(path);
    document.head.appendChild(link);
    console.log('[loader] CSS loaded: ' + link.href);
  }

  /**
   * Injects a <script> tag into <body>.
   * Scripts are injected synchronously in order (defer=false) so that
   * each one can rely on the previous script's globals being available.
   */
  function loadJS(path) {
    var script = document.createElement('script');
    script.type  = 'text/javascript';
    script.src   = versionedUrl(path);
    script.async = false;    // preserve load order
    script.defer = false;
    document.body.appendChild(script);
    console.log('[loader] JS  loaded: ' + script.src);
  }

  /* ------------------------------------------------------------------ *
   *  Bootstrap — process the asset list                                 *
   * ------------------------------------------------------------------ */
  ASSETS.forEach(function (asset) {
    if (asset.type === 'css') {
      loadCSS(asset.path);
    } else if (asset.type === 'js') {
      // Defer JS injection until DOM is ready so scripts can safely
      // query the DOM on first run (mirrors the original <script> at
      // end-of-body pattern).
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          loadJS(asset.path);
        });
      } else {
        loadJS(asset.path);
      }
    }
  });

  /* ------------------------------------------------------------------ *
   *  Expose loader info on window for debugging                         *
   * ------------------------------------------------------------------ */
  window.__assetLoader = {
    version: APP_VERSION.app,
    assets:  ASSETS,
    versionedUrl: versionedUrl
  };

})();
