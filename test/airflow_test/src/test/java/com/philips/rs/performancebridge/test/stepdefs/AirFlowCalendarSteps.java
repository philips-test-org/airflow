package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.po.AirflowCalendar;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class AirFlowCalendarSteps {

	
	private AirflowCalendar airflowCalendar;
	private Airflow Airflow;
	private ContextDTO contextDTO;

	public AirFlowCalendarSteps(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		this.contextDTO = contextDTO;
		airflowCalendar = pageObjectManager.getAirflowCalendarPage();
		Airflow = pageObjectManager.getAirflowPage();
	}


	@Then("^Verify the New Group with Resource \"([^\"]*)\" and \"([^\"]*)\" is displayed$")
	public void verify_the_New_Group_with_Resource_and_is_displayed(String resource1, String resource2) throws Throwable {
		String groupName = contextDTO.getGroupName();
		airflowCalendar.selectResource(groupName);
		Airflow.verifySpinnerIsInvisible();
		Comparator.check("The selected "+resource1+" is present in group", true, airflowCalendar.verifyResource(resource1));
		Comparator.check("The selected "+resource2+" is present in group" ,true, airflowCalendar.verifyResource(resource2));
	}
	
	@Given("^user clicks on \"([^\"]*)\" tab$")
	public void user_clicks_on_tab(String tabName) throws Throwable {
		airflowCalendar.clickOnMenuTab(tabName);
	}


	/**
	 * The below method is getting the token/kiosk number from the exam card modal pop up
	 */
	
	@Then("^user schedules per day are same in overVeiw and Calender$")
	public void user_schedules_per_day_are_same_in_overVeiw_and_Calender() throws Throwable {
		int examsCountOnOverview = airflowCalendar.getCountForExamCardsFromOverview();
		airflowCalendar.clickOnMenuTab("Calendar");
		int examsCountOnCalendar = airflowCalendar.getCountForExamCardsFromCalendar();
		Comparator.check("Number of exam cards are same in Calendar and Overview tab", examsCountOnOverview, examsCountOnCalendar);
	}

	@Then("^user selects \"([^\"]*)\" from Resource Group filter$")
	public void user_selects_from_Resource_Group_filter(String GroupName) throws Throwable {
		String groupName = contextDTO.getGroupName();
		airflowCalendar.selectResource(groupName);
	}
	
	@Then("^Verify the \"([^\"]*)\" is not displayed$")
	public void verify_the_is_not_displayed(String group) throws Throwable {
		String groupName = contextDTO.getGroupName();
		airflowCalendar.clickOnResourceGroupDropDown();
		Comparator.check("Verify groupname" + groupName + " is not available", true, airflowCalendar.verifyResourceGroupIsDisplayedInList(groupName));
	}
	
	@Then("^verify that ordering physicians name is displayed on the exam card$")
	public void verify_that_ordering_physicians_name_is_displayed_on_the_exam_card() throws Throwable {
	    Airflow.verifyOrderingPhysicianNameOnExamCardbody(contextDTO.getResource(), contextDTO.getMrn(), contextDTO.getOrderingPhysician());
	}
	
	@Then("^verify that ordering physicians name is displayed as unknown on the exam card$")
	public void verify_that_ordering_physicians_name_is_displayed_as_unknown_on_the_exam_card() throws Throwable {
	    Airflow.verifyOrderingNameDisplayedIsUnknown(contextDTO.getMrn());
	}
}
