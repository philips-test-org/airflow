package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.config.ApplicationProperties;
import com.philips.rs.performancebridge.test.common.config.ApplicationProperties.ApplicationProperty;
import com.philips.rs.performancebridge.test.common.utils.Apps;
import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.po.AirflowKiosk;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AirflowKioskSteps{
	
	private AirflowKiosk airflowKiosk;
	private Airflow airflow;
	private ContextDTO contextDTO;

	public AirflowKioskSteps(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		this.contextDTO = contextDTO;
		airflowKiosk = pageObjectManager.getAirflowKioskPage();
		airflow = pageObjectManager.getAirflowPage();
	}

	@Then("^user verifies order number is diplayed on the examcards$")
	public void user_verifies_order_number_is_diplayed_on_the_examcards() throws Throwable {
		String kioskNumberText = contextDTO.getKioskNumber();
		Comparator.check("Verify" + kioskNumberText + " kioskNumber Number is diplayed under Kiosk tab", true, airflowKiosk.verifySearchKioskNumberInKioskTab(kioskNumberText));
		log.info(kioskNumberText + " kioskNumber Number is diplayed");
	}

	@Given("^gets the token number from exam card$")
	public void gets_the_token_number_from_exam_card() throws Throwable {
		String kioskNumberText = airflowKiosk.getKioskNumber();
		contextDTO.setKioskNumber(kioskNumberText);
		airflow.closeTheExamCard();
	}
	
	@When("^user navigate to url \"([^\"]*)\"$")
	public void gets_the_token_number_from_exam_card(String part_url) throws Throwable {
		UITestUtils.launchPBPApplication(ApplicationProperties.getString(ApplicationProperty.APP_URL) + part_url);
	}
	
	@Then("^kiosk tab should display$")
	public void kiosk_tab_should_display() throws Throwable {
		UITestUtils.switchWindow(Apps.AIR_FLOW.toString());
		Comparator.check("Verify kiosk page is displayed", true, airflowKiosk.verifyKioskTabIsActive());
	}


}
