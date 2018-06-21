package com.philips.rs.sanity.pagelibrary;

import org.junit.Assert;
import org.openqa.selenium.By;

import com.philips.rs.utils.UITestUtils;

public class AirflowKiosk extends UITestUtils {
	
	public By kioskNumber(String kioskNumber)
	{
	return By.xpath("//div[text()='"+kioskNumber+"']");
	}
}


