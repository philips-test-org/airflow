@Airflow @Browser @50313
Feature: 51081_VerifyKioskWithoutLogin
  To verify that user can access Kiosk in airflow without logging in.

  @51081 @Regression @Parallel
  Scenario: 51081_VerifyKioskWithoutLogin
    Given user launch App
    When user navigate to url "airflow/kiosk"
    Then kiosk tab should display
    And user clicks on "Calendar" tab
    Then login screen should display
