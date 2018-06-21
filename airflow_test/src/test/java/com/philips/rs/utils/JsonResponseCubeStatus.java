package com.philips.rs.utils;

import java.io.Serializable;


public class JsonResponseCubeStatus implements Serializable{
	private static final long serialVersionUID = 1L;

	private int status;
	private String title;

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
