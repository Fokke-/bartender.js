# Changelog

## 1.2.1-beta.0

### Patch Changes

- 69b6149: Fix memory leak in bartender-open, bartender-toggle, and bartender-close directives. Click event listeners are now properly removed when the element is unmounted.
- 2dd8484: Add missing modal prop watcher to BartenderBar component. Previously, changing the modal prop after mount had no effect on the core bar instance.
- Updated dependencies [465fa98]
- Updated dependencies [c808b23]
- Updated dependencies [44ff98f]
- Updated dependencies [bf4a9f6]
  - @fokke-/bartender.js@3.2.1-beta.0

## 1.2.0

### New features

- Enhanced types of the emits

## 1.1.0

### New features

- Added new scoped slot `activator` with `open()` and `toggle()` methods.
- `open()` and `toggle()` are now exposed.

## 1.0.0

Initial release
