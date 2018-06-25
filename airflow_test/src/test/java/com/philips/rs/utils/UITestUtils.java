package com.philips.rs.utils;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Properties;
import java.util.Random;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Function;

public class UITestUtils {

	//public static Properties CONFIG;
	public static final Logger logger = Logger.getLogger(UITestUtils.class);
	public static Properties CONFIG;
	RSLogger rslogger = new RSLogger();
	public static WebDriver driver = null;
	public static String browser = BackendApiTestUtils.readPropertyFile("/application.properties", "Browser");
	public static String url = BackendApiTestUtils.readPropertyFile("/application.properties", "sisenseURL");
 
    
	public static final By reset_icon = By.xpath("//img[@src='assets/images/reset-icon.svg']");
    public static String buildVersionFromFrontEnd;
    public static final By about = By.xpath("//li[text()='About']");
    public static final By buildVer = By.xpath("//div[@class='build']");
    public static final By closeButton = By.xpath("//div[@class='modal-header']/img");
    public static By userArrowDown = By.xpath("//img[@src='assets/images/arrow-down.svg']");


	public  UITestUtils() {
		try {
			
			if (driver == null) {
				driver = WebDriverFactory.createDriver(browser);
				
				//sleep(3);
				if (browser.equals("IE_LOCAL")) {
					//driver.get(url);
					/*driver.navigate()
							.to("javascript:document.getElementById('overridelink').click()");*/
			}
				driver.get(url);
			}
		}
		catch (InterruptedException e) {
			logger.error("ERROR while creating a webDriver for " + browser);
		} catch (IOException e) {
			logger.error("ERROR while creating a reading file");
		}
	}

	/*
	 * Reading value form property file
	 */
	public static String readPropertyFile(String fileName, String key) {
		CONFIG = new Properties();
		fileName = "src/test/resources" + fileName;
		try {
			InputStream inputStream = new FileInputStream(fileName);
			CONFIG.load(inputStream);
			
		} catch (IOException e) {
			logger.error("ERROR readin the properties file: " + fileName);
		}
		return CONFIG.getProperty(key);

	}
	

	
/*	public WebDriver getDriver() {
		return driver;
}*/
	// Generate random alphanumeric value depending on the length given as
    // paramater
    public static String randomAlphanumeric(int len) {
                    String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@$&()_-=~,";
                    Random rnd = new Random();
                    StringBuilder sb = new StringBuilder(len);
                    for (int i = 0; i < len; i++)
                                    sb.append(AB.charAt(rnd.nextInt(AB.length())));
                    return sb.toString();
    } 
	public void clearField(By locator, String elemName) {

		logger.debug("Clearing field : " + elemName);
		try {
			// Wait for the input-box to load on the page
			waitForElementToLoad(locator, elemName);

			// Clear the input-box
			driver.findElement(locator).clear();

			// Log result
			logger.info("PASS :Cleared : '" + elemName + "'");

		} catch (org.openqa.selenium.NoSuchElementException clearFieldException) {
			logger.error("Error while clearing - '" + elemName + "' : " + clearFieldException.getMessage());
			throw new RuntimeException(
					"Error while clearing - '" + elemName + "' : " + clearFieldException.getClass().getName());

}
}
	
	public void waitForPageLoad() {
	    Wait<WebDriver> wait = new WebDriverWait(driver, 60);
	    wait.until(new Function<WebDriver, Boolean>() {
	        public Boolean apply(WebDriver driver) {
	            System.out.println("Current Window State       : "
	                + String.valueOf(((JavascriptExecutor) driver).executeScript("return document.readyState")));
	            return String
	                .valueOf(((JavascriptExecutor) driver).executeScript("return document.readyState"))
	                .equals("complete");
	        }
	    });
	}

	
	public void clickEnter(By locator, String elemName)
	{
		logger.debug("Clicking on : " + elemName);
		try {
			// Wait for link to appear on the page
			waitForElementToLoad(locator, elemName);

			driver.findElement(locator).sendKeys(Keys.RETURN);
			
			// Log result
			logger.info("PASS :Clicked on : '" + elemName + "'");

		} catch (org.openqa.selenium.NoSuchElementException clickLinkException) {
			// Log error
			logger.error("Error while clicking on - '" + elemName + " " + clickLinkException.getMessage());
			throw new RuntimeException(
					"Error while clicking on - '" + elemName +" "+locator+ "' : " + clickLinkException.getClass().getName());

}
	}
	protected void clickLink(By locator, String elemName) throws InterruptedException {
		logger.debug("Clicking on : " + elemName);
		try {
			// Wait for link to appear on the page
			waitForElementToLoad(locator, elemName);

			JavascriptExecutor executor = (JavascriptExecutor) driver;
			executor.executeScript("arguments[0].click()", driver.findElement(locator));
			
			// Log result
			logger.info("PASS :Clicked on : '" + elemName + "'");

		} catch (org.openqa.selenium.NoSuchElementException clickLinkException) {
			// Log error
			logger.error("Error while clicking on - '" + elemName + " " + clickLinkException.getMessage());
			throw new RuntimeException(
					"Error while clicking on - '" + elemName +" "+locator+ "' : " + clickLinkException.getClass().getName());

}
	}

