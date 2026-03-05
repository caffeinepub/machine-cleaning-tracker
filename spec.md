# Machine Cleaning Tracker

## Current State
- Dashboard shows machine cleaning records with due dates
- In-app flashing alert banners for overdue and due-today machines
- Stats bar, machine cards with status badges
- Add/edit/delete machines with machine no. and cleaning tool type

## Requested Changes (Diff)

### Add
- Browser-based push notifications using the Web Notifications API
- A custom React hook `useBrowserNotifications` that:
  - Requests notification permission on first load
  - Checks all machines for due-today (within 24h) or overdue status
  - Fires a browser notification for each machine that is due within 1 day or overdue
  - Tracks which notifications have already been shown (using localStorage by machine id + due date) to avoid repeat notifications on the same session
  - Re-checks whenever the machines list refreshes
- A notification permission prompt UI (small banner) if permission is not yet granted

### Modify
- Dashboard.tsx: integrate `useBrowserNotifications` hook, pass machines data to it

### Remove
- Nothing removed
