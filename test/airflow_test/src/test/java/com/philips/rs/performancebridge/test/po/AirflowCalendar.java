package com.philips.rs.performancebridge.test.po;

import java.util.List;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.FindBys;
import org.openqa.selenium.support.PageFactory;

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
	
//	public By groupNameDropDown = By.xpath("//div[@id='resource-group-buttons']/button[@class='btn btn-default btn-sm dropdown-toggle']");
	
//	public By examcard = By.xpath("//div[@class='left-tab']");
	
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
	
	private WebElement getResourceWebElement(String resource) {
		return UITestUtils.getWebElementByXpath(getResourceXpath(resource));
	}
	
	private WebElement getGroupNameWebElement(String groupName) {
		return UITestUtils.getWebElementByXpath(getGroupNameXpath(groupName));
	}
	
	/*public List getxamCardsCount(By element) {
		return driver.findElements(element);
	}
	
	public List examCardsCount(By element) {
		return driver.findElements(element);
	}
*/
	private String getTabElementXPath(String tabName) {
		return "//a[contains(text(),'" + tabName + "')]";
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
	public void getCountForExamCardsFromOverviewAndCalendar() throws Exception {
		UITestUtils.waitForElementToLoad(examcard, "examcard");
		int totalExamCards = examcards.size();
		log.info("Number of exam cards are " + totalExamCards);
		clickOnMenuTab("Calendar");
		log.info("Number of exam cards are " + examcards.size());
		Assert.assertEquals(totalExamCards, examcards.size());
	}

	/**
	 * The below method selects the created resource group from the Group
	 * selector drop down
	 */
	public void selectResource(String groupName) throws InterruptedException {
		UITestUtils.clickLink_JavaScript(groupNameDropDown, "Clicked on group name drop down");
		UITestUtils.clickLink(getGroupNameWebElement(groupName), "Selected the resource group from drop down");	
	}
	
	public void verifyResource(String resource) throws InterruptedException {
		UITestUtils.waitForElementToLoad(getResourceWebElement(resource), resource);
		Assert.assertEquals(true, UITestUtils.verifyIsElementDisplayed(getResourceWebElement(resource), resource));
	}
	
	
}
