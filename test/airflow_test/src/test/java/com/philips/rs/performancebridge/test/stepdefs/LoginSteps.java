package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.config.ApplicationProperties;
import com.philips.rs.performancebridge.test.common.config.ApplicationProperties.ApplicationProperty;
import com.philips.rs.performancebridge.test.common.po.Login;
import com.philips.rs.performancebridge.test.common.po.Logout;
import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class LoginSteps {

	private Login loginPage;
	private Logout logoutPage;
	private ContextDTO contextDTO;

	public LoginSteps(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		loginPage = pageObjectManager.getLoginPage();
		logoutPage = pageObjectManager.getLogout();
		this.contextDTO = contextDTO;
	}


	@Then("^user switches to \"([^\"]*)\" app$")
	public void user_switches_to_app(String appName) throws Throwable {
		UITestUtils.switchWindow(appName);
	}

	@Then("^login screen should display$")
	public void login_screen_should_display() throws Throwable {
		UITestUtils.certifactionHandeler();
	}

	@Given("^user clicks on \"([^\"]*)\" App$")
	public void user_clicks_on_App(String appName) throws Throwable {
		loginPage.clickOnApp(appName);
	}

	@Then("^user login as \"([^\"]*)\"$")
	public void user_logs_in_as(String userName) throws Throwable {
		// logout.appLogoutIfAlreadyExist();
		if (loginPage.verifyUserFieldDisplayed()) {
			loginPage.login(userName);
		}
	}

	@Then("^user closes the browser$")
	public void user_closes_the_browser() {
		UITestUtils.closeDriver();
	}

	@Then("^user logs out of the application$")
	public void user_logs_out_of_the_application() throws InterruptedException {
		logoutPage.appLogout();
	}

	@Then("^page should display with title \"([^\"]*)\"$")
	public void page_should_display_with_title(String pageTitle) throws Throwable {
		Comparator.check("Page should display with title " + pageTitle, true, UITestUtils.switchWindow(pageTitle));

	}

	// new stepdef
	@Given("^user logins to the portal app as \"([^\"]*)\"$")
	public void user_logins_to_the_portal_app_as(String userName) throws Throwable {
		contextDTO.setUserName(userName);
		UITestUtils.launchPBPApplication(ApplicationProperties.getString(ApplicationProperty.APP_URL));
		loginPage.login(userName);
		Comparator.check("verified that the user " + userName + " is logged into portal app", true,
				loginPage.verifyUserIslogged(userName));

	}

	@Given("^user opens \"([^\"]*)\" App$")
	public void user_opens_App(String appName) throws Throwable {
		loginPage.switchToTab(appName);
	}

}
