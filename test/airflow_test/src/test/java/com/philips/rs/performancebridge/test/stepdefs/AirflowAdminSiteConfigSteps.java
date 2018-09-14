package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.po.AirflowAdminSiteConfig;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Then;

public class AirflowAdminSiteConfigSteps {

	private PageObjectManager pom;
	private AirflowAdminSiteConfig airflowAdminSiteConfig;

	public AirflowAdminSiteConfigSteps(PageObjectManager pageObjectManager) {
		this.pom = pageObjectManager;
		airflowAdminSiteConfig = pom.getAirflowAdminSiteConfigPage();
	}

	@Then("^user is configured without role \"([^\"]*)\"$")
	public void user_configured_without_role(String userRole) throws Throwable {
		airflowAdminSiteConfig.UpdateRoleConfigureOfWithOutAccess(userRole);

	}

	@Then("^user is configured role with \"([^\"]*)\"$")
	public void user_configured_with_role(String userRole) throws Throwable {
		airflowAdminSiteConfig.UpdateRoleConfigureOfWithAccess(userRole);

	}

}
