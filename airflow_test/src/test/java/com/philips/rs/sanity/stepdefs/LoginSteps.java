package com.philips.rs.sanity.stepdefs;


import com.philips.rs.sanity.pagelibrary.Login;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;



public class LoginSteps extends Login{
	
    @Given("^user clicks on \"([^\"]*)\" App$")
    public void user_clicks_on_App(String appName) throws Throwable {
           clickOnApp(appName);
           //takeSnapShot(driver, appName+" Page");
    }

@Then("^user logs in as \"([^\"]*)\"$")
    public void user_logs_in_as(String userName) throws Throwable {
           enterUserName(userName);
           enterPassword(userName);
           clickOnLogin();
    }



}
	
	