package com.philips.rs.performancebridge.test.po;

/**
 *  public By selectResource(String selectResourcesFromDropDown) {
		 return By.xpath("//select[@id='exam_resource']/option[text()='"+selectResourcesFromDropDown+"']");
	 }
	 	
	 public By selectProcedureElement(String procedureName) {
		 System.out.println("XPATH : " + "//select[@id='procedure_code']/option[text()='"+procedureName+"']");
		 return By.xpath("//select[@id='procedure_code']");
	 }
	 
	 
	 public By resource(String resource )
	{
		return By.xpath("//h1[text()='"+resource+"']");
	}
	
	public static final By selectProcedureButton = By.xpath("//button[@data-id='procedure_code']");
	public By grupuNameDropDown= By.xpath("//button[@class='btn btn-default btn-sm dropdown-toggle']");
 */
//comment
import java.util.List;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.Color;

import com.philips.rs.performancebridge.test.utils.UITestUtils;

public class Airflow extends UITestUtils {
	public static String resourceID;
	public static final By selectCatFromLeftPaneOfST = By.xpath("//a[text()='Resource']");
	public static final By clickOnSearchInResourcesInST = By.xpath(
			"//a[text()='Resource']/../../../..//div[@id='query-window']//div[@data='Resource']//input[@value='Search']");
	public static final By categoryName = By.xpath("//select[@name='category']");
	public static final By leftStripeColorLegendInExamCard = By.xpath("//div[@class='left-stripe']");
	public static final By closeTheExamCardPopUp = By.xpath("//button[@class='close']");
	public static final By commentBoxWithinExamCard = By.xpath("//div[@class='content']/textarea[@name='comments']");

	private int preIngestedCountOfExamCardsInResource;

	public static final By searchForMRNNumberInExamCard() {
		return By.xpath("//td[@data-resource-id='" + resourceID + "']//div[@class='mrn'][text()='"
				+ Ingestion.newlyCreatedMrnNumber + "']");
	}

	public By findIDOfSelectedResource(String resourcename) {
		return By.xpath("//td[@sort='.resource']//label[text()='" + resourcename + "']/../../..//td//label");
	}

	public By resourceExamCardCount() {
		return By.xpath("//td[@data-resource-id='" + resourceID + "']//div[@class='mrn']");
	}

	public By toggleSwitchToChangeState(String patientExperienceEvents, String PatientexperienceEventstatus) {
		return By.xpath("//input[@name='" + patientExperienceEvents + "']/../div/label[text()='"
				+ PatientexperienceEventstatus + "']");
	}

	public By stateIndicatorIcon(String iconOnExamCard) {
		return By.xpath("//div[@class='status-indicator '" + iconOnExamCard + "']");
	}

	public By patientExperienceState(String labelForState) {
		return By.xpath("//label[text()='" + labelForState + "']/../div[1]");
	}

	public By toSearchIconsOnTheExamCard(String toVerifyStatusIconsOnExamCard) {
		return By.xpath("//div[@class='mrn'][text()='" + Ingestion.newlyCreatedMrnNumber
				+ "']/../../div[@class='footer']//div//div[@class='status-indicator " + toVerifyStatusIconsOnExamCard
				+ "']");
	}
	
	

	// ---------------------------------------------------- Methods -----------------------------------------------//

	/**
	 * The below method clicks on the category 'Resource' in Service Tools which is displayed in the left panel
	 */
	public void leftPanelElementsFOrServiceTool() throws InterruptedException {
		clickLink(selectCatFromLeftPaneOfST, "resource");
	}

	/**
	 * In service Tools, to view the data for a chosen category, user needs to click on search
	 */
	public void clickOnSearchInResource() throws Throwable {
		clickLink(clickOnSearchInResourcesInST, "search");
	}

	public void getIDForResource(String resource) {
		resourceID = retrieveText(findIDOfSelectedResource(resource), resource);
	}

	/**
	 * Getting the count of exam cards before ingesting data for particular resource
	 */
	public void getExamCardCountPreIngestion() {
		preIngestedCountOfExamCardsInResource = examCardCountForTheResource();
	}

	/**
	 * Get the current count of exam cards for particular resource
	 */
	public int examCardCountForTheResource() {
		List<WebElement> resourceExamCardList = driver.findElements(resourceExamCardCount());
		return resourceExamCardList.size();
	}

	/**
	 * Getting the count of exam cards after ingesting data for particular resource
	 */
	public void verifyExamCardCount() {
		int verifyExamCount = examCardCountForTheResource();
		logger.info("The count of exam cards before ingesting data: " + preIngestedCountOfExamCardsInResource);
		logger.info("The count of exam cards after ingesting data: " + examCardCountForTheResource());
		Assert.assertTrue(verifyExamCount == preIngestedCountOfExamCardsInResource + 1);
		logger.info("Pass : Data is ingested for particular resource");
	}

	/**
	 * The below method searches for the MRN number for a particular resource.
	 * It verifies that the newly ingested record in airflow shows the MRN number of the ingested record
	 */
	public void verifyMRNOnExamCard() {
		waitForElementToLoad(searchForMRNNumberInExamCard(),
				"Verified that ingested record is available in Exam Card for particular resource");
	}

	/**
	 * The below method is getting the hex value for the color code picked up from the left stripe and compares that hex value for the intended color
	 */
	public void checkForColorLegend(String colorLegend) {
		waitForElementToLoad(leftStripeColorLegendInExamCard, "Waiting for Exam Card to load");
		String hex = Color
				.fromString(driver.findElement(leftStripeColorLegendInExamCard).getCssValue("background-color"))
				.asHex();
		Assert.assertTrue(hex.equals(colorLegend));
	}

	/**
	 * The method closes the modal pop up for exam card information
	 */
	public void closeTheExamCard() throws InterruptedException {
		clickLink(closeTheExamCardPopUp, "Close the exam card");
		sleep(5);
	}

	/**
	 * Selecting the drop down for resource categories
	 */
	public void selectTheCategory(String catName) {
		selectValueByVisibleText(categoryName, catName, "Category DropDown");
	}

	/**
	 * 
	 */
//	public void changeThePatientExperienceStatus(String patExpEvents, String patExpEventstatus)
//			throws InterruptedException {
//		clickLink(toggleSwitchToChangeState(patExpEvents, patExpEventstatus),
//				"Change the status of patient experience event " + patExpEvents);
//	}

	/**
	 *  The below method adds the comments in the comments section of the exam card information modal pop up
	 */
	public void addCommentsinExamCard() throws InterruptedException {
		clearAndInput(commentBoxWithinExamCard, "Adding comments in the exam card",
				"The patient is prepared for the scan and the paperwork is completed. Room not ready, patient scan is on hold");
	}

	/**
	 * The below method verifies the icons for representing the status of the exam card
	 */
	public void statusIndicatorOnExamCard(String verifyIconsOnExamCard) throws InterruptedException {
		Assert.assertTrue(driver.findElements(toSearchIconsOnTheExamCard(verifyIconsOnExamCard)).size() != 0);
	}

}
