@patientflow @Browser @51058 @50312 @System
Feature: 51058_VerifyCalendarTab
  To verify that the calendar tab in Patient-flow app shows the exam cards against the time period of exam events with respect to resources for which the data is ingested.
  To verify the Resource selection drop down and calendar drop down
  To verify exam card information module pop up
  To verify that the legend is displayed for various events

  @Regression @51058
  Scenario Outline: 51058_VerifyCalendarTab
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "New Group"
    Then add Resources "<Resource1>" and "<Resource2>" into the group
    And user clicks on "Calendar" tab
    Then user selects "New Group" from Resource Group filter
    And Verify the New Group with Resource "<Resource1>" and "<Resource2>" is displayed
    And user count number of exams for "<Resource1>"
    Given user clicks on "Virtual Hospital" App
    And user creates exam with "<Resource1>" resource, "<Exam_Event>" status, ordering Physician
    And selects "Lower GI" procedure for appointment time in VHIS
    Then user switches to "Patient Flow" app
    Then user selects "New Group" from Resource Group filter
    And user verifies that record is added in "<Resource1>"
    And user selects the exam card
    Then verify that exam card has "Lower GI", "<Resource1>", ordering physician
    And data in time field as ingested for appointment
    And verify the left stripe color legend of exam card is "<Color_In_LeftStripe>"
    Then close the exam card

    Examples: 
      | Resource1   | Resource2   | Exam_Event | Color_In_LeftStripe |
      | VHO-CT CT-3 | VHO-CT CT-2 | scheduled  | grey                |
      #| VHO-CT CT-3 | VHO-CT CT-2 | begin      | violet              |
      #| VHO-CT CT-3 | VHO-CT CT-2 | completed  | blue                |
