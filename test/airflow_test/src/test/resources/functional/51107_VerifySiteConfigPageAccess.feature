@patientflow @Browser @50315 @System
Feature: 51107_VerifySiteConfigPageAccess
  To verify that users with access roles under 'User roles with access' section can access the airflow application. 
  To verify that the users with access roles under 'User roles without access' section are not unauthorized to use airflow app

   @51107 @Nonparallel
  Scenario: 51107_VerifySiteConfigPageAccess
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Site Configuration"
    When user is configured without role "attending"
    Then user logs out of the application
    Given user opens "Patient Flow" App
    Then user login as "attending3"
    Then user is unauthorized access message should display
    Then user logs out of the application
    Given user opens "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Site Configuration"
    When user is configured role with "attending"
    Then user logs out of the application
    Given user opens "Patient Flow" App
    Then user login as "attending3"
    Then Airflow home page should display
    Then user logs out of the application