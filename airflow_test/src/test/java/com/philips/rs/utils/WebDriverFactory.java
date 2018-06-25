package com.philips.rs.utils;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.Capabilities;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

public class WebDriverFactory {

	public static WebDriver driver = null;
	final static int TIMEOUT1 = 30;
	final static int TIMEOUT2 = 90;
	final static int TIMEOUT3 = 120;

	@SuppressWarnings({ "deprecation" })
	public static  WebDriver createDriver(String browser)
			throws InterruptedException, MalformedURLException, IOException {
		ChromeOptions opt = new ChromeOptions();
		DesiredCapabilities capabilities = new DesiredCapabilities() ;

		switch (browser) {

		case "IE_LOCAL":
			System.setProperty("webdriver.ie.driver","./driver_exe/IEDriverServer.exe");
			capabilities = DesiredCapabilities.internetExplorer();
			capabilities.setCapability(CapabilityType.ACCEPT_SSL_CERTS, true);
			driver = new InternetExplorerDriver(capabilities);
			break;
		case "IE_REMOTE":
			
			break;
		case "CHROME_LOCAL":
			System.setProperty("webdriver.chrome.driver","./driver_exe/chromedriver.exe");
			driver = new ChromeDriver();
			break;
		case "FIREFOX_LOCAL":		
			System.setProperty("webdriver.gecko.driver", "./driver_exe/geckodriver.exe");	
			/*FirefoxProfile profile = new FirefoxProfile();
			profile.setPreference("browser.download.folderList", 1);
			profile.setPreference("browser.download.manager.showWhenStarting", false);
			profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/pdf,image/png,image/gif,application/json;charset=UTF-8,application/octet-stream; charset=utf-8,application/font-woff,text/csv");
			profile.setPreference( "pdfjs.disabled", true );*/
			/*capabilities.setCapability(FirefoxDriver.PROFILE, profile);
			capabilities.setAcceptInsecureCerts(true);*/
			driver = new FirefoxDriver();
			break;
		case "iPad":
			System.setProperty("webdriver.chrome.driver","./driver_exe/chromedriver.exe");
			Map<String, String> mobileEmulation = new HashMap<>();

			mobileEmulation.put("deviceName", "iPad");


			ChromeOptions chromeOptions = new ChromeOptions();
			chromeOptions.setExperimentalOption("mobileEmulation", mobileEmulation);

			 driver = new ChromeDriver(chromeOptions);
			break; 
		case "CHROME_REMOTE":
			
			
			String nodeURL = "http://localhost:5555/wb/hub";
			
		/*	capabilities = DesiredCapabilities.chrome();
			capabilities.setBrowserName("chrome");
			capabilities.setPlatform(Platform.WINDOWS);
			capabilities.setVersion("3.11.0");
		*/	
			//opt.merge(capabilities);
			
			//driver=new RemoteWebDriver(new URL(nodeURL), (Capabilities) opt);
			
						
			
		}
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		
		return driver;
	}
	
	public WebDriver getDriver()
	{
		return driver;
	}

	
}
