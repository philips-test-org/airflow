## v1.3.0 released 2018-12-06

* **improvement:** support for WildFly app server deployment
* **improvement:** updated branding (favicon, about page)
* **bugfix:** fix rounding notes in print view

### Service Notes

> **Warning**: This must be done after undeploying the old application and before deploying the new application
> **Warning**: Run in support console with zip extracted under /servers/tmp
> **Warning**: Make sure airflow user is in site.config.json

```bash
/servers/tmp/patient-flow-v1.3.0/db_scripts/migrations/manuals-name-change.py
```

## v1.2.2 released 2018-08-20

* **improvement** added Audit Log to card modal (Lists all events/comments for that patient. Addresses issue with not seeing comments on cancelled exams)
* **improvement** added "x" button to cancelled cards to dismiss from the view
* **bugfix** cancelled cards no longer merge with non-cancelled cards
* **bugfix** resource groups are once again loaded before the app is rendered, so that the user can choose a different resource group before exams are done fetching
* **bugfix** fixed ordering provider to show even when there is no exam (order is used)
* **bugfix** fixed it so that adjusted date is used for ordering and grouping on the print screen
* **bugfix** ignore adjusted date and resource change if the order's date was changed to not match the adjusted date
* **bugfix** fix hamburger menu icon to ensure it opens the mobile menu
* **bugfix** fixed comments to be ordered latest to earliest and appear at the top of the list when added
* **bugfix** fixed issue where dragging a card past the viewport (above or below) would not drop the card at the time where it was intended to drop

## v1.2.1 released 2018-08-16

* **bugfix:** fix app crash on orders without rad exams
* **bugfix:** fix printing in IE
* **bugfix:** fix card ordering in "Overview"
* **bugfix:** fix placeholder images for avatars
* **bugfix:** move "PPCA Ready" status between "Arrived" and "Started"

## v1.2.0 released 2018-07-17

* **new:** added PPCA Ready toggle
* **new:** added Ordering Physician to card
* **new:** print view for Calendar
* **new:** search/filter cards
* **improvement:** added merged indicator to merged cards
* **improvement:** launch patient images
* **improvement:** overlapping cards displayed side by side
* **improvement:** Overview page wraps instead of scrolling horizontally
* **improvement:** updated icon for anesthesia
* **bugfix:** events on merged cards are saved to both orders to prevent event loss if cards are no longer merged
* **bugfix:** event tabs show all events after new event added
* **bugfix:** rounding notes update for all users viewing card

## v1.1.3 released 2018-06-19

* **bugfix:** all order messages sending requests to server
* **bugfix:** check new orders for relevant resource

## v1.1.2 released 2018-06-05

* **bugfix:** "On Hold" status no longer takes priority over "Cancelled" status
* **bugfix:** cards now consistently update when an exam message is received for an existing order

## v1.1.1 released 2018-04-09

* **improvement:** updated APM client for APM v1.0.2
* **improvement:** updated notifications to exclude avatars to reduce load
* **bugfix:** user and admin manual URL configuration secured
* **bugfix:** removed redundant step from install script

## v1.1.0 released 2018-02-05

* **new:** real-time data now uses new platform messaging service for improved performance and reliability
* **new:** added PPCA toggle
* **new:** added rounding block
* **improvement:** split activity log into comments, audit trail, and combined
* **improvement:** updated styling for Philips brand
* **bugfix:** comments now respect new line characters
* **bugfix:** corrected display/calculation of report difference measurement

## v1.0.1 released 2017-09-01

* **improvement:** added visual indicators for additional demographics and exams with invalid duration
* **bugfix:** empty appointment durations now behave correctly
* **bugfix:** resolved double comment/status entry
* **bugfix:** moving a card sets the exam duration properly

## v1.0.0 released 2017-08-24

**new:** initial release
