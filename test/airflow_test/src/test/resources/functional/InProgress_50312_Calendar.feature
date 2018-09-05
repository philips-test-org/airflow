@airflow @Browser
Feature: The system shall support a calendar view to display data

  #The below scenarios requires to be run one after the other because of dependencies on creation of group and data ingestion respectively
  Scenario Outline: 51058_VerifyCalendarTab
    Given user launch App
    Given user clicks on "Airflow" App
    Then user login as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And creates "New Group"
    Then add Resources "VHC Main CT-1" and "VHC Main CT-2" into the group
    And user clicks on "Calendar" tab
    And Verify the New Group with Resource "VHC Main CT-1" and "VHC Main CT-2" is displayed
    Given user clicks on "Service Tools" App
    Then user finds the ID for "VHC Main CT-1"
    Given user clicks on "Airflow" App
    Then user selects "New Group" from Resource Group filter
    And user count number of exams for "<Resource>"
    Given user clicks on "Virtual Hospital" App
    And user creates a exam with "VHC Main CT-1" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    Then user switches to "Airflow" app
  #  Then user selects "New Group" from Resource Group filter
    And user verifies that record is added in "VHC Main CT-1"
    And user selects the exam card
    And verify the left stripe color legend of exam card is "<Color>"
    Then verify that exam card has "<Procedure>", "VHC Main CT-1", "<Accession_Number>","<Time_related_information>"
    Then close the exam card
    
    Examples: 
     |	Exam Status	| Procedure             | Color  |
     |	begin		| CT PELVIS W/O & W/DYE | voilet |
    # | completed	| CT PELVIS W/O & W/DYE | blue	 |
