package com.philips.rs.sanity.pagelibrary;

import org.junit.Assert;
import org.openqa.selenium.By;

import com.philips.rs.utils.UITestUtils;

public class AirflowAdmin extends UITestUtils {
	
	public static By newCategory=By.xpath("//a[text()='New Category']");
	public static By categoryInputBox=By.xpath("//input[@name='category']");
	public static By PHIEnabledDropDownBox=By.xpath("//select[@name='phi_enabled']");
	public static By enableCategory=By.xpath("//select[@name='enabled']");
	public static By saveChanges=By.xpath("//button[text()='Save changes']");
	public static By categoryName=By.xpath("//select[@name='category']");
	public static By searchExplanation=By.xpath("//input[@name='explanation']");
	public static By searchText=By.xpath("//input[@name='search_terms']");
	public static By searchButton=By.xpath("//button[text()='Search']");
	public static By resutlMessage = By.xpath("//div[@id='results']/div/h4");
	public static By createNewGroup= By.xpath("//input[@placeholder='Create a new group']");
	public static By createNewGroupPlus= By.xpath("//i[@class='fa fa-plus']");
	/**
	 * @author Aditya Pare
	 * Find xPath for subTabElement
	 * @param subTabName
	 * @return Locator By
	 */
	public By subTabElementXPath(String subTabName) {
		return By.xpath("//a[contains(text(),'"+subTabName+"')]");
	}
	

	/**
	 * @author Ganesh Totad
	 * Find xPath for clicking on group
	 * @param subTabName
	 * @return Locator By
	 */
	public By groupName(String subTabName) {
		return By.xpath("//span[text()='"+subTabName+"']");
	}
	
	/**
	 * @author Ganesh Totad
	 * Find xPath for clicking on group
	 * @param subTabName
	 * @return Locator By
	 */
	public By resourceName(String resourceName) {
		return By.xpath("//td[contains(text(),'"+resourceName+"')]");
	}
	/**
	 * @author Ganesh Totad
	 * Find xPath for (-) symbol 
	 * @param subTabName
	 * @return Locator By
	 */
	public By resourceNameMinus(String resourceNameMinus) {
		return By.xpath("//td[contains(text(),'"+resourceNameMinus+"')]/..//i[2]");
	}
	//td[contains(text(),'VHO-CT CT-2')]/..//i[2]
	
	/**
	 * @author Aditya Pare
	 * Find xPath for configuration Button.  
	 * @param confiName
	 * @return Locator By
	 */
	public By configurationButtonCheckPath(String configName) {
		return By.xpath("//h3[contains(text(),'"+configName+"')]/..//div/div/div/div/div");
	}
	
	
	/**
	 * @author Aditya Pare
	 * Find xPath for configuration button path
	 * @param configName
	 * @return Locatore By
	 */
	public By checkedConfigurationButtonPath(String configName) {
		return By.xpath("//h3[contains(text(),'"+configName+"')]/..//div[@class='toggle-group']//label[text()='Off']");
	}
	
	
	
	/**
	 * @author Aditya Pare
	 * Find xPath for configuration update button path
	 * @param configName
	 * @return Locatore By
	 */
	public By updateButtonPath(String configName) {
		return By.xpath("//h3[contains(text(),'"+configName+"')]/..//button[text()='Update']");
	}
	
	
	
	/**
	 * @author Aditya Pare
	 * Path finding for 'from' element in dragNdrop configuration.
	 * @param configName
	 * @param role
	 * @return locator By
	 */
	public By dragAnddropPath(String configName, String role) {
		return By.xpath("//h3[contains(text(),'"+configName+"')]/..//ul[@id='clinical_roles_auth_list_no-access']/li[contains(text(),'"+role+"')]");
	}
	
	/**
	 * @author Aditya Pare
	 * Path finding for 'to' element in dragNdrop configuration.
	 * @param configName
	 * @return
	 */
	public By dragAnddropPath(String configName) {
		return By.xpath("//h3[contains(text(),'"+configName+"')]/..//ul[@id='clinical_roles_auth_list_all-access']/li");
	}
	
	
	/**
	 * @author Aditya Pare
	 * Find Drop container path to find element is present or not.
	 * @param configName
	 * @param role
	 * @return locator By
	 */
	public By dropedValuePath(String configName, String role) {
		return By.xpath("//h3[contains(text(),'"+configName+"')]/..//ul[@id='clinical_roles_auth_list_all-access']/li[contains(text(),'"+role+"')]");
	}
	
