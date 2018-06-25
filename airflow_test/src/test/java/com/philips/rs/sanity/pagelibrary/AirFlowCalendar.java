package com.philips.rs.sanity.pagelibrary;

import java.util.List;

import org.openqa.selenium.By;

import com.philips.rs.utils.UITestUtils;

public class AirFlowCalendar extends UITestUtils {
	public By grupuNameDropDown= By.xpath("//button[@class='btn btn-default btn-sm dropdown-toggle']");
	public By examcard = By.xpath("//div[@class='left-tab']");
	public By examcardClose =By.xpath("//span[text()='×']");
	public static By kioskNumber = By.xpath("//div[@class='modal-header']//h5");
	public By resource(String resource )
	{
		return By.xpath("//h1[text()='"+resource+"']");
	}
	public By GroupName(String groupName)
	{
		return By.xpath("//a[text()='"+groupName+"']");
		
	}
	
	public List examCardsCount(By element)
	{
		return driver.findElements(element);
	}
	public  String kioskNumber()
	{
		String[]  kioskNumber1 = retrieveText(kioskNumber,"kioskNumber").split(" ");
		return kioskNumber1[kioskNumber1.length-1];
	}
}
