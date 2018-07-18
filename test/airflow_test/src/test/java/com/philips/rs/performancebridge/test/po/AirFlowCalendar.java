package com.philips.rs.performancebridge.test.po;

import java.util.List;

import org.junit.Assert;
import org.openqa.selenium.By;

import com.philips.rs.performancebridge.test.utils.UITestUtils;

public class AirFlowCalendar extends UITestUtils {
	public static int totalExamCards;
	public By groupNameDropDown = By.xpath("//div[@id='resource-group-buttons']/button[@class='btn btn-default btn-sm dropdown-toggle']");
	public By examcard = By.xpath("//div[@class='left-tab']");
	public static String kioskNumberText = "";
	
	AirflowKiosk airflowkiosk = new AirflowKiosk();

	public void clickOnTab(String tabName) throws Exception {
		clickLink(tabElementXPath(tabName), tabName);
	}

	public By resource(String resource) {
		return By.xpath("//h1[text()='" + resource + "']");
	}

	public By GroupName(String groupName) {
		return By.xpath("//a[text()='" + groupName + "']");
	}

	@SuppressWarnings("rawtypes")
	public List examCardsCount(By element) {
		return driver.findElements(element);
	}

	public By tabElementXPath(String tabName) {
		return By.xpath("//a[contains(text(),'" + tabName + "')]");
	}

	public void clickOnMenuTab(String tabName) throws Exception {
		clickLink(tabElementXPath(tabName), tabName);
	}

	/**
	 * The below method is comparing the count of exam cards in Calendar and
	 * Overview tab.
	 */
	public void getCountForExamCardsFromOverviewAndCalendar() throws Exception {
		waitForElementToLoad(examcard, "examcard");
		totalExamCards = examCardsCount(examcard).size();
		logger.info("Number of exam cards are " + totalExamCards);
		clickOnMenuTab("Calendar");
		logger.info("Number of exam cards are " + examCardsCount(examcard).size());
		Assert.assertEquals(totalExamCards, examCardsCount(examcard).size());
	}

	/**
	 * The below method selects the created resource group from the Group
	 * selector drop down
	 */
	public void selectResource(String groupName, String resource) throws InterruptedException {
		clickLink_JavaScript(groupNameDropDown, "Clicked on group name drop down");
		clickLink(GroupName(randomGroupName), "Selected the resource group from drop down");	
		waitForElementToLoad(resource(resource), resource);
		Assert.assertEquals(true, isElementDisplayed(resource(resource), resource));
	}
	
	
}
