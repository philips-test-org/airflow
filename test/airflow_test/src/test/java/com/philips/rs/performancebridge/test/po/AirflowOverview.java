package com.philips.rs.performancebridge.test.po;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;

import com.philips.rs.performancebridge.test.common.utils.UITestUtils;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

public class AirflowOverview {

	private AirflowCalendar airflowCalendar;
	private Airflow airflow;
	private ContextDTO contextDTO;

	public AirflowOverview(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		this.contextDTO = contextDTO;
		airflowCalendar = pageObjectManager.getAirflowCalendarPage();
		airflow = pageObjectManager.getAirflowPage();
	}
	
		protected WebDriver driver;
		
		public AirflowOverview(WebDriver driver) {
			this.driver = driver;
			PageFactory.initElements(driver, this);
		}
	
		private String getResourceXpathInOverview(String resource) {
			return "//div[@class='row-label']/h1[text()='"+resource+"']";
		}
		
		private String getResourceExamCardCountXpath(String resource) {
			return "//div[@class='row-label']/h1[text()='" + resource + "']/../..//div[@class='mrn']";
		}
		
		private String getSearchForMRNNumberInExamCardXpath(String resource, String mrn) {
			return "//div[@class='row-label']/h1[text()='" + resource + "']/../..//div[@class='mrn'][text()='" + mrn + "']";
		}
		
		private WebElement getResourceWebElementInOverview(String resource) {
			return UITestUtils.getWebElementByXpath(getResourceXpathInOverview(resource));
		}
		
		private By getResourceExamCardCountLocator(String resource) {
			return UITestUtils.getLocatorByXpath(getResourceExamCardCountXpath(resource));
		}
		
		private WebElement getSearchForMRNNumberInExamCardWebElement(String resource, String mrn) {
			return UITestUtils.getWebElementByXpath(getSearchForMRNNumberInExamCardXpath(resource, mrn));
		}
		
		public boolean verifyResourceInRows(String resource) throws InterruptedException {
				UITestUtils.waitForElementToLoad(getResourceWebElementInOverview(resource), resource);
				return UITestUtils.verifyIsElementDisplayed(getResourceWebElementInOverview(resource), resource);					
		}
		
	
		/**
		 * Get the current count of exam cards for particular resource
		 */
		public int examCardCountForTheResource(String resource) {
			List<WebElement> resourceExamCardList = driver.findElements(getResourceExamCardCountLocator(resource));
			return resourceExamCardList.size();
		}
		
		public boolean verifyMrnExamCardDispalyedInOverview(String resource, String mrn) {
			UITestUtils.sleep(10);
			return UITestUtils.verifyIsElementDisplayed(getSearchForMRNNumberInExamCardWebElement(resource, mrn), "Verified that ingested record is available in Exam Card for particular resource");
		}
		
		public void selectMRNOnExamCardInOverview(String resource, String mrn) {
			UITestUtils.clickLink_JavaScript(getSearchForMRNNumberInExamCardWebElement(resource, mrn),"selects Exam for particular resource" + resource);
		}

}
