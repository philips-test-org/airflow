package ui.test.java;

//import java.io.File;
//import java.util.List;
//import java.util.UUID;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
//import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
//import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

//import com.philips.rs.utils.BackendApiTestUtils;
import com.philips.rs.utils.UITestUtils;
//import com.philips.rs.utils.customException;

//import cucumber.api.java.en.And;
//import cucumber.api.java.en.Given;
//import cucumber.api.java.en.Then;

public class AirFlow extends UITestUtils{
	
	public static final By productivitytag = By.xpath("//div[@class='navbar-header']/a[text()='| Productivity']");
	public static final By selectmetricdropdown = By.xpath("//div[@class='modal-body']//select[@class='form-control']");
	public static final By selectfilterdropdown = By.xpath("//div[@class='input-group-btn']//span[@class='title']");
	public static final By addmetricconfirmation = By.xpath("//div[@class='modal-footer']/button[text()='Add Metric']");
	public static final By editmetricconfirmation = By.xpath("//div[@class='modal-footer']/button[text()='Save Metric']");
	public static final By enterKPIName = By.xpath("//input[@id='view-title']");
	public static final By errormessage = By.xpath("//div[@id='notification-message-0']/h4[text()='error']");
	public static final By savebutton = By.xpath("//button[@id='save-button']");
	public static final By addmetric = By.xpath("//span[@class='add-metric']");
	public static final By selectgroupingdropdown = By.xpath("//select[@id='select-topic']");
	public static final By resetbutton = By.xpath("//a[@id='reset-button']");
	public static final By viewSavedKPIs = By.xpath("//h4[@class='panel-title'][contains(text(),'KPIs')]");
	public static final By export_button = By.xpath("//button[@id='export-button']");
	public static final By save_as_button = By.xpath("//button[@id='save-as-button']"); 
	public static final By close_button = By.xpath("//button[text()='Close']");
	public static final By confirm_save = By.xpath("//button[@id='confirm_save']");
	public static final By date_time = By.xpath("//h4[@class='panel-title'][contains(text(),'Date/Time')]");	
	public static final By fixed = By.xpath("//a[@data='fixed']");
	public static final By start_date = By.xpath("//label[text()='Start Date']/../input[@class='form-control datetimepicker']");
	public static final By stop_date = By.xpath("//label[text()='Stop Date']/../input[@class='form-control datetimepicker']");
	public static final By Apply = By.xpath("//button[text()='Apply']");
	public static final By autopreview = By.xpath("//label[text()='Autopreview']/../..");
	public static final By Filters = By.xpath("//div[@class='filter-pane-group panel-group']/div");
	public static final By performanceAlertContinue = By.xpath("//button[@id='override-performance']");
	public static final By smartFilter = By.xpath("//label[contains(text(),'Smart')]/../..");
	public static final By Admin = By.xpath("//a[text()='Admin']");
	public static final By GlobalAdmin = By.xpath("//a[text()='Global Admin']");
	public static final By GroupingHeader = By.xpath("//table[@id='productivity-table']/thead/tr/th[1]/div");
	public static final By exportDataToProductivity = By.xpath("//button[@data-export-to='productivity']");
	Actions actions = new Actions(driver);
	WebDriverWait wait = new WebDriverWait(driver, 50);
	
	
	public boolean verifyproductivitytagIsDisplayed() {
		boolean status = false;
		try {
			Assert.assertTrue(isElementDisplayed(productivitytag, "productivity"));
			status = true;
		} catch (AssertionError error) {
			status = false;
		}
		return status;
	}
	
	public boolean verifyerrormessageDisplayed() {
		boolean status = false;
		try {
			Assert.assertTrue(isElementDisplayed(errormessage, "error message"));
			status = true;
		} catch (AssertionError error) {
			status = false;
		}
		return status;
	}
		
	public void AddNewColumn(String MetricName) throws Throwable 
	{
		clickLink(addmetric, "Add New Metric");
		clickLink(selectmetricdropdown, "Select Metric Dropdown");
		clickLink(selectMetricByXpath(MetricName), MetricName);				
		clickLink(addmetricconfirmation, "Add Metric Confirmation");
		sleep(1);
		Assert.assertTrue(driver.findElement(getColumnByXpath(MetricName)).isDisplayed());	
		logger.info("PASS :'"+MetricName+"' Column is added");
	}
	
