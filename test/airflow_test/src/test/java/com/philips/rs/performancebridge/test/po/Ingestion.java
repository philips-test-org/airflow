package com.philips.rs.performancebridge.test.po;

import org.openqa.selenium.By;

import com.philips.rs.performancebridge.test.utils.UITestUtils;

public class Ingestion extends UITestUtils {

	public static final By examStatus = By.name("exam_status");
	public static final By examResource = By.xpath("//select[@id='exam_resource']");
	public static final By submit = By.xpath("//button[contains(text(),'Submit')]");
	public static final By typeAccNum = By.xpath("//input[@name='accession_number']");
	public static final By procedureDropDownInVHS = By.xpath("//div[@class='btn-group bootstrap-select form-control']");
	public static final By procedureSearchFieldInVHS = By.xpath("//div[@class='bs-searchbox']//input");
	public static String newlyCreatedMrnNumber = "";
	public static String accessionNumber;
	
	public static By searchAccNumber (String searchAccNum) throws InterruptedException {
		return By.xpath("//td[@class='acc'][text()='"+searchAccNum+"']");
	}
	
	public static By ProcedureSelectForVHSCreateExam(String value) throws InterruptedException {
		return By.xpath("//span[text()='" + value + "']");
	}

	public void selectStatus(String examstatus) throws InterruptedException {
		selectValueByOption(examStatus, examstatus, examstatus);
	}

	public void selectSubmit(String submitbutton) throws InterruptedException {
		clickLink(submit, "Submit");
	}

	public void selectResourceFromDropDown(String Resource) throws Throwable {
		selectValueByOption(examResource, Resource, "Select the Resource");
	}

	public String enterAccessionNumber() throws Throwable {
		generateAccessionNumber();
		clearAndInput(typeAccNum, accessionNumber, accessionNumber);
		return accessionNumber;
	}

	public void selectProcedure(String procedure) throws InterruptedException {
		clickLink(procedureDropDownInVHS, "Procedure Dropdown");
		clearAndInput(procedureSearchFieldInVHS, "Procedure search Field", procedure);
		clickLink(ProcedureSelectForVHSCreateExam(procedure), procedure);
	}

	public void searchIngestedAccNum(String acc_num) throws InterruptedException {
		searchAccNumber(acc_num);
	}
	
	public void getCorrespondingMRNNumber(String acc_num) throws InterruptedException {
			By getMrnNumber = By.xpath("//tr[@data='" + acc_num + "']/td[@class='mrn']");
			newlyCreatedMrnNumber = driver.findElement(getMrnNumber).getText();
			}
	
	public void generateAccessionNumber() {
        accessionNumber = randomNumberGenerator(0, 99999);
        logger.info("Dynamically generated accession number is "+accessionNumber);
	}
	

}
