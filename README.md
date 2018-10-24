# README

Patient Flow is a practice management tool. It is meant to replace whiteboard workflows in departments. This is where a literal white board and index cards are used to track patients through the process of receiving a procedure or exam. As such this is a tactical application for a department and is primarily used for communication and tracking workflow.

The calendar view is built for schedulars and nurses to be able to move exams/cases around and understand their timing.

The overview is built for physicians to get a consolidated view of the current status of cases in a compact space. The goal being to see what's happened/happening while still being able to see when their day will end (last case).

The kiosk view is for the patient waiting room and is intended to communicate a simple set of status for family members without showing PHI.

# Development
You can run the application with either hot-reloading (Javascript code is automatically injected upon saving without reloading the package) or without
- `yarn` to install Javascript dependencies 
- `bundle` to install Ruby dependencies

## Without Hot-reloading
- `./launch_dev_server` to run the Rails server
- `yarn watch` to build the Javascript bundle and watch for changes to rebuild
## With Hot-reloading
- `./launch_hot_server` to run the Rails server with "HOT" ENV variable
- `yarn watch:hot` to start hot-reloading server that serves the Javascript bundle and watches for changes to rebuild

# Build Production
- `yarn` to install Javascript dependencies
- `yarn build` to build Javascript bundle (which builds to `public/assets/packs/app.bundle.js` and `public/assets/packs/vendors.bundle.js`)