	public void EditColumn(String oldMetricName,String newMetricName) throws Throwable
	{
		actions.moveToElement(driver.findElement(getColumnByXpath(oldMetricName)));
		actions.moveToElement(driver.findElement(getEditButton(oldMetricName)));
		actions.click().build().perform();
		logger.info("PASS :Clicked on 'Edit Column'");
		clickLink(selectmetricdropdown, "Select Metric Dropdown");
		clickLink(selectMetricByXpath(newMetricName), newMetricName);						
		clickLink(editmetricconfirmation, "Save Metric");
		sleep(1);
		Assert.assertTrue(driver.findElement(getColumnByXpath(newMetricName)).isDisplayed());
		logger.info("PASS :'"+oldMetricName+"' Column is edited to '"+newMetricName+"'");
		
	}
	
	public void DeleteColumn(String metricName) throws Throwable {
		
		actions.moveToElement(driver.findElement(getColumnByXpath(metricName)));		
		actions.moveToElement(driver.findElement(getDeleteButton(metricName)));
		actions.click().build().perform();
		logger.info("PASS :Clicked on 'Delete Column'");
		Assert.assertFalse(isElementDisplayed(getColumnByXpath(metricName), metricName));
		logger.info("PASS :'"+metricName+"' Column is deleted");		
	}
	
	public void jumpToQuality(String ColumnName) throws Throwable
	{
		clickLink(getJumpToQualityByXpath(ColumnName), "Show " +ColumnName + " in Quality");
		handlePerformanceWarning();
		Assert.assertTrue(isElementDisplayed(getKpiHeadingForVerification(ColumnName), ColumnName));
		logger.info("PASS :'"+ ColumnName + "' Metric is displayed in Quality");
		clickLink(exportDataToProductivity, "Back to Productivity");
		
	}
	
	public void ClickSaveBeforeEnteringName() throws Throwable {
		sleep(2);
		clickLink(savebutton, "Save Button");
		sleep(2);
		Assert.assertTrue(verifyerrormessageDisplayed());
		logger.info("PASS :Error message displayed when trying to save KPI without entering name");
	}
	
	public void ClickSaveAfterEnteringName(String kpiname) throws Throwable {
		sleep(2);
		clearAndInput(enterKPIName, "KPI Name", kpiname);		
		sleep(2);
		clickLink(savebutton, "Save button");
		wait.until(ExpectedConditions.visibilityOfElementLocated(getXpathOfSuccessMessage()));
		clickLink(viewSavedKPIs, "View Saved KPIs");
		sleep(2);
		Assert.assertTrue(verifykpiisDisplayed(kpiname));
		logger.info("PASS: KPI "+kpiname+" is saved");
		clickLink(viewSavedKPIs, "View Saved KPIs - Close");	
	}
	
	public void ClickSaveAsBeforeEnteringName() throws Throwable
	{
		sleep(2);
		clickLink(save_as_button, "Save As Button");
		sleep(2);
		//Assert.assertTrue(verify_save_as_name_field_blank());
		//logger.info("SAVE AS WITHOUT ENTERING NAME : PASS");
		clickLink(confirm_save, "Save");
		sleep(2);
		clickLink(close_button, "close button");
		//sleep(2);
		Assert.assertTrue(verifyerrormessageDisplayed());
		logger.info("PASS :Error message displayed when trying to save KPI without entering name");
		sleep(5);
	}
	
