## V5.3.0 — India Languages Edition
- Added Marathi, Telugu, Tamil, Gujarati, Kannada, Odia and Malayalam interface translations.
- Reordered the language selector: English first, followed by the ten most widely reported Indian mother tongues in the 2011 Census ranking, then the existing additional languages.
- Added translated task-description placeholders and updated the interface language count to 17.

# Changelog

## V5.2.0 — Embedded Guidance Edition
- Added opt-in scanning for cross-site embedded frames, requesting host access only for external origins found on the current page.
- Added highlighting and scrolling to results found inside accessible embedded frames.
- Expanded the built-in plain-language guide for common website areas and actions.
- Simplified Describe My Task result explanations so they guide users to a section without copying long page text.
- Improved form-field naming by preferring accessible labels and useful placeholders over generic identifiers such as `field1` and `input2`.
- Retained the V5.1.0 guided multi-page search, local journey storage, and existing privacy-first permissions model.

## V5.1.0 — Guided Browsing Edition
- Added a persistent, tab-scoped guided search journey across pages.
- Added local journey storage and same-origin navigation reinjection through a service worker.
- Added link-route suggestions when the current page has no result.
- Added context-aware descriptions for links, buttons, disclosure controls, forms, and nearby sections.
- Replaced generic “matching key intent” explanations with descriptions grounded in page markup and accessible metadata.
- Kept the extension local-first and avoided blanket all-sites host permissions.

## V5.0.0 — Fully Resolved Edition
- Fixed duplicate word issues across labels.
- Added deep iframe/embedded DOM element collection.
- Added Search Bar inside Fill out a form mode.
- Fixed auto-scrolling across Describe My Task and search modes.
- Restricted results to top 3–5 ranked matches.
