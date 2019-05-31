@patientflow @Browser @50311 @System
Feature: 51098_VerifyNearRealTimeUpdates
  To verify that calendar view shows the near real time update of following Events Ordered,Patient Arrived,Exam start and Exam complete. 
  To verify that the legend is updated in Overview tab
  To verify that the legend is updated in Kiosk tab

  #The below scenarios requires to be run one after the other because of dependencies on creation of group and data ingestion respectively.
   @Regression @51098
  Scenario Outline: 51098_VerifyNearRealTimeUpdates
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "New Group"
    Then add Resources "My Favorite CT" and "My Favorite CT1" into the group
    And user clicks on "Calendar" tab
    And Verify the New Group with Resource "My Favorite CT" and "My Favorite CT1" is displayed
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
    Then gets the token number from exam card
    And user clicks on "Kiosk" tab
    Then user selects "New Group" from Resource Group filter
    And user verifies order number is diplayed on the examcards
    And user verifies procedure and accession number is not diplayed on the examcards
    And user logs out of the application

    Examples: 
      | Exam Status | Resource      | Procedure             | Color  |
      | begin       | My Favorite CT | Chest W & W/O | violet |
      