	protected void clickLinkNew(By locator, String elemName) {
		logger.debug("Clicking on : " + elemName);
		try {
			// Wait for link to appear on the page
			waitForElementToLoad(locator, elemName);

			driver.findElement(locator).click();

			// Log result
			logger.info("PASS :Clicked on : '" + elemName + "'");

		} catch (org.openqa.selenium.NoSuchElementException clickLinkException) {
			// Log error
			logger.error("Error while clicking on - '" + elemName + " " + clickLinkException.getMessage());

			throw new RuntimeException(
					"FAIL : Error while clicking on - '" + elemName + "' : " + clickLinkException.getClass().getName());
	}

	}
		public void clickLink_JavaScript(WebElement webelement, String elemName) {
			logger.debug("Clicking on : " + elemName);
		try {
				// Wait for link to appear on the page
				waitForWebElementToLoad(webelement, elemName);

				JavascriptExecutor executor = (JavascriptExecutor) driver;
				executor.executeScript("arguments[0].click()",
						webelement);

				// Log result
				logger.info("PASS :Clicked on : '" + elemName + "'");

			
			} catch (org.openqa.selenium.NoSuchElementException clickLinkException) {
				// Log error
				logger.error("Error while clicking on - '" + elemName+ " "
						+ clickLinkException.getMessage());

				throw new RuntimeException( "FAIL : Error while clicking on - '" + elemName + "' : "
						+ clickLinkException.getClass().getName());
			}

		}
	
		
	public void clickLinkUntillExpectedWebElementDisplayed(WebElement webelement,String elemName,By locator)
	{
		try
		{
		// Wait for link to appear on the page
		waitForWebElementToLoad(webelement, elemName);

		for(int i=1; i<=3;i++)
		{
		   System.out.println("Iteration click "+i);	
		   JavascriptExecutor executor = (JavascriptExecutor) driver;executor.executeScript("arguments[0].click()",webelement);
		   if(isElementDisplayed(locator, "ExpectedWebElement"))
		   {
			   logger.info("PASS: Found Expected webElement On the webpage");
			   break;
		   }
			   
		}
		// Log result
		logger.info("PASS :Clicked on : '" + elemName + "'");
		}
	
	 catch (org.openqa.selenium.NoSuchElementException clickLinkException) {
		// Log error
		logger.error("Error while clicking on - '" + elemName+ " "
				+ clickLinkException.getMessage());

		throw new RuntimeException( "FAIL : Error while clicking on - '" + elemName + "' : "
				+ clickLinkException.getClass().getName());
	}

	}
	
	public void clickLinkUntillExpectedElementDisplayed(By locator,
			String elemName, By expectedLocator) {
		try {
			// Wait for link to appear on the page
			waitForElementToLoad(locator, elemName);

			for (int i = 1; i <= 3; i++) {
				System.out.println("Iteration click " + i);
				driver.findElement(locator).click();
				/*JavascriptExecutor executor = (JavascriptExecutor) driver;
				executor.executeScript("arguments[0].click()",driver.findElement(locator));*/
				if (isElementDisplayed(expectedLocator, "ExpectedWebElement")) {
					logger.info("PASS: Found Expected webElement On the webpage");
					break;
				}

			}
			// Log result
			logger.info("PASS :Clicked on : '" + elemName + "'");
		}

		catch (org.openqa.selenium.NoSuchElementException clickLinkException) {
			// Log error
			logger.error("Error while clicking on - '" + elemName + " "
					+ clickLinkException.getMessage());

			throw new RuntimeException("FAIL : Error while clicking on - '"
					+ elemName + "' : "
					+ clickLinkException.getClass().getName());
		}

	}

