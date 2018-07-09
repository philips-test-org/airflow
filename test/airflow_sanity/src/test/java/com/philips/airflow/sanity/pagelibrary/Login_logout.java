package com.philips.airflow.sanity.pagelibrary;

import java.util.Arrays;
import java.util.List;
import org.openqa.selenium.By;
import com.philips.airflow.sanity.utils.UITestUtils;
import org.junit.Assert;

public class Login_logout extends UITestUtils {

	public static final By username = By.id("IDToken1");
	public static final By password = By.id("IDToken2");
	public static final By loginbutton = By.xpath("//*[@id=\"login-container\"]/div[1]/input");
	public static final By accessMsg = By.xpath("//div[@class='col-md-12']");
	public static final String actualMsg = "Your username and password combination check was successful. However, you are not in the proper groups required for this application.";
	public static final By imgLogo = By.xpath("//img[@class='logo']");
	public final static By logout = By.xpath("//a[text() = 'Logout']");

	public By appElement(String appName) {
		List<String> list = Arrays.asList(appName.split(" "));
		return By.xpath("//div[@class='app']/a/h3[contains(text(),'" + list.get(0) + "')]/..");
	}

	public void enterUserName(String userName) {
		clearAndInput(username, "Username", userName);
	}

	public void enterPassword(String userName) {
		String password = readPropertyFile("/application.properties", userName);
		clearAndInput(Login_logout.password, "Password", password);
	}

	public void clickOnLogin() throws InterruptedException {
		clickLink(loginbutton, "Login_logout Button");
	}

	public void clickOnApp(String appName) throws InterruptedException {

		clickLink_JavaScript(appElement(appName), appName);
		waitForElementToLoad(imgLogo, "Image logo");
		tabSwitch(appName);
		if (browser.equals("IE_LOCAL")) {
			// if(isElementDisplayed(IE_More_Information_path, "More
			// Information")) {
			// clickLink(IE_More_Information_path, "Security Link");
			// }
			for (int i = 0; i < 2; i++) {
				if (isElementDisplayed(By.id("overridelink"), "Certificate link")) {
					driver.navigate().to("javascript:document.getElementById('overridelink').click()");
				}
			}
			driver.manage().window().maximize();
		}
	}

	public void verifyUserAccess(String user) {
		Assert.assertEquals(actualMsg, retrieveText(accessMsg, "Access Message"));
		logger.info("PASS : " + user + " does not have access in Report Search Application");
	}

	public void appLogout() throws InterruptedException {
		clickLink(logout, "Logout");
	}
}
