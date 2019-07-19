package com.philips.rs.performancebridge.test.po;


import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.FindBys;
import org.openqa.selenium.support.PageFactory;

import com.philips.rs.performancebridge.test.common.config.ApplicationProperties.ApplicationProperty;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AirflowCalendar {

	protected WebDriver driver;

	public AirflowCalendar(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	@FindBy(xpath = "//div[@id='resource-group-buttons']/button[@class='btn btn-default btn-sm dropdown-toggle']")
	private WebElement groupNameDropDown;

	@FindBy(xpath = "//div[@class='left-tab']")
	private WebElement examcard;

	@FindBys(@FindBy(xpath = "//div[@class='left-tab']"))
	private List<WebElement> examcards;

	private String getResourceXpath(String resource) {
		return "//h1[text()='" + resource + "']";
	}

	private String getGroupNameXpath(String groupName) {
		return "//a[text()='" + groupName + "']";
	}

	private String getTabElementXPath(String tabName) {
		return "//a[contains(text(),'" + tabName + "')]";
	}


	/*
	 * RETURN WebElement/Locators
	 */

	private WebElement getResourceWebElement(String resource) {
		return UITestUtils.getWebElementByXpath(getResourceXpath(resource));
	}

	private WebElement getGroupNameWebElement(String groupName) {
		return UITestUtils.getWebElementByXpath(getGroupNameXpath(groupName));
	}
	
	private By getGroupNamelocator(String groupName) {
		return UITestUtils.getLocatorByXpath(getGroupNameXpath(groupName));
	}

	private WebElement getTabWebElement(String tabName) {
		return UITestUtils.getWebElementByXpath(getTabElementXPath(tabName));
	}


	/*
	 * METHODS
	 */

	public void clickOnTab(String tabName) throws Exception {
		UITestUtils.clickLink(getTabWebElement(tabName), tabName);
	}

	public void clickOnMenuTab(String tabName) throws Exception {
		UITestUtils.clickLink(getTabWebElement(tabName), tabName);
	}

	/**
	 * The below method is comparing the count of exam cards in Calendar and
	 * Overview tab.
	 */
	public int getCountForExamCardsFromOverview() throws Exception {
		UITestUtils.waitForElementToLoad(examcard, "examcard");
		int totalExamCards = examcards.size();
		log.info("Number of exam cards on overview " + totalExamCards);
		return totalExamCards;
	}
	
	public int getCountForExamCardsFromCalendar() throws Exception {
		UITestUtils.waitForElementToLoad(examcard, "examcard");
		int totalExamCards = examcards.size();
		log.info("Number of exam cards on Calendar " + examcards.size());
		return totalExamCards;
	}

	public void clickOnResourceGroupDropDown() {
		UITestUtils.clickLink_JavaScript(groupNameDropDown, "Clicked on group name drop down");
	}
	
	/**
	 * The below method selects the created resource group from the Group
	 * selector drop down
	 */
	public void selectResource(String groupName) throws InterruptedException {
		clickOnResourceGroupDropDown();
		UITestUtils.sleep(2);
		UITestUtils.clickLink_JavaScript(getGroupNameWebElement(groupName), "Selected the resource group from drop down");
	}

	public boolean verifyResource(String resource) throws InterruptedException {
		
		UITestUtils.sleep(5);
		UITestUtils.scrollIntoViewElement(getResourceWebElement(resource), resource);
//		return UITestUtils.isElementPresent(UITestUtils.getLocatorByXpath(getResourceXpath(resource)),resource);
		//UITestUtils.waitForElementToLoad(UITestUtils.getWebElementByXpath(getResourceXpath(resource)), resource);
		
		return UITestUtils.isElementDisplayed(UITestUtils.getWebElementByXpath(getResourceXpath(resource)));
	
	}

	public boolean verifyResourceGroupIsDisplayedInList(String groupName) throws InterruptedException {
		return UITestUtils.elementInVisibilitymethod(getGroupNamelocator(groupName));
		
	}
	
}
