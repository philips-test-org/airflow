@patientflow @Browser @50314 @System
Feature: 51080_VerifyDeleteExistingResourceGroup
  To verify that user can delete the existing resource groups
  To verify that the user cannot access the deleted group from Calendar tab

   @51080
  Scenario Outline: 51080_VerifyDeleteExistingResourceGroup
    Given user logins to the portal app as "aiuser"
    Given user clicks on "Patient Flow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "<Group_Name>"
    Then add Resources "VHO-CT CT-3" and "VHO-CT CT-2" into the group
    And user clicks on "Calendar" tab
    And Verify the New Group with Resource "VHO-CT CT-3" and "VHO-CT CT-2" is displayed
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    Then user deletes the "<Group_Name>"
    And user clicks on "Calendar" tab
    And Verify the "<Group_Name>" is not displayed

    Examples: 
      | Group_Name |
      | New Group  |
 