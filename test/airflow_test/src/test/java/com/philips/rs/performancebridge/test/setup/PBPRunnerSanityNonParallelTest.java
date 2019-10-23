package com.philips.rs.performancebridge.test.setup;

import org.junit.runner.RunWith;

import com.github.mkolisnyk.cucumber.runner.ExtendedCucumber;
import com.github.mkolisnyk.cucumber.runner.ExtendedCucumberOptions;

import cucumber.api.CucumberOptions;

@RunWith(ExtendedCucumber.class)
@ExtendedCucumberOptions(jsonReport = "target/cucumber.json",
retryCount = 0,
detailedReport = true,
detailedAggregatedReport = true,
overviewReport = true,
//coverageReport = true,
jsonUsageReport = "target/cucumber-usage.json",
//usageReport = true,
toPDF = true,
pdfPageSize="auto",
threadsCount=1,
//excludeCoverageTags = {"@flaky" },
includeCoverageTags = {"@Regression" },
outputFolder = "target")
@CucumberOptions(
		format   = {"pretty","html:target/cucumber", "json:target/cucumber.json","rerun:target/rerun_featureName.txt"},
		features = {"src/test/resources/sanity/92177_VerifySchedulesInOverviewAndClalender.feature"},								
		strict = true,
	    monochrome = true,
        glue = {"com.philips.rs.performancebridge.test.stepdefs","com.philips.rs.performancebridge.test.common.hooks"},
		tags = {"@Sanity"}
		
        
		)
public class PBPRunnerSanityNonParallelTest {

}

