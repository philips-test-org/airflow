package com.philips.rs.performancebridge.test.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Properties;
import java.util.Random;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.Color;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

public class UITestUtils extends Reporter {

	public static Properties CONFIG;
	public static final Logger logger = Logger.getLogger(UITestUtils.class);
	RSLogger rslogger = new RSLogger();
	public static WebDriver driver = null;
	public static String browser = readPropertyFile("/application.properties", "Browser");
	public static String url = readPropertyFile("/application.properties", "sisenseURL");

	public static final By reportFolderArrow = By.xpath("//img[@src='assets/images/arrow-expand-white.svg']");
	public static final By schedulesFolder = By.xpath("//div[text()='Schedules']");
	public static final By finalizedFolder = By.xpath("//div[text()='Finalized']");

	public By requiredReportFolder(String folder) throws InterruptedException {
		return By.xpath("//div[text()='" + folder + "']");
	}

	public static final By popover_overlay = By.xpath("//div[@class='popover-overlay open']");
	public static final By deletedFolder = By.xpath("//div[@class='naver-item-link' and text()='Deleted']");
	public static final By reset_icon = By.xpath("//img[@src='assets/images/reset-icon.svg']");
	public static final By IE_More_Information_path = By.xpath("//a[text()='More information']");
	public static String randomGroupName = "";

	public UITestUtils() {
		try {
			if (driver == null) {
				driver = WebDriverFactory.createDriver(browser);
				driver.get(url);
				ScriptValidationReport();
				if (browser.equals("IE_LOCAL")) {
					// if(isElementDisplayed(IE_More_Information_path, "More
					// Information")) {
					// clickLink(IE_More_Information_path, "Security Link");
					// }
					driver.navigate().to("javascript:document.getElementById('overridelink').click()");
				}
			}
		} catch (InterruptedException e) {
			logger.error("ERROR while creating a webDriver for " + browser);
		} catch (IOException e) {
			logger.error("ERROR while creating a reading file");
		}
	}

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

	public static String randomNumberGenerator(int min, int max) {
		Random random = new Random();
		return String.valueOf(random.ints(0, (99999 + 1)).findFirst().getAsInt());
	}

	public static void delete_files() {

		String downloadPath = System.getProperty("user.home");
		File folder = new File(downloadPath + "\\Downloads");
		File[] listOffiles = folder.listFiles();

		for (File file : listOffiles) {
			if (file.isFile()) {
				String filename = file.getName();
				if (filename.contains(".xlsx")) {
					file.delete();
				}
			}
		}
	}

	public static boolean check_file_existence(String name) {
		String downloadPath = System.getProperty("user.home");
		File folder = new File(downloadPath + "\\Downloads");
		File[] listOffiles = folder.listFiles();
		System.out.println(folder.getAbsolutePath());
		for (File file : listOffiles) {
			if (file.isFile()) {
				String filename = file.getName();
				System.out.println(filename);
				if (filename.contains(name)) {
					System.out.println("fine true");
					return true;
				}

			}
		}
		return false;
	}

	public static String removeSpacesFromName(String name) {
		List<String> list = Arrays.asList(name.split(" "));
		return list.get(0).toLowerCase();
	}

	public void clickArrow() throws InterruptedException {
		clickLink(reportFolderArrow, "reportFolderArrow");
	}

	protected String clickLink_JavaScript(By locator, String elemName) {
		logger.debug("Clicking on : " + elemName);
		try {
			// Wait for link to appear on the page
			waitForElementToLoad(locator, elemName);

			JavascriptExecutor executor = (JavascriptExecutor) driver;
			executor.executeScript("arguments[0].click()", driver.findElement(locator));

			// Log result
			logger.info("PASS :Clicked on : '" + elemName + "'");

			return "Pass : Clicked on : '" + elemName + "'";
		} catch (org.openqa.selenium.NoSuchElementException clickLinkException) {
			// Log error
			logger.info("Error while clicking on - '" + elemName);

			return "Fail : Error while clicking on - '" + elemName + "' : " + clickLinkException.getMessage();
		}

	}

