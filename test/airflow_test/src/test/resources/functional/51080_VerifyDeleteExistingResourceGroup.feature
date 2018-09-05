@airflow @Browser @50314
Feature: 51080_VerifyDeleteExistingResourceGroup
	To verify that user can delete the existing resource groups
  To verify that the user cannot access the deleted group from Calendar tab
  
   @Sanity @Regression @51080
   Scenario Outline: 51080_VerifyDeleteExistingResourceGroup
   Given user launch App
   Given user clicks on "Airflow" App
   Then user login as "aiuser"
   And user clicks on "Admin" tab
   Then user selects "Resource Groups"
   And creates "<Group_Name>"
   Then add Resources "VHC Main CT-1" and "VHC Main CT-2" into the group
   And user clicks on "Calendar" tab
   And Verify the New Group with Resource "VHC Main CT-1" and "VHC Main CT-2" is displayed
   And user clicks on "Admin" tab
   Then user selects "Resource Groups"
   Then user deletes the "<Group_Name>"
   And user clicks on "Calendar" tab
   And Verify the "<Group_Name>" is not displayed
   
   Examples:
   | Group_Name |
   | New Group	|