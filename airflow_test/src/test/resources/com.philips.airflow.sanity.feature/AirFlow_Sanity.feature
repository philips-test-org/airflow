@airflow
Feature: AirFlow app to create new group, Real Time data inflow, display of ingested data, legends verification

  #The below scenarios requires to be run one after the other because of dependencies on creation of group and data ingestion respectively.
  @sanity
  Scenario: Create New Group
    Given user clicks on "Airflow" App
    Then user logs in as "aiuser"
    And user clicks on "Admin" tab
    Then user selects "Resource Groups"
    And Creates "New Group" with Resource "VHC Main CT-1"
    And user clicks on "Calendar" tab
    And Verify the "New Group" with Resource "VHC Main CT-1" is displayed
    And user logs out
    And user closes the browser

 # The below scenario is depeneded on the 'Create New Group' scenario
  @tag
  Scenario Outline: Admin ingested data and verifies the ingestion in Real Time
    Given user clicks on "Service Tools" App
    Then user logs in as "aiuser"
    Then user finds the ID for "<Resource>"
    Then user switches to "PerformanceBridge" app
    Given user clicks on "Airflow" App
    Then user selects "New Group" from Resource Group filter
    And user count number of exams for "<Resource>"
    Then user switches to "PerformanceBridge" app
    Given user clicks on "Virtual Hospital" App
    Then select exam status as "<Exam Status>"
    And user selects the "<Resource>" and Accession_Number, "<Procedure>" and submit in VHIS
    Then user switches to "Airflow" app
    And user verifies that record is added in "<Resource>"
    And user selects the exam card
    And verify the left stripe color legend of exam card is "<Color>"
    Then close the exam card
    And user logs out
    And user closes the browser

    Examples: 
      | Exam Status | Resource      | Procedure             | Color  |
      | begin       | VHC Main CT-1 | CT PELVIS W/O & W/DYE | voilet |
      #| completed   | VHC Main CT-1 | CT PELVIS W/O & W/DYE | blue   |

#  The below scenario requires the data to be ingested before hand. The Scenario 'Admin ingested data and verifies the ingestion in Real Time' takes care that.
  @tag
  Scenario Outline: Admin applies patient experience level settings on an exam card
    Given user clicks on "Airflow" App
    Then user logs in as "aiuser"
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
    And user logs out
    And user closes the browser

    Examples: 
    | Resource      |
    | VHC Main CT-1 |

#  The below scenario requires the data to be ingested for particular resource
  @sanity
  Scenario Outline: Kiosk Verify Only Order/token numbers, no asscn/mrn is displayed
    Given user clicks on "Airflow" App
    Then user logs in as "aiuser"
    Then user selects "New Group" from Resource Group filter
    Then in "<Resource>", choose exam card
    And user selects the exam card
    And gets the token number from exam card
    And user clicks on "Kiosk" tab
    Then user selects "New Group" from Resource Group filter
    And user verifies order number is diplayed on the examcards
    And user verifies procedure and accession number is not diplayed on the examcards
    And user logs out
    And user closes the browser

    Examples: 
      | Resource      |
      | VHC Main CT-1 |

  @sanity
  Scenario: Check:All schedules per day are are same in overVeiw and Calender
    Given user clicks on "Airflow" App
    Then user logs in as "aiuser"
    Then user selects "New Group" from Resource Group filter
    And user clicks on "Overview" tab
    Then user selects "New Group" from Resource Group filter
    And user schedules per day are same in overVeiw and Calender
    And user logs out
    And user closes the browser
    
    
  #@sanity 
  #Scenario: Drag and Drop between Timelines and Device 
  #	Given user clicks on "Airflow" App
  #	Then user logs in as "attending1" 
  #	And user clicks on "Calendar" tab
  #	And Drag and Drops exam card "Air103" between Device "VHO-CT CT-2"  to "VHO-CT CT-3"
  #	And Drag and Drops exam card "Air103" between Time 
  #	And user logs out
  #	And user closes the browser
