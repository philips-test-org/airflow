package com.philips.rs.performancebridge.test.po;

import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.Color;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import static com.philips.rs.performancebridge.test.common.config.Constants.WAIT_LONG_SECONDS;

public class Airflow {

	protected WebDriver driver;

	public Airflow(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	private final String spinner = "//img[@src='/airflow/assets/ajax-loader-f4c4723838ebbad7aaa793555d43d4a9f442db0f6d64ef851855cac082d3adc5.gif']";
	private final String closeTheExamCardPopUpXpath = "//button[@class='close']";

	@FindBy(xpath = "//a[text()='Resource']")
	private WebElement selectCatFromLeftPaneOfST;

	@FindBy(xpath = "//a[text()='Resource']/../../../..//div[@id='query-window']//div[@data='Resource']//input[@value='Search']")
	private WebElement clickOnSearchInResourcesInST;

	@FindBy(xpath = "//select[@name='category']")
	private WebElement categoryName;

	@FindBy(xpath = "//div[@class='left-stripe']")
	private WebElement leftStripeColorLegendInExamCard;

	@FindBy(xpath = closeTheExamCardPopUpXpath)
	private WebElement closeTheExamCardPopUpWebElement;

	@FindBy(xpath = "//div[@class='content']/textarea[@name='comments']")
	private WebElement commentBoxWithinExamCard;
	
	@FindBy(xpath = "//h1[text()='Unauthorized']/../p[text()='You are not in the required user roles to view this page.']")
	private WebElement unauthorizedUserTitle;
	
	// This element is to verify the Home page is displayed
	@FindBy(xpath = "//div[(@id='workspace') and ( @class='vertical-timeline')]")
	private WebElement hompageWorkSpace;
	

	private String getSearchForMRNNumberInExamCardXpath(String resourceID, String mrn) {
		return "//td[@data-resource-id='" + resourceID + "']//div[@class='mrn'][text()='" + mrn + "']";
	}

	private String getMRNNumberExamCardLeftPanelXpath(String resourceID, String mrn) {
		return "//td[@data-resource-id='" + resourceID + "']/div[descendant::div[@class='mrn'][text()='" + mrn
				+ "']]/div[@class='left-tab']";
	}

	private String getFindIDOfSelectedResourceXpath(String resourcename) {
		return "//td[@sort='.resource']//label[text()='" + resourcename + "']/../../..//td//label";
	}

	private String getResourceExamCardCountXpath(String resourceID) {
		return "//td[@data-resource-id='" + resourceID + "']//div[@class='mrn']";
	}

	private String getPatientExperienceStateXpath(String labelForState) {
		return "//label[text()='" + labelForState + "']/../div[1]";
	}

	private String getToSearchIconsOnTheExamCardXpath(String toVerifyStatusIconsOnExamCard, String mrn) {
		return "//div[@class='mrn'][text()='" + mrn
				+ "']/../../div[@class='footer']//div//div[@class='status-indicator " + toVerifyStatusIconsOnExamCard
				+ "']";
	}

	/*
	 * RETURN Locator or WebElement
	 */

	private WebElement getMRNNumberExamCardLeftPanelWebElement(String resourceID, String mrn) {
		return UITestUtils.getWebElementByXpath(getMRNNumberExamCardLeftPanelXpath(resourceID, mrn));
	}

	private By getToSearchIconsOnTheExamCardLocator(String toVerifyStatusIconsOnExamCard, String mrn) {
		return UITestUtils.getLocatorByXpath(getToSearchIconsOnTheExamCardXpath(toVerifyStatusIconsOnExamCard, mrn));
	}

	private By getCloseTheExamCardPopUpLocator() {
		return UITestUtils.getLocatorByXpath(closeTheExamCardPopUpXpath);
	}

	private WebElement getPatientExperienceStateWebElement(String labelForState) {
		return UITestUtils.getWebElementByXpath(getPatientExperienceStateXpath(labelForState));
	}

	private WebElement getSearchForMRNNumberInExamCardWebElement(String resourceID, String mrn) {
		return UITestUtils.getWebElementByXpath(getSearchForMRNNumberInExamCardXpath(resourceID, mrn));
	}

	private By getSearchForMRNNumberInExamCardLocator(String resourceID, String mrn) {
		return UITestUtils.getLocatorByXpath(getSearchForMRNNumberInExamCardXpath(resourceID, mrn));
	}

	private WebElement getFindIDOfSelectedResourceWebElement(String resourcename) {
		return UITestUtils.getWebElementByXpath(getFindIDOfSelectedResourceXpath(resourcename), WAIT_LONG_SECONDS);
	}

	private By getResourceExamCardCountLocator(String resourceID) {
		return UITestUtils.getLocatorByXpath(getResourceExamCardCountXpath(resourceID));
	}

	private By getSpinnerLocator() {
		return UITestUtils.getLocatorByXpath(spinner);
	}

	// ---------------------------------------------------- Methods
	// -----------------------------------------------//

	/**
	 * The below method clicks on the category 'Resource' in Service Tools which
	 * is displayed in the left panel
	 */
	public void leftPanelElementsFOrServiceTool() throws InterruptedException {
		UITestUtils.clickLink(selectCatFromLeftPaneOfST, "resource");
	}

	/**
	 * In service Tools, to view the data for a chosen category, user needs to
	 * click on search
	 */
	public void clickOnSearchInResource() throws Throwable {
		UITestUtils.clickLink(clickOnSearchInResourcesInST, "search");
	}

	public String getIDForResource(String resource) {
		return UITestUtils.retrieveText(getFindIDOfSelectedResourceWebElement(resource), resource);
	}

	/**
	 * Get the current count of exam cards for particular resource
	 */
	public int examCardCountForTheResource(String resourceID) {
		UITestUtils.waitForPresenceOfAllElementsLocated(getResourceExamCardCountLocator(resourceID), "Resource Exams List");
		List<WebElement> resourceExamCardList = driver.findElements(getResourceExamCardCountLocator(resourceID));
		return resourceExamCardList.size();
	}

	/**
	 * The below method searches for the MRN number for a particular resource.
	 * It verifies that the newly ingested record in airflow shows the MRN
	 * number of the ingested record
	 */
	public boolean verifyExamCardNotVisible(String resourceID, String mrn) {
		return UITestUtils.elementInVisibilitymethod(getSearchForMRNNumberInExamCardLocator(resourceID, mrn));
	}

	public boolean verifyMrnExamCardDispalyed(String resourceID, String mrn) {
		UITestUtils.sleep(10);
		System.out.println("Resource ID : " + resourceID);
		System.out.println("MRN : " + mrn);
		return UITestUtils.verifyIsElementDisplayed(getSearchForMRNNumberInExamCardWebElement(resourceID, mrn),
				"Verified that ingested record is available in Exam Card for particular resource");
	}

	public void selectMRNOnExamCard(String resourceID, String mrn) {
		UITestUtils.clickLink_JavaScript(getSearchForMRNNumberInExamCardWebElement(resourceID, mrn),
				"selects Exam for particular resource" + resourceID);
	}

	/**
	 * The below method is getting the hex value for the color code picked up
	 * from the left stripe and compares that hex value for the intended color
	 */
	public boolean verifyExamCardPopupLeftStripColorLegend(String colorLegend) {
		String hex = Color
				.fromString(
						UITestUtils.retrieveCssAttributeValue(leftStripeColorLegendInExamCard, "background-color", ""))
				.asHex();
		return Comparator.match(colorLegend, hex, "LeftStripColor");

	}

	public boolean verifyMRNNumberExamCardLeftPanelBackgroupColor(String colorLegend, String resourceID, String mrn) {
		String hex = Color.fromString(UITestUtils.retrieveCssAttributeValue(
				getMRNNumberExamCardLeftPanelWebElement(resourceID, mrn), "background-color", "")).asHex();
		return Comparator.match(colorLegend, hex, "LeftStripColor");

	}

	/**
	 * The method closes the modal pop up for exam card information
	 */
	public void closeTheExamCard() throws InterruptedException {
		UITestUtils.clickLink(closeTheExamCardPopUpWebElement, "Close the exam card");
		UITestUtils.WaitForElementToBeInVisible(getCloseTheExamCardPopUpLocator(), "Exam Card Popup");
	}

	/**
	 * Selecting the drop down for resource categories
	 */
	public void selectTheCategory(String catName) {
		UITestUtils.selectValueByVisibleText(categoryName, catName, "Category DropDown");
	}

	/**
	 * The below method adds the comments in the comments section of the exam
	 * card information modal pop up
	 */
	public void addCommentsinExamCard(String comment) throws InterruptedException {
		UITestUtils.clearAndInput(commentBoxWithinExamCard, "Adding comments in the exam card", comment);
	}

	/**
	 * The below method verifies the icons for representing the status of the
	 * exam card
	 */
	public boolean statusIndicatorOnExamCard(String verifyIconsOnExamCard, String mrn) throws InterruptedException {
		boolean SearchIconsCount = !driver.findElements(getToSearchIconsOnTheExamCardLocator(verifyIconsOnExamCard, mrn)).isEmpty();
		return Comparator.match(SearchIconsCount, true, "No search Icons Count on ExamCard");
	}

	public boolean verifySpinnerIsInvisible() {
		return UITestUtils.elementInVisibilitymethod(getSpinnerLocator());
	}

	public String getPatientExperienceState(String patientExperienceEvents) {
		return UITestUtils.retrieveAttributeValue(getPatientExperienceStateWebElement(patientExperienceEvents), "class",
				"picking up the class");
	}

	public void clickOnPatientExperienceStateEvent(String patientExperienceEvents) {
		UITestUtils.clickLink(getPatientExperienceStateWebElement(patientExperienceEvents),
				patientExperienceEvents + " event");
	}

	public boolean verifyUnauthorizedUserTitleDisplayed() {
		return UITestUtils.verifyIsElementDisplayed(unauthorizedUserTitle, "unauthorized User Page Title");

	}
	
	public boolean verifyhomePageWorkspaceDisplayed() {
		return UITestUtils.verifyIsElementDisplayed(hompageWorkSpace, "Airflow homepage displayed");

	}
}