	public void clickSchedulesFolder() throws InterruptedException {
		clickLink(schedulesFolder, "schedulesFolder");
	}

	public void clickfinalizedFolder() throws InterruptedException {
		clickLink(finalizedFolder, "schedulesFolder");
	}

	public void clickDeletedFolder() throws InterruptedException {
		clickLink(deletedFolder, "schedulesFolder");
	}

	public WebDriver getDriver() {
		return driver;
	}

	public void clearField(By locator, String elemName) {

		logger.debug("Clearing field : " + elemName);
		try {
			// Wait for the input-box to load on the page
			waitForElementToLoad(locator, elemName);

			// Clear the input-box
			driver.findElement(locator).clear();

			// Log result
			// logger.info("PASS :Cleared : '" + elemName + "'");

		} catch (org.openqa.selenium.NoSuchElementException clearFieldException) {
			logger.error("Error while clearing - '" + elemName + "' : " + clearFieldException.getMessage());
			throw new RuntimeException(
					"Error while clearing - '" + elemName + "' : " + clearFieldException.getClass().getName());

		}
	}

	protected void clickLink(By locator, String elemName) throws InterruptedException {
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
					"Error while clicking on - '" + elemName + "' : " + clickLinkException.getClass().getName());

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
			logger.info("PASS :Inputted '" + value + "' text into " + elemName);

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

	public void waitForElementToLoad(final By locator, String element) {

		// logger.debug("Waiting for web element to load on the page");
		try {

			// Waits for 60 seconds implicitly until expected condition is
			// matched
			Wait<WebDriver> wait = new WebDriverWait(driver, WebDriverFactory.TIMEOUT3);

			wait.until(ExpectedConditions.visibilityOfElementLocated(locator));

			// Log result
			// logger.info("Waiting ends ... Web element loaded on the page"
			// + element);

		} catch (Exception waitForElementException) {
			// Log error

			logger.error("Error came while waiting for element to appear : " + element + " "
					+ waitForElementException.getMessage());

			throw new RuntimeException("Error came while waiting for element to appear : " + element + " "
					+ waitForElementException.getClass().getName());

		}

	}

	public String getHexValueForGivenWebElement(By locator) {
		String hex = null;
		try {
			hex = Color.fromString(driver.findElement(locator).getCssValue("background-color")).asHex();
			logger.info("Pass : Got the hex code for given color code");
		} catch (Exception e) {
			logger.error("Error : Failing at retrieving the hex code for required color ");
		}
		return hex;
	}

