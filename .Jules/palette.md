## 2025-05-14 - Dashboard Accessibility and Micro-UX
**Learning:** Common interactive elements like custom selects and icon-only buttons often lack ARIA labels, making them difficult for screen reader users. Adding a "Clear Search" button is a simple but highly effective micro-UX improvement for search-heavy interfaces.
**Action:** Always check for `aria-label` on buttons and selects, and consider adding clear buttons to search inputs.

## 2025-05-15 - Sidebar Accessibility in Collapsible Interfaces
**Learning:** Collapsible sidebars that hide labels for an icon-only "mini" mode create a complete navigation blackout for screen reader users if labels are not preserved via `sr-only` elements. Native tooltips using the `title` attribute provide a simple but effective visual hint for icon-only buttons without requiring complex tooltip components.
**Action:** When implementing collapsible sidebars, always use `sr-only` for labels in collapsed mode and `aria-current="page"` for the active link.

## 2026-05-16 - Search Experience and Keyboard Accessibility
**Learning:** Adding a keyboard shortcut like `/` to focus search is a low-effort, high-impact micro-UX that power users love. Combining it with a visual hint (`<kbd>`) makes it discoverable. Also, ensuring visible focus states on custom-styled `select` elements is critical for keyboard-only navigation.
**Action:** Always include keyboard shortcut hints in search inputs and never use `focus:outline-none` without providing an alternative focus ring.