	protected void clearAndInput(By locator, String elemName, String value) {
		try {
			// Wait for the input box to appear on the page
			waitForElementToLoad(locator, elemName);

			// Clear the input field before sending values
			clearField(locator, elemName);

			// Send values to the input box
			driver.findElement(locator).sendKeys(value);

			// Log result
			logger.info("PASS :Inputted " + value + " text into " + elemName);

		} catch (org.openqa.selenium.NoSuchElementException inputException) {

			// Log error
			logger.error("Error while inputting " + value + " into - '" + elemName + "'" + inputException.getMessage());

			throw new RuntimeException("Error while inputting " + value + " into - '" + elemName + "' "
					+ inputException.getClass().getName());

		}
	}
	protected void Input(By locator, String elemName, String value) {
		try {
			// Wait for the input box to appear on the page
			waitForElementToLoad(locator, elemName);

			// Clear the input field before sending values
			//clearField(locator, elemName);

			// Send values to the input box
			driver.findElement(locator).sendKeys(value);

			// Log result
			logger.info("PASS :Inputted " + value + " text into " + elemName);

		} catch (org.openqa.selenium.NoSuchElementException inputException) {

			// Log error
			logger.error("Error while inputting " + value + " into - '" + elemName + "'" + inputException.getMessage());

			throw new RuntimeException("Error while inputting " + value + " into - '" + elemName + "' "
					+ inputException.getClass().getName());

		}
		
	}

		
	@SuppressWarnings("deprecation")
	public void waitForTextToLoad(final By locator, String text) {

		logger.debug("Waiting for text to load on the page");
		try {

			// Waits for 30 seconds implicitly until expected condition is
			// matched
			Wait<WebDriver> wait = new WebDriverWait(driver, 30);

			wait.until(ExpectedConditions.textToBePresentInElement(locator, text));
			
			// Log result
			logger.info("Waiting ends ... " + text + " loaded on the page");
			
		} catch (Exception waitForElementException) {
			// Log error
			logger.error(
					"Error came while waiting for " + text + " to appear : " + waitForElementException.getMessage());

			throw new RuntimeException("Error came while waiting for " + text + " to appear : "
					+ waitForElementException.getClass().getName());
		}

	}

	public static void waitForElementToLoad(final By locator, String element) {

		logger.debug("Waiting for web element to load on the page");
		try {

			// Waits for 60 seconds implicitly until expected condition is
			// matched
			Wait<WebDriver> wait = new WebDriverWait(driver, WebDriverFactory.TIMEOUT1);

			wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
			
			// Log result
			//logger.info("PASS: Web element '"+element+"' loaded on the page");

		} catch (Exception waitForElementException) {
			// Log error
			logger.error("FAIL: Error came while waiting for element to appear : "
					+ element + " " + waitForElementException.getMessage());
			
			throw new RuntimeException(
					"FAIL: Error came while waiting for element to appear : "
							+ element + " "
					+ waitForElementException.getClass().getName());

		}

	}
	
	public void waitForWebElementToLoad(final WebElement webElement, String element) {

		try {

			// Waits for 60 seconds implicitly until expected condition is
			// matched
			Wait<WebDriver> wait = new WebDriverWait(driver, 60);

			wait.until(ExpectedConditions.visibilityOf(webElement));

			// Log result
			logger.info("PASS: Waiting ends ... Web element loaded on the page");

		} catch (org.openqa.selenium.InvalidElementStateException waitForElementException) {
			// Log error
			logger.error("FAIL: Error came while waiting for element to appear : " + element + " "
					+ waitForElementException.getMessage());

			throw new RuntimeException("FAIL: Error came while waiting for element to appear : " + element + " "
					+ waitForElementException.getClass().getName());

		}

	}
	
	public void mouseHoverOnElement(WebElement webElement, String elemName) {
		try {
			// Wait for web element to load
			waitForWebElementToLoad(webElement, elemName);

			// Mousehover on the webElement
			Actions action = new Actions(driver);
			action.moveToElement(webElement).perform();
			
			// Log result
			logger.info("PASS :Mousehoverd on '" + elemName + "'");

		} catch (Exception mouseHoverException) {
			logger.error(
					"Error came while Mousehovering on element : " + elemName + " " + mouseHoverException.getMessage());

			throw new RuntimeException("Error came while Mousehovering on element : " + elemName + " "
					+ mouseHoverException.getClass().getName());
		}
	}
//	public void DragnDrop(WebElement from, WebElement to,String elemName) {
//		try {
//			// Wait for web element to load
//			waitForWebElementToLoad(from, "From");
//			waitForWebElementToLoad(to, "To");
//			// Mousehover on the webElement
//			Actions action = new Actions(driver);
//			logger.info(to.getLocation());
//			logger.info(from.getLocation());
//			//action.clickAndHold().moveToElement(to, 0, 242).pause(10).perform();
//			mouseHoverOnElement(to, "toelemName");
//			mouseHoverOnElement(from, "toelemName");
//			action.clickAndHold().moveToElement(to, 95, 213).perform();
//			mouseHoverOnElement(from, "toelemName");
//			action.dragAndDropBy(from, 95, 213);
//			 String xto=Integer.toString(from.getLocation().x);
//			    String yto=Integer.toString(to.getLocation().y);
//			   /* ((JavascriptExecutor)driver).executeScript("function simulate(f,c,d,e){var b,a=null;for(b in eventMatchers)if(eventMatchers[b].test(c)){a=b;break}if(!a)return!1;document.createEvent?(b=document.createEvent(a),a==\"HTMLEvents\"?b.initEvent(c,!0,!0):b.initMouseEvent(c,!0,!0,document.defaultView,0,d,e,d,e,!1,!1,!1,!1,0,null),f.dispatchEvent(b)):(a=document.createEventObject(),a.detail=0,a.screenX=d,a.screenY=e,a.clientX=d,a.clientY=e,a.ctrlKey=!1,a.altKey=!1,a.shiftKey=!1,a.metaKey=!1,a.button=1,f.fireEvent(\"on\"+c,a));return!0} var eventMatchers={HTMLEvents:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvents:/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/}; " +
//			    "simulate(arguments[0],\"mousedown\",0,0); simulate(arguments[0],\"mousemove\",arguments[1],arguments[2]); simulate(arguments[0],\"mouseup\",arguments[1],arguments[2]); ",
//			    from,xto,yto);*/
//			action.dragAndDrop(from, to).perform();
//			// Log result
//			logger.info("PASS :DragnDrop on '" + elemName + "'");
//
//		} catch (Exception mouseHoverException) {
//			logger.error(
//					"Error came while DragnDrop on element : " + elemName + " " + mouseHoverException.getMessage());
//
//			throw new RuntimeException("Error came while DragnDrop on element : " + elemName + " "
//					+ mouseHoverException.getClass().getName());
//		}
//	}

