package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.po.AirflowCalendar;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class AirFlowCalendarSteps {

	
	private PageObjectManager pom;
	private AirflowCalendar airflowCalendar;
	private Airflow Airflow;
	private ContextDTO contextDTO;

	public AirFlowCalendarSteps(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		this.contextDTO = contextDTO;
		this.pom = pageObjectManager;
		airflowCalendar = pageObjectManager.getAirflowCalendarPage();
		Airflow = pageObjectManager.getAirflowPage();
	}


	@Then("^Verify the New Group with Resource \"([^\"]*)\" and \"([^\"]*)\" is displayed$")
	public void verify_the_New_Group_with_Resource_and_is_displayed(String resource1, String resource2) throws Throwable {
		String groupName = contextDTO.getGroupName();
		airflowCalendar.selectResource(groupName);
		Airflow.verifySpinnerIsInvisible();
		Comparator.check(true, airflowCalendar.verifyResource(resource1));
		Comparator.check(true, airflowCalendar.verifyResource(resource2));
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
		Comparator.check(examsCountOnOverview, examsCountOnCalendar);
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
}
