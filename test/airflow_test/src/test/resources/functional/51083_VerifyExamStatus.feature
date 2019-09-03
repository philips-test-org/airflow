@patientflow @Browser @50317 @System
Feature: 51083_VerifyExamStatus
  To verify that the icons on the cards in the calendar view are displayed that represent steps completed in the patient experience including: On Hold, Anesthesia, Consent, PPCA Ready (“Pre-Procedure Care area” Ready), Paperwork completed, and Ready for Room
  To verify that the user is able to change the state of the following  in exam card information  pop-up : On Hold, Anesthesia, Consent, PPCA Arrival, PPCA Ready (“Pre-Procedure Care area” Ready), Paperwork completed, and Ready for Room
  To verify that the respective icons for state change is displayed in the calendar view

  @Regression  @51083
  Scenario Outline: 51083_VerifyExamStatus
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "New Group"
    Then add Resources "VHO-CT CT-3" and "VHO-CT CT-2" into the group
    And user clicks on "Calendar" tab
    Given user clicks on "Virtual Hospital" App
    And user creates a exam with "<Resource>" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    Then user switches to "Patient Flow" app
    Then user selects "New Group" from Resource Group filter
    Then in "<Resource>", choose exam card
    And user selects the exam card
    Then user selects exam status "On Hold"
    Then user selects exam status "Anesthesia"
    Then user selects exam status "Consent"
    Then user selects exam status "PPCA Arrival"
    Then user selects exam status "PPCA Ready"
    Then user selects exam status "Paperwork"
    And user adds comments in exam card
    Then close the exam card
    Then user verifies the "anesthesia" icon is displayed on exam card
    Then user verifies the "consent" icon is displayed on exam card
    Then user verifies the "ppca_ready" icon is displayed on exam card
    Then user verifies the "paperwork" icon is displayed on exam card
    Then user verifies the On Hold status is displayed with "yellow" background color
    And user logs out of the application

    Examples: 
      | Exam Status | Resource    | Procedure | Color  |
      | begin       | VHO-CT CT-3 | Lower GI  | voilet |
