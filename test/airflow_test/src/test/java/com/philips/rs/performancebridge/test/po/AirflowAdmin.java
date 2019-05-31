package com.philips.rs.performancebridge.test.po;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.FindBys;
import org.openqa.selenium.support.PageFactory;

import com.philips.rs.performancebridge.test.common.utils.UITestUtils;

public class AirflowAdmin {
	protected WebDriver driver;

	public AirflowAdmin(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	@FindBy(xpath = "//a[text()='New Category']")
	private WebElement newCategory;

	@FindBy(xpath = "//input[@name='category']")
	private WebElement categoryInputBox;

	@FindBy(xpath = "//select[@name='phi_enabled']")
	private WebElement PHIEnabledDropDownBox;

	@FindBy(xpath = "//select[@name='enabled']")
	private WebElement enableCategory;

	@FindBy(xpath = "//button[text()='Save changes']")
	private WebElement saveChanges;

	@FindBy(xpath = "//select[@name='category']")
	private WebElement categoryName;

	@FindBy(xpath = "//input[@name='explanation']")
	private WebElement searchExplanation;

	@FindBy(xpath = "//input[@name='search_terms']")
	private WebElement searchText;

	@FindBy(xpath = "//button[text()='Search']")
	private WebElement searchButton;

	@FindBy(xpath = "//div[@id='results']/div/h4")
	private WebElement resutlMessage;

	@FindBy(xpath = "//input[@placeholder='Create a new group']")
	private WebElement createNewGroup;

	@FindBy(xpath = "//i[@class='fa fa-plus']")
	private WebElement createNewGroupPlus;
	
	@FindBy(xpath = "//button[@id='modality-filter-button']")
	private WebElement modalityFilterDropdown;

	@FindBy(xpath = "//i[@class='fa fa-search']")
	private WebElement searchAppliedModalityFilter;
	
	@FindBy(xpath = "//i[@class='fa fa-minus-circle']")
	private WebElement removeAddedResources;
	
	@FindBys(@FindBy(xpath = "//tr[@class='selected']//i[@class='fa fa-minus-circle']"))
	private List<WebElement> removeAddedResourcesList;
	
	
	private String selectModalityFilter(String modality) {
		return "//a[text()='" + modality + "']";
	}
	
	private String trashIconForResourceGroup(String groupName) {
		return "//span[@class='name'][text()='" + groupName + "']/../span[@class='trash']";
	}
	
	private String getSubTabElementXPath(String subTabName) {
		return "//a[contains(text(),'" + subTabName + "')]";
	}

//	private String getConfigurationButtonCheckXPath(String configName) {
//		return "//h3[contains(text(),'" + configName + "')]/..//div/div/div/div/div";
//	}

	private String getGroupNameXpath(String subTabName) {
		return "//span[text()='" + subTabName + "']";
	}

	private String getResourceNameXpath(String resourceName) {
		return "//td[text()='" + resourceName + "']";
	}
	
//	private String getResourceNameMinusXpath(String resourceNameMinus) {
//		return "//td[contains(text(),'" + resourceNameMinus + "')]/..//i[2]";
//	}
//
//	private String getCheckedConfigurationButtonXPath(String configName) {
//		return "//h3[contains(text(),'" + configName + "')]/..//div[@class='toggle-group']//label[text()='Off']";
//	}
//
//	private String getUpdateButtonXPath(String configName) {
//		return "//h3[contains(text(),'" + configName + "')]/..//button[text()='Update']";
//	}
//
//	private String getDragAnddropXPath(String configName, String role) {
//		return "//h3[contains(text(),'" + configName
//				+ "')]/..//ul[@id='clinical_roles_auth_list_no-access']/li[contains(text(),'" + role + "')]";
//	}
//
//	private String getDragAnddropXPath(String configName) {
//		return "//h3[contains(text(),'" + configName + "')]/..//ul[@id='clinical_roles_auth_list_all-access']/li";
//	}
//
//	private String getDropedValueXPath(String configName, String role) {
//		return "//h3[contains(text(),'" + configName
//				+ "')]/..//ul[@id='clinical_roles_auth_list_all-access']/li[contains(text(),'" + role + "')]";
//	}
//
//	private String getUserRoleUpdateButtonXPath(String configName) {
//		return "//h3[contains(text(),'" + configName + "')]/button";
//	}
//
//	private String getEephixXpath(String str) {
//		return "//p/b[text()='str']";
//	}
//
//	private String getUpdateSuccessMarkXPath(String configName) {
//		return "//h3[contains(text(),'" + configName + "')]//span[@class='success']";
//	}

	/*
	 * RETURN WebElement/Locator
	 */

//	private WebElement getconfigurationButtonCheckWebElement(String configName) {
//		return UITestUtils.getWebElementByXpath(getConfigurationButtonCheckXPath(configName));
//	}
//
//	private WebElement getCheckedConfigurationButtonWebElement(String configName) {
//		return UITestUtils.getWebElementByXpath(getCheckedConfigurationButtonXPath(configName));
//	}
//
//	private WebElement getUpdateButtonWebElement(String configName) {
//		return UITestUtils.getWebElementByXpath(getUpdateButtonXPath(configName));
//	}
//
//	private WebElement getDragAnddropWebElement(String configName, String role) {
//		return UITestUtils.getWebElementByXpath(getDragAnddropXPath(configName, role));
//	}
//
//	private WebElement getDragAnddropWebElement(String configName) {
//		return UITestUtils.getWebElementByXpath(getDragAnddropXPath(configName));
//	}
//
//	private WebElement getDropedValueWebElement(String configName, String role) {
//		return UITestUtils.getWebElementByXpath(getDropedValueXPath(configName, role));
//	}
//
//	private WebElement getUpdateSuccessMarkWebElement(String configName) {
//		return UITestUtils.getWebElementByXpath(getUpdateSuccessMarkXPath(configName));
//	}
//
//	private WebElement getEephixWebElement(String str) {
//		return UITestUtils.getWebElementByXpath(getEephixXpath(str));
//	}
//
//	private By getEephixLocator(String str) {
//		return UITestUtils.getLocatorByXpath(getEephixXpath(str));
//	}
//
//	private WebElement getUserRoleUpdateButtonWebElement(String configName) {
//		return UITestUtils.getWebElementByXpath(getUserRoleUpdateButtonXPath(configName));
//	}
//
//	private WebElement getResourceNameMinusWebElement(String resourceNameMinus) {
//		return UITestUtils.getWebElementByXpath(getResourceNameMinusXpath(resourceNameMinus));
//	}

	private WebElement getSubTabElementWebElement(String subTabName) {
		return UITestUtils.getWebElementByXpath(getSubTabElementXPath(subTabName));
	}

	private WebElement getGroupNameWebElement(String subTabName) {
		return UITestUtils.getWebElementByXpath(getGroupNameXpath(subTabName));
	}

	private WebElement getResourceNameWebElement(String resourceName) {
		return UITestUtils.getWebElementByXpath(getResourceNameXpath(resourceName));
	}
	
	private WebElement applyModalityFilter(String modalityFilter) {
		return UITestUtils.getWebElementByXpath(selectModalityFilter(modalityFilter));
	}
	
	private WebElement getTrashIconWebElement (String groupName) {
		return UITestUtils.getWebElementByXpath(trashIconForResourceGroup(groupName));
	}
	

	// !=================================== Methods ==============================================================

	/**
	 * Click on subTab Menu link of Main menu.
	 */
	public void clickOnSubMenOfMenuTab(String subTabName) throws Exception {
		UITestUtils.isClickable(getSubTabElementWebElement(subTabName), subTabName);
		UITestUtils.clickLink(getSubTabElementWebElement(subTabName), subTabName);
	}

	/**
	 * @description:This method enters text in an input box
	 */
	public void enterCategoryName(String catName) {
		UITestUtils.clearAndInput(categoryInputBox, "Category", catName);
	}

	/**
	 * @description:This method selects False in the PHIEnabled drop box for the
	 *                   category created
	 */
	public void disablePHI(String bool) {
		UITestUtils.selectValueByVisibleText(PHIEnabledDropDownBox, bool, "PHIEnabledDropDownBox");
	}

	/**
	 * @description:This method selects enabled to true for the category created
	 */
	public void enableCatgory(String bool) {
		UITestUtils.selectValueByVisibleText(enableCategory, bool, "CategoryEnabledDropDownBox");
	}

	/**
	 * @description:This method clicks on the save changes button
	 */
	public void saveTheChanges() throws Exception {
		UITestUtils.clickLink_JavaScript(saveChanges, "Save Changes ");
	}
	
	public void removeAddedResourcesFromResourceGroup () {
		UITestUtils.clickLink_JavaScript(removeAddedResources, "Removing the resources from resource group");
		
	}

	/**
	 * @description:This method selects the category from the list
	 */
	public void selectTheCategory(String catName) {
		UITestUtils.selectValueByVisibleText(categoryName, catName, "Category DropDown");
	}

	/**
	 * @description:This method enters the explanation in the explanation box
	 */
	public void enterTheExplanation(String explanation) {
		UITestUtils.clearAndInput(searchExplanation, "Explanation", explanation);
	}

	/**
	 * @description:This method enters the search text
	 */
	public void enterTheSearchText(String searchString) {
		UITestUtils.clearAndInput(searchText, "Search Text", searchString);

	}

	/**
	 * @description:This method clicks on search button
	 */
	public void clickOnSearch() throws Exception {
		UITestUtils.clickLink_JavaScript(searchButton, "Search");

	}
	
	public void removingTheExistingResources() {
		List<WebElement> initialResourceList = removeAddedResourcesList;
		for(int i=0;i<=initialResourceList.size()-1;i++)
		{
			UITestUtils.clickLink(initialResourceList.get(i), i+ "click On");
		}
	}

	/**
	 * @description:This method ensures that patient ID is not present in the
	 *                   report search
	 */
//	public void checkPatientIDDoesNotExist(String patientID) {
//
//		// Assert.assertFalse(UITestUtils.elementInVisibilitymethod(getEephixLocator(patientID)));
//		// log.info("PASS :" + patientID + " does not exist in the report
//		// search");
//	}

	/**
	 * @description:This method ensures that accession is not present in the
	 *                   report search
	 */
	/*public void checkAccessionDoesNotExist(String accession) {
		// Assert.assertFalse(UITestUtils.isElementPresent(getEephixWebElement(accession)));
		log.info("PASS :" + accession + " does not exist in the report search");
	}*/

	/**
	 * Check the result message is equivalent with given parameter after the
	 * search.
	 */
	/*public void checkResultMessage(String message) {
		// Assert.assertTrue(UITestUtils.retrieveText(resutlMessage,
		// "Message").equalsIgnoreCase(message.trim()));
		log.info("PASS : Result Message " + message.trim() + " is Displayed");
	}
*/
	
	
	public void enterGroupName(String groupName) {
		UITestUtils.clearAndInput(createNewGroup, "createNewGroup", groupName);
	}

	public void clickCreateNewGroupPlus() {
		UITestUtils.clickLink_JavaScript(createNewGroupPlus, "createNewGroupPlus");
	}

	public void clickGroupName(String groupName) {
		UITestUtils.waitForElementToLoad(getGroupNameWebElement(groupName), groupName + " Group");
		UITestUtils.clickLink_JavaScript(getGroupNameWebElement(groupName), groupName + " Group");
	}

	public void clickOnResourceName(String resourceName) {
		UITestUtils.clickLink_JavaScript(getResourceNameWebElement(resourceName), resourceName + " Group");
	}
		
	public void clickOnFilterByModalityButton() {
		UITestUtils.clickLink(modalityFilterDropdown, "Click on filter by modality button");
	}
	
	 public void selectModalityFilterFromDropDown(String modality) {
		 UITestUtils.clickLink(applyModalityFilter(modality), "Select the modality" + modality);
	 }

	 public void searchAppliedModalityFilter() {
		 UITestUtils.clickLink(searchAppliedModalityFilter, "Searched for applied modality filter");
	 }
	 
	public void deleteResourceGroup(String groupName) throws InterruptedException {
		UITestUtils.clickLink(getTrashIconWebElement(groupName), "Clicked on trash icon to delete the resource group");
		driver.switchTo().alert().accept();
		}
}
