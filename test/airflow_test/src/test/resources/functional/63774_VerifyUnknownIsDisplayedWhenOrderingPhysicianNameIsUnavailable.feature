@patientflow @Browser @52667 @50320 @System
Feature: 52667_VerifyOrderingPhysicianName
  To verify that ordering physician's name is displayed as unknown in case the name is not available for an exam.

   @63774
  Scenario Outline: 63774_VerifyUnknownIsDisplayedWhenOrderingPhysician'sNameIsUnavailable
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
    And select the ordering physician name as blank
    And selects "Chest W & W/O" procedure for appointment time in VHIS
    Then user switches to "Patient Flow" app
    Then user selects "New Group" from Resource Group filter
    And user verifies that record is added in "<Resource1>"
    And verify that ordering physicians name is displayed as unknown on the exam card
    And user logs out of the application

    Examples: 
      | Resource1      | Resource2       | Exam_Event |
      | My Favorite CT | My Favorite CT1 | scheduled  |
