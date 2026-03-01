# Specification

## Summary
**Goal:** After login, redirect the user to a new "Add Contact Details" screen before reaching the Dashboard, display their name at the top, and allow them to save or skip contact details.

**Planned changes:**
- After successful login, navigate to a new "Add Contact Details" screen instead of the Dashboard
- Display the logged-in user's name prominently at the top of the Add Contact Details screen
- Add a form with fields for full name, phone number, and email address, with basic validation
- Include a "Save" button (submits details, then navigates to Dashboard) and a "Skip" button (navigates directly to Dashboard)
- Add backend methods to save and retrieve contact details (full name, phone, email) associated with a user principal, persisted across upgrades
- Skip the contact details screen on subsequent logins if details have already been saved

**User-visible outcome:** After logging in, users are taken to an "Add Contact Details" screen showing their name, where they can fill in and save their contact info or skip to go straight to the Dashboard.
