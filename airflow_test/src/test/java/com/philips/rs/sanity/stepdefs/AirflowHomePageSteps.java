package com.philips.rs.sanity.stepdefs;


import org.openqa.selenium.By;

import com.philips.rs.sanity.pagelibrary.*;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class AirflowHomePageSteps extends AirflowHomePage {
	
	@Given("^user clicks on \"([^\"]*)\" tab$")
	public  void user_clicks_on_tab(String tabName) throws Throwable {
	    // Write code here that turns the phrase above into concrete actions
		clickOnMenuTab(tabName);
		takeSnapShot(driver, tabName+" Page");
	}
	@Then("^user clicks on \"([^\"]*)\"$")
	public void user_clicks_on(String Element) throws Throwable {
	    // Write code here that turns the phrase above into concrete actions
	 if(Element.equals(Element))
	 {
		 clickLink(By.xpath("//span[@class='group-name']"), Element);
		 takeSnapShot(driver, Element+" Button");
	 }
	 else{
		 clickLink(By.id("legend-button"), Element);
		 takeSnapShot(driver, Element+" Button");
		 	 
	 }
	
	}


}
