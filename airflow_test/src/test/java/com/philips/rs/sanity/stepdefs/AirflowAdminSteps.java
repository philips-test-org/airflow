package com.philips.rs.sanity.stepdefs;

import com.philips.rs.sanity.pagelibrary.AirflowAdmin;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class AirflowAdminSteps extends AirflowAdmin {

	@Then("^user selects \"([^\"]*)\"$")
	public void user_selects(String subTabName) throws Throwable {
		takeSnapShot(driver, subTabName+" Page");
		clickOnSubMenOfMenuTab(subTabName);
		takeSnapShot(driver, subTabName+" Page");
	}

	@Then("^Creates \"([^\"]*)\" with Resource \"([^\"]*)\"$")
	public void creates_with_Resource(String elemName, String Resource) throws Throwable {
	    // Write code here that turns the phrase above into concrete actions
	    clearAndInput(createNewGroup, "createNewGroup", elemName);
	    clickLink(createNewGroupPlus,"createNewGroupPlus");
	    clickLink(groupName(elemName), elemName);
	    clickLink(resourceName(Resource), Resource);
	}
	
	

	@When("^user selects a Category \"([^\"]*)\"$")
	public void user_selects_a_Category(String catName) throws Throwable {
		selectTheCategory(catName);
	}

	@When("^provide explanation \"([^\"]*)\"$")
	public void provide_explanation(String explanation) throws Throwable {
		enterTheExplanation(explanation);
	}

	@Given("^perform a search with the text \"([^\"]*)\" in the Search box$")
	public void perform_a_search_with_the_text_in_the_Search_box(String searchString) throws Throwable {
		enterTheSearchText(searchString);
		clickOnSearch();

	}

	@Given("^verify that search results does not display patient information like \"([^\"]*)\" and \"([^\"]*)\"$")
	public void verify_that_search_results_does_not_display_patient_information_like_and(String accession,
			String patientID) throws Throwable {
		checkAccessionDoesNotExist(accession);
		checkPatientIDDoesNotExist(patientID);

	}

	@Given("^verify that user message is displayed indicating \"([^\"]*)\"$")
	public void verify_that_user_message_is_displayed_indicating(String msg) throws Throwable {
		checkResultMessage(msg);
	}

}
