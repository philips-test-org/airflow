package com.philips.airflow.sanity.stepdefs;

import com.philips.airflow.sanity.pagelibrary.AirFlowCalendar;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class AirFlowCalendarSteps extends AirFlowCalendar {

	AirflowKioskSteps airflowKioskSteps = new AirflowKioskSteps();

	@Then("^Verify the \"([^\"]*)\" with Resource \"([^\"]*)\" is displayed$")
	public void verify_the_with_Resource_is_displayed(String groupName, String resource) throws Throwable {
		selectResource(groupName, resource);
	}

	/**
	 * The below method is getting the token/kiosk number from the exam card modal pop up
	 */
	@Given("^gets the token number from exam card$")
	public void gets_the_token_number_from_exam_card() throws Throwable {
		airflowKioskSteps.getKioskNumber();
	}

	@Then("^user schedules per day are same in overVeiw and Calender$")
	public void user_schedules_per_day_are_same_in_overVeiw_and_Calender() throws Throwable {
		getCountForExamCardsFromOverviewAndCalendar();
	}

	@Then("^user selects \"([^\"]*)\" from Resource Group filter$")
	public void user_selects_from_Resource_Group_filter(String GroupName) throws Throwable {
		clickLink(groupNameDropDown, randomGroupName);
		clickLink(GroupName(randomGroupName), randomGroupName);
		sleep(10);
	}

	@Given("^user clicks on \"([^\"]*)\" tab$")
	public void user_clicks_on_tab(String tabName) throws Throwable {
		clickOnMenuTab(tabName);
	}

//	@Then("^user clicks on \"([^\"]*)\"$")
//	public void user_clicks_on(String Element) throws Throwable {
//		if (Element.equals(Element)) {
//			clickLink(By.xpath("//span[@class='group-name']"), Element);
//		} else {
//			clickLink(By.id("legend-button"), Element);
//		}
//	}

	// @Then("^Drag and Drops exam card \"([^\"]*)\" between Device \"([^\"]*)\"
	// to \"([^\"]*)\"$")
	// public void drag_and_Drops_exam_card_between_Device_to(String arg1,
	// String arg2, String arg3) throws Throwable {
	// //DragnDrop(driver.findElement(By.xpath("//div[@class='notecard scaled
	// completed ui-draggable ui-draggable-handle']")),
	// driver.findElement(By.xpath("//td[@data-resource-id='4']//div[@class='row-marker']")),
	// "DragNDrop");
	// //DragnDrop(driver.findElement(By.xpath("//div[@class='notecard scaled
	// completed ui-draggable ui-draggable-handle']")),
	// driver.findElement(By.xpath("//td[@data-resource-id='4']//div[@class='row-marker']")),
	// "DragNDrop");
	//
	// By from=By.xpath("//table[@id='time-grid']/tbody/tr/td[2]/div[2]");
	// By to=By.xpath("//table[@id='time-grid']/tbody/tr/td[5]/div/div[1]");
	// sleep(10);
	// dragNDrop(from, to, "Drag N Drop");
	//
	// /*System.out.println(driver.findElement(from).getLocation());
	// System.out.println(driver.findElement(to).getLocation());
	// Actions builder = new Actions(driver);
	// WebElement From=driver.findElement(examcard);
	// WebElement To=driver.findElement(to);
	// for (int i = 0; i < 20; i++) {
	// builder.dragAndDropBy(From, driver.findElement(to).getLocation().x,
	// driver.findElement(to).getLocation().y)
	// .build().perform();
	// builder.clickAndHold(From).moveToElement(To).release(To).build();
	// builder.perform();
	// System.out.println(driver.findElement(from).getLocation());
	// System.out.println(driver.findElement(to).getLocation());
	// builder.clickAndHold(From).dragAndDropBy(From,
	// driver.findElement(from).getLocation().x,driver.findElement(from).getLocation().y).build().perform();
	//
	// }
	// builder.clickAndHold(From).dragAndDropBy(From,
	// driver.findElement(from).getLocation().x,driver.findElement(from).getLocation().y).build().perform();
	// *///dragAndDrop.perform();
	// }
}
