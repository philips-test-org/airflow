package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.po.Login_logout;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class Login_logoutSteps extends Login_logout {

	@Given("^user clicks on \"([^\"]*)\" App$")
	public void user_clicks_on_App(String appName) throws Throwable {
		clickOnApp(appName);
	}

	@Then("^user logs in as \"([^\"]*)\"$")
	public void user_logs_in_as(String userName) throws Throwable {
		enterUserName(userName);
		enterPassword(userName);
		clickOnLogin();
	}

	@Then("^user switches to \"([^\"]*)\" app$")
	public void user_switches_to_app(String appName) throws Throwable {
		tabSwitch(appName);	
	}

	@Then("^user logs out$")
	public void user_logs_out() throws Throwable {
		appLogout();
	}

	@Given("^user closes the browser$")
	public void user_closes_the_browser() throws Throwable {
		closeDriver();
	} 
}