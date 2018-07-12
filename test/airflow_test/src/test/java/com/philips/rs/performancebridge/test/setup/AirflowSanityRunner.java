package com.philips.rs.performancebridge.test.setup;

import org.junit.runner.RunWith;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;

@RunWith(Cucumber.class)
@CucumberOptions(
		format   = {"pretty","html:target/cucumber", "json:target/cucumber.json","rerun:target/rerun_featureName.txt"},
		features = {"src/test/resources/sanity/"},								
		strict = true,
	    monochrome = true,
	    
        glue = {"com.philips.rs.performancebridge.test.stepdefs","com.philips.rs.performancebridge.test.utils"},
        		tags = {"@airflow"}
        
		)

public class AirflowSanityRunner {

}
