# Feature: Intelligent Search Experience (`/search`)

## Overview
The Search experience provides semantic query resolution across keywords, product names, material descriptions, and tags. It features interactive keyword tags, auto-dismissible chips, and verified empty states.

## Components Breakdown
- `SearchHero.tsx`: Omni-search input container, discovery tags strip, and query stats.
- `SearchResults.tsx`: Multi-grid results matrix and empty search fallback.

## Consistency Metrics
- Strictly under 330 lines per file.
- Direct synchronization with the global ⌘K modal and catalog filter matrix.
