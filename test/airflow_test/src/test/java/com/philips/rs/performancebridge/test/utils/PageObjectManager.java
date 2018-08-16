package com.philips.rs.performancebridge.test.utils;


import org.openqa.selenium.WebDriver;

import com.philips.rs.performancebridge.test.common.core.DriverBase;
import com.philips.rs.performancebridge.test.common.core.PageObjectManagerBase;
import com.philips.rs.performancebridge.test.po.Airflow;
import com.philips.rs.performancebridge.test.po.AirflowAdmin;
import com.philips.rs.performancebridge.test.po.AirflowCalendar;
import com.philips.rs.performancebridge.test.po.AirflowKiosk;

public class PageObjectManager extends PageObjectManagerBase  {

	private WebDriver driver;
	private Airflow airflow;
	private AirflowAdmin airflowAdmin;
	private AirflowCalendar airflowCalendar;
	private AirflowKiosk airflowKiosk;

	

	public PageObjectManager() {
	        this.driver = DriverBase.getDriver();
	    }

	public Airflow getAirflowPage() {
		return (airflow == null) ? airflow = new Airflow(driver) : airflow;
	}
	
	public AirflowAdmin getAirflowAdminPage() {
		return (airflowAdmin == null) ? airflowAdmin = new AirflowAdmin(driver) : airflowAdmin;
	}
	
	public AirflowCalendar getAirflowCalendarPage() {
		return (airflowCalendar == null) ? airflowCalendar = new AirflowCalendar(driver) : airflowCalendar;
	}

	public AirflowKiosk getAirflowKioskPage() {
		return (airflowKiosk == null) ? airflowKiosk = new AirflowKiosk(driver) : airflowKiosk;
	}
	
}