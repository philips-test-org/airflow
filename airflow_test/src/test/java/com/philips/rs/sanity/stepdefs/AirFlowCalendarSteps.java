package com.philips.rs.sanity.stepdefs;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;

import com.philips.rs.sanity.pagelibrary.AirFlowCalendar;

import cucumber.api.java.en.Then;
import junit.framework.Assert;

public class AirFlowCalendarSteps extends AirFlowCalendar{
   public static int totalExamCards;
   
   AirflowHomePageSteps aiMainPage =new AirflowHomePageSteps();
	@Then("^Verify the \"([^\"]*)\" with Resource \"([^\"]*)\" is displayed$")
	public void verify_the_with_Resource_is_displayed(String groupName, String resource) throws Throwable {
	    // Write code here that turns the phrase above into concrete actions
	    clickLink(grupuNameDropDown, "grupuName");
	    clickLinkNew(GroupName(groupName), "grupuName");
	    Assert.assertEquals(true,isElementDisplayed(resource(resource), resource));
	    
	}
	
	
	
	@Then("^gets the order number ,procedure and accession number from the exam card  \"([^\"]*)\"$")
	public void gets_the_order_number_procedure_and_accession_number_from_the_exam_card(String arg1) throws Throwable {
	    // Write code here that turns the phrase above into concrete actions
		clickLink(examcard, "examcard");
		AirflowKioskSteps.kioskNumber=kioskNumber();
		logger.info("kioskNumber is "+kioskNumber());
		clickLink(examcardClose, "examcardClose");
	}
	
	@Then("^user schedules per day are same in overVeiw and Calender$")
	public void user_schedules_per_day_are_same_in_overVeiw_and_Calender() throws Throwable {
	    // Write code here that turns the phrase above into concrete actions
		waitForElementToLoad(examcard, "examcard");
		totalExamCards=examCardsCount(examcard).size();
		logger.info("Number of exam cards are " +totalExamCards);
		aiMainPage.user_clicks_on_tab("Calendar");
		logger.info("Number of exam cards are " +examCardsCount(examcard).size());
		Assert.assertEquals(totalExamCards, examCardsCount(examcard).size());
		
	}
	@Then("^Drag and Drops exam card \"([^\"]*)\" between Device \"([^\"]*)\"  to \"([^\"]*)\"$")
	public void drag_and_Drops_exam_card_between_Device_to(String arg1, String arg2, String arg3) throws Throwable {
		//DragnDrop(driver.findElement(By.xpath("//div[@class='notecard scaled completed  ui-draggable ui-draggable-handle']")), driver.findElement(By.xpath("//td[@data-resource-id='4']//div[@class='row-marker']")), "DragNDrop");
		//DragnDrop(driver.findElement(By.xpath("//div[@class='notecard scaled completed  ui-draggable ui-draggable-handle']")), driver.findElement(By.xpath("//td[@data-resource-id='4']//div[@class='row-marker']")), "DragNDrop");
		
		By from=By.xpath("//table[@id='time-grid']/tbody/tr/td[2]/div[2]");
		By to=By.xpath("//table[@id='time-grid']/tbody/tr/td[5]/div/div[1]");
		sleep(10);
		dragNDrop(from, to, "Drag N Drop");
		
		/*System.out.println(driver.findElement(from).getLocation());
		 System.out.println(driver.findElement(to).getLocation());
		 Actions builder = new Actions(driver);
		 WebElement From=driver.findElement(examcard);
		 WebElement To=driver.findElement(to);
		 for (int i = 0; i < 20; i++) {
			builder.dragAndDropBy(From, driver.findElement(to).getLocation().x, driver.findElement(to).getLocation().y)
					.build().perform();
			builder.clickAndHold(From).moveToElement(To).release(To).build();
			builder.perform();
			System.out.println(driver.findElement(from).getLocation());
			 System.out.println(driver.findElement(to).getLocation());
			 builder.clickAndHold(From).dragAndDropBy(From, driver.findElement(from).getLocation().x,driver.findElement(from).getLocation().y).build().perform();
			 
		 }
		builder.clickAndHold(From).dragAndDropBy(From, driver.findElement(from).getLocation().x,driver.findElement(from).getLocation().y).build().perform();
		  *///dragAndDrop.perform();
	}
}
