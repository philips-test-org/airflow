package com.philips.rs.performancebridge.test.stepdefs;

import org.junit.Assert;

import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.po.AirflowAdmin;
import com.philips.rs.performancebridge.test.po.AirflowKiosk;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AirflowKioskSteps{
	
	private PageObjectManager pom;
	private AirflowKiosk airflowKiosk;
	private Airflow airflow;

	public AirflowKioskSteps(PageObjectManager pageObjectManager) {
		this.pom = pageObjectManager;
		airflowKiosk = pageObjectManager.getAirflowKioskPage();
		airflow = pageObjectManager.getAirflowPage();
	}

//**************************************************
	@Then("^user verifies order number is diplayed on the examcards$")
	public void user_verifies_order_number_is_diplayed_on_the_examcards() throws Throwable {
		String  kioskNumberText = pom.getValue("kioskNumber");
		Assert.assertTrue(airflowKiosk.verifySearchKioskNumberInKioskTab(kioskNumberText));
		log.info(kioskNumberText + " kioskNumber Number is diplayed");
	}

	@Given("^gets the token number from exam card$")
	public void gets_the_token_number_from_exam_card() throws Throwable {
		String kioskNumberText = airflowKiosk.getKioskNumber();
		pom.setValue("kioskNumber", kioskNumberText);
		airflow.closeTheExamCard();
	}


}
