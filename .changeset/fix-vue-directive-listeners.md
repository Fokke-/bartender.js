---
'@fokke-/vue-bartender.js': patch
---

Fix memory leak in bartender-open, bartender-toggle, and bartender-close directives. Click event listeners are now properly removed when the element is unmounted.
