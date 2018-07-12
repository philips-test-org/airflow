package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.po.Ingestion;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class IngestionSteps extends Ingestion {

	/**
	 * The below method change the exam event for the data being ingested. The exam status is a configurable value which needs to be given in the feature file
	 */
	@Then("^select exam status as \"([^\"]*)\"$")
	public void select_exam_status_as(String examStatus) throws Throwable {
		selectStatus(examStatus);
		selectSubmit("Submit");
	}


	/**
	 * The below method enters the accession number which is generated using random numbers, resource as mentioned in the feature file, search for intended procedure and select it from the drop down and submit in VHIS.
	 * The method also picks up the MRN number corresponding newly created accession number for the exam.  
	 */
	@Given("^user selects the \"([^\"]*)\" and Accession_Number, \"([^\"]*)\" and submit in VHIS$")
	public void user_selects_the_and_Accession_Number_and_submit_in_VHIS(String resource, String procedure) throws Throwable {
		selectResourceFromDropDown(resource);
		String acc_num = enterAccessionNumber();
		selectProcedure(procedure);
		selectSubmit("Submit");
		searchIngestedAccNum(acc_num);
		getCorrespondingMRNNumber(acc_num);
	}
}
