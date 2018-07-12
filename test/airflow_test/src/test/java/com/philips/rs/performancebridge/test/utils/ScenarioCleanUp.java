package com.philips.rs.performancebridge.test.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.apache.log4j.Logger;
import org.openqa.selenium.WebDriver;

import cucumber.api.Scenario;
import cucumber.api.java.After;
import cucumber.api.java.Before;

public class ScenarioCleanUp {

	public static String scname = "";
	public static String featurename = "";
	public static final Logger logger = Logger.getLogger(ScenarioCleanUp.class);
	public WebDriver driver = UITestUtils.driver;

	@After()
	public void tearDown(Scenario scenario) throws Exception {
		System.out.println("---------Closing the Sceanrio-----------------");
		// boolean scenarioCleanUp = false;

		if (scenario.isFailed()) {
			System.out.println("Came Inside Scenario Failed");
			DateFormat df = new SimpleDateFormat("ddMMyyHHmmss");
			Date dateobj = new Date();
			logger.info("CurrentDate used for concating the sceenshot: " + df.format(dateobj));

			logger.error("The Scenario is failed: " + scenario.getName());
			if (UITestUtils.driver != null) {
				scenario.write("Current Page URL is " + driver.getCurrentUrl());

				String filename = scenario.getName();
				filename = filename.replaceAll("\"", "");
				filename = filename.replaceAll("\\s+", "_");
				filename = filename + df.format(dateobj) + ".jpg";

				new UITestUtils().takeSnapShot(driver, filename);
				UITestUtils.closeDriver();
			}
		}
	}

	@Before()
	public static String getTheScenarioName(Scenario scenario) {
		logger.info("sceanrio Names :"+scenario.getName());
		return scname = scenario.getName();
	}

	@Before()
	public static String getTheFeatureName(Scenario scenario) {

		scenario.getSourceTagNames();
		String rawFeatureName = scenario.getId().split(";")[0].replace("-", " ");
		featurename = rawFeatureName.substring(0, 1).toUpperCase() + rawFeatureName.substring(1);
		return featurename;
	}
}
