@airflow @Browser
Feature: AirFlow app to create new group, Real Time data inflow, display of ingested data, legends verification

  #The below scenarios requires to be run one after the other because of dependencies on creation of group and data ingestion respectively.
  @sanity
  Scenario Outline: 003_VerifyApplyPatientExperienceByAdmin
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
    And user logs out of the application
    Given user clicks on "Virtual Hospital" App
    
    #And user creates a startup exam with "<Resource>" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    #Given user clicks on "Airflow" App
    #Then user selects "New Group" from Resource Group filter
    #And user count number of exams for "<Resource>"
    Then user switches to "Virtual Hospital" app
    And user creates a exam with "<Resource>" resource, "<Exam Status>" status and "<Procedure>" procedure in VHIS
    
    #Then user switches to "Airflow" app
    
    Given user clicks on "Airflow" App
    #Then user selects "New Group" from Resource Group filter
    #And user count number of exams for "<Resource>"
    
    #And user verifies that record is added in "<Resource>"
    #And user selects the exam card
    #And verify the left stripe color legend of exam card is "<Color>"
    #Then close the exam card
    #And user logs out of the application
    
    
    #The below scenario requires the data to be ingested before hand. The Scenario 'Admin ingested data and verifies the ingestion in Real Time' takes care that.
    #@tag
    #Scenario Outline: Admin applies patient experience level settings on an exam card
    
    #Given user clicks on "Airflow" App
    #Then user logs in as "aiuser"
    #
    Then user selects "New Group" from Resource Group filter
    Then in "<Resource>", choose exam card
    And user selects the exam card
    Then user selects "On Hold" as "On Hold"
    Then user selects "Anesthesia" as "Complete"
    Then user selects "Consent" as "Complete"
    Then user selects "PPCA Ready" as "Complete"
    Then user selects "Paperwork" as "Complete"
    And user adds comments in exam card
    Then close the exam card
    Then user verifies the "anesthesia" icon is displayed on exam card
    Then user verifies the "consent" icon is displayed on exam card
    Then user verifies the "ppca_ready" icon is displayed on exam card
    Then user verifies the "paperwork" icon is displayed on exam card
    Then user verifies the On Hold status is displayed with "yellow" background color
    And user logs out of the application

       Examples: 
      | Exam Status | Resource      | Procedure             | Color  |
      | begin       | VHC Main CT-1 | CT PELVIS W/O & W/DYE | voilet |
