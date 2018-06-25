package com.philips.rs.sanity.pagelibrary;



import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;

import com.philips.rs.utils.UITestUtils;




public class Login extends UITestUtils {
	
	public static final By username = By.id("IDToken1");
	public static final By password = By.id("IDToken2");
	public static final By loginbutton = By.xpath("//*[@id=\"login-container\"]/div[1]/input");
	
	
	/**
	 * @author Aditya Pare
	 * Finding the path of PB app.
	 * @param appName
	 * @return By locatore. 
	 */
	public By appElement(String appName) {
		
		List<String> list = Arrays.asList(appName.split(" "));
//		return By.xpath("//h3[contains(text(),'"+list.get(0)+"')]/../..//a");
		return By.xpath("//div[@class='app']/a/h3[contains(text(),'"+list.get(0)+"')]/../..");
	}

	
	/**
	 * @author Aditya Pare
	 * Enter username for login.
	 * @param userName
	 */
	public void enterUserName(String userName)
	{
			clearAndInput(username, "Username", userName );
	}
	
	

	/**
	 * @author Aditya Pare
	 * Enter Password of given user for login.
	 * @param userName
	 */
    public void enterPassword(String userName)
    {
    	String password = readPropertyFile("/application.properties","password");
    	clearAndInput(Login.password, "Password", password);
    }
    
   
    /**
     * @author Aditya Pare
     * Click on login button after inserting username and password.
     * @throws InterruptedException
     */
    public void clickOnLogin() throws InterruptedException
    {
    	clickLink(loginbutton, "Login Button");
    }

    
    /**
     * @author Aditya Pare
     * Click on given PB app.
     * @param appName
     * @throws InterruptedException
     */
    public void clickOnApp(String appName) throws InterruptedException
    {
    	
    	/*if (driver.getTitle().equals("PerformanceBridge")) {
    		
    		clickLink(appElement(appName), appName);
        	
        	ArrayList<String> tabs = new ArrayList<String> (driver.getWindowHandles());	    
    	    driver.switchTo().window(tabs.get(1));
    	    logger.info("Current Page Title is :"+driver.getTitle());
    	    if (browser.equals("IE_LOCAL")) {
    			if(isElementDisplayed(IE_More_Information_path, "More Information")) {
    				clickLink(IE_More_Information_path, "Security Link");	
    			}
   
    			driver.navigate().to("javascript:document.getElementById('overridelink').click()");
    			driver.manage().window().maximize();
    			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
    			ArrayList<String> tabs1 = new ArrayList<String> (driver.getWindowHandles());	    
        	    driver.switchTo().window(tabs1.get(0));
        	    logger.info("Current Page Title is :"+driver.getTitle());
        	    clickLink(appElement(appName), appName);
        	    tabs1 = new ArrayList<String> (driver.getWindowHandles());
        	    
        	    driver.switchTo().window(tabs1.get(2));
        	    logger.info("Current Page Title is :"+driver.getTitle());
    	
    		}
		} else {
			ArrayList<String> tabs = new ArrayList<String> (driver.getWindowHandles());	    
    	    driver.switchTo().window(tabs.get(0));
    	    logger.info("Current Page Title is :"+driver.getTitle());
    	    clickLink(appElement(appName), appName);
    	    tabs = new ArrayList<String> (driver.getWindowHandles());
    	    
    	    driver.switchTo().window(tabs.get(2));
    	    logger.info("Current Page Title is :"+driver.getTitle());
		}*/
    	clickLinkNew(appElement(appName), appName);
    	logger.info("Current Page Title is :"+driver.getTitle());
    	ArrayList<String> tabs = new ArrayList<String> (driver.getWindowHandles());	    
	    driver.switchTo().window(tabs.get(1));
	    logger.info("Current Page Title is :"+driver.getTitle());
	    if (browser.equals("IE_LOCAL")) {
			/*if(isElementDisplayed(IE_More_Information_path, "More Information")) {
				clickLink(IE_More_Information_path, "Security Link");	
			}*/
			/*driver.navigate().to("javascript:document.getElementById('overridelink').click()");
			driver.navigate().to("javascript:document.getElementById('overridelink').click()");*/
			driver.manage().window().maximize();
			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
		} 
    } 
	
}
