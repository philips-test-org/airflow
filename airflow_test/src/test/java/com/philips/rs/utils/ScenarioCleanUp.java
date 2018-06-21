package com.philips.rs.utils;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;


import org.junit.Assert;
import org.apache.log4j.Logger;
import org.openqa.selenium.WebDriver;

import cucumber.api.Scenario;
import cucumber.api.java.After;

public class ScenarioCleanUp  {
  
	public static final Logger logger = Logger.getLogger(ScenarioCleanUp.class);
	public WebDriver driver =  UITestUtils.driver;
	BackendApiTestUtils backendApiTestUtils = new BackendApiTestUtils();
	  
	ScenarioCleanupData scenarioCleanupData = 	ScenarioCleanupData.getScenarioCleanupData();
	
	@After()
	public void tearDown(Scenario scenario) throws Exception {

		boolean scenarioCleanUp = false;
		
		if (scenario.isFailed())
		{
			DateFormat df = new SimpleDateFormat("ddMMyyHHmmss");
			Date dateobj = new Date();
			logger.info("Failed Screenshot: "+ df.format(dateobj));

			logger.info("The Scenario is failed: " + scenario.getName());
			if (UITestUtils.driver != null) {
				scenario.write("Current Page URL is " + UITestUtils.driver.getCurrentUrl());

				String filename = scenario.getName();
				filename = filename.replaceAll("\"", "");
				filename = filename.replaceAll("/", " ");
				filename = filename.replaceAll("\\s+", "_");
				filename = filename+"_" + df.format(dateobj) + ".jpg";
				logger.info("Failed Screenshot: " + filename);
				new UITestUtils().takeSnapShot(UITestUtils.driver, filename);
				UITestUtils.closeDriver();
			}
					}

		for (int i = 0; i < scenarioCleanupData.listUserCreations().size(); i++) {
			try {

				String username = scenarioCleanupData.listUserCreations()
						.get(i);
				scenarioCleanUp = backendApiTestUtils
						.deleteSisenseUsersCreated(username);
				scenarioCleanupData.removeUserFromList(username);
				logger.info("User Removed from list successfully");

			} catch (Exception e) {
				logger.error("Error While deleting user");
				Assert.fail("Error While deleting user");
			}
		}
		 
	if (scenarioCleanupData.listUserCreations().size() > 0
				&& !scenarioCleanUp) {
			Assert.fail("Issue with Clean Up, User is trying to delete non existing user");
		}
		 
	}
}
