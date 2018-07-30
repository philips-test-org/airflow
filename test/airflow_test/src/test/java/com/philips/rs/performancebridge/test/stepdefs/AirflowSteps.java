package com.philips.rs.performancebridge.test.stepdefs;

import org.junit.Assert;
import org.openqa.selenium.By;

import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class AirflowSteps {

	
	private PageObjectManager pom;
	private Airflow airflow;
	private int preIngestionExamsCount;

	public AirflowSteps(PageObjectManager pageObjectManager) {
		this.pom = pageObjectManager;
		airflow = pageObjectManager.getAirflowPage();
	}

	
	
	/**
	 * The below method is designed to pick up the resource ID for chosen resource from Service Tools
	 */	
	@Then("^user finds the ID for \"([^\"]*)\"$")
	public void user_finds_the_ID_for(String selectResourceInST) throws Throwable {
		airflow.leftPanelElementsFOrServiceTool();
		airflow.clickOnSearchInResource();
		pom.setValue("resourceId", airflow.getIDForResource(selectResourceInST));
	}


	/**
	 * The below method counts the number of exam cards in the chosen resource
	 */
	@Then("^user count number of exams for \"([^\"]*)\"$")
	public void user_count_number_of_exams_for(String resourceName) throws Throwable {
		airflow.verifySpinnerIsInvisible();
		preIngestionExamsCount = airflow.examCardCountForTheResource(pom.getValue("resourceId")); 
//		getExamCardCountPreIngestion();      
	}

	/**
	 * The below method is written to count the number of exam cards in a particular records and verify that the post data ingestion, the exam card count is increased by 1. 
	 * The later method verifies that the 1 increased count belongs to the MRN of the ingested data
	 */
	@Given("^user verifies that record is added in \"([^\"]*)\"$")
	public void user_verifies_that_is_added_in(String Resource) throws Throwable {
		// refreshPage();
		UITestUtils.refreshPage();
		airflow.verifySpinnerIsInvisible();
		int postIngestionExamCount = airflow.examCardCountForTheResource(pom.getValue("resourceId"));
		Comparator.check(preIngestionExamsCount + 1, postIngestionExamCount);
		Comparator.check(true, airflow.verifyMrnExamCardDispalyed(pom.getValue("resourceId"), pom.getValue("mrn")));
	}


	/**
	 * The below method clicks on the newly ingested exam card to view the color of the left stripe
	 */
	@Given("^user selects the exam card$")
	public void user_selects_the_exam_card() throws Throwable {
		airflow.selectMRNOnExamCard(pom.getValue("resourceId"), pom.getValue("mrn"));
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
	}


	/**
	 * The below method identifies the newly ingested exam card within the chosen resource column
	 */
	@Then("^in \"([^\"]*)\", choose exam card$")
	public void in_choose_exam_card(String Resources) throws Throwable {
		airflow.verifyMrnExamCardDispalyed(pom.getValue("resourceId"), pom.getValue("mrn"));
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
		Assert.assertTrue(airflow.statusIndicatorOnExamCard(statusIconsOnExamCard,pom.getValue("mrn")));
	}


	/**
	 * The below method is verifying the color of the exam card if the patient experience metric for On Hold is turned on.
	 * The method picks the hex value of the background color and verifies that the value matches the hex code of intended color
	 */
	@Then("^user verifies the On Hold status is displayed with \"([^\"]*)\" background color$")
	public void user_verifies_the_On_Hold_status_is_displayed_with_background_color(String checkHexValueForColor) throws Throwable {
//		String valueForColor = getHexValueOfColor(checkHexValueForColor);
//		Assert.assertEquals(getHexValueForGivenWebElement(leftStripeColorLegendInExamCard), valueForColor);
		String resourceId = pom.getValue("resourceId");
		String mrn = pom.getValue("mrn");
		String valueForColor = UITestUtils.getHexValueOfColor(checkHexValueForColor);
		boolean verifyColor = airflow.verifyMRNNumberExamCardLeftPanelBackgroupColor(valueForColor,resourceId,mrn);
		Comparator.check(true, verifyColor);
	}
	
	@Then("^user verifies procedure and accession number is not diplayed on the examcards$")
	public void user_verifies_procedure_and_accession_number_is_not_diplayed_on_the_examcards() throws Throwable {
		Assert.assertTrue(airflow.verifyExamCardNotVisible(pom.getValue("resourceId"), pom.getValue("mrn")));
	}

}

