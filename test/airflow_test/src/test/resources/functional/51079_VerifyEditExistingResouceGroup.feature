@patientfloew @Browser @50314 @System @Regression
Feature: 51079_VerifyEditExistingResouceGroup
  To verify that user can edit resource grouping in airflow by adding/removing the existing resources from the group.
  To verify that the user can access the edited group from Calendar tab

  @51079 @Parallel
  Scenario: 51079_VerifyEditExistingResouceGroup
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "New Group"
    Then add Resources "VHO-CT CT-3" and "VHO-CT CT-2" into the group
    And user clicks on "Calendar" tab
    And Verify the New Group with Resource "VHO-CT CT-3" and "VHO-CT CT-2" is displayed
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And selects group "New Group" to edit
    Then user removes the existing resources
    Then add Resources "VHO-CT CT-1" and "VHO-CT CT-2" into the group
    #And user clicks on "Calendar" tab
    #And Verify the New Group with Resource "VHO-CT CT-1" and "VHO-CT CT-2" is displayed
    #And user logs out of the application
