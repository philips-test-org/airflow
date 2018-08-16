package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.po.AirflowAdmin;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Then;

public class AirflowAdminSteps {
	
	private PageObjectManager pom;
	private ContextDTO contextDTO;
	private AirflowAdmin airflowAdmin;

	public AirflowAdminSteps(PageObjectManager pageObjectManager,ContextDTO contextDTO) {
		this.pom = pageObjectManager;
		this.contextDTO = contextDTO;
		airflowAdmin = pageObjectManager.getAirflowAdminPage();
	}

	@Then("^user selects \"([^\"]*)\"$")
	public void user_selects(String subTabName) throws Throwable {
		airflowAdmin.clickOnSubMenOfMenuTab(subTabName);
	} 
	
	@Then("^Creates \"([^\"]*)\" with Resource \"([^\"]*)\"$")
	public void creates_with_Resource(String originalGroupName, String Resource) throws Throwable {
		
		String randomGroupName = originalGroupName + UITestUtils.randomNumberGenerator(1,999999);
//		pom.setValue("groupName", randomGroupName);
		contextDTO.setGroupName(randomGroupName);
		airflowAdmin.enterGroupName(randomGroupName);
		airflowAdmin.clickCreateNewGroupPlus();
		airflowAdmin.clickGroupName(randomGroupName);
		airflowAdmin.clickOnResourceName(Resource);
	}
	
}
