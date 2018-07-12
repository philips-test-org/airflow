package com.philips.rs.performancebridge.test.stepdefs;

import org.junit.Assert;

import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.po.AirflowKiosk;

import cucumber.api.java.en.Then;

public class AirflowKioskSteps extends AirflowKiosk {
	
	//static String procedure = "";
	//static String accessinNumber = "";

	@Then("^user verifies order number is diplayed on the examcards$")
	public void user_verifies_order_number_is_diplayed_on_the_examcards() throws Throwable {
		logger.info(kioskNumberText);
		Assert.assertTrue(isElementDisplayed(searchKioskNumberInKioskTab(kioskNumberText), kioskNumberText));
		logger.info("only Number is diplayed");
	}

	@Then("^user verifies procedure and accession number is not diplayed on the examcards$")
	public void user_verifies_procedure_and_accession_number_is_not_diplayed_on_the_examcards() throws Throwable {
		Assert.assertFalse(isElementDisplayed(Airflow.searchForMRNNumberInExamCard(),
				"The MRN number is not shown in the exam card in Kiosk"));
	}

}