	public void ClickSaveAsAfterEnteringName(String kpiname) throws Throwable {
	    clearAndInput(enterKPIName, "KPI Name", kpiname);
	    sleep(2);
	    clickLink(save_as_button, "Save As Button");
	    sleep(2);
	    //Assert.assertTrue(verify_save_as_name_field(kpiname));
	    //logger.info("SAVE AS AFTER ENTERING NAME : PASS");
	    clickLink(confirm_save, "Confirm Save");
		sleep(2);
		wait.until(ExpectedConditions.visibilityOfElementLocated(getXpathOfSuccessMessage()));
		//clickLink(close_button, "close button");
		sleep(2);		
	    clickLink(viewSavedKPIs, "View Saved KPIs");
		sleep(2);
		Assert.assertTrue(verifykpiisDisplayed("Copy of "+kpiname));
		logger.info("PASS :KPI 'Copy of "+kpiname+"'"+" is saved");
	    clickLink(viewSavedKPIs, "View Saved KPIs - Close");
	}
	
	
	public void ExportToLocal(String name) throws Throwable
	{
		sleep(2);
		clickLink(viewSavedKPIs, "View Saved KPIs");
		sleep(2);
		By kpiname = By.xpath("//span[contains(text(),'"+name+"')]");		
		clickLink(kpiname, name);
		sleep(2);
		clickLink(export_button, "Export Button");
		sleep(5);
		
	}
	
	public void deleteKPIFromSavedView(String KPIName) throws Throwable
	{
		sleep(2);
		clickLink(viewSavedKPIs, "View Saved KPIs");
		sleep(2);
		clickLink(By.xpath("//span[@class='title' and contains(text(),'"+KPIName+"')]/../../a/i"), "Delete Button");
		sleep(2);
		clickLink(By.xpath("//div[@class='popover fade right in']/div[2]/div/div/button[text()='Yes']"), "Delete Confirmation Button");
		sleep(2);
		Assert.assertFalse(verifykpiisDisplayed(KPIName));
		logger.info("PASS :KPI '"+KPIName+"' has been deleted");
		clickLink(viewSavedKPIs, "View Saved KPIs - Close");
	}
	
	public boolean verifykpiisDisplayed(String kpiname) {
		boolean status = false;
		By element = By.xpath("//span[contains(text(),'"+kpiname+"')]");
		try {
			Assert.assertTrue(isElementDisplayed(element, kpiname + "is displayed"));
			status = true;
		} catch (AssertionError error) {
			status = false;
		}
		return status;
	}
	
	public void clickOnGrouping(String GroupingName) throws Throwable
	{
		clickLink(getGroupingByXpath(GroupingName), GroupingName+" Grouping");	
	}
	
	public void verifyGrouping(String GroupingName) throws Throwable
	{
		Assert.assertTrue(driver.findElement(GroupingHeader).getText().contains(GroupingName));
		logger.info("PASS :'" + GroupingName+ "' Grouping has been applied");		
	}
	
	public void verifyGroupingWhenAutopreviewOff(String oldGroupingName, String newGroupingName) throws Throwable
	{		
		Assert.assertTrue(driver.findElement(GroupingHeader).getText().contains(oldGroupingName));
		logger.info("PASS :'" + newGroupingName+ "' Grouping has not been applied since AutoPreview is Off");		
	}
	
	public void ResetFilters() throws Throwable
	{
		sleep(1);
		clickLink(resetbutton, "Reset Button");
	}
	
	public void turnOffSmartFilter() throws Throwable
	{
		if(driver.findElement(smartFilter).getAttribute("Class").equals("toggle btn btn-success btn-xs"))
		{
			clickLink(smartFilter, "Turn Off Smart Filter");
		}
	}
	
	public void turnOffAutoPreview() throws Throwable
	{
		if(driver.findElement(autopreview).getAttribute("Class").equals("toggle btn btn-success btn-xs")||driver.findElement(autopreview).getAttribute("Class").equals("toggle btn btn-xs btn-success"))
		{
			clickLink(autopreview, "Turn Off Autopreview");
		}
		logger.info("PASS :AutoPreview is Off");
	}
	
