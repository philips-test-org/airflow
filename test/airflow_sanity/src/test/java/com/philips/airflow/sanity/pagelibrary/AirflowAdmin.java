package com.philips.airflow.sanity.pagelibrary;

import org.junit.Assert;
import org.openqa.selenium.By;

import com.philips.airflow.sanity.utils.UITestUtils;

public class AirflowAdmin extends UITestUtils {

	public static By newCategory = By.xpath("//a[text()='New Category']");
	public static By categoryInputBox = By.xpath("//input[@name='category']");
	public static By PHIEnabledDropDownBox = By.xpath("//select[@name='phi_enabled']");
	public static By enableCategory = By.xpath("//select[@name='enabled']");
	public static By saveChanges = By.xpath("//button[text()='Save changes']");
	public static By categoryName = By.xpath("//select[@name='category']");
	public static By searchExplanation = By.xpath("//input[@name='explanation']");
	public static By searchText = By.xpath("//input[@name='search_terms']");
	public static By searchButton = By.xpath("//button[text()='Search']");
	public static By resutlMessage = By.xpath("//div[@id='results']/div/h4");
	public static By createNewGroup = By.xpath("//input[@placeholder='Create a new group']");
	public static By createNewGroupPlus = By.xpath("//i[@class='fa fa-plus']");

	public By subTabElementXPath(String subTabName) {
		return By.xpath("//a[contains(text(),'" + subTabName + "')]");
	}

	public By groupName(String subTabName) {
		return By.xpath("//span[text()='" + subTabName + "']");
	}

	public By resourceName(String resourceName) {
		return By.xpath("//td[contains(text(),'" + resourceName + "')]");
	}

	public By resourceNameMinus(String resourceNameMinus) {
		return By.xpath("//td[contains(text(),'" + resourceNameMinus + "')]/..//i[2]");
	}

	public By configurationButtonCheckPath(String configName) {
		return By.xpath("//h3[contains(text(),'" + configName + "')]/..//div/div/div/div/div");
	}

	public By checkedConfigurationButtonPath(String configName) {
		return By.xpath(
				"//h3[contains(text(),'" + configName + "')]/..//div[@class='toggle-group']//label[text()='Off']");
	}

	public By updateButtonPath(String configName) {
		return By.xpath("//h3[contains(text(),'" + configName + "')]/..//button[text()='Update']");
	}

	public By dragAnddropPath(String configName, String role) {
		return By.xpath("//h3[contains(text(),'" + configName
				+ "')]/..//ul[@id='clinical_roles_auth_list_no-access']/li[contains(text(),'" + role + "')]");
	}

	public By dragAnddropPath(String configName) {
		return By.xpath(
				"//h3[contains(text(),'" + configName + "')]/..//ul[@id='clinical_roles_auth_list_all-access']/li");
	}

	public By dropedValuePath(String configName, String role) {
		return By.xpath("//h3[contains(text(),'" + configName
				+ "')]/..//ul[@id='clinical_roles_auth_list_all-access']/li[contains(text(),'" + role + "')]");
	}

	public By userRoleUpdateButtonPath(String configName) {
		return By.xpath("//h3[contains(text(),'" + configName + "')]/button");
	}

	public By EPHIXpath(String str) {
		return By.xpath("//p/b[text()='str']");
	}

	public By updateSuccessMarkPath(String configName) {
		return By.xpath("//h3[contains(text(),'" + configName + "')]//span[@class='success']");
	}

	// !======================================== Methods
	// ==============================================================

	/**
	 * Click on subTab Menu link of Main menu.
	 */
	public void clickOnSubMenOfMenuTab(String subTabName) throws Exception {
		clickLink(subTabElementXPath(subTabName), subTabName);
	}

	/**
	 * @description:This method enters text in an input box
	 */
	public void enterCategoryName(String catName) {
		clearAndInput(categoryInputBox, "Category", catName);
	}

	/**
	 * @description:This method selects False in the PHIEnabled drop box for the
	 *                   category created
	 */
	public void disablePHI(String bool) {
		selectValueByVisibleText(PHIEnabledDropDownBox, bool, "PHIEnabledDropDownBox");
	}

	/**
	 * @description:This method selects enabled to true for the category created
	 */
	public void enableCatgory(String bool) {
		selectValueByVisibleText(enableCategory, bool, "CategoryEnabledDropDownBox");
	}

	/**
	 * @description:This method clicks on the save changes button
	 */
	public void saveTheChanges() throws Exception {
		clickLink(saveChanges, "Save Changes ");
	}

	/**
	 * @description:This method selects the category from the list
	 */
	public void selectTheCategory(String catName) {
		selectValueByVisibleText(categoryName, catName, "Category DropDown");
	}

	/**
	 * @description:This method enters the explanation in the explanation box
	 */
	public void enterTheExplanation(String explanation) {
		clearAndInput(searchExplanation, "Explanation", explanation);
	}

	/**
	 * @description:This method enters the search text
	 */
	public void enterTheSearchText(String searchString) {
		clearAndInput(searchText, "Search Text", searchString);

	}

	/**
	 * @description:This method clicks on search button
	 */
	public void clickOnSearch() throws Exception {
		clickLink(searchButton, "Search");

	}

	/**
	 * @description:This method ensures that patient ID is not present in the
	 *                   report search
	 */
	public void checkPatientIDDoesNotExist(String patientID) {

		Assert.assertFalse(isElementPresent(EPHIXpath(patientID)));
		logger.info("PASS :" + patientID + " does not exist in the report search");
	}

	/**
	 * @description:This method ensures that accession is not present in the
	 *                   report search
	 */
	public void checkAccessionDoesNotExist(String accession) {
		Assert.assertFalse(isElementPresent(EPHIXpath(accession)));
		logger.info("PASS :" + accession + " does not exist in the report search");
	}

	/**
	 * Check the result message is equivalent with given parameter after the
	 * search.
	 */
	public void checkResultMessage(String message) {
		Assert.assertTrue(retrieveText(resutlMessage, "Message").equalsIgnoreCase(message.trim()));
		logger.info("PASS : Result Message " + message.trim() + " is Displayed");
	}

}
