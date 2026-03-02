# Specification

## Summary
**Goal:** Fix all broken backend, frontend, authentication, and date utility issues in the Machine Cleaning Tracker app.

**Planned changes:**
- Fix all compile errors and broken logic in `backend/main.mo`, including role-based access control, machine CRUD operations, and user profile management
- Fix all broken React Query hooks in `useQueries.ts`, including data fetching, mutations, and cache invalidation
- Fix broken modal dialogs: `AddMachineModal`, `EditMachineModal`, `DeleteConfirmDialog`, and `RescheduleDateModal`
- Fix malfunctioning alert banners: `DueTodayAlertBanner` and `OverdueAlertBanner`
- Fix rendering errors and broken interactions in `Dashboard.tsx` and `AddContactDetailsPage.tsx`
- Fix authentication and onboarding flow so new users are directed to `AddContactDetailsPage` and returning users to `Dashboard` after login
- Fix logout to properly reset per-principal localStorage state and ensure reliable identity change detection in `App.tsx`
- Fix date utilities in `dateUtils.ts`: correct IC nanosecond timestamp conversion, machine cleaning status computation (ok, due-soon, due-today, overdue), and next-due-date calculation

**User-visible outcome:** The app works correctly end-to-end — users can log in, complete onboarding, manage machines, and see accurate cleaning statuses and alerts without errors.
