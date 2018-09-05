package com.philips.rs.performancebridge.test.po;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AirflowKiosk {

	protected WebDriver driver;

	public AirflowKiosk(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	@FindBy(xpath = "//div[@class='modal-header']//h5")
	private WebElement kioskNumber;
	
	@FindBy(xpath = "//li[@class='active']/a[@name='kiosk']")
	private WebElement activeKioskTab;
	
	

	private String getSearchKioskNumberInKioskTabXpath(String kioskNumber) {
		return "//div[text()='" + kioskNumber + "']";
	}

	/*
	 * RETURN WebElement/Locators
	 */

	private WebElement getSearchKioskNumberInKioskTabWebElement(String kioskNumber) {
		return UITestUtils.getWebElementByXpath(getSearchKioskNumberInKioskTabXpath(kioskNumber));
	}

	public boolean verifySearchKioskNumberInKioskTab(String kioskNumber) {
		return UITestUtils.isElementDisplayed(getSearchKioskNumberInKioskTabWebElement(kioskNumber));
	}

	/*
	 * METHODS
	 */

	public String getKioskNumber() throws InterruptedException {
		String kioskNumberText = retrievedKioskNumber();
		log.info("kioskNumber is " + kioskNumberText);
		return kioskNumberText;
	}
	
	
	public boolean verifyKioskTabIsActive() throws InterruptedException {
		return UITestUtils.isElementDisplayed(activeKioskTab);
	}


	private String retrievedKioskNumber() {
		String[] kioskNumber1 = UITestUtils.retrieveText(kioskNumber, "kioskNumber").split(" ");
		return kioskNumber1[kioskNumber1.length - 1];
	}

}