	/**
	 * @author Aditya Pare
	 * Path for user role config update button.
	 * @param configName
	 * @return locator By
	 */
	public By userRoleUpdateButtonPath(String configName) {
		return By.xpath("//h3[contains(text(),'"+configName+"')]/button");
	}
	
	
	/**
	 * @author Sada
	 * Find Path for EPHI
	 * @param str
	 * @return
	 */
	public By EPHIXpath(String str){
		return By.xpath("//p/b[text()='str']");
	}
	
	/**
	 * @author Aditya Pare
	 * Find path of successfull mark
	 * @param configName
	 * @return
	 */
	public By updateSuccessMarkPath(String configName) {
		return By.xpath("//h3[contains(text(),'"+configName+"')]//span[@class='success']");
	}
	
	
	/**
	 * @author Aditya Pare
	 * Click on subTab Menu link of Main menu.
	 * @param subTabName
	 */ 
	public void clickOnSubMenOfMenuTab(String subTabName) throws Exception {
		clickLink(subTabElementXPath(subTabName), subTabName);
	}
	
	
	 
	
	
		   
			
		
	
	
	/**
	 * /**
	 * @author:Sadashiva Ashok
	 * @description:This method enters text in an input box
	 * @param catName
	 */
	public void enterCategoryName(String catName) {
		clearAndInput(categoryInputBox, "Category", catName);
	}
	
	/**
	 * @author:Sadashiva Ashok
	 * @description:This method selects False in the PHIEnabled drop box for the category created
	 */
	public void disablePHI(String bool) {
		selectValueByVisibleText(PHIEnabledDropDownBox, bool, "PHIEnabledDropDownBox");
	}

	/**
	 * @author Sadashiva Ashok
	 * @description:This method selects enabled to true for the category created 
	 */
	
	public void enableCatgory(String bool) {
		selectValueByVisibleText(enableCategory, bool, "CategoryEnabledDropDownBox");
		
	}
	
	/**
	 * @author Sadashiva Ashok
	 *  @description:This method clicks on the save changes button
	 * @throws Exception
	 */
	
	public void saveTheChanges() throws Exception {
		clickLink(saveChanges, "Save Changes ");
	}
	
	/**
	 * @author Sadashiva Ashok
	 * @description:This method selects the category from the list
	 * @param catName
	 */
	public void selectTheCategory(String catName) {
		selectValueByVisibleText(categoryName, catName, "Category DropDown");
	}
	
	/**
	 * @author Sadashiva Ashok
	 * @description:This method enters the explanation in the explanation box
	 * @param explanation
	 */
	
	public void enterTheExplanation(String explanation) {
		clearAndInput(searchExplanation, "Explanation", explanation);
	}

	/**
	 * @author Sadashiva Ashok
	 * @description:This method enters the search text
	 * @param searchString
	 */
	public void enterTheSearchText(String searchString) {
		clearAndInput(searchText, "Search Text", searchString);
		
	}
	
	/**
	 * @author Sadashiva Ashok
	 * @throws Exception 
	 * @description:This method clicks on search button
	 */
	public void clickOnSearch() throws Exception {
		clickLink(searchButton, "Search");
		
	}
	
	/**
	 * @author Sadashiva Ashok
	 * @description:This method ensures that patient ID is not present in the report search
	 * @param patientID
	 */
	public void checkPatientIDDoesNotExist(String patientID) {
		
		Assert.assertFalse(isElementPresent(EPHIXpath(patientID)));
		logger.info("PASS :"+patientID +" does not exist in the report search");
	}
	
	/**
	 * @author Sadashiva Ashok
	 * @description:This method ensures that accession is not present in the report search
	 * @param accession
	 */
	public void checkAccessionDoesNotExist(String accession) {
		Assert.assertFalse(isElementPresent(EPHIXpath(accession)));
		logger.info("PASS :"+accession +" does not exist in the report search");
	}

	
	/**
	 * @author Aditya Pare
	 * Check the result message is equivalent wih given parameter after the search.
	 * @param message
	 */
	public void checkResultMessage(String message) {
		Assert.assertTrue(retrieveText(resutlMessage, "Message").equalsIgnoreCase(message.trim()));
		logger.info("PASS : Result Message "+message.trim()+" is Displayed");
	}
	
	
	
}
	


