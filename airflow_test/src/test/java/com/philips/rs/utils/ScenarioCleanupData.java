package com.philips.rs.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ScenarioCleanupData {
	
	private static  ScenarioCleanupData scenarioCleanupData = null;
	
	private ScenarioCleanupData()
	{
		
	}
	public static ScenarioCleanupData getScenarioCleanupData()
	{
		if(scenarioCleanupData == null)
		{
			scenarioCleanupData = new ScenarioCleanupData();
		}
		return scenarioCleanupData;
	}
	
	 private List<String> createdUsers = Collections.synchronizedList(new ArrayList<>());
	 
	 public void registerUserCreation(String username) {
	       createdUsers.add(username);
	    }
	 public void removeUserFromList(String username)
	 {
		 createdUsers.remove(username);
		 System.out.println("----------------------------number of users---- "+createdUsers.size()+"---------------------------");
	 }
	 
	 public List<String> listUserCreations() {
		 System.out.println("created User "+createdUsers);
	        return createdUsers;
	    }
	 
}
