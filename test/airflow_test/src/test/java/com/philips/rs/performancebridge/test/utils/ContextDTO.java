package com.philips.rs.performancebridge.test.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ContextDTO {

	private String accessionNumber;
	private String groupName;
	private String kioskNumber;
	private String resource;
	private String mrn;
	private String orderingPhysician;
	private String appointmentTime;
	private String beginTime;
	private String examEndTime;
	private String userName;
	private int examCardCount;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getAccessionNumber() {
		return accessionNumber;
	}

	public void setAccessionNumber(String accessionNumber) {
		this.accessionNumber = accessionNumber;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getKioskNumber() {
		return kioskNumber;
	}

	public void setKioskNumber(String kioskNumber) {
		this.kioskNumber = kioskNumber;
	}

	public String getResource() {
		return resource;
	}

	public void setResource(String resource) {
		this.resource = resource;
	}

	public String getMrn() {
		return mrn;
	}

	public void setMrn(String mrn) {
		this.mrn = mrn;
	}

	public void setOrderingPhysician(String orderingPhysician) {
		this.orderingPhysician = orderingPhysician;
	}

	public String getOrderingPhysician() {
		return orderingPhysician;
	}

	public void setAppointmentTime(String appointmentTime) {
		this.appointmentTime = appointmentTime;
	}

	public String getAppointmentTime() throws Exception {
		return convertTime(appointmentTime);
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	public String getBeginTime() throws Exception {
		return convertTime(beginTime);
	}

	public void setExamEndTime(String examEndTime) {
		this.examEndTime = examEndTime;
	}

	public String getExamEndTime() throws Exception {
		return convertTime(examEndTime);
	}

	public String convertTime(String timeFrame) throws ParseException {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm aa");
		Date date = (Date) dateFormat.parse(timeFrame);
		String dateString = new SimpleDateFormat("MMMM d'th' yyyy, HH:mm").format(date);
		return dateString;
	}
	
	public void setExamCardCount(int count)
	{
		this.examCardCount=count;
	}
	
	public int getExamCardCount()
	{
		return examCardCount;
	}
}
