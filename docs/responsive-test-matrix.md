# Responsive Test Matrix

## English

The default mobile strategy is priority-based columns with horizontal-scroll fallback.

## Turkce

Varsayilan mobil strateji horizontal-scroll fallback ile priority-based columns olur.

Responsive behavior is container-based. Tests must set the grid container width, not only the browser viewport.

## Container Width Matrix

| Width | Expected Default Strategy | Required Checks |
|---:|---|---|
| 320px | `priority-columns` with `horizontal-table` fallback | no overflow except explicit horizontal fallback; touch targets >=44x44; required/user-visible columns reachable; focus ring not clipped |
| 375px | `priority-columns` with `horizontal-table` fallback | primary/required columns, filters, sort, pagination, validation and column picker reachable by keyboard/touch |
| 480px | `priority-columns` | required/user-visible columns preserved; horizontal-scroll fallback available when required columns cannot fit; active filter chips visible |
| 768px | `compact-table` / `priority-columns` | tablet portrait, modal/drawer/sidebar, filter/sort overlays not clipped |
| 1024px | `horizontal-table` | resize/order where enabled, optional single pinned start column if remaining area >=240px |
| 1280px | `horizontal-table` | configured visible columns preserved, dense scanning, keyboard navigation |
| 1440px | `horizontal-table` | pinning, resize/order, pagination and filters stable |
| 1920px | `horizontal-table` | wide layout does not over-expand text; DOM budget still bounded |

## Context Matrix

Each width should be tested in:

- normal page content;
- modal;
- drawer;
- sidebar;
- split pane;
- card container with constrained width;
- nested scrolling layout.

Same viewport with different container widths must produce different `responsiveState` when appropriate.

## Strategy Matrix

| Strategy | Semantics | MVP Status | Notes |
|---|---|---|---|
| `horizontal-table` | ARIA grid/table | MVP | Horizontal scroll allowed; best for high column fidelity |
| `compact-table` | ARIA grid/table | MVP | Reduced density, hidden resize handles on coarse/narrow |
| `priority-columns` | ARIA grid/table | MVP | Required/user-visible columns preserved |
| `primary-plus-detail` | ARIA grid/table plus expandable detail | Post-MVP candidate | Collapsed fields reachable in detail when the strategy ships |
| `stacked-card` | list/detail, not grid | Post-MVP experimental | No fake grid semantics; separate ADR, keyboard and a11y tests |
| `user-visibility` | follows selected presentation | MVP | User choice wins except required columns |

## Column Visibility Conflict Order

1. `column.required === true`
2. Controlled user visibility state
3. Developer `visibleWhen`
4. `hiddenBelow` / `minContainerWidth`
5. `priority` reduction
6. Strategy fallback minimums

Responsive auto-hiding must not mutate canonical user visibility.

## Narrow Interaction Requirements

Items tied to features outside the Usable Grid MVP are marked "when enabled" and are not MVP release gates.

Filtering:

- below `sm`, column popovers collapse into toolbar filter sheet;
- active filter chips remain visible;
- keyboard can open, edit, clear and apply filters.

Sorting:

- primary sort from header remains available;
- compact sort menu supports multi-sort;
- sort state announced to assistive tech.

Pagination:

- previous/next and current range visible below `sm`;
- numeric page list may be hidden;
- page size in menu;
- focus restored after page change.

Actions, when enabled:

- action column moves to row menu or detail footer below `sm`;
- destructive actions have accessible labels and confirmation hook;
- row menu is keyboard reachable.

Pinning, when enabled:

- right-pinned action column degrades to row menu below `md`;
- left-pinned primary column remains only when remaining scroll area is >=240px;
- pinned degradation is announced or reflected in state.

Resize/Reorder, when enabled:

- resize handles hidden for coarse pointer below `md`;
- reorder available through column menu for keyboard;
- no custom gesture prevents native horizontal scroll.

Editing, when enabled:

- inline editing only when control fits 44px target;
- otherwise editor opens in popover/sheet;
- validation summary is announced.

## Accessibility Checks Per Width

- no keyboard trap;
- focus ring not clipped;
- exactly one `tabindex=0` in grid mode;
- `aria-rowindex` and `aria-colindex` remain absolute;
- responsive-hidden focused column uses fallback focus;
- card mode is announced as list/detail, not grid;
- VoiceOver/TalkBack touch exploration labels are meaningful in narrow modes.

## Visual Checks Per Width

- no header/body misalignment;
- no row overlap;
- no clipped text that hides controls;
- scrollbar gutter stable where applicable;
- pinned areas do not cover content;
- filter/sort menus fit inside modal/drawer;
- density/touch token changes apply only through documented CSS variables.

## Browser Matrix

Automated:

- Chromium;
- Firefox;
- WebKit;
- Edge through Chromium scheduled run.

Manual release:

- iOS Safari;
- Android Chrome;
- Windows forced colors;
- 200% and 400% zoom.
