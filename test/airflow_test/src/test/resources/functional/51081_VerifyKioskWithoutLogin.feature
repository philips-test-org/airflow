@patientflow @Browser @50313 @System
Feature: 51081_VerifyKioskWithoutLogin
  To verify that user can access Kiosk in airflow without logging in.

  @51081 @Functional @Parallel
  Scenario: 51081_VerifyKioskWithoutLogin
    Given user logins to the portal app as "aiuser"
    When user navigate to url "Patient Flow/kiosk"
    Then kiosk tab should display
    And user clicks on "Calendar" tab
    Then login screen should display