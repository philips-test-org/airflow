@Airflow @Browser @50313
Feature: 51082_VerifyOverviewCalendarWithoutLogin
To verify that user cannot access Overview/calendar in airflow without logging in.

  @51082 @Regression @Parallel
  Scenario: 51082_VerifyOverviewCalendarWithoutLogin
    Given user launch App
    When user navigate to url "airflow/calendar"
    Then page should display with title "The page you were looking for doesn't exist (404)"
    When user navigate to url "airflow/overview"
    Then page should display with title "The page you were looking for doesn't exist (404)"
