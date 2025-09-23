# Fix Recent Campaigns Tags Display Issue

## Problem
Recent Campaigns table in home page shows "No tags" instead of actual campaign tags. The issue is a field name mismatch between backend API (`selectedTags`) and frontend expectation (`tags`).

## Plan
- [x] Analyze the issue and understand field name mismatch
- [ ] Update home component to map `selectedTags` to `tags`
- [ ] Test the fix to ensure tags display correctly

## Files to Edit
- `outreachHub_user/src/app/features/home/home.component.ts`

## Changes Needed
1. Update the `loadAnalytics()` method to handle both `selectedTags` and `tags` field names
2. Map `selectedTags` to `tags` when processing recent campaigns data
