package com.philips.airflow.sanity.pagelibrary;

import org.openqa.selenium.By;

import com.philips.airflow.sanity.utils.UITestUtils;

public class AirflowKiosk extends UITestUtils {
	
	public static String kioskNumberText = "";
	public static By kioskNumber = By.xpath("//div[@class='modal-header']//h5");
	public By searchKioskNumberInKioskTab(String kioskNumber) {
		return By.xpath("//div[text()='" + kioskNumber + "']");
	}
	public void getKioskNumber() throws InterruptedException {
		kioskNumberText = retrievedKioskNumber();
		logger.info("kioskNumber is " + kioskNumberText);
		clickLink(Airflow.closeTheExamCardPopUp, "Close the exam card");
		sleep(5);
	}
	public String retrievedKioskNumber() {
		String[] kioskNumber1 = retrieveText(kioskNumber, "kioskNumber").split(" ");
		return kioskNumber1[kioskNumber1.length - 1];
	}
	
	
	
	
}
