@patientflow @Browser @50314 @System @Regression
Feature: 51078_VerifyCreateResourceGroups
  To verify that user can create resource grouping in airflow by filtering resources by modalities and searching by resource name.
  To verify that the user can access the created group from Calendar tab

  @51078 @Parallel
  Scenario: 51078_VerifyCreateResourceGroups
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "New Group"
    Then Apply the "CT" modality filter
    Then add Resources "VHO-CT CT-3" and "VHO-CT CT-2" into the group
    And user clicks on "Calendar" tab
    And Verify the New Group with Resource "VHO-CT CT-3" and "VHO-CT CT-2" is displayed
    And user logs out of the application
