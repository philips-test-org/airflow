@tag
Feature: AirFlow app workflow
 
  @ResourceGrouping
  Scenario: Create New Group
  
  	Given user clicks on "Airflow" App
  	
  	Then user logs in as "cmeenan"   
  	#Then user clicks on "Legend"  #""
  	And user clicks on "Admin" tab 
  	Then user selects "Resource Groups"
  	#And user clicks on "Kiosk" tab   ##
  	#Then user clicks on "group-name"		##
  	And Creates "New Group" with Resource "VHO-CT CT-2"
  	And user clicks on "Calendar" tab
  	And Verify the "New Group" with Resource "VHO-CT CT-2" is displayed
  	And user logs out
  	
  	@Kiosk
  Scenario: Kiosk  Verify Only Order/token numbers, no asscn/mrn is displayed
  
  	Given user clicks on "Airflow" App
  	Then user logs in as "cmeenan" 
  	And gets the order number ,procedure and accession number from the exam card  "Air103"
  	And user clicks on "Kiosk" tab
  	And user verifies order number is diplayed on the examcards
  	And user verifies procedure and accession number is not diplayed on the examcards
  	And user logs out
  	
  @Overview 
  Scenario: Check:All schedules per day are are same in overVeiw and Calender 
  
  	Given user clicks on "Airflow" App
  	Then user logs in as "cmeenan" 
  	And user clicks on "Overview" tab
  	And user schedules per day are same in overVeiw and Calender  
  	And user logs out
  	
  @Calendar 
  Scenario: Drag and Drop between Timelines and Device 
  
  	Given user clicks on "Airflow" App
  	Then user logs in as "attending1" 
  	And user clicks on "Calendar" tab
  	And Drag and Drops exam card "Air103" between Device "VHO-CT CT-2"  to "VHO-CT CT-3"
  	And Drag and Drops exam card "Air103" between Time 
  	And user logs out
  	
  	
  #	
  #	