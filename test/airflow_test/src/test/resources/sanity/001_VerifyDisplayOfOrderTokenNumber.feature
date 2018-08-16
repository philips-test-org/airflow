@airflow @Browser
Feature: AirFlow app to create new group, Real Time data inflow, display of ingested data, legends verification

  #The below scenarios requires to be run one after the other because of dependencies on creation of group and data ingestion respectively.
  @sanity
  Scenario Outline: 001_VerifyDisplayOfOrderTokenNumber
    Given user launch App
    Given user clicks on "Airflow" App
    Then user logs in as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And Creates "New Group" with Resource "VHC Main CT-1"
    And user clicks on "Calendar" tab
    And Verify the New Group with Resource "VHC Main CT-1" is displayed
    And user logs out of the application
    #The below scenario is depeneded on the 'Create New Group' scenario
    #  Scenario Outline: Admin ingested data and verifies the ingestion in Real Time
    Given user clicks on "Service Tools" App
    Then user logs in as "aiuser"
    Then user finds the ID for "<Resource>"
    Given user clicks on "Virtual Hospital" App
    And user creates a startup exam with "<Resource>" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    Given user clicks on "Airflow" App
    Then user selects "New Group" from Resource Group filter
    And user count number of exams for "<Resource>"
    Then user switches to "Virtual Hospital" app
    And user creates a exam with "<Resource>" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    Then user switches to "Airflow" app
    And user verifies that record is added in "<Resource>"
    And user selects the exam card
    #The below scenario requires the data to be ingested for particular resource
    #Scenario Outline: Kiosk Verify Only Order/token numbers, no asscn/mrn is displayed
    Then gets the token number from exam card
    And user clicks on "Kiosk" tab
    Then user selects "New Group" from Resource Group filter
    And user verifies order number is diplayed on the examcards
    And user verifies procedure and accession number is not diplayed on the examcards
    And user logs out of the application

    Examples: 
      | Exam Status | Resource      | Procedure             | Color  |
      | begin       | VHC Main CT-1 | CT PELVIS W/O & W/DYE | voilet |
