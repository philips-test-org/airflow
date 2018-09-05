@Airflow @Browser @50315
Feature: 51107_VerifySiteConfig_PageAccess
  To verify that users with access roles under 'User roles with access' section can access the airflow application. 
  To verify that the users with access roles under 'User roles without access' section are not unauthorized to use airflow app

  @Regression @51107 @Nonparallel
  Scenario: 51107_VerifySiteConfig_PageAccess
    Given user launch App
    Given user clicks on "Airflow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Site Configuration"
    When user is configured without role "attending"
    Then user logs out of the application
    Given user clicks on "Airflow" App
    Then user login as "Airflow_attending"
    Then user is unauthorized access message should display
    Then user logs out of the application
    Given user clicks on "Airflow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Site Configuration"
    When user is configured role with "attending"
    Then user logs out of the application
    Given user clicks on "Airflow" App
    Then user login as "Airflow_attending"
    Then Airflow home page should display
    Then user logs out of the application
