@patientflow @Browser @50313 @System
Feature: 51082_VerifyOverviewCalendarWithoutLogin
To verify that user cannot access Overview/calendar in airflow without logging in.

  @51082  @Parallel @Regression
  Scenario: 51082_VerifyOverviewCalendarWithoutLogin
    Given user logins to the portal app as "aiuser"
    When user navigate to url "Patient Flow/calendar"
    Then page should display with title "The page you were looking for doesn't exist (404)"
    When user navigate to url "Patient Flow/overview"
    Then page should display with title "The page you were looking for doesn't exist (404)"
