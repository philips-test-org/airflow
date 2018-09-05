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
	 * The below method is designed to pick up the resource ID for chosen resource from Service Tools
	 */	
	@Then("^user finds the ID for \"([^\"]*)\"$")
	public void user_finds_the_ID_for(String selectResourceInST) throws Throwable {
		airflow.leftPanelElementsFOrServiceTool();
		airflow.clickOnSearchInResource();
		contextDTO.setResourceId(airflow.getIDForResource(selectResourceInST));
	}


	/**
	 * The below method counts the number of exam cards in the chosen resource
	 */
	@Then("^user count number of exams for \"([^\"]*)\"$")
	public void user_count_number_of_exams_for(String resourceName) throws Throwable {
		airflow.verifySpinnerIsInvisible();
		preIngestionExamsCount = airflow.examCardCountForTheResource(contextDTO.getResourceId()); 
	}

	/**
	 * The below method is written to count the number of exam cards in a particular records and verify that the post data ingestion, the exam card count is increased by 1. 
	 * The later method verifies that the 1 increased count belongs to the MRN of the ingested data
	 */
	@Given("^user verifies that record is added in \"([^\"]*)\"$")
	public void user_verifies_that_is_added_in(String Resource) throws Throwable {
		UITestUtils.refreshPage();
		airflow.verifySpinnerIsInvisible();
		
		System.out.println(airflow.verifyMrnExamCardDispalyed(contextDTO.getResourceId(), contextDTO.getMrn()));
		
		int postIngestionExamCount = airflow.examCardCountForTheResource(contextDTO.getResourceId());
		Comparator.check(preIngestionExamsCount + 1, postIngestionExamCount);
		Comparator.check(true, airflow.verifyMrnExamCardDispalyed(contextDTO.getResourceId(), contextDTO.getMrn()));
	}


	/**
	 * The below method clicks on the newly ingested exam card to view the color of the left stripe
	 */
	@Given("^user selects the exam card$")
	public void user_selects_the_exam_card() throws Throwable {
		airflow.selectMRNOnExamCard(contextDTO.getResourceId(), contextDTO.getMrn());
//		clickLink_JavaScript(searchForMRNNumberInExamCard(), "Exam Card is selected");	
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
		UITestUtils.refreshPage();
		airflow.verifySpinnerIsInvisible();
		airflow.verifyMrnExamCardDispalyed(contextDTO.getResourceId(), contextDTO.getMrn());
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
	@Then("^user selects \"([^\"]*)\" as \"([^\"]*)\"$")
	public void user_selects_as(String patientExperienceEvents, String PatientexperienceEventstatus) throws InterruptedException {
		String status = airflow.getPatientExperienceState(patientExperienceEvents);
		if (status.contains("off"))
		{
			airflow.clickOnPatientExperienceStateEvent(patientExperienceEvents);
		}
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
		String resourceId = contextDTO.getResourceId();
		String mrn = contextDTO.getMrn();
		String valueForColor = UITestUtils.getHexValueOfColor(checkHexValueForColor);
		boolean verifyColor = airflow.verifyMRNNumberExamCardLeftPanelBackgroupColor(valueForColor, resourceId, mrn);
		Comparator.check(true, verifyColor);
	}
	
	@Then("^user verifies procedure and accession number is not diplayed on the examcards$")
	public void user_verifies_procedure_and_accession_number_is_not_diplayed_on_the_examcards() throws Throwable {
		Comparator.check("verifies " + contextDTO.getMrn() + " mrn is not diplayed on the examcards", true,airflow.verifyExamCardNotVisible(contextDTO.getResourceId(), contextDTO.getMrn()));
	}
	
	
	@Then("^user is unauthorized access message should display$")
	public void user_unauthorized_To_access() throws Throwable {
		Comparator.check("user unauthorized access page dispalyed", true, airflow.verifyUnauthorizedUserTitleDisplayed());
	}
	
	@Then("^Airflow home page should display$")
	public void airflow_Home_Page() throws Throwable {
		Comparator.check("user unauthorized access page dispalyed",true,  airflow.verifyhomePageWorkspaceDisplayed());
	}
	
}

