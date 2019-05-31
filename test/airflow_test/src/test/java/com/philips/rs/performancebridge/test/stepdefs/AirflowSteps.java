package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class AirflowSteps {

	private Airflow airflow;
	private int preIngestionExamsCount;
	private ContextDTO contextDTO;

	public AirflowSteps(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		airflow = pageObjectManager.getAirflowPage();
		this.contextDTO = contextDTO;
	}

	/**
	 * The below method counts the number of exam cards in the chosen resource
	 */
	@Then("^user count number of exams for \"([^\"]*)\"$")
	public void user_count_number_of_exams_for(String resourceName) throws Throwable {
		airflow.verifySpinnerIsInvisible();
		preIngestionExamsCount = airflow.examCardCountForTheResource(resourceName);
	}

	/**
	 * The below method is written to count the number of exam cards in a particular records and verify that the post data ingestion, the exam card count is increased by 1. 
	 * The later method verifies that the 1 increased count belongs to the MRN of the ingested data
	 */
	@Given("^user verifies that record is added in \"([^\"]*)\"$")
	public void user_verifies_that_is_added_in(String Resource) throws Throwable {
	//	UITestUtils.refreshPage();
		airflow.verifySpinnerIsInvisible();	
		int postIngestionExamCount = airflow.examCardCountForTheResource(Resource);
		Comparator.check("Verified that the count of exam cards is incremented by 1", preIngestionExamsCount + 1, postIngestionExamCount);
		Comparator.check("Verified that incremented exam card is same as the ingested record", true,  airflow.verifyMrnExamCardDispalyed(Resource, contextDTO.getMrn()));
	}


	/**
	 * The below method clicks on the newly ingested exam card to view the color of the left stripe
	 */
	@Given("^user selects the exam card$")
	public void user_selects_the_exam_card() throws Throwable {
		airflow.selectMRNOnExamCard(contextDTO.getResource(), contextDTO.getMrn());
	}


	/**
	 * The below method picks the hex value of the color of the left stripe and compares with the hex code of expected color
	 */
	@Then("^verify the left stripe color legend of exam card is \"([^\"]*)\"$")
	public void verify_the_left_stripe_color_legend_of_exam_card_is(String checkHexValueForColor) throws Throwable {
		String valueForColor = UITestUtils.getHexValueOfColor(checkHexValueForColor);
		boolean verifyColor = airflow.verifyExamCardPopupLeftStripColorLegend(valueForColor);
		Comparator.check(true, verifyColor);
	}


	/**
	 * The below method closes the exam card information pop up
	 */
	@Then("^close the exam card$")
	public void close_the_exam_card() throws Throwable {
		airflow.closeTheExamCard();
		Thread.sleep(5000);
	}


	/**
	 * The below method identifies the newly ingested exam card within the chosen resource column
	 */
	@Then("^in \"([^\"]*)\", choose exam card$")
	public void in_choose_exam_card(String Resources) throws Throwable {
		//UITestUtils.refreshPage();
		airflow.verifySpinnerIsInvisible();
		airflow.verifyMrnExamCardDispalyed(Resources, contextDTO.getMrn());
	}


	/**
	 * The below method selects the resource group from the drop down
	 */
	@Then("^selects the \"([^\"]*)\"$")
	public void selects_the(String resourceGroup) throws Throwable {
		airflow.selectTheCategory(resourceGroup);
	}
	/**
	 * The below method selects the check box for all the patient experience metrics such as anesthesia, On hold, paperwork, consent and ppca ready.
	 * The method is designed to identify the current state of the check boxes and then switch the status if the status if OFF.
	 */
	@Then("^user selects exam status \"([^\"]*)\"$")
	public void user_selects_exam_status(String patientExperienceEvents) throws Throwable {
			airflow.clickOnPatientExperienceStateEvent(patientExperienceEvents);
	}


	/**
	 * The below method adds the comments in the comments section of the exam card information modal pop up
	 */
	@Given("^user adds comments in exam card$")
	public void user_adds_comments_in_exam_card() throws Throwable {
		airflow.addCommentsinExamCard("The patient is prepared for the scan and the paperwork is completed. Room not ready, patient scan is on hold");
	}


	/**
	 * After turning on the check boxes for all patient experience metrics, the below method verified the icons for representing the status of the exam card
	 */
	@Then("^user verifies the \"([^\"]*)\" icon is displayed on exam card$")
	public void user_verifies_the_icon_is_displayed_on_exam_card(String statusIconsOnExamCard) throws Throwable {
		airflow.verifySpinnerIsInvisible();
		Comparator.check("Verify " + statusIconsOnExamCard + " icon is displayed on exam card", true, airflow.statusIndicatorOnExamCard(statusIconsOnExamCard,contextDTO.getMrn()));
	}


	/**
	 * The below method is verifying the color of the exam card if the patient experience metric for On Hold is turned on.
	 * The method picks the hex value of the background color and verifies that the value matches the hex code of intended color
	 */
	@Then("^user verifies the On Hold status is displayed with \"([^\"]*)\" background color$")
	public void user_verifies_the_On_Hold_status_is_displayed_with_background_color(String checkHexValueForColor)
			throws Throwable {
		String resource = contextDTO.getResource();
		String mrn = contextDTO.getMrn();
		String valueForColor = UITestUtils.getHexValueOfColor(checkHexValueForColor);
		boolean verifyColor = airflow.verifyMRNNumberExamCardLeftPanelBackgroupColor(valueForColor, resource, mrn);
		Comparator.check(true, verifyColor);
	}
	
	@Then("^user verifies procedure and accession number is not diplayed on the examcards$")
	public void user_verifies_procedure_and_accession_number_is_not_diplayed_on_the_examcards() throws Throwable {
		Comparator.check("verifies " + contextDTO.getMrn() + " mrn is not diplayed on the examcards", true,airflow.verifyExamCardNotVisible(contextDTO.getResource(), contextDTO.getMrn()));
	}
	
	
	@Then("^user is unauthorized access message should display$")
	public void user_unauthorized_To_access() throws Throwable {
		Comparator.check("user unauthorized access page dispalyed", true, airflow.verifyUnauthorizedUserTitleDisplayed());
	}
	
	@Then("^Airflow home page should display$")
	public void airflow_Home_Page() throws Throwable {
		Comparator.check("user unauthorized access page dispalyed",true,  airflow.verifyhomePageWorkspaceDisplayed());
	}
	
	@Then("^verify that exam card has \"([^\"]*)\", \"([^\"]*)\", ordering physician$")
	public void verify_that_exam_card_has_ordering_physician(String procedure, String resource) throws Throwable {
		Comparator.check("Verified that MRN number displayed is correct", true, airflow.verifyMRNOnExamCard(contextDTO.getMrn()));
		Comparator.check("Verified that accession number displayed is correct", true, airflow.verifyAccessionNumberOnExamCard(contextDTO.getAccessionNumber()));
		Comparator.check("Verified that procedure displayed is correct", true, airflow.verifyProcedure(procedure));
		Comparator.check("Verified that resource displayed is correct", true, airflow.verifyResource(resource));
		Comparator.check("Verified that ordering physician displayed is correct", true, airflow.verifyOrderingPhysician(contextDTO.getOrderingPhysician()));
	}
		
	@Then("^data in time field as ingested for appointment$")
	public void data_in_time_field_as_ingested_for_appointment() throws Throwable {
		Comparator.check("Verified that appointment time displayed is correct", true, airflow.verifyAppointmentTime(contextDTO.getAppointmentTime()));
	}
	
	@Then("^data in time field as ingested for appointment and begin exam$")
	public void data_in_time_field_as_ingested_for_appointment_and_begin_exam() throws Throwable {
		Comparator.check("Verified that appointment time displayed is correct", true, airflow.verifyAppointmentTime(contextDTO.getAppointmentTime()));
		Comparator.check("Verified that begin time displayed is correct", true, airflow.verifyBeginTime(contextDTO.getBeginTime()));
}
	
	@Then("^data in time field as ingested for appointment, begin exam and end exam$")
	public void data_in_time_field_as_ingested_for_appointment_begin_exam_and_end_exam() throws Throwable {
		Comparator.check("Verified that appointment time displayed is correct", true, airflow.verifyAppointmentTime(contextDTO.getAppointmentTime()));
		Comparator.check("Verified that begin time displayed is correct", true, airflow.verifyBeginTime(contextDTO.getBeginTime()));
		Comparator.check("Verified that exam end time displayed is correct", true, airflow.verifyExamEndTime(contextDTO.getExamEndTime()));
	}
}