	public void waitForWebElementToLoad(final WebElement webElement, String element) {

		logger.debug("Waiting for web element to load on the page");
		try {

			// Waits for 60 seconds implicitly until expected condition is
			// matched
			Wait<WebDriver> wait = new WebDriverWait(driver, 60);

			wait.until(ExpectedConditions.visibilityOf(webElement));

			// Log result
			logger.info("Waiting ends ... Web element loaded on the page");

		} catch (org.openqa.selenium.InvalidElementStateException waitForElementException) {
			// Log error
			logger.error("Error came while waiting for element to appear : " + element + " "
					+ waitForElementException.getMessage());

			throw new RuntimeException("Error came while waiting for element to appear : " + element + " "
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

			logger.info("PASS :Mousehoverd on elemName" + webElement);

		} catch (Exception mouseHoverException) {
			logger.error(
					"Error came while Mousehovering on element : " + elemName + " " + mouseHoverException.getMessage());

			throw new RuntimeException("Error came while Mousehovering on element : " + elemName + " "
					+ mouseHoverException.getClass().getName());
		}
	}

	public void mouseHoverOnWebElemet(By locator, String elemName) {
		try {
			// Wait for web element to load
			waitForElementToLoad(locator, elemName);

			// Mousehover on the webElement
			Actions action = new Actions(driver);
			action.moveToElement(driver.findElement(locator)).perform();
			logger.info("PASS :Mousehoverd on elemName" + elemName);

		} catch (Exception mouseHoverException) {
			logger.error(
					"Error came while Mousehovering on element : " + elemName + " " + mouseHoverException.getMessage());

			throw new RuntimeException("Error came while Mousehovering on element : " + elemName + " "
					+ mouseHoverException.getClass().getName());
		}
	}

	public void selectValueByVisibleText(By Locator, String Option, String elemName) {

		try {
			// Wait for drop-down element to load on the page
			waitForElementToLoad(Locator, elemName);

			// Locate drop-down field
			Select select = new Select(driver.findElement(Locator));

			// Select value from drop-down
			select.selectByVisibleText(Option);

			logger.info("Pass : Selected '" + Option + "' from : " + elemName);

		} catch (org.openqa.selenium.ElementNotVisibleException selectValueException) {

			logger.error("Fail : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getMessage());
			throw new RuntimeException("Fail : Error while Selecting Value from - '" + elemName + "' : "
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

			logger.info("Pass : Selected '" + index + "' from : " + elemName);

		} catch (org.openqa.selenium.ElementNotVisibleException selectValueException) {

			logger.error("Fail : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getMessage());
			throw new RuntimeException("Fail : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getClass().getName());
		}

	}

	public void selectValueByOption(By Locator, String value, String elemName) {

		try {
			// Wait for drop-down element to load on the page
			waitForElementToLoad(Locator, elemName);

			// Locate drop-down field
			Select select = new Select(driver.findElement(Locator));

			// Select value from drop-down
			select.selectByValue(value);

			logger.info("Pass : Selected '" + value + "' from : " + elemName);

		} catch (org.openqa.selenium.ElementNotVisibleException selectValueException) {

			logger.error("Fail : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getMessage());
			throw new RuntimeException("Fail : Error while Selecting Value from - '" + elemName + "' : "
					+ selectValueException.getClass().getName());
		}

	}

	public String retrieveText(By locator, String elemName) {

		logger.info("Retrieving Text from : " + elemName);

		try {
			waitForElementToLoad(locator, elemName);

			// Retrieve text from web element
			String retrievedText = driver.findElement(locator).getText().trim();

			logger.info("Pass : retrieved '" + retrievedText + "' from : " + elemName);
			return retrievedText;
		} catch (org.openqa.selenium.NoSuchElementException retrieveTextException) {
			// Log error
			logger.debug("Error while Getting Text from '" + elemName + "' : ", retrieveTextException);
			return "Fail : Error while Getting Text from '" + elemName + "' : " + retrieveTextException.getMessage();
		}
	}

	public String retrieveAttributeValue(By locator, String value, String elemName) {

		String attributeValue = null;
		try {

			// Wait for web element to load
			waitForElementToLoad(locator, elemName);

			// Get attribute value for the web element
			attributeValue = driver.findElement(locator).getAttribute(value);
			logger.info("Retrieved text : " + attributeValue);

		} catch (Exception retrieveAttributeValueException) {
			logger.info("Execption while retrieving the attribute");
			return "Fail : Error while Getting Attribute '" + value + "' value from '" + elemName + "' : "
					+ retrieveAttributeValueException.getMessage();
		}

		return attributeValue;
	}

	public boolean isElementPresent(By locatorKey) {
		try {
			driver.findElement(locatorKey);
			return true;
		} catch (org.openqa.selenium.NoSuchElementException e) {
			return false;
		}
	}

	public void switchToFrame(By frame) {
		WebDriverWait wait = new WebDriverWait(driver, 20);
		wait.until(ExpectedConditions.visibilityOfElementLocated(frame));
		try {
			driver.switchTo().frame(driver.findElement(frame));
			logger.info("PASS :Switching to iFrame");
		} catch (WebDriverException e) {
			logger.info("Execption while switching to iFrame");
			driver.switchTo().frame(driver.findElement(frame));
		}
	}

	public void switchbackToDefault() {
		driver.switchTo().defaultContent();
		logger.info("PASS :Swithched to Default ");
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

	public boolean verifyIsElementNotDisplayed(By locator, String elementName) {
		boolean status = false;
		try {
			Assert.assertTrue(!isElementDisplayed(locator, elementName));
			logger.info("PASS : " + elementName + " is deleted");
			status = true;
		} catch (AssertionError error) {
			status = false;
			// Reporter.featureStepResult(elementName + " Not Displayed",
			// "Failure");
			logger.error("FAIL :  " + elementName + " is still displayed");
		}
		return status;
	}

	public void rightclickOnWebElement(By locator, String element) {
		try {
			WebElement eleWebElement = driver.findElement(locator);
			Actions action = new Actions(driver);
			action.contextClick(eleWebElement);
			action.build().perform();
			logger.info("Sucessfully Right clicked on the element");

		} catch (StaleElementReferenceException e) {
			System.out.println("Element is not attached to the page document " + e.getStackTrace());
		} catch (NoSuchElementException e) {
			System.out.println("Element " + element + " was not found in DOM " + e.getStackTrace());
		} catch (Exception e) {
			System.out.println("Element " + element + " was not clickable " + e.getStackTrace());
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
			logger.info("Exception while launching the browser");
		}
	}

	public void elementInVisibilitymethod(By element) {
		WebDriverWait wait_Tools = new WebDriverWait(driver, WebDriverFactory.TIMEOUT3);
		wait_Tools.until(ExpectedConditions.invisibilityOfElementLocated(element));
	}

	/**
	 * 
	 * Take Snapshot
	 */

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
			logger.info("Exception while closing the driver");
		}
		driver = null;
	}

	public static void sleep(int seconds) {
		// logger.info("Waiting for " + seconds + " seconds");
		seconds = 1000 * seconds;
		try {
			Thread.sleep(seconds);
		} catch (InterruptedException e) {
			logger.info("Exception while Thread Sleep");
		}
	}

	/**
	 * Verify webElement displayed on the page
	 */
	public static boolean isElementDisplayed(By locator, String elemName) {

		try {
			return driver.findElement(locator).isDisplayed();
		} catch (org.openqa.selenium.NoSuchElementException e) {
			return false;
		}
	}

	// unused functions
	protected void highlightElement(WebDriver driver, By locator) {
		try {

			for (int i = 0; i < 3; i++) {

				JavascriptExecutor js = (JavascriptExecutor) driver;
				js.executeScript("arguments[0].setAttribute('style', arguments[1]);", locator,
						"color: red; border: 2px solid red;");
			}
		} catch (org.openqa.selenium.NoSuchElementException t) {
			logger.error("Error came from: " + locator, t);
		}

	}

	public void FileExistanceValidation(String Filename, String Extension) throws InterruptedException {

		String downloadPath = System.getProperty("user.home");
		File filePath = new File(downloadPath + "\\Downloads\\" + Filename);

		rslogger.check(Filename, filePath.getName());
		rslogger.info("Is File Downloaded  " + filePath.isFile() + " File path is " + filePath.getPath());
		logger.info("PASS:" + Filename + " is in the form of");

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

	public static ExpectedCondition<Boolean> currentUrlContains(final String url) {
		return new ExpectedCondition<Boolean>() {
			public Boolean apply(WebDriver driver) {
				String currentUrl = driver.getCurrentUrl();
				return currentUrl == null ? false : currentUrl.contains(url);
			}
		};
	}

	protected ExpectedCondition<WebElement> visibilityOfElementLocated(final By locator) {

		return new ExpectedCondition<WebElement>() {

			public WebElement apply(WebDriver driver) {
				// Store the web element
				WebElement toReturn = driver.findElement(locator);

				// Check whether the web element is displayed on the page
				if (toReturn.isDisplayed())
					return toReturn;

				return null;
			}
		};
	}

	/**
	 * 1) Waits for a new page to load completely 2) new WebDriverWait(driver,
	 * 60) -> Waits for 60 seconds implicitly until expected condition is
	 * matched 3) wait.until((ExpectedCondition<Boolean>) -> Wait until expected
	 * condition (All documents present on the page get ready) met
	 **/
	public void waitForPageToLoad() throws InterruptedException {
		try {

			// Waits for 60 seconds implicitly until expected condition is
			// matched
			WebDriverWait wait = new WebDriverWait(driver, WebDriverFactory.TIMEOUT2);

			// Wait until expected condition (All documents present on the page
			// get ready) met
			wait.until(new ExpectedCondition<Boolean>() {

				public Boolean apply(WebDriver d) {

					if (!(d instanceof JavascriptExecutor))
						return true;

					Object result = ((JavascriptExecutor) d)
							.executeScript("return document['readyState'] ? 'complete' == document.readyState : true");

					return result != null && result instanceof Boolean && (Boolean) result;

				}
			});
		} catch (org.openqa.selenium.InvalidElementStateException waitForPageToLoadException) {
			logger.debug("Error came while waiting for page to load : ", waitForPageToLoadException);
		}
	}

	public void waitForElementToClick(final By locator, String element) {

		// logger.debug("Waiting for web element to load on the page");
		try {

			// Waits for 60 seconds implicitly until expected condition is
			// matched
			Wait<WebDriver> wait = new WebDriverWait(driver, WebDriverFactory.TIMEOUT1);

			wait.until(ExpectedConditions.elementToBeClickable(locator));

			// Log result
			// logger.info("Waiting ends ... Web element loaded on the page"
			// + element);

		} catch (Exception waitForElementException) {
			// Log error

			logger.error("Error came while waiting for element to clickable : " + element + " "
					+ waitForElementException.getMessage());

			throw new RuntimeException("Error came while waiting for element to clickable : " + element + " "
					+ waitForElementException.getClass().getName());

		}

	}

	public static boolean isEnabled(By locator, String elemName) {

		try {
			return driver.findElement(locator).isEnabled();
		} catch (org.openqa.selenium.NoSuchElementException e) {
			return false;
		}
	}

	public static void scrollToElement(By locator, String elemName) {
		try {

			WebElement element = driver.findElement(locator);

			JavascriptExecutor js = (JavascriptExecutor) driver;
			js.executeScript("window.scrollTo(0," + element.getLocation().x + ")");
			logger.info("PASS :Browser window scroll to '" + elemName + "'");
		} catch (Exception scrollToElement) {
			logger.error("Error came while Scrolling to element : " + elemName + " " + scrollToElement.getMessage());

			throw new RuntimeException(
					"Error came while Scrolling to element : " + elemName + " " + scrollToElement.getClass().getName());
		}

	}

	public void dragNDrop(By locatorFrom, By locatorTo, String elemName) {

		try {
			// convert By locator into WebElement.
			WebElement from = driver.findElement(locatorFrom);
			WebElement to = driver.findElement(locatorTo);

			// Wait for web element to load
			waitForWebElementToLoad(from, "From");
			waitForWebElementToLoad(to, "To");

			// Mousehover on the webElement
			Actions action = new Actions(driver);
			// Action act =
			// action.clickAndHold(from).moveToElement(to).release(to).build();
			// act.perform();
			action.dragAndDrop(from, to).build().perform();

			// logger.info(to.getLocation());
			// logger.info(from.getLocation());
			// action.clickAndHold().moveToElement(to, 0,
			// 242).pause(10).build().perform();
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

	public void tabSwitch(String tabTitle) throws InterruptedException {
		ArrayList<String> tabs = new ArrayList<String>(driver.getWindowHandles());
		for (int i = 0; i < tabs.size(); i++) {
			driver.switchTo().window(tabs.get(i));
			if (driver.getTitle().equals(tabTitle)) {
				logger.info("PASS : Tab Switching to Tab Name : " + i + " : " + driver.getTitle());
				break;
			}
		}
	}

	// public String generateRandomNumber() {
	// String randomNumber = randomNumberGenerator(0, 99999);/
	// logger.info("Random Number is : " + randomNumber);
	// return randomNumber;
	// }
	//
	/**
	 * 
	 * @param checkHexValueForColor
	 * @return
	 */

	public String getHexValueOfColor(String checkHexValueForColor) {
		String valueForColor = null;
		switch (checkHexValueForColor) {
		case "voilet":
			valueForColor = "#631d76";
			break;
		case "blue":
			valueForColor = "#005a8b";
			break;
		case "yellow":
			valueForColor = "#f5f52b";
			break;
		default:
			logger.info("Required color is not available for comparison");
		}
		return valueForColor;
	}
}
