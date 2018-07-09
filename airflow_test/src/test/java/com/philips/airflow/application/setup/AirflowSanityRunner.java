package com.philips.airflow.application.setup;

import org.junit.runner.RunWith;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;

@RunWith(Cucumber.class)
@CucumberOptions(
		format   = {"pretty","html:target/cucumber", "json:target/cucumber.json","rerun:target/rerun_featureName.txt"},
		features = {"src/test/resources/com.philips.airflow.sanity.feature"},								
		strict = true,
	    monochrome = true,
	    
        glue = {"com.philips.airflow.sanity.stepdefs","com.philips.airflow.sanity.utils"},
        		tags = {"@airflow"}
        
		)

public class AirflowSanityRunner {

}
