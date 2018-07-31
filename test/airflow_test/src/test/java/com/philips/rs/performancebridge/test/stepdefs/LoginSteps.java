package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.config.ApplicationProperties;
import com.philips.rs.performancebridge.test.common.config.ApplicationProperties.ApplicationProperty;
import com.philips.rs.performancebridge.test.common.po.Login;
import com.philips.rs.performancebridge.test.common.po.Logout;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class LoginSteps {

	private Login loginPage;
	private Logout logoutPage;

	public LoginSteps(PageObjectManager pageObjectManager) {
		loginPage = pageObjectManager.getLoginPage();
		logoutPage = pageObjectManager.getLogout();
	}

	@Given("^user launch App$")
	public void user_launch_App() throws Throwable {

		UITestUtils.launchPBPApplication(ApplicationProperties.getString(ApplicationProperty.APP_URL));
	}

	@Then("^user switches to \"([^\"]*)\" app$")
	public void user_switches_to_app(String appName) throws Throwable {
		UITestUtils.switchWindow(appName);
	}

	@Given("^user clicks on \"([^\"]*)\" App$")
	public void user_clicks_on_App(String appName) throws Throwable {

		loginPage.clickOnApp(appName);
	}

	@Then("user logs in as \"(.*)\"")
	public void userLogsIn(String userName) throws Throwable {
		loginPage.login(userName);
	}

	@Then("^user closes the browser$")
	public void user_closes_the_browser() {
		UITestUtils.closeDriver();
	}

	@Then("^user logs out of the application$")
	public void user_logs_out_of_the_application() throws InterruptedException {
		logoutPage.appLogout();
	}

}
