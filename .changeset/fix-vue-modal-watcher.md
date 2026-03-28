---
'@fokke-/vue-bartender.js': patch
---

Add missing modal prop watcher to BartenderBar component. Previously, changing the modal prop after mount had no effect on the core bar instance.