	public void turnOnAutoPreview() throws Throwable
	{
		if(driver.findElement(autopreview).getAttribute("Class").equals("toggle btn btn-danger off btn-xs")||driver.findElement(autopreview).getAttribute("Class").equals("toggle btn btn-xs btn-danger off"))
		{
			clickLink(autopreview, "Turn On Autopreview");
		}
		logger.info("PASS :AutoPreview is ON");
	}
	
	
	public void scrolltoFilterandClick(String FilterName) throws Throwable
	{
		if(!isElementDisplayed(getFilterByXpath(FilterName), FilterName))
		{
			((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(getFilterByXpath(FilterName)));
			sleep(1);
		}
		sleep(1);
		clickLink(getFilterByXpath(FilterName),FilterName +" Filter");
		sleep(1);	
	}
	
	public void scrolltoSubFilterandClick(String FilterName, String SubfilterName) throws Throwable
	{
		if(!isElementDisplayed((getSubFilterByXpath(FilterName, SubfilterName)), SubfilterName))
		{
			sleep(1);
			((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(getSubFilterByXpath(FilterName, SubfilterName)));					
		}
		clickLink(getSubFilterByXpath(FilterName, SubfilterName), SubfilterName +" SubFilter");
		sleep(1);
	}
	
	public void verifyIfSelectedFilterisWorking(String FilterName)
	{
		Assert.assertTrue(isElementDisplayed(getXpathOfFilterHeadingForVerification(FilterName), FilterName));	
		logger.info("PASS :'"+FilterName+"' Filter has been applied");	
	}
	
	public void checkIfDrillDownMessageIsDisplayed(String FilterName)
	{
		if(!driver.findElement(getDrillDownMessageXpath(FilterName)).isDisplayed())
		{
			((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", driver.findElement(getFilterByXpath("Technologist")));
		}		
		Assert.assertTrue(driver.findElement(By.xpath("//div[@class='drilled-explanation'][contains(text(),'"+FilterName+"')]")).isDisplayed());
		logger.info("PASS :Drill Down message for filter '"+FilterName+ "' is displayed");
	}

	
	public void handlePerformanceWarning() throws Throwable
	{
		sleep(2);
		if(isElementDisplayed(performanceAlertContinue, ""))
		{			
			clickLink(performanceAlertContinue, "Performance Warning Pop Up");
		}
		sleep(2);
	}
	
	public By getXpathOfSuccessMessage()
	{
		return By.xpath("//div[@class='alert alert-success']");
	}
	
	public By getXpathOfFilterHeadingForVerification(String FilterName)
	{
		return By.xpath("//strong[text()='"+FilterName+":']");
	}
	
	public By getDrillDownMessageXpath(String FilterName)
	{
		return By.xpath("//h4[@class='panel-title'][contains(text(),'Site')]/../../div[2]/div[@class='panel-body']");
	}

	public By getKpiHeadingForVerification (String ColumnName)
	{
		return By.xpath("//strong[text()='"+ColumnName+"']");
	}
	
	public By getEditButton(String ColumnName)
	{
		return By.xpath("//th[contains(@aria-label,'"+ColumnName+"')]/div/span[@class='header-action edit-header']/i");
	}
	
	public By getJumpToQualityByXpath(String ColumnName)
	{
		return By.xpath("//th[contains(@aria-label,'"+ColumnName+"')]/div/span[@class='testing header-transfer-button']");
	}
	
	public By getDeleteButton(String ColumnName)
	{
		return By.xpath("//th[contains(@aria-label,'"+ColumnName+"')]/div/span[@class='header-action delete-header']/i");
	}
	
	public By getFilterByXpath(String name)
	{
		return By.xpath("//h4[@class='panel-title'][contains(text(),'"+name+"')]");
	}
	
	public By getSubFilterByXpath(String name,String subname)
	{
		return By.xpath("//h4[@class='panel-title'][contains(text(),'"+name+"')]/../../div[2]/div/div/div/div[@class='results margin-top-sm']/table/tbody/tr/td/div[text()='"+subname+"']");
	}
	
	public By selectMetricByXpath(String metrictype) throws Throwable {
		return By.xpath("//div[@class='modal-body']//select[@class='form-control']/option[text()='"+metrictype+"']");
	}
	
	public By getGroupingByXpath(String groupingName) throws Throwable {
		return By.xpath("//select[@id='select-topic']//option[text()='"+groupingName+"']");
	}
	
	public By getSubGroupingByXpath(String subGroupingName) throws Throwable {
		return By.xpath("//td[@class='grouping'][text()='"+subGroupingName+"']");
	}
	
	public By getDrillDownByXpath(String drillDownName) throws Throwable {
		return By.xpath("//button[text()='"+drillDownName+"']");
	}
	
	public By getColumnByXpath(String MetricName)
	{
		return By.xpath("//th[contains(@aria-label,'"+MetricName+"')]");
	}


}