	public void dragNDrop(By locatorFrom, By locatorTo, String elemName) {

		try {
			// convert By locator into WebElement.
			WebElement from = driver.findElement(locatorFrom);
			WebElement to = driver.findElement(locatorTo);

			// Wait for web element to load
			//waitForWebElementToLoad(from, "From");
			//waitForWebElementToLoad(to, "To");

			// Mousehover on the webElement
			Actions action = new Actions(driver);
			// Action act = action.clickAndHold(from).moveToElement(to).release(to).build();
			// act.perform();
			action.dragAndDrop(from, to).build().perform();

			// logger.info(to.getLocation());
			// logger.info(from.getLocation());
			// action.clickAndHold().moveToElement(to, 0, 242).pause(10).build().perform();
			// mouseHoverOnElement(to, "toelemName");
			// mouseHoverOnElement(from, "toelemName");
			// action.clickAndHold().moveToElement(to, 95, 213).perform();
			// mouseHoverOnElement(from, "toelemName");
			// action.dragAndDropBy(from, 95, 213);
			// String xto=Integer.toString(from.getLocation().x);
			// String yto=Integer.toString(to.getLocation().y);
			/*
			 * ((JavascriptExecutor)driver).
			 * executeScript("function simulate(f,c,d,e){var b,a=null;for(b in eventMatchers)if(eventMatchers[b].test(c)){a=b;break}if(!a)return!1;document.createEvent?(b=document.createEvent(a),a==\"HTMLEvents\"?b.initEvent(c,!0,!0):b.initMouseEvent(c,!0,!0,document.defaultView,0,d,e,d,e,!1,!1,!1,!1,0,null),f.dispatchEvent(b)):(a=document.createEventObject(),a.detail=0,a.screenX=d,a.screenY=e,a.clientX=d,a.clientY=e,a.ctrlKey=!1,a.altKey=!1,a.shiftKey=!1,a.metaKey=!1,a.button=1,f.fireEvent(\"on\"+c,a));return!0} var eventMatchers={HTMLEvents:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvents:/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/}; "
			 * +
			 * "simulate(arguments[0],\"mousedown\",0,0); simulate(arguments[0],\"mousemove\",arguments[1],arguments[2]); simulate(arguments[0],\"mouseup\",arguments[1],arguments[2]); "
			 * , from,xto,yto);
			 */
			// action.dragAndDrop(from, to).perform();
			// Log result
			logger.info("PASS :DragnDrop on '" + elemName + "'");

		} catch (Exception dragAndDropException) {
			logger.error(
					"Error came while DragnDrop on element : " + elemName + " " + dragAndDropException.getMessage());

			throw new RuntimeException("Error came while DragnDrop on element : " + elemName + " "
					+ dragAndDropException.getClass().getName());
		}
	}
	
	public void mouseHoverOnWebElemet(By locator, String elemName) {
		try {
			// Wait for web element to load
			waitForElementToLoad(locator, elemName);

			// Mousehover on the webElement
			Actions action = new Actions(driver);
			action.moveToElement(driver.findElement(locator)).perform();

			// Log result
			logger.info("PASS :Mousehoverd on '" + elemName + "'");

		} catch (Exception mouseHoverException) {
			logger.error(
					"Error came while Mousehovering on element : " + elemName + " " + mouseHoverException.getMessage());

			throw new RuntimeException("Error came while Mousehovering on element : " + elemName + " "
					+ mouseHoverException.getClass().getName());
		} 
	}
	
