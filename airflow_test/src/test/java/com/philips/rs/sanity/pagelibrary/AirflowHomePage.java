package com.philips.rs.sanity.pagelibrary;

import org.openqa.selenium.By;

import com.philips.rs.utils.UITestUtils;

public class AirflowHomePage extends UITestUtils {
	
	public By tabElementXPath(String tabName){
		return By.xpath("//a[contains(text(),'"+tabName+"')]");
	}
	
	/**
	 * @author Aditya Pare
	 * Click on main menu
	 * @param tabName
	 * @throws Exception
	 */
	public void clickOnMenuTab(String tabName) throws Exception {
		clickLink(tabElementXPath(tabName), tabName);
	}
	
	

}
