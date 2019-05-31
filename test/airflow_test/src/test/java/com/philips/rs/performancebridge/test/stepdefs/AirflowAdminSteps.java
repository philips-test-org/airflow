package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.po.AirflowAdmin;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Then;

public class AirflowAdminSteps {
	
	//private PageObjectManager pom;
	private AirflowAdmin airflowAdmin;
	private Airflow Airflow;
	private ContextDTO contextDTO;
	
	

	public AirflowAdminSteps(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		this.contextDTO = contextDTO;
	//	this.pom = pageObjectManager;
		airflowAdmin = pageObjectManager.getAirflowAdminPage();
		Airflow = pageObjectManager.getAirflowPage();
	}

	@Then("^user selects \"([^\"]*)\"$")
	public void user_selects(String subTabName) throws Throwable {
		airflowAdmin.clickOnSubMenOfMenuTab(subTabName);
	} 
	
	@Then("^creates \"([^\"]*)\"$")
	public void creates(String originalGroupName) throws Throwable {
		String randomGroupName = originalGroupName + UITestUtils.randomNumberGenerator(1,999999);
		contextDTO.setGroupName(randomGroupName);
		airflowAdmin.enterGroupName(randomGroupName);
		airflowAdmin.clickCreateNewGroupPlus();
		airflowAdmin.clickGroupName(randomGroupName);
	}
	
	@Then("^Apply the \"([^\"]*)\" modality filter$")
	public void apply_the_modality_filter(String modality) throws Throwable {	
		airflowAdmin.clickOnFilterByModalityButton();
		airflowAdmin.selectModalityFilterFromDropDown(modality);
		airflowAdmin.searchAppliedModalityFilter();
	}
	
	@Then("^add Resources \"([^\"]*)\" and \"([^\"]*)\" into the group$")
	public void add_Resources_and_into_the_group(String resource1, String resource2) throws Throwable {
		Airflow.verifySpinnerIsInvisible();
		airflowAdmin.clickOnResourceName(resource1);
		
		airflowAdmin.clickOnResourceName(resource2);
	}
	
	@Then("^selects group \"([^\"]*)\" to edit$")
	public void selects_group_to_edit(String resourceName) throws Throwable {
		String groupName = contextDTO.getGroupName();		
		airflowAdmin.clickGroupName(groupName);
	}

	@Then("^user removes the existing resources$")
	public void user_removes_the_existing_resources() throws Throwable {
		Airflow.verifySpinnerIsInvisible();
		airflowAdmin.removingTheExistingResources();
	}

	@Then("^user deletes the \"([^\"]*)\"$")
	public void user_deletes_the(String groupname) throws Throwable {
		String groupName = contextDTO.getGroupName();
		airflowAdmin.clickGroupName(groupName);
		Airflow.verifySpinnerIsInvisible();
		airflowAdmin.deleteResourceGroup(groupName);
	}
	
}
