package com.philips.rs.performancebridge.test.stepdefs;

import com.philips.rs.performancebridge.test.common.po.VhisExamDetail;
import com.philips.rs.performancebridge.test.common.po.VhisExamList;
import com.philips.rs.performancebridge.test.common.utils.Comparator;
import com.philips.rs.performancebridge.test.utils.ContextDTO;
import com.philips.rs.performancebridge.test.utils.PageObjectManager;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class VirtualHospitalSteps {

	private VhisExamList vhisExamList;
	private VhisExamDetail vhisExamDetail;
	private ContextDTO contextDTO;
	

	public VirtualHospitalSteps(PageObjectManager pageObjectManager, ContextDTO contextDTO) {
		this.contextDTO = contextDTO;
		vhisExamList = pageObjectManager.getVhisExamList();
		vhisExamDetail = pageObjectManager.getVhisExamDetail();
	}

	@Then("^user selects site as \"([^\"]*)\" and exam status as \"([^\"]*)\" and clicks on Submit button$")
	public void user_selects_site_as_and_exam_status_as_and_clicks_on1(String site, String examStatus) throws Throwable {

		vhisExamList.selectSite(site);
		vhisExamList.selectStatus(examStatus);
		vhisExamList.clickSubmit();

	}
	
	
	@Then("^user selects site as \"([^\"]*)\" and exam status as \"([^\"]*)\" and selects existing '(.*)' and clicks on Submit button$")
	public void user_selects_site_as_and_exam_status_as_and_clicks_on(String site, String examStatus,
			String accessionNumber) throws Throwable {

		vhisExamList.selectSite(site);
		vhisExamList.selectStatus(examStatus);
		vhisExamList.inputExistingAccession(contextDTO.getAccessionNumber());
		vhisExamList.clickSubmit();

	}

	@Then("^verify creating a new \"([^\"]*)\" exam page appears$")
	public void creating_a_new_prelim_exam_page_appears(String examtype) throws Throwable {

		Comparator.check(examtype, vhisExamDetail.getStatusOnHeader());
	}

	@Then("^user selects the '(.*)','(.*)','(.*)' and  clicks submit in VHIS$")
	public void user_clicks_submit_in_VHIS(String radiologist1,String modality,String procedure) throws Throwable {
		contextDTO.setAccessionNumber(vhisExamDetail.getAccession());
		vhisExamDetail.selectRadiologist1(radiologist1);
		vhisExamDetail.selectProcedure(procedure);
		vhisExamDetail.selectModality(modality);
		vhisExamDetail.clickSubmit();

	}

	@Then("^'(.*)'(?: with \"([^\"]*)\")? should appear in the Recent Exams$")
	public void accession_number_should_appear_in_the(String accessionNumber, String examtype) throws Throwable {

		vhisExamList.verifyExamDetailsInRecentExams(contextDTO.getAccessionNumber(), examtype);
	}

	@Then("^user selects the '(.*)' and '(.*)','(.*)','(.*)','(.*)','(.*)','(.*)', and clicks submit in VHIS$")
	public void userselectsExamsDetails(String modality, String accessionNumber, String procedure, String radiologist1,
			String radiologist2, String impression, String reportbody) throws Throwable {
		contextDTO.setAccessionNumber(vhisExamDetail.getAccession());
		vhisExamDetail.selectModality(modality);
		vhisExamDetail.selectProcedure(procedure);
		vhisExamDetail.selectRadiologist1(radiologist1);
		vhisExamDetail.selectRadiologist2(radiologist2);
		vhisExamDetail.enterReportImpression(impression);
		vhisExamDetail.enterReportBody(reportbody);
		vhisExamDetail.clickSubmit();

	}
	
	@Given("^user creates a exam with \"([^\"]*)\" resource, \"([^\"]*)\" status and \"([^\"]*)\" procedure in VHIS$")
	public void user_selects_the_and_Accession_Number_and_submit_in_VHIS(String resource, String examstatus, String procedure) throws Throwable {
		vhisExamList.selectStatus(examstatus);
		vhisExamList.clickSubmit();
		vhisExamDetail.selectResourceFromDropDown(resource);
		contextDTO.setAccessionNumber(vhisExamDetail.getAccession());
		contextDTO.setMrn(vhisExamDetail.getMRNOnHeader());
		vhisExamDetail.selectProcedure(procedure);
		vhisExamDetail.clickSubmit();	
	}
	
	/*
	 * This method is to make sure atleast one exam is created as part of startup data
	 */
	@Given("^user creates a startup exam with \"([^\"]*)\" resource, \"([^\"]*)\" status and \"([^\"]*)\" procedure in VHIS$")
	public void user_selects_the_and_Accession_Number_and_create_startup_exam_in_VHIS(String resource, String examstatus, String procedure) throws Throwable {
		vhisExamList.selectStatus(examstatus);
		vhisExamList.clickSubmit();
		vhisExamDetail.selectResourceFromDropDown(resource);
		vhisExamDetail.selectProcedure(procedure);
		vhisExamDetail.clickSubmit();
	}
	
	@Given("^user creates exam with \"([^\"]*)\" resource, \"([^\"]*)\" status, ordering Physician$")
	public void user_creates_exam_with_resource_status_ordering_Physician(String resource, String examstatus) throws Throwable {
		vhisExamList.selectStatus(examstatus);
		vhisExamList.clickSubmit();
		vhisExamDetail.selectResourceFromDropDown(resource);
		contextDTO.setAccessionNumber(vhisExamDetail.getAccession());
		contextDTO.setMrn(vhisExamDetail.getMRNOnHeader());
		contextDTO.setOrderingPhysician(vhisExamDetail.getOrderingPhysician());
		contextDTO.setResource(resource);
	}
	
	@Given("^selects \"([^\"]*)\" procedure for appointment time in VHIS$")
	public void selects_procedure_for_appointment_time_in_VHIS(String procedure) throws Throwable {
		vhisExamDetail.selectProcedure(procedure);
		contextDTO.setAppointmentTime(vhisExamDetail.getAppointmentTime());
		vhisExamDetail.clickSubmit();
	}
	
	@Given("^selects \"([^\"]*)\" procedure for appointment time and begin time in VHIS$")
	public void selects_procedure_for_appointment_time_and_begin_time_in_VHIS(String procedure) throws Throwable {
		vhisExamDetail.selectProcedure(procedure);
		contextDTO.setAppointmentTime(vhisExamDetail.getAppointmentTime());
		contextDTO.setBeginTime(vhisExamDetail.getBeginTime());;
		vhisExamDetail.clickSubmit();
	}
	
	@Given("^selects \"([^\"]*)\" procedure for appointment time, begin time and exam end time in VHIS$")
	public void selects_procedure_for_appointment_time_begin_time_and_exam_end_time_in_VHIS(String procedure) throws Throwable {
		vhisExamDetail.selectProcedure(procedure);
		contextDTO.setAppointmentTime(vhisExamDetail.getAppointmentTime());
		contextDTO.setBeginTime(vhisExamDetail.getBeginTime());;
		contextDTO.setExamEndTime(vhisExamDetail.getEndExamTime());
		vhisExamDetail.clickSubmit();
	}

	@Given("^select the ordering physician name as blank$")
	public void select_the_ordering_physician_name_as_blank() throws Throwable {
	    vhisExamDetail.selectOrderingPysicianNameBlank();
	}

}

