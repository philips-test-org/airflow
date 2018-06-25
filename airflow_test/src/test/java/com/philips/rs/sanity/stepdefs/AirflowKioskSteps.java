package com.philips.rs.sanity.stepdefs;

import com.philips.rs.sanity.pagelibrary.AirflowAdmin;
import com.philips.rs.sanity.pagelibrary.AirflowKiosk;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import junit.framework.Assert;

public class AirflowKioskSteps extends AirflowKiosk {
	static String kioskNumber="";
	static String procedure="";
	static String accessinNumber="";
	
	@SuppressWarnings("deprecation")
	@Then("^user verifies order number is diplayed on the examcards$")
	public void user_verifies_order_number_is_diplayed_on_the_examcards() throws Throwable {
	   isElementDisplayed(kioskNumber(kioskNumber), kioskNumber);
	   Assert.assertTrue( isElementDisplayed(kioskNumber(kioskNumber), kioskNumber));
	   logger.info("only Number is diplayed");
	}
	
	@Then("^user verifies procedure and accession number is not diplayed on the examcards$")
	public void user_verifies_procedure_and_accession_number_is_not_diplayed_on_the_examcards() throws Throwable {
	    // Write code here that turns the phrase above into concrete actions
	 
	}
}
