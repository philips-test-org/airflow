@patientflow @Browser @50311 @System
Feature: 51104_VerifyNearRealTimeUpdatesCancelledExam
 To verify that calendar view shows the near real time update of following Events Ordered,Patient Arrived,Exam start ,Exam complete and Exam Cancelled.
 To verify that the legend is updated in Overview tab
 To verify that the legend is updated in Kiosk tab

   @51104 
  Scenario Outline: 51104_VerifyNearRealTimeUpdatesCancelledExam
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "New Group"
    #Then Apply the "CT" modality filter
    Then add Resources "My Favorite CT" and "My Favorite CT1" into the group
    And user clicks on "Calendar" tab
    And Verify the New Group with Resource "My Favorite CT" and "My Favorite CT1" is displayed
    #And user logs out of the application
    #Given user clicks on "Service Tools" App
    #Then user login as "aiuser"
    #Then user finds the ID for "<Resource>"
    Given user clicks on "Virtual Hospital" App
    And user creates a startup exam with "<Resource>" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    Given user clicks on "Patient Flow" App
    Then user selects "New Group" from Resource Group filter
    And user count number of exams for "<Resource>"
    Then user switches to "Virtual Hospital" app
    And user creates a exam with "<Resource>" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    Then user switches to "Patient Flow" app
    And user verifies that record is added in "<Resource>"
    And user selects the exam card
    And verify the left stripe color legend of exam card is "<Color>"
    Then close the exam card
    And user logs out of the application

    Examples: 
      | Exam Status | Resource      | Procedure             | Color  |
      | begin       | My Favorite CT | CT PELVIS W/O & W/DYE | voilet |