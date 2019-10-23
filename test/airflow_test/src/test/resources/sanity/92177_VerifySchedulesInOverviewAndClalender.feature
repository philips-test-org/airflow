@patientflow @Browser @Sanity @92177 @System
Feature: 92177_VerifySchedulesInOverviewAndClalender

  #AirFlow app to create new group, Real Time data inflow, display of ingested data, legends verification
  #The below scenarios requires to be run one after the other because of dependencies on creation of group and data ingestion respectively.
  Scenario Outline: 92177_VerifySchedulesInOverviewAndClalender
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "New Group"
    Then add Resources "<Resource1>" and "<Resource2>" into the group
    And user clicks on "Calendar" tab
    And Verify the New Group with Resource "<Resource1>" and "<Resource2>" is displayed
    And user logs out of the application
    Given user opens "Virtual Hospital" App
    Then user login as "aiuser"
    And user creates a exam with "<Resource1>" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    And user logs out
    Given user opens "Patient Flow" App
    Then user login as "aiuser"
    #Scenario: Check:All schedules per day are same in overVeiw and Calender
    Then user selects "New Group" from Resource Group filter
    And user clicks on "Overview" tab
    Then user selects "New Group" from Resource Group filter
    And user schedules per day are same in overVeiw and Calender
    And user logs out of the application

    Examples: 
      | Exam Status | Resource1   | Resource2   | Procedure | Color  |
      | begin       | VHO-CT CT-1 | VHO-CT CT-2 | Lower GI  | voilet |
