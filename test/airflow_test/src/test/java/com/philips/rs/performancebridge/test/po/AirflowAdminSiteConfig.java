package com.philips.rs.performancebridge.test.po;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import com.philips.rs.performancebridge.test.common.utils.UITestUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AirflowAdminSiteConfig {
	protected WebDriver driver;

	public AirflowAdminSiteConfig(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}
	
	@FindBy(xpath = "//ul[@id='clinical_roles_auth_list_no-access']")
	private WebElement userRoleWithOutAccessPanel;
	
	@FindBy(css = "button.update-access.btn.btn-primary.update")
	private WebElement updateClinicalRolesAuthListBtn;
	
	@FindBy(css = "span#updated_at")
	private WebElement updatedAtTimeStamp;
	
//	By updatedClinicalRolesAuthListCheck = By.cssSelector("div#clinical_roles_auth_list span.success[style*='inline']");
//	By updatedClinicalRolesAuthListCheck = By.xpath("//div[@id='clinical_roles_auth_list']//span[@class='success'][contains(@style,'inline')]");
	
	@FindBy(xpath = "//ul[@id='clinical_roles_auth_list_all-access']")
	private WebElement userRoleWithAccessPanel;

	private String getUserRoleWithoutAccessXpath(String userRole) {
		return "//ul[@id='clinical_roles_auth_list_no-access']/li[text()='" + userRole + "']";
	}
	
	private String getUserRoleWithAccessXpath(String userRole) {
		return "//ul[@id='clinical_roles_auth_list_all-access']/li[text()='" + userRole + "']";
	}
	
	private String getUpdatedAtTimeStampXpath(String timeStamp) {
		return "//span[@id='updated_at'][text()='" + timeStamp + "']";
	}
	
	private By getUserRoleWithAccessLocator(String userRole) {
		return UITestUtils.getLocatorByXpath(getUserRoleWithAccessXpath(userRole));
	}
	
	private By getUpdatedAtTimeStampLocator(String timeStamp) {
		return UITestUtils.getLocatorByXpath(getUpdatedAtTimeStampXpath(timeStamp));
	}
	
	private WebElement getUserRoleWithAccessWebElement(String userRole) {
		return UITestUtils.getWebElementByXpath(getUserRoleWithAccessXpath(userRole));
	}
	
	private WebElement getUserRoleWithoutAccessWebElement(String userRole) {
		return UITestUtils.getWebElementByXpath(getUserRoleWithoutAccessXpath(userRole));
	}
	
	private By getUserRoleWithoutAccessLocator(String userRole) {
		return UITestUtils.getLocatorByXpath(getUserRoleWithoutAccessXpath(userRole));
	}
	
	// !=================================== Methods ==============================================================

	public boolean verifyaRoleWithOutAccess(String userRole){
		return UITestUtils.isElementDisplayed(getUserRoleWithoutAccessLocator(userRole));
	}
	
	public boolean verifyaRoleWithAccess(String userRole){
		return UITestUtils.isElementDisplayed(getUserRoleWithAccessLocator(userRole));
	}
	
	public void UpdateRoleConfigureOfWithAccess(String userRole){
		UITestUtils.waitForElementToLoad(userRoleWithAccessPanel, "userRoleWithAccessPanel");
		if(!verifyaRoleWithAccess(userRole)){
			String beforeUpdateTimeStamp = UITestUtils.retrieveText(updatedAtTimeStamp, "Timestamp Befor update role");
			UITestUtils.dragNDrop(getUserRoleWithoutAccessWebElement(userRole), userRoleWithAccessPanel, "Role '" + userRole + "' to with access");
			clickOnUpdateClinicalRolesAuthList();
			UITestUtils.WaitForElementToBeInVisible(getUpdatedAtTimeStampLocator(beforeUpdateTimeStamp), "Timestamp Befor update role");
			return;
		}
		log.info("'" + userRole + "' role is already present in User Role Without Access panel");
	}
	
	public void UpdateRoleConfigureOfWithOutAccess(String userRole){
		UITestUtils.waitForElementToLoad(userRoleWithOutAccessPanel, "userRoleWithOutAccessPanel");
		if(!verifyaRoleWithOutAccess(userRole)){
			String beforeUpdateTimeStamp = UITestUtils.retrieveText(updatedAtTimeStamp, "Timestamp Befor update role");
			UITestUtils.dragNDrop(getUserRoleWithAccessWebElement(userRole), userRoleWithOutAccessPanel, "Role '" + userRole + "' to without access");
			clickOnUpdateClinicalRolesAuthList();
			UITestUtils.WaitForElementToBeInVisible(getUpdatedAtTimeStampLocator(beforeUpdateTimeStamp), "Timestamp Befor update role");
//			waitUntilTextChange(updatedAtTimeStamp,beforeUpdateTimeStamp);
			return;
		}
		log.info("'" + userRole + "' role is already present in User Role With Access panel");
	}
	
	public void clickOnUpdateClinicalRolesAuthList(){
		UITestUtils.clickLink(updateClinicalRolesAuthListBtn, "update Clinical Roles Auth List");
		
//		UITestUtils.waitForPresenceOfElement(updatedClinicalRolesAuthListCheck, "update Clinical Roles AuthList Button");
	}
	
	/*private void waitUntilTextChange(WebElement webElement, String text, String ElementName){
		int incr = 1;
		while(webElement.getText().equals(text) && incr <= 10){
			UITestUtils.sleep(2);
			incr++;
			
			if (!webElement.getText().equals(text)){
				return;
			}
		}
		
		if (updatedAtTimeStamp.getText().equals(text))
			throw new RuntimeException(
					"Error while clearing - '" + elemName + "' : " + clearFieldException.getClass().getName());
	}*/
}
