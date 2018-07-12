package com.philips.rs.performancebridge.test.stepdefs;

import org.junit.Assert;
import org.openqa.selenium.By;

import com.philips.rs.performancebridge.test.po.Airflow;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class AirflowSteps extends Airflow  {

	/**
	 * The below method is designed to pick up the resource ID for chosen resource from Service Tools
	 */	
	@Then("^user finds the ID for \"([^\"]*)\"$")
	public void user_finds_the_ID_for(String selectResourceInST) throws Throwable {
		leftPanelElementsFOrServiceTool();
		clickOnSearchInResource();
		getIDForResource(selectResourceInST);
	}


	/**
	 * The below method counts the number of exam cards in the chosen resource
	 */
	@Then("^user count number of exams for \"([^\"]*)\"$")
	public void user_count_number_of_exams_for(String resourceName) throws Throwable {
		sleep(15);
		getExamCardCountPreIngestion();      
	}


	/**
	 * The below method selects the resource group from the drop down
	 */
	@Then("^selects the \"([^\"]*)\"$")
	public void selects_the(String resourceGroup) throws Throwable {
		selectTheCategory(resourceGroup);
	}


	/**
	 * The below method is written to count the number of exam cards in a particular records and verify that the post data ingestion, the exam card count is increased by 1. 
	 * The later method verifies that the 1 increased count belongs to the MRN of the ingested data
	 */
	@Given("^user verifies that record is added in \"([^\"]*)\"$")
	public void user_verifies_that_is_added_in(String Resource) throws Throwable {
		sleep(20);
		//refreshPage();
		verifyExamCardCount();
		verifyMRNOnExamCard();
	}


	/**
	 * The below method clicks on the newly ingested exam card to view the color of the left stripe
	 */
	@Given("^user selects the exam card$")
	public void user_selects_the_exam_card() throws Throwable {
		clickLink_JavaScript(searchForMRNNumberInExamCard(), "Exam Card is selected");	
	}


	/**
	 * The below method picks the hex value of the color of the left stripe and compares with the hex code of expected color
	 */
	@Then("^verify the left stripe color legend of exam card is \"([^\"]*)\"$")
	public void verify_the_left_stripe_color_legend_of_exam_card_is(String checkHexValueForColor) throws Throwable {
		String valueForColor = getHexValueOfColor(checkHexValueForColor);
		Assert.assertEquals(getHexValueForGivenWebElement(leftStripeColorLegendInExamCard), valueForColor);
	}


	/**
	 * The below method closes the exam card information pop up
	 */
	@Then("^close the exam card$")
	public void close_the_exam_card() throws Throwable {
		closeTheExamCard();
		sleep(5);
	}


	/**
	 * The below method identifies the newly ingested exam card within the chosen resource column
	 */
	@Then("^in \"([^\"]*)\", choose exam card$")
	public void in_choose_exam_card(String Resources) throws Throwable {
		waitForElementToLoad(searchForMRNNumberInExamCard(), "Search for Exam Card within a resource");
	}


	/**
	 * The below method selects the check box for all the patient experience metrics such as anesthesia, On hold, paperwork, consent and ppca ready.
	 * The method is designed to identify the current state of the check boxes and then switch the status if the status if OFF.
	 */
	@Then("^user selects \"([^\"]*)\" as \"([^\"]*)\"$")
	public void user_selects_as(String patientExperienceEvents, String PatientexperienceEventstatus) throws InterruptedException {
		By labelName = patientExperienceState(patientExperienceEvents);
		String status = retrieveAttributeValue(labelName, "class", "picking up the class");
		if (status.contains("off"))
		{
			clickLink(labelName,"The state is changed");
		}		 
	}


	/**
	 * The below method adds the comments in the comments section of the exam card information modal pop up
	 */
	@Given("^user adds comments in exam card$")
	public void user_adds_comments_in_exam_card() throws Throwable {
		addCommentsinExamCard();
	}


	/**
	 * After turning on the check boxes for all patient experience metrics, the below method verified the icons for representing the status of the exam card
	 */
	@Then("^user verifies the \"([^\"]*)\" icon is displayed on exam card$")
	public void user_verifies_the_icon_is_displayed_on_exam_card(String statusIconsOnExamCard) throws Throwable {
		statusIndicatorOnExamCard(statusIconsOnExamCard);
	}


	/**
	 * The below method is verifying the color of the exam card if the patient experience metric for On Hold is turned on.
	 * The method picks the hex value of the background color and verifies that the value matches the hex code of intended color
	 */
	@Then("^user verifies the On Hold status is displayed with \"([^\"]*)\" background color$")
	public void user_verifies_the_On_Hold_status_is_displayed_with_background_color(String checkHexValueForColor) throws Throwable {
		String valueForColor = getHexValueOfColor(checkHexValueForColor);
		Assert.assertEquals(getHexValueForGivenWebElement(leftStripeColorLegendInExamCard), valueForColor);
	}

}

