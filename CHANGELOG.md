## v1.0.0-rc8 released 2017-07-28

* **bugfix:** Legend focus in safari wasn't working (delete)
* **bugfix:** Now expecting appointment_duration to be in seconds (delete)

## v1.0.0-rc7 released 2017-07-28

* **bugfix:** Fixed legend icons and conformed to names the customer wanted (delete)
* **bugfix:** Changed logic on "ordered" coloring to include orders that don't have a rad exam yet

## v1.0.0-rc6 released 2017-07-27

* **new:** Moved to order based model, see service notes for migration procedure

### Service Notes

> **Warning**: this update **requires Bridge >= v3.7.1** to be installed, which includes data-model v3.6.1 and data-manager v3.5.0

The following migration keeps all site config and resource group information but will delete all exam adjustment/event information. This is due to the model switch and has been approved by the one affected customer.

```bash
psql -U airflow harbinger -f db_scripts/migrations/v1.0.0-rc6-order-model.sql
```


## v1.0.0-rc5 released 2017-07-19

* **bugfix:** Comments/events should always show up moving forward. Cleared the ambiguity of which exam would be selected for fk reference
* **improvement:** Made the color bar wider by request of customer
* **improvement:** Changed comments/events to have the form on top and the events in descending order
* **bugfix:** Limited usage logging to user driven functions to prevent saturating the bus with meaningless events

## v1.0.0-rc4 released 2017-06-20

* **improvement:** Added patient type to the cards
* **improvement:** Moved anesthesia to a "GA" icon and placed in the bottom left of the card
* **improvement:** Legend is now focus based


## v1.0.0-rc3 released 2017-06-08

* **bugfix:** handling exams that were moved to a resource that is not longer selected
* **bugfix:** added usage tracking

## v1.0.0-rc2 released 2017-05-24

* **new:** added check in and sign in times
* **bugfix:** Fixed multiple resource groups failing on sort

## v1.0.0-rc1 released 2017-05-23

**new:** initial release for beta preview
