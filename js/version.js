/**
 * version.js — Asset Version Manifest
 *
 * Bump the version strings here after ANY update to CSS or JS files.
 * The loader.js uses these values to append ?v=<version> cache-busting
 * query parameters when dynamically injecting <link> and <script> tags.
 *
 * Convention: "MAJOR.MINOR.PATCH"
 *   MAJOR — breaking changes / full redesign
 *   MINOR — new feature / visual change
 *   PATCH — bug fix / small tweak
 *
 * To invalidate browser cache without changing filenames, just increment
 * the appropriate segment. Browsers treat ?v=4.1.0 and ?v=4.1.1 as
 * completely different URLs and will re-fetch the asset.
 */
var APP_VERSION = {
  /** Application-wide semantic version */
  app: '4.1.0',

  /** Per-asset versions — use these to invalidate specific files only */
  assets: {
    'css/expense_v4.css': '4.1.0',
    'js/expense_v4.js':   '4.0.0'
  }
};