	public void mouseHoverJScript(By locator) {
		try {
			if (isElementPresent(locator)) {
				
				String mouseOverScript = "if(document.createEvent){var evObj = document.createEvent('MouseEvents');evObj.initEvent('mouseover', true, false); arguments[0].dispatchEvent(evObj);} else if(document.createEventObject) { arguments[0].fireEvent('onmouseover');}";
				((JavascriptExecutor) driver).executeScript(mouseOverScript,
						driver.findElement(locator));

			} else {
				System.out.println("Element was not visible to hover " + "\n");

			}
		} catch (StaleElementReferenceException e) {
			System.out.println("Element with " + locator
					+ "is not attached to the page document"
					+ e.getStackTrace());
		} catch (NoSuchElementException e) {
			System.out.println("Element " + locator + " was not found in DOM"
					+ e.getStackTrace());
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Error occurred while hovering"
					+ e.getStackTrace());
		}
	}

	/*public static boolean isElementPresent(By locator) {
		boolean flag = false;
		WebElement element = driver.findElement(locator);
		try {
			if (element.isDisplayed()
					|| element.isEnabled())
				flag = true;
		} catch (NoSuchElementException e) {
			flag = false;
		} catch (StaleElementReferenceException e) {
			flag = false;
		}
		return flag;
	}*/



	public void selectValueByVisibleText(By Locator, String Option, String elemName) {

		try {
			// Wait for drop-down element to load on the page
			waitForElementToLoad(Locator, elemName);

			// Locate drop-down field
			Select select = new Select(driver.findElement(Locator));

			// Select value from drop-down
			select.selectByVisibleText(Option);

			// Log result
			logger.info("Pass : Selected '" + Option + "' from : " + elemName);

		} catch (org.openqa.selenium.ElementNotVisibleException selectValueException) {

			logger.error("FAIL : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getMessage());
			throw new RuntimeException("FAIL : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getClass().getName());

		}

	}

	public void selectValueByIndex(By Locator, int index, String elemName) {
	
		try {
			// Wait for drop-down element to load on the page
			waitForElementToLoad(Locator, elemName);

			// Locate drop-down field
			Select select = new Select(driver.findElement(Locator));

			// Select value from drop-down
			select.selectByIndex(index);

			// Select value from drop-down
			select.selectByIndex(index);

			// Log result
			logger.info("Pass : Selected '" + index + "' from : " + elemName);

		} catch (org.openqa.selenium.ElementNotVisibleException selectValueException) {
			
			logger.error("FAIL : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getMessage());
			throw new RuntimeException("FAIL : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getClass().getName());
		}

	}
	
	public List<WebElement> getOptionsList(By Locator, String elemName) {
        
		try {
			// Wait for drop-down element to load on the page
			waitForElementToLoad(Locator, elemName);
      
			// Locate drop-down field
			Select select = new Select(driver.findElement(Locator));
       
			// Log result
		
			// logger.info("Pass : Selected '" + index + "' from : " +
			// elemName);
			return select.getOptions();
      
		} catch (org.openqa.selenium.ElementNotVisibleException selectValueException) {
      
			logger.error("FAIL : Error while gettingoptions from - '" + elemName + "' : "
					+ selectValueException.getMessage());
			throw new RuntimeException("FAIL : Error while gettingoptions Value from - '" + elemName + "' : "
							+ selectValueException.getClass().getName());
        }
            	   
               }
            	   
public List<WebElement> getWebElementsList(By Locator, String elemName) {
	List<WebElement> elementsList = null;
		try {
			// Wait for drop-down element to load on the page
			//waitForElementToLoad(Locator, elemName);
      
			// Locate drop-down field
			elementsList = driver.findElements(Locator);
       
		
      
		} catch (org.openqa.selenium.ElementNotVisibleException selectValueException) {
      
			logger.error("FAIL : Error while getting element from - '" + elemName + "' : "
					+ selectValueException.getMessage());
        }

		return elementsList;
            	   
               }
	public void selectValueByOption(By Locator, String value, String elemName) {
               		
		try {
			// Wait for drop-down element to load on the page
			waitForElementToLoad(Locator, elemName);
            	
			// Locate drop-down field
			Select select = new Select(driver.findElement(Locator));
               	
			// Select value from drop-down
			select.selectByValue(value);

			// Log result
			logger.info("Pass : Selected '" + value + "' from : " + elemName);
	 
		} catch (org.openqa.selenium.ElementNotVisibleException selectValueException) {

			logger.error("FAIL : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getMessage());
			throw new RuntimeException("FAIL : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getClass().getName());
		}

			}

	public String retrieveText(By locator, String elemName) {

		logger.info("Retrieving Text from : " + elemName);

		try {
			waitForElementToLoad(locator, elemName);

			// Retrieve text from web element
			String retrievedText = driver.findElement(locator).getText().trim();

			// Log result
			logger.debug("Pass : retrieved text '" + retrievedText + "' from webelement :" + elemName);

			return retrievedText;
		} catch (org.openqa.selenium.NoSuchElementException retrieveTextException) {
			// Log error
			logger.error("Error while Getting Text from '" + elemName + "' : " + retrieveTextException.getMessage());
			throw new RuntimeException("FAIL : Error while Getting Text from '" + elemName + "' : "
					+ retrieveTextException.getClass().getName());
		}
	}

	public String retrieveAttributeValue(By locator, String value, String elemName) {

		logger.info("Retrieving Attribute value from : " + elemName);
		String attributeValue = null;
		try {

			// Wait for web element to load
			waitForElementToLoad(locator, elemName);

			// Get attribute value for the web element
			attributeValue = driver.findElement(locator).getAttribute(value);
			logger.info("Pass : retrieved Attribute '" + value + "' value from '" + elemName);

		} catch (Exception retrieveAttributeValueException) {
			logger.error("Execption while retrieving the attribute'" + elemName + "' : "
					+ retrieveAttributeValueException.getMessage());

			throw new RuntimeException("FAIL : Error while Getting Attribute '" + value + "' value from '" + elemName
					+ "' : " + retrieveAttributeValueException.getClass().getName());
		}

		return attributeValue;
	}

	public void rightclickOnWebElement(By locator, String element) {
		try {
			WebElement eleWebElement = driver.findElement(locator);
			Actions action = new Actions(driver);
			action.contextClick(eleWebElement).sendKeys(Keys.ARROW_DOWN).click();
			action.build().perform();
			logger.info("PASS : Sucessfully Right clicked on the :" + element);

		} catch (StaleElementReferenceException e) {
			logger.error("FAIL: Element is not attached to the page document " + e.getMessage());
			throw new RuntimeException("Element is not attached to the page document " + e.getClass().getName());
		} catch (NoSuchElementException e) {
			logger.error("FAIL: Element " + element + " was not found in DOM " + e.getMessage());
			throw new RuntimeException("Element " + element + " was not found in DOM " + e.getClass().getName());
		} catch (Exception e) {
			logger.error("FAIL : Element " + element + " was not clickable " + e.getMessage());
			throw new RuntimeException("Element " + element + " was not clickable " + e.getClass().getName());
				}
		}

	public boolean isClickable(By locator, String element) {
		try {
			WebDriverWait wait = new WebDriverWait(driver, 60);
			wait.until(ExpectedConditions.elementToBeClickable(locator));
			logger.info("Element " + element + " was clickable ");
			return true;
		} catch (Exception e) {
			logger.info("Element " + element + " was not clickable ");
			return false;
	}
	}

	// add logs
	public boolean isElementPresent(By locatorKey) {
		try {
			driver.findElement(locatorKey);
			return true;
		} catch (org.openqa.selenium.NoSuchElementException e) {
			return false;
		}
	}

	// add log
	 public static  boolean  isElementDisplayed(By locator, String elemName) {
		
		try {
			return driver.findElement(locator).isDisplayed();
		} catch (org.openqa.selenium.NoSuchElementException e) {
			return false;
		}
	}

	 public static  boolean  isEnabaled(By locator, String elemName) {

		try {
			return driver.findElement(locator).isEnabled();
		} catch (org.openqa.selenium.NoSuchElementException e) {
			return false;
		}
	}

	// Add logs
	public void elementInVisibilitymethod(By element) {
	
		WebDriverWait wait_Tools = new WebDriverWait(driver, 90);
		wait_Tools.until(ExpectedConditions.invisibilityOfElementLocated(element));
		logger.info("Element " +element + " is not visisble");

	}
	
	public void deleteAllFilesInDownloads() 
	{
		String downloadPath = System.getProperty("user.home");
		File filePath = new File(downloadPath + "\\Downloads\\");
		try{
		FileUtils.cleanDirectory(filePath);
		}catch(IOException e)
		{
			throw new RuntimeException(filePath +" is not found");
		}
		
	}


	public void FileExistanceValidation(String Filename,String Extension) throws InterruptedException {

		String downloadPath = System.getProperty("user.home");
		File filePath = new File(downloadPath + "\\Downloads\\" + Filename);
		rslogger.check(Filename, filePath.getName());		
				
		if (filePath.isFile()) {
			rslogger.info("Is File Downloaded :" + filePath.isFile() + " Download path is " + filePath.getPath());
			logger.info("PASS: " + Filename + " is in Form of an " + Extension);
		} else {
			Assert.fail(Filename + " not found in path " + filePath.getPath());
		}
	}

	public void FileDelete(String Filename) {

		String downloadPath = System.getProperty("user.home");
		File filePath = new File(downloadPath + "\\Downloads\\" + Filename);
		File filePathDownload = new File(downloadPath + "\\Downloads\\");

		File[] ListOfFiles = filePathDownload.listFiles();
			
		if (filePath.exists())
			filePath.delete();
		for (int i = 0; i < ListOfFiles.length; i++) {
			String name = ListOfFiles[i].getName();
			if (name.contains(Filename))

			{
				logger.info(name + "is being delted");
				ListOfFiles[i].delete();
				logger.info("****** " + name + " deleted from the " + ListOfFiles[i].getParent());
			}

		}
	}

	public void switchToFrame(By frame) {

		WebDriverWait wait = new WebDriverWait(driver, WebDriverFactory.TIMEOUT3);
		wait.until(ExpectedConditions.visibilityOfElementLocated(frame));
		try {
			driver.switchTo().frame(driver.findElement(frame));
			logger.info("PASS :Switching to iFrame");
			sleep(3);
		} catch (WebDriverException e) {
			logger.info("Execption while switching to iFrame,trying again to switch..");
		try {
				driver.switchTo().frame(driver.findElement(frame));
				sleep(3);
			} catch (WebDriverException frameException) {
				logger.error("FAIL: Exception while swithcing to iFrame :" + frameException.getMessage());
				throw new RuntimeException(
						"FAIL: Exception while swithcing to iFrame :" + frameException.getClass().getName());
			}
		}
	}

	public void switchbackToDefault() {
		try {
			driver.switchTo().defaultContent();
			//sleep(5);
			logger.info("PASS :Swithched to Default ");
		} catch (WebDriverException e) {
			logger.error("FAIL: Execption while switching to default frame :" + e.getMessage());
			throw new RuntimeException("FAIL: Exception while swithcing to default frame :" + e.getClass().getName());
		}
	}

	public void clickBrowserBackArrow() {
		try {
			driver.navigate().back();
			logger.info("User clicked on Browser back arrow");
		} catch (Exception e) {
			logger.error("ERROR while clicking on back button");
		}

	}

	public void clickBrowserFrontArrow() {
		try {
			driver.navigate().forward();
			logger.info("User clicked on Browser Front arrow");
		} catch (Exception e) {
			logger.error("ERROR while clicking on Front button");
		}
	}

	public void refreshPage() {

		try {
			driver.navigate().refresh();
			Thread.sleep(10000);
			logger.info("User refreshed the page");
		} catch (Exception e) {
			logger.error("ERROR while clicking on Front button");
		}
	}

	public void lunchPBPApplication(String url) {
		try {
			driver.get(url);
		} catch (Exception e) {
			logger.error("Exception while launching the browser");
	}
	
	} 

	public void takeSnapShot(WebDriver webdriver, String fileWithPath) throws Exception {

		TakesScreenshot scrShot = ((TakesScreenshot) webdriver);
		File SrcFile = scrShot.getScreenshotAs(OutputType.FILE);
		File DestFile = new File("screenshots/" + fileWithPath);
		try {
			FileUtils.copyFile(SrcFile, DestFile);
		} catch (IOException e) {
			logger.error("Path or File not found: " + "./screenshots/" + fileWithPath);
		}
	}

	public static void closeDriver() {
		try {
			if (driver != null) {
				driver.quit();
			}
		} catch (Exception e) {
			logger.error("Exception while closing the driver");
		}
		driver = null;
	}
	
	public void sleep(int seconds,String message) {	
		seconds = 1000 * seconds;
		try {
			Thread.sleep(seconds);
			logger.info(message);
		} catch (InterruptedException e) {
			logger.error("Exception while Thread Sleep");
		}

		} 
	
	public void sleep(int seconds) {
		logger.info("Waiting for " + seconds + " seconds");
		seconds = 1000 * seconds;
		try {
			Thread.sleep(seconds);
			logger.info("Waited for " + seconds/1000 + " seconds");
		} catch (InterruptedException e) {
			logger.error("Exception while Thread Sleep");
		}

		} 

	public boolean verifyIsElementDisplayed(By locator, String elementName) {
		boolean status = false;
		try {
			Assert.assertTrue(isElementDisplayed(locator, elementName));
			logger.info("PASS : " + elementName + " displayed");
			status = true;
		} catch (AssertionError error) {
			status = false;
			logger.error("FAIL :  " + elementName + " not displayed");
		}
		return status;
	}
	
	public void WaitForElementToBeInVisible(By element, String value) {
		try {
			WebDriverWait wait_Tools = new WebDriverWait(driver, 60);
			logger.info("Waiting for " + value + " to dissappear");
			wait_Tools.until(ExpectedConditions.invisibilityOfElementLocated(element));
		} catch (Exception e) {
			logger.info(value + " is not visible");
		}

	}

	public void mouseHoverOnWebElemetAndEnterText(By locator, String elemName, String value) {
		try {
			// Wait for web element to load
			waitForElementToLoad(locator, elemName);

			Actions actions = new Actions(driver);
			actions.moveToElement(driver.findElement(locator));
			actions.click();
			logger.info("PASS :Clicked on : '" + elemName + "'");
			
			actions.sendKeys(value);
			logger.info("PASS :Sent Txt as: '" + value + "'");
			actions.build().perform();
		} catch (Exception mouseHoverException) {
			logger.error("Execption while Entering the text on Field");
		}
	}

	protected void selectAll(By locator, String elemName, String value) {

		try {
			// Wait for web element to load
			waitForElementToLoad(locator, elemName);

			Actions actions = new Actions(driver);
			actions.moveToElement(driver.findElement(locator));
			actions.click();
			logger.info("PASS :Clicked on : '" + elemName + "'");
			if (browser.equalsIgnoreCase("firefox_local")) {
				actions.keyDown(Keys.CONTROL).sendKeys(String.valueOf('\u0061')).perform();
			} else
				actions.sendKeys(value);
			logger.info("PASS :Selected the entire Text: '" + value + "'");
			actions.build().perform();
		} catch (Exception mouseHoverException) {
			logger.error("Execption while Selecting the Entire Text");
		}
	}

public void clickOnAbout() throws InterruptedException {

		clickLink(about,"about");
	}

public String getBuildVersionDetails() throws InterruptedException {
		waitForElementToLoad(buildVer, "Build Version");
		String buildVersion = driver.findElement(buildVer).getText();
		logger.info("Pass: Obtained build Version : "+buildVersion+" from About Page");
		closeAboutPagePopUp();
		return buildVersion;
	}

public void closeAboutPagePopUp() throws InterruptedException {
		clickLink(closeButton, "closeButton");

		}
public void clickOnUserDownArrow() throws InterruptedException {
		clickLink(userArrowDown, "userDownArrow");
	}

public String getExcelCSVSecondRowData(String filename) throws IOException {
	String downloadPath = System.getProperty("user.home");
	File filePath = new File(downloadPath + "\\Downloads\\" + filename);
	@SuppressWarnings("resource")
	BufferedReader reader = new BufferedReader(new FileReader(filePath));
	List<String> lines = new ArrayList<>();
	String line = null;
	while ((line = reader.readLine()) != null) {
		lines.add(line);
	}
	return lines.get(1);

}

/**
 * @author: Shilpa
 * Upload file in IE
 * @return 
 */
 public void uploadFile_IE(String filePath)
 {
		try
		{
		Runtime.getRuntime().exec("./HospitalLogoImgUploadNew.exe"+" "+filePath);
		}
		catch(IOException e)
		{
			Assert.fail("Given file "+filePath+" does not exist" + e.getMessage());
		}
 }


/**
 * @author:Sadashiva Ashok
 * This Method checks that none of the tabs are in focus
 */
public void CheckforTabs(String Headernames, By locator) {
Assert.assertFalse(isElementDisplayed(locator, Headernames));
logger.info("Pass: "+Headernames+" is not in focus");
	}


/**@author Sadashiva Ashok
 * This Method disconnects the system out of network
 */
public void systemOutOfNetwork() throws IOException {
	logger.info("Disconnecting the network");
	Runtime.getRuntime().exec("netsh wlan disconnect");		
}

/**@author Sadashiva Ashok
 * This Method reconnects the system to network
 */
public void reconnectInXSeconds(int time ,String network) throws IOException {
	sleep(time);
	logger.info("Reconnecting the network");
	Runtime.getRuntime().exec("netsh wlan connect name="+network);
}

	public void zoomIn(int count) { // To zoom In page 4 time using CTRL and + keys.
		for (int i = 0; i < count; i++) {
			driver.findElement(By.tagName("html")).sendKeys(Keys.chord(Keys.CONTROL, Keys.ADD));
		}
	}

	public void zoomOut(int count,By locator) { // To zoom out page 4 time using CTRL and - keys.
		for (int i = 0; i < count; i++) {
			driver.findElement(locator).sendKeys(Keys.chord(Keys.CONTROL, Keys.SUBTRACT));
		}
	}

	public void set100() { // To set browser to default zoom level 100%
		driver.findElement(By.tagName("html")).sendKeys(Keys.chord(Keys.CONTROL, "0"));
	}

}
