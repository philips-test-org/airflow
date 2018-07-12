package com.philips.rs.performancebridge.test.utils;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.apache.log4j.Logger;
import org.junit.Assert;

public class RSLogger
{

	Logger logger = Logger.getLogger(RSLogger.class);

	public void check(String expected, String actual)
	{
		String actualResult = " Actual Result: ";
		String expResult = " Expected Result: ";
		String msg = actualResult + actual + " is displayed " + expResult + expected + " is expected";

		logger.info(actual.equals(expected) ? "PASS :" + msg : "FAIL :" + msg);
		Assert.assertEquals(msg, expected, actual);
		
	}

	
	public void checkSearch(String expected, String actual, String modality1)
	{
		String actualResult = " Actual : ";
		String expResult = " Expected : ";
		String msg = "Number of Exams for "+ modality1 + actualResult + actual  + expResult + expected ;

		logger.info(actual.equals(expected) ? "PASS " + msg : "FAIL " + msg);
		Assert.assertEquals(msg, expected, actual);
	}

	public void check(int expected, int actual)
	{
		String actualResult = " Actual Result: ";
		String expResult = " Expected Result: ";
		String msg = actualResult + actual + " is displayed " + expResult + expected + " is expected";

		logger.info((actual == expected) ? "PASS" + msg : "FAIL" + msg);

		if (actual != expected)
		{
			error("Test case Failed");
		}
		Assert.assertEquals(msg, expected, actual);
	}

	public void check(float expected, float actual)
	{
		String actualResult = " Actual Result: ";
		String expResult = " Expected Result: ";
		String msg = actualResult + actual + " is displayed " + expResult + expected + " is expected";

		logger.info((actual == expected) ? "PASS" + msg : "FAIL" + msg);

		if (actual != expected)
		{
			error("Test case Failed");
		}
		
		Assert.assertEquals(expected, actual, 0.001);

	}

	public void check(double expected, double actual)
	{
		String actualResult = " Actual Result: ";
		String expResult = " Expected Result: ";
		String msg = actualResult + actual + " is displayed " + expResult + expected + " is expected";

		logger.info((actual == expected) ? "PASS" + msg : "FAIL" + msg);

		if (actual != expected)
		{
			error("Test case Failed");
		}
		
		Assert.assertEquals(expected, actual, 0.001);
	}

	public void check(String expected, String actual, String msg)
	{

		logger.info(actual.equals(expected) ? "PASS :" + msg : "FAIL" + msg);
		Assert.assertEquals(msg, expected, actual);

	}

	
	
	public void check(boolean bool1, boolean bool2)
	{
		
		
		Assert.assertEquals(bool1, bool2);
		logger.info(bool1 == bool2 ? "PASS " + ": Condition is True" : "FAIL" + ": Condition is not met, its a fail");
	}

	public void info(String message)
	{
		logger.info(message);
	}

	public void error(String message)
	{
		logger.error(message);
	}

	public void error(Object message)
	{
		logger.error(message);
	}

	public void error(StackTraceElement message)
	{
		logger.error(message);
	}

	public void error(StackOverflowError message)
	{
		logger.error(message);
	}

	public void debug(String message)
	{
		logger.debug(message);
	}

	public void debug(Exception e)
	{
		StringWriter errors = new StringWriter();

		e.printStackTrace(new PrintWriter(errors));
		logger.debug(errors.toString());
	}

}