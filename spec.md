# Machine Cleaning Tracker

## Current State
The app tracks machine cleaning schedules with multiple machines, each having a name, machine number, machine part type (Coolant Filtration Unit, Mist Unit, Chiller Unit), last cleaned date, and next due date. The frontend shows a dashboard with machine cards, status badges, alert banners for overdue/due-today machines, and modals for adding/editing/rescheduling machines. Internet Identity is used for login.

The **root bug**: `addMachine`, `updateMachine`, and `deleteMachine` backend functions require `#admin` role. New users who log in via Internet Identity are assigned `#user` role (not `#admin`) unless they use an admin token. This causes all add/update/delete operations to fail with "Unauthorized" for regular users.

## Requested Changes (Diff)

### Add
- Nothing new to add.

### Modify
- **Backend authorization**: Change `addMachine`, `updateMachine`, `deleteMachine` to require `#user` permission instead of `#admin`. Any authenticated (non-anonymous) user should be able to manage machines.
- **Backend authorization**: Change `logEvent` and `getAuditLogs` to require `#user` permission instead of `#admin`.
- Keep `getAllContacts` and `saveContact` as-is.
- Keep all other functionality unchanged.

### Remove
- Nothing to remove.

## Implementation Plan
1. Regenerate Motoko backend with machine CRUD operations open to `#user` role (not just `#admin`).
2. Keep all existing data types: Machine, MachinePart (coolantFiltrationUnit, mistUnit, chillerUnit), LogEntry, Contact, UserProfile.
3. Keep the same function signatures so the frontend requires no changes.
4. Keep admin-only for: `getAllContacts`, `assignCallerUserRole`.
