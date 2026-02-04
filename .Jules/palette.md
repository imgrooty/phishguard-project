## 2025-05-14 - Dashboard Accessibility and Micro-UX
**Learning:** Common interactive elements like custom selects and icon-only buttons often lack ARIA labels, making them difficult for screen reader users. Adding a "Clear Search" button is a simple but highly effective micro-UX improvement for search-heavy interfaces.
**Action:** Always check for `aria-label` on buttons and selects, and consider adding clear buttons to search inputs.

## 2025-05-15 - Sidebar Accessibility in Collapsible Interfaces
**Learning:** Collapsible sidebars that hide labels for an icon-only "mini" mode create a complete navigation blackout for screen reader users if labels are not preserved via `sr-only` elements. Native tooltips using the `title` attribute provide a simple but effective visual hint for icon-only buttons without requiring complex tooltip components.
**Action:** When implementing collapsible sidebars, always use `sr-only` for labels in collapsed mode and `aria-current="page"` for the active link.

## 2026-02-04 - Keyboard Shortcut Hints and Focus Rings
**Learning:** Visual keyboard hints (like `<kbd>`) improve discoverability for power users but should be marked with `aria-hidden="true"` if the element already has an `aria-label`. Standardizing focus rings (e.g., `focus-visible:ring-2`) across all interactive elements (buttons, selects, inputs) is essential for a cohesive keyboard navigation experience.
**Action:** Always add `aria-hidden="true"` to visual-only hints and ensure all interactive elements have visible focus states that match the design system.
