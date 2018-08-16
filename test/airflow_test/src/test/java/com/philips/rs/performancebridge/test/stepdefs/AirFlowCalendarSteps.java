package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.po.AirflowCalendar;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class AirFlowCalendarSteps {

	
	private PageObjectManager pom;
	private AirflowCalendar airflowCalendar;
	private ContextDTO contextDTO;

	public AirFlowCalendarSteps(PageObjectManager pageObjectManager,ContextDTO contextDTO) {
		this.pom = pageObjectManager;
		this.contextDTO = contextDTO;
		airflowCalendar = pageObjectManager.getAirflowCalendarPage();
	}


	@Then("^Verify the New Group with Resource \"([^\"]*)\" is displayed$")
	public void verify_the_with_Resource_is_displayed(String resource) throws Throwable {
		String groupName = contextDTO.getGroupName(); 
//		String groupName = pom.getValue("groupName");
		airflowCalendar.selectResource(groupName);
		Comparator.check(true, airflowCalendar.verifyResource(resource));
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
//		String groupName = pom.getValue("groupName");
		String groupName = contextDTO.getGroupName(); 
		airflowCalendar.selectResource(groupName);
	}
	
}
