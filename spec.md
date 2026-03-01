# Specification

## Summary
**Goal:** Rename all "cleaning" terminology to "Machine Part" terminology throughout the CleanTrack application (frontend UI and backend data model).

**Planned changes:**
- Replace all user-visible occurrences of "Cleaning", "cleaning", "Cleaning Tool", "Machine Cleaning Tracker", "Cleaning Done", "Last Cleaned", etc. with "Machine Part", "Machine Part Tracker", "Part Done", "Last Replaced", and equivalent terms across all frontend components (MachineCard, AddMachineModal, EditMachineModal, MachineFormFields, stats bar, overdue alert banner, page title, button labels)
- Rename the `cleaningTool` field in the backend Motoko actor (`backend/main.mo`) to `machinePart` and update all related CRUD operations accordingly

**User-visible outcome:** The app displays "Machine Part" terminology everywhere instead of "Cleaning" — including the page title, card labels, form fields, modal headers, buttons, and stats bar — with no remaining references to "cleaning" in the UI.
