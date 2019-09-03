package com.philips.rs.performancebridge.test.po;

import java.awt.AWTException;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.Color;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;

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

	@FindBy(xpath = "//div[@class='comment']//textarea[@name='comments']")
	private WebElement commentBoxWithinExamCard;
	
	@FindBy(xpath = "//h1[text()='Unauthorized']/../p[text()='You are not in the required user roles to view this page.']")
	private WebElement unauthorizedUserTitle;
	
	// This element is to verify the Home page is displayed
	@FindBy(xpath = "//div[(@id='workspace') and ( @class='vertical-timeline')]")
	private WebElement hompageWorkSpace;
	
	private String getSearchForMRNNumberInExamCardXpath(String resource, String mrn) {
		return "//table[@id='time-grid']//td[count(//table[@id='time-headings']//tr/td/h1[text()='" + resource + "']/../preceding-sibling::td)+2]//div[@class='mrn'][text()='" + mrn + "']";
	}

	private String getOrderingPysicianNameInExamCard(String resource, String mrn, String orderingPhysician) {
		return "//table[@id='time-grid']//td[count(//table[@id='time-headings']//tr/td/h1[text()='"+resource+"']/../preceding-sibling::td)+2]//div[@class='mrn'][text()='"+mrn+"']/../../../..//div[@class='ordering-physician'][text()='"+orderingPhysician+"']";
	}
	
	private String OrderingNameIsUnknown (String mrn) {
		return "//div[@class='mrn'][text()='"+mrn+"']/../../../..//div[@class='ordering-physician'][text()='unknown']";
	}
	
	private String getMRNNumberExamCardLeftPanelXpath(String resource, String mrn) {
		return "//table[@id='time-grid']//td[count(//table[@id='time-headings']//tr/td/h1[text()='" + resource + "']/../preceding-sibling::td)+2]//div[@class='mrn'][text()='" + mrn + "']/../../../div[@class='left-tab']";
	}

	private String getResourceExamCardCountXpath(String resource) {
		return "//table[@id='time-grid']//td[count(//table[@id='time-headings']//tr/td/h1[text()='" + resource + "']/../preceding-sibling::td)+2]//div[@class='mrn']";
	}

	private String getPatientExperienceStateXpath(String labelForState) {
		return "//span[text()='" + labelForState + "']/..//div[@class='react-toggle']";
	}

	private String getToSearchIconsOnTheExamCardXpath(String toVerifyStatusIconsOnExamCard, String mrn) {
		return "//div[@class='mrn'][text()='" + mrn + "']/../../div[@class='footer']//div//div[@class='status-indicator " + toVerifyStatusIconsOnExamCard + "']";
	}
	
	private String accessionNumberInExamCard(String accessionNumber) {
		return "//th[text()='Accession']/following-sibling::td[text()='"+accessionNumber+"']";
	}

	private String procedurepickedFromExamCard (String procedure) {
		return "//th[text()='Procedure']/following-sibling::td[text()='"+procedure+"']";
	}
	
	private String resourcePickedFromExamCard(String resource) {
		return "//th[text()='Resource']/following-sibling::td[text()='"+resource+"']";		
	}
	
	private String orderingPhysicianPickedFromExamCard(String orderingPhysician) {
		return "//th[text()='Ordering Physician']/following-sibling::td[text()='"+orderingPhysician+"']";
	}
	
	private String MRNNumberPickedFromExamCard(String MRNNumber) {
		return "//th[text()='Patient MRN']/following-sibling::td[text()='"+MRNNumber+"']";
	}
	
	private String appointmentTimePickedFromExamCard(String appointmentTime) {
		return "//th[text()='Appointment']/following-sibling::td[text()='"+appointmentTime+"']";
	}
	
	private String beginExamTimePickedFromExamCard(String beginTime) {
		return "//th[text()='Begin Exam']/following-sibling::td[text()='"+beginTime+"']";
	}
	
	private String examEndTimePickedFromExamCard(String examEndTime) {
		return "//th[text()='End Exam']/following-sibling::td[text()='"+examEndTime+"']";
	}
	
	/*
	 * RETURN Locator or WebElement
	 */

	private WebElement getMRNNumberExamCardLeftPanelWebElement(String resource, String mrn) {
		return UITestUtils.getWebElementByXpath(getMRNNumberExamCardLeftPanelXpath(resource, mrn));
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

	private WebElement getSearchForMRNNumberInExamCardWebElement(String resource, String mrn) {
		return UITestUtils.getWebElementByXpath(getSearchForMRNNumberInExamCardXpath(resource, mrn));
	}

	private By getOrderingPysicianNameInExamCardWebElement(String resource, String mrn, String orderingPhysician) {
		return UITestUtils.getLocatorByXpath(getOrderingPysicianNameInExamCard(resource, mrn, orderingPhysician));
	}
	
	private By orderingPhysicianNameIsUnknown(String mrn) {
		return UITestUtils.getLocatorByXpath(OrderingNameIsUnknown(mrn));
	}
	
	
	private By getSearchForMRNNumberInExamCardLocator(String resource, String mrn) {
		return UITestUtils.getLocatorByXpath(getSearchForMRNNumberInExamCardXpath(resource, mrn));
	}

	private By getResourceExamCardCountLocator(String resource) {
		return UITestUtils.getLocatorByXpath(getResourceExamCardCountXpath(resource));
	}

	private By getSpinnerLocator() {
		return UITestUtils.getLocatorByXpath(spinner);
	}
	
	private WebElement accessionNumberOnExamCard(String accessionNumber) {
		return UITestUtils.getWebElementByXpath(accessionNumberInExamCard(accessionNumber));
	}
	
	private WebElement procedureOnExamCard(String procedure) {
		return UITestUtils.getWebElementByXpath(procedurepickedFromExamCard(procedure));
	}
	
	private WebElement resourceOnExamCard(String resource) {
		return UITestUtils.getWebElementByXpath(resourcePickedFromExamCard(resource));
	}
	
	private WebElement patientMRNOnExamCard(String MRNNumber) {
		return UITestUtils.getWebElementByXpath(MRNNumberPickedFromExamCard(MRNNumber));
	}
	
	private WebElement orderingPhysicianNameOnexamCard(String orderingPhysician) {
		return UITestUtils.getWebElementByXpath(orderingPhysicianPickedFromExamCard(orderingPhysician));
	}
	
	private WebElement appointmentTimeOnExamCard(String appointmentTime) {
		return UITestUtils.getWebElementByXpath(appointmentTimePickedFromExamCard(appointmentTime));
	}
	
	private WebElement beginExamTimeOnExamCard(String beginTime) {
		return UITestUtils.getWebElementByXpath(beginExamTimePickedFromExamCard(beginTime));
	}
	
	private WebElement examEndTimeOnExamCard(String examEndTime) {
		return UITestUtils.getWebElementByXpath(examEndTimePickedFromExamCard(examEndTime));
	}

	// --------------------------------------------- Methods -----------------------------------------------//

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

	/**
	 * Get the current count of exam cards for particular resource
	 * @throws Exception 
	 */
	public int examCardCountForTheResource(String resource) throws Exception {
		UITestUtils.refreshPage();
//		UITestUtils.waitForPageLoad();
		verifySpinnerIsInvisible();	
//		UITestUtils.zoomOut();
		List<WebElement> resourceExamCardList = driver.findElements(getResourceExamCardCountLocator(resource));
		return resourceExamCardList.size();
	}

	/**
	 * The below method searches for the MRN number for a particular resource.
	 * It verifies that the newly ingested record in airflow shows the MRN
	 * number of the ingested record
	 */
	public boolean verifyExamCardNotVisible(String resource, String mrn) {
		return UITestUtils.elementInVisibilitymethod(getSearchForMRNNumberInExamCardLocator(resource, mrn));
	}

	public boolean verifyMrnExamCardDispalyed(String resource, String mrn) {
		UITestUtils.sleep(10);
		return UITestUtils.verifyIsElementDisplayed(getSearchForMRNNumberInExamCardWebElement(resource, mrn),
				"Verified that ingested record is available in Exam Card for particular resource");
	}

	public void selectMRNOnExamCard(String resource, String mrn) {
		UITestUtils.clickLink_JavaScript(getSearchForMRNNumberInExamCardWebElement(resource, mrn),"selects Exam for particular resource" + resource);
	}

	/**
	 * The below method is getting the hex value for the color code picked up
	 * from the left stripe and compares that hex value for the intended color
	 */
	public boolean verifyExamCardPopupLeftStripColorLegend(String colorLegend) {
		String hex = Color.fromString(UITestUtils.retrieveCssAttributeValue(leftStripeColorLegendInExamCard, "background-color", "")).asHex();
		return Comparator.match(colorLegend, hex, "LeftStripColor");

	}

	public boolean verifyMRNNumberExamCardLeftPanelBackgroupColor(String colorLegend, String resource, String mrn) {
		String hex = Color.fromString(UITestUtils.retrieveCssAttributeValue(getMRNNumberExamCardLeftPanelWebElement(resource, mrn), "background-color", "")).asHex();
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

	public void verifySpinnerIsInvisible() {
	 UITestUtils.WaitForElementToBeInVisible(getSpinnerLocator(),"spinner");
	}

	public String getPatientExperienceState(String patientExperienceEvents) {
		return UITestUtils.retrieveAttributeValue(getPatientExperienceStateWebElement(patientExperienceEvents), "class",
				"picking up the class");
	}

	public void clickOnPatientExperienceStateEvent(String patientExperienceEvents) {
		UITestUtils.clickLink(getPatientExperienceStateWebElement(patientExperienceEvents),patientExperienceEvents + " event");
	}

	public boolean verifyUnauthorizedUserTitleDisplayed() {
		return UITestUtils.verifyIsElementDisplayed(unauthorizedUserTitle, "unauthorized User Page Title");
	}
	
	public boolean verifyhomePageWorkspaceDisplayed() {
		return UITestUtils.verifyIsElementDisplayed(hompageWorkSpace, "Airflow homepage displayed");
	}
	
	public boolean verifyAccessionNumberOnExamCard(String accessionNumber) {
		return UITestUtils.verifyIsElementDisplayed(accessionNumberOnExamCard(accessionNumber), "Accession number shown on Exam Card");
	}
	
	public boolean verifyMRNOnExamCard(String MRNNumber) {
		return UITestUtils.verifyIsElementDisplayed(patientMRNOnExamCard(MRNNumber), "MRN number shown on Exam Card");
	}
	
	public boolean verifyOrderingPhysician(String orderingPhysician) {
		return UITestUtils.verifyIsElementDisplayed(orderingPhysicianNameOnexamCard(orderingPhysician), "Ordering physician shown on Exam Card");
	}
	
	public boolean verifyProcedure(String procedure) {
		return UITestUtils.verifyIsElementDisplayed(procedureOnExamCard(procedure), "Verified that procedure shown is correct");
	}
	
	public boolean verifyResource(String resource) {
		return UITestUtils.verifyIsElementDisplayed(resourceOnExamCard(resource), "Resource shown on Exam Card");
	}
	
	public boolean verifyAppointmentTime(String appointmentTime) {
		return UITestUtils.verifyIsElementDisplayed(appointmentTimeOnExamCard(appointmentTime), "Appointment Time shown on Exam Card");
	}
	
	public boolean verifyBeginTime(String beginExamTime) {
		return UITestUtils.verifyIsElementDisplayed(beginExamTimeOnExamCard(beginExamTime), "Begin Time shown on Exam Card");
	}
	
	public boolean verifyExamEndTime(String examEndTime) {
		return UITestUtils.verifyIsElementDisplayed(examEndTimeOnExamCard(examEndTime), "Exam End Time shown on Exam Card");
	}
	
	public boolean verifyOrderingPhysicianNameOnExamCardbody(String resource, String mrn, String orderingPhysician) {
		return UITestUtils.isElementPresent(getOrderingPysicianNameInExamCardWebElement(resource, mrn, orderingPhysician), "Ordering Physician is shown on exam card body");
	}
	
	public boolean verifyOrderingNameDisplayedIsUnknown(String mrn) {
		return UITestUtils.isElementPresent(orderingPhysicianNameIsUnknown(mrn), "Ordering Physician name displayed is unknown");
	}
}
