package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.po.AirflowCalendar;
import com.philips.rs.performancebridge.test.po.AirflowOverview;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Then;

public class AirflowOverviewSteps {

	private AirflowOverview airflowOverview;
	private AirflowCalendar airflowCalendar;
	private Airflow airflow;
	private ContextDTO contextDTO;
	private int preIngestionExamsCount;

	public AirflowOverviewSteps(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		this.contextDTO = contextDTO;
		airflowCalendar = pageObjectManager.getAirflowCalendarPage();
		airflow = pageObjectManager.getAirflowPage();
		airflowOverview = pageObjectManager.getAirflowOverviewPage();
	}
	
	@Then("^verify the New Group with Resource \"([^\"]*)\" and \"([^\"]*)\" is displayed in Overview$")
	public void verify_the_New_Group_with_Resource_and_is_displayed_in_Overview(String resource1, String resource2) throws Throwable {
		String groupName = contextDTO.getGroupName();
		airflowCalendar.selectResource(groupName);
		airflow.verifySpinnerIsInvisible();
		Comparator.check("Verify that "+resource1+" is shown in the group", true, airflowOverview.verifyResourceInRows(resource1));
		Comparator.check("Verify that "+resource2+" is shown in the group", true, airflowOverview.verifyResourceInRows(resource2));
	}
	

	@Then("^user count number of exams for \"([^\"]*)\" in Overview$")
	public void user_count_number_of_exams_for_in_Overview(String resourceName) throws Throwable {
		airflow.verifySpinnerIsInvisible();
		preIngestionExamsCount = airflowOverview.examCardCountForTheResource(resourceName);
	}

	@Then("^user verifies that record is added in \"([^\"]*)\" in Overview$")
	public void user_verifies_that_record_is_added_in_in_Overview(String Resource) throws Throwable {
		//UITestUtils.refreshPage();
		airflow.verifySpinnerIsInvisible();	
		int postIngestionExamCount = airflowOverview.examCardCountForTheResource(Resource);
		Comparator.check("Verified that the count of exam cards is incremented by 1", preIngestionExamsCount + 1, postIngestionExamCount);
		Comparator.check("Verified that incremented exam card is same as the ingested record", true,  airflowOverview.verifyMrnExamCardDispalyedInOverview(Resource, contextDTO.getMrn()));
	}
	
	@Then("^user selects the exam card in overview tab in resource \"([^\"]*)\"$")
	public void user_selects_the_exam_card_in_overview_tab(String resource) throws Throwable {
		airflowOverview.selectMRNOnExamCardInOverview(resource, contextDTO.getMrn());
	}
	
	
}
