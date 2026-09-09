# Feature: Category & Catalog Browsing (`/category`)

## Overview
The Category & Catalog browsing experience provides comprehensive taxonomy filtering, dual-density grids, multi-facet faceted refinement (sizes, authentic materials, price range), and instant state updates with zero full-page reloads.

## Components Breakdown
- `CategoryHero.tsx`: Breadcrumb lockup, category hero typography with coral accent dot, curated style count badge, and subcategory navigation pills.
- `FilterSidebar.tsx`: Multi-facet filters for taxonomy, price range slider, authentic materials checkboxes, shoe sizes, and stock availability toggles.
- `ActiveFilterBar.tsx`: Active chip badges with single-click dismissal, clear-all action, sorting selector, demo empty state toggle, and 3-column/4-column/list layout toggles.
- `CatalogGrid.tsx`: Dynamic product rendering supporting multi-density views and verified empty states.

## UX & Design Consistency
- Strict adherence to the 330-line maximum file length rule.
- Product cards maintain consistent price typography, quick-add hover micro-interactions, and wishlist hearts.
- Seamless fallback to branded empty states with actionable reset triggers.
