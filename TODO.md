# Admin Dashboard UI Fix Plan

## Issues to Fix:
1. Header overlaps with sidebar (positioned at left-0 but should account for sidebar width)
2. Collapsed state not synchronized between sidebar and layout
3. Table overflow issues on smaller screens
4. UI not visually pleasing

## Tasks:
- [ ] 1. Fix admin-layout.tsx - Remove local collapsed state, pass to children via context or props
- [ ] 2. Fix admin-sidebar.tsx - Accept collapsed prop from parent
- [ ] 3. Fix admin-header.tsx - Accept collapsed prop to adjust left position
- [ ] 4. Fix dashboard/page.tsx - Improve table styling and overflow handling

## Dependent Files:
- src/components/layout/admin-layout.tsx
- src/components/layout/admin-sidebar.tsx
- src/components/layout/admin-header.tsx
- src/app/(admin)/admin/dashboard/page.tsx
