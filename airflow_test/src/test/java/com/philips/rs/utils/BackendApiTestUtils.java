package com.philips.rs.utils;

import gherkin.deps.com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.TimeZone;
import java.util.jar.JarException;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.log4j.Logger;
//import org.json.simple.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.JSONValue;
import org.junit.Assert;
import org.omg.CORBA.UnknownUserException;

public class BackendApiTestUtils {
	public static Properties CONFIG;
	public static Logger logger = Logger.getLogger(BackendApiTestUtils.class);
	JSONObject rolesAndNames = new JSONObject();
	public static String sisenseURL = "";
	public static String SysAdminUsername = "";
	public static String SysAdminPassword = "";
	public static String timezone = "";
	public static String sisenseRestApiForLogin = "";
	public static String sisenseRestApiForCreatingSisenseUser = "";
	public static String sienseAuthToken = "";
	public static String payloadForSisenseUserCreation = "";
	public static String roleId = "";
	public static String sisenseRestApiForRoles = "";
	public static String sisenseRestApiForGettingAllExistingUsers = "";
	public static String sisenseRestApiForCreatingADUser = "";
	public static String sisenseRestApiForGettingLdapDetails = "";
	public static String sisenseRestApiToStartPMTDMBuild = "";
	public static String sisenseRestApiForStatusOfBuild = "";
	public static String sisenseRestApiForDeletingSisenseUser="";
	public static String sisenseRestApiToLogout="";
	public static String sisenseRestApiForGettingDashboardId ="";
	public static String sisenseRestApiForGettingAllDashboards="";
	public static String sisenseRestApiForGettingUserId = "";
	public static String sisenseRestApiForDeletingDashboard = "";
	public static String sisenseRestApiForDeletingDahboardFolder = "";
	public static String ldapDomainID = "";
	public static String email = "";
	public static String tempPayload = "";
	public static long start;
	public static long end;
	public static float timeTakenToBuild;
	public static CloseableHttpClient httpClient = null;
	public static String buildStartTime = null;
	public static String buildEndTime = null;
	public static String userID;
	public static String Volume="";
  // ScenarioCleanupData scenarioCleanupData = new ScenarioCleanupData();
	
	public BackendApiTestUtils() {
		sisenseURL = readPropertyFile("/application.properties", "sisenseURL");
		SysAdminUsername = readPropertyFile("/application.properties",
				"SysAdminUsername");
		SysAdminPassword = readPropertyFile("/application.properties",
				"SysAdminPassword");
		timezone = readPropertyFile("/application.properties", "Timezone");
		Volume = readPropertyFile("/application.properties", "Volume");
	}

	/**
	 * Start cube build
	 */
	public void startCubeBuild() throws KeyManagementException, JarException,
			NoSuchAlgorithmException, KeyStoreException, IOException,
			InterruptedException, JSONException {

		logger.info("Start the cube build");
		// get authorization code by logging into sisense application
		getAuthorizationToken(SysAdminUsername, SysAdminPassword);

		// Get RestAPIURL to start PMTDM build
		sisenseRestApiToStartPMTDMBuild = getUrlForAPICalls("sisenseRestApiToStartPMTDMBuild");

		HttpPost httpPost = new HttpPost(sisenseRestApiToStartPMTDMBuild);
		httpPost.setHeader("Content-Type", "application/json");
		httpPost.setHeader("Accept", "application/json");
		httpPost.setHeader("Authorization", "Bearer " + sienseAuthToken);
		HttpResponse httpResponse = httpClient.execute(httpPost);

		// verify statusCode is 200
		logger.info("Build start response  = " + httpResponse.getStatusLine());
		try {
			Assert.assertEquals(200, httpResponse.getStatusLine()
					.getStatusCode());
		} catch (AssertionError e) {
			if (httpResponse.getStatusLine().getStatusCode() == 400)
				Assert.fail("Last cube build is still progressing");
		}

		buildStartTime = currentDateAndTimeInGivenTimeZone(timezone);
		Thread.sleep(5000);

	}

	public String currentDateAndTimeInGivenTimeZone(String timezoneGiven) {
		TimeZone timezone = TimeZone.getTimeZone(timezoneGiven);
		Calendar calendar = Calendar.getInstance(timezone);
		@SuppressWarnings("static-access")
		int day = calendar.get(calendar.DATE);

		SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy HH:mm");
		
		//SimpleDateFormat formatter = getFormattedDate(day);
		formatter.setCalendar(calendar);
		formatter.setTimeZone(timezone);
		return formatter.format(calendar.getTime());
	}

	public static SimpleDateFormat getFormattedDate(int day) {
		if (!((day > 10) && (day < 19)))
			switch (day % 10) {
			case 1:
				return new SimpleDateFormat("MMMM d'st' 'at' hh:mm a");
			case 2:
				return new SimpleDateFormat("MMMM d'nd' 'at' hh:mm a");
			case 3:
				return new SimpleDateFormat("MMMM d'rd' 'at' hh:mm a");
			default:
				return new SimpleDateFormat("MMMM d'th' 'at' hh:mm a");
			}
		return new SimpleDateFormat("MMMM d'th' 'at' hh:mm a");
	}

	/**
	 * Get the status of Cube Build
	 */

	public void getCubeBuildStatus() throws KeyManagementException,
			JarException, NoSuchAlgorithmException, KeyStoreException,
			IOException, JSONException, InterruptedException {

		logger.info("Get the build status");

		// get authorization code by logging into sisense application
		getAuthorizationToken(SysAdminUsername, SysAdminPassword);

		// Get RestAPIURL to get status of build
		sisenseRestApiForStatusOfBuild = getUrlForAPICalls("sisenseRestApiForStatusOfBuild");

		boolean isBuildSucceded = false;
		
		do {
			HttpGet httpGet = new HttpGet(sisenseRestApiForStatusOfBuild);
			httpGet.addHeader("Accept", "application/json");
			httpGet.addHeader("Authorization", "Bearer " + sienseAuthToken);
			HttpResponse httpResponse = httpClient.execute(httpGet);
			logger.info("Build status response  = "+ httpResponse.getStatusLine());
			Assert.assertEquals(200, httpResponse.getStatusLine().getStatusCode());

			Gson gson = new Gson();
			JsonResponseCubeStatus[] jsonCubeResponse = gson.fromJson(BufferedReaderAndGetJsonObject(httpResponse),JsonResponseCubeStatus[].class);

			for (int i = 0; i < jsonCubeResponse.length; i++) {				
				JsonResponseCubeStatus status = jsonCubeResponse[i];
				if (status.getTitle().equals("PMTDM")&& status.getStatus() == 2) 
				{					
					isBuildSucceded = true;
					buildEndTime = currentDateAndTimeInGivenTimeZone(timezone);
					break;
				}
			}
		
			start = Date.parse(buildStartTime);
			if ((start - System.currentTimeMillis()) >= 600000) {
				isBuildSucceded = true;
				logger.info("Build is Stuck, Please check once");
			}

		} while (!isBuildSucceded);
	}

	/**
	 * Create sisense user through api
	 */

	@SuppressWarnings("null")
	public void createSisenseUser(String userName, String password, String role) {
		JSONObject jsnobj = null;
		// login to sisense as SystemAdmin
		getAuthorizationToken(SysAdminUsername, SysAdminPassword);
		// Get RestAPIURL to create sisense user
		sisenseRestApiForCreatingSisenseUser = getUrlForAPICalls("sisenseRestApiForCreatingSisenseUser");
		// form playload for creating sisenseUser
		try {
			formPayloadForCreatingSisenseUser(userName, password, role);
		} catch (IOException e1) {
			logger.error("Error while forming playload for sisense user");
		}
		// post the request to create user
		try {
			logger.info("Creating Sisense User");

			HttpPost httpPost = new HttpPost(
					sisenseRestApiForCreatingSisenseUser);
			httpPost.setHeader("Content-Type", "application/json");
			httpPost.setHeader("Accept", "application/json");
			httpPost.setHeader("Authorization", "Bearer " + sienseAuthToken);
			httpPost.setEntity(new StringEntity(payloadForSisenseUserCreation));
			HttpResponse httpResponse = httpClient.execute(httpPost);

			// verify the request is processed and httpResponse code is 200
			logger.info("Build start response  = "+ httpResponse.getStatusLine());
			Assert.assertEquals(200, httpResponse.getStatusLine().getStatusCode());
			String response = BufferedReaderAndGetJsonObject(httpResponse);
	
			Object obj = JSONValue.parse(response);
			org.json.simple.JSONArray finalResult = (org.json.simple.JSONArray) obj;
			org.json.simple.JSONArray jsonArr = (org.json.simple.JSONArray) finalResult.get(0);
			org.json.simple.JSONObject jsonSimpleObj = (org.json.simple.JSONObject) jsonArr.get(0);
			userID= jsonSimpleObj.get("_id").toString();
			//scenarioCleanupData.registerUserCreation(userId);
			ScenarioCleanupData scenarioCleanupData = ScenarioCleanupData.getScenarioCleanupData();
			scenarioCleanupData.registerUserCreation(userID);
	
		} catch (IOException e) {
			logger.error(e.getMessage());
			Assert.fail("Error creating Sisense users");
		} catch (Exception e) {
			logger.error(e.getMessage());
			try {
				if (jsnobj.get("status").toString().equals("error"));
				Assert.fail("Error While Creating Sisense User : ->"+jsnobj.get("message").toString());
			} catch (JSONException json) {
				logger.error(json.getMessage());
				Assert.fail("JSON error while getting status of the response");
			}
			Assert.fail("Error creating Sisense users: Sisense user is not created");
		}
	}

	/**
	 * Get authorization code for PMP application
	 */
	public String getAuthorizationToken(String username, String password) {
		JSONObject jsnobj = null;
		HttpResponse httpResponse = null;
		try {

			// create httpClient
			httpClient = getHTTPClient();

			// form play load
			String payloadForAuthToken = formPayloadForAutentication(username,
					password);

			sisenseRestApiForLogin = getUrlForAPICalls("sisenseRestApiForLogin");

			// create http post
			HttpPost httpPost = new HttpPost(sisenseRestApiForLogin);
			httpPost.setHeader("Content-Type", "application/json");
			httpPost.setHeader("Accept", "application/json");
			httpPost.setEntity(new StringEntity(payloadForAuthToken));
		   httpResponse = httpClient.execute(httpPost);

			// Read the httpRsponse and get JSON Object
			jsnobj = new JSONObject(
					BufferedReaderAndGetJsonObject(httpResponse));
			
			sienseAuthToken = jsnobj.get("access_token").toString();
			
		    

		} catch (UnsupportedOperationException e) {
			logger.error("Error obtaining Authentication token");
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			return null;
		} catch (IOException e) {
			Assert.fail("Error obtaining Authentication token");
			logger.error("Error obtaining Authentication token");
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
		} catch (JSONException e) {
			logger.error("Error obtaining Authentication token");
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			try {				
				return jsnobj.getJSONObject("error").getString("message");
			} catch (JSONException e1) {
				logger.error(e1.getMessage());
				Assert.fail("Error while obtaining error message");
			}
		} catch (Exception e) {
			logger.error("Error obtaining Authentication token");
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			return null;
		}
		return sienseAuthToken;

	}

	public String BufferedReaderAndGetJsonObject(HttpResponse httpResponse) {
		BufferedReader reader;
		String inputLine;
		StringBuffer response = null;
		@SuppressWarnings("unused")
		JSONObject jsnobj = null;
		try {
			reader = new BufferedReader(new InputStreamReader(httpResponse
					.getEntity().getContent()));
			response = new StringBuffer();
			while ((inputLine = reader.readLine()) != null) {
				response.append(inputLine);
			}
			reader.close();
		} catch (IOException e) {
			logger.error("Error while http post call");
			e.printStackTrace();
		} catch (UnsupportedOperationException e) {
			logger.error("Error obtaining httpResopnse");
			e.printStackTrace();
		}
		return response.toString();
	}

	/**
	 * Create http client
	 */
	public CloseableHttpClient getHTTPClient() {
		SSLContextBuilder builder = new SSLContextBuilder();

		CloseableHttpClient httpClient = null;
		try {
			builder.loadTrustMaterial(new TrustAllStrategy());
			@SuppressWarnings("deprecation")
			SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(
					builder.build(),
					SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);

			httpClient = HttpClients.custom().setSSLSocketFactory(sslsf)
					.build();
		} catch (NoSuchAlgorithmException e) {
			logger.error("Error while creating http client");
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
		} catch (KeyStoreException e) {
			logger.error("Error while creating http client");
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
		} catch (KeyManagementException e) {
			logger.error("Error while creating http client");
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return httpClient;
	}

	public static String formPayloadForAutentication(String userName,
			String password) {
		logger.info("Forming payload for generating Sisense Authentication token");
		String payloadForAuthToken = null;
		try {
			payloadForAuthToken = "{\"username\" : \"" + userName
					+ "\",\"password\" : \"" + password + "\"}";
			logger.info("Payload formed is " + payloadForAuthToken);
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
		}
		return payloadForAuthToken;
	}

	public String getUrlForAPICalls(String requestedAPI) {
		String requestedRestAPI = null;
		try {

			if (!sisenseURL.matches("null")) {
				logger.info("Forming URLs for REST API calls");

				switch (requestedAPI) {
				case "sisenseRestApiForRoles":
					requestedRestAPI = sisenseURL
							+ "/api/roles?includeManifest=true&compiledRoles=true";
					break;
				case "sisenseRestApiForLogin":
					requestedRestAPI = sisenseURL
							+ "/api/v1/authentication/login";
					break;
				case "sisenseRestApiForGettingAllExistingUsers":
					requestedRestAPI = sisenseURL + "/api/v1/users";
					break;
				case "sisenseRestApiForCreatingSisenseUser":
					requestedRestAPI = sisenseURL + "/api/users";
					break;
				case "sisenseRestApiForCreatingADUser":
					requestedRestAPI = sisenseURL + "/api/v1/users/ad";
					break;
				case "sisenseRestApiForGettingLdapDetails":
					requestedRestAPI = sisenseURL + "/api/v1/ldap_domains";
					break;
				case "sisenseRestApiToStartPMTDMBuild":
					requestedRestAPI = sisenseURL
							+ "/api/elasticubes/localhost/PMTDM/startBuild?type=Entire";
					break;
				case "sisenseRestApiForStatusOfBuild":
					requestedRestAPI = sisenseURL
							+ "/api/elasticubes/servers/localhost/status";
					break;
				case "sisenseRestApiForDeletingSisenseUser":
					requestedRestAPI = sisenseURL
					+ "/api/v1/users/";
					break;
				case "sisenseRestApiToLogout":
					requestedRestAPI = sisenseURL
					+ "/api/v1/authentication/logout";
					break;
				case "sisenseRestApiForGettingDashboardId":
					requestedRestAPI = sisenseURL+"/api/v1/dashboards?name=";
					break;
				case "sisenseRestApiForDeletingDashboard":
					requestedRestAPI = sisenseURL+"/api/v1/dashboards/";
					break;
				case "sisenseRestApiForGettingAllDashboards":
					requestedRestAPI = sisenseURL+"/api/v1/folders";
					break;
				case "sisenseRestApiForGettingUserId":
					requestedRestAPI = sisenseURL+"/api/v1/users";
					break;
				case "sisenseRestApiForDeletingDahboardFolder":
					requestedRestAPI = sisenseURL+"/api/v1/folders";
					break;
				}
			} else {
				logger.error("Sisense URL in config file is null. Retry entering correct Sisense URL.");
			}
		} catch (Exception e) {
			logger.error("Error occured in forming REST API calls. Cross check config file and retry.");
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
		}
		return requestedRestAPI;

	}

	public void formPayloadForCreatingSisenseUser(String userName,
			String password, String role) throws IOException {
		try {
			String userEmail = userName + "@philips.com";
			String firstName = userName;
			@SuppressWarnings("unused")
			String lastName = userName;
			String sisenseRoleId = getRoleIdFromRolename(role);
			payloadForSisenseUserCreation = "[{\"userName\": \""
					+ userName
					+ "\",\"roleId\": \""
					+ sisenseRoleId
					+ "\",\"email\": \""
					+ userEmail
					+ "\",\"firstName\": \""
					+ firstName
					// + "\",\"lastName\": \""
					// + lastName
					+ "\",\"activeDirectory\": false,\"groups\": [],\"preferences\": { \"localeId\": \"string\",\"language\": \"string\"},\"password\": \""
					+ password + "\"}]";

		} catch (JSONException e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
		}
	}

	private String getRoleIdFromRolename(String roleName) throws JSONException {
		switch (roleName) {
		case "Admin": {
			roleId = "admin";
		}
			break;
		case "Designer": {
			roleId = "contributor";
		}
			break;
		case "Viewer": {
			roleId = "consumer";
		}
			break;
		default: {
			logger.error("No such role exists.");
		}
		}
		return roleId;
	}
	
	@SuppressWarnings("static-access")
	public boolean deleteSisenseUsersCreated(String userID) 
	{
		HttpResponse httpResponse = null;
		@SuppressWarnings("unused")
		String response = null;
		boolean status = false;
		// login to sisense as SystemAdmin
		getAuthorizationToken(SysAdminUsername, SysAdminPassword);

		// Get RestAPIURL to delete sisense user
		sisenseRestApiForDeletingSisenseUser = getUrlForAPICalls("sisenseRestApiForDeletingSisenseUser");
		try {
			if (this.userID != null && userID != null) {
				if (userID.equals(this.userID)) {
					// create http post
					HttpDelete httpDelete = new HttpDelete(
							sisenseRestApiForDeletingSisenseUser + userID);
					httpDelete.setHeader("Content-Type", "application/json");
					httpDelete.setHeader("Authorization", "Bearer "
							+ sienseAuthToken);
					httpDelete.setHeader("Accept", "application/json");

					httpResponse = httpClient.execute(httpDelete);
					// response = BufferedReaderAndGetJsonObject(httpResponse);
					logger.info("Build start response  = "
							+ httpResponse.getStatusLine());
					Assert.assertEquals(204, httpResponse.getStatusLine()
							.getStatusCode());
					logger.info("User deleted successfully");
					status = true;
				/*	ScenarioCleanupData scenarioCleanupData = ScenarioCleanupData.getScenarioCleanupData();
					scenarioCleanupData.removeUserFromList(this.userID);
					logger.info("User Removed from list successfully");*/
				}
			}
		} catch (IOException e) {
			logger.error(e.getMessage());
		} catch (AssertionError e) {
			if (httpResponse.getStatusLine().getStatusCode() == 404)
				logger.info("User with id " + userID + " is not found");
				//Assert.fail("User with id " + userID + " is not found");
		}
		return status;
	}

	public void deleteAllCustomizedDashboard(String user,String dashboardFolder)
	{
		List<String> oid = getOwnerIdOfTheDashboardFolder(user,dashboardFolder) ;
		deleteDashboardsUnderGivenFolder(user,oid,dashboardFolder);
	}
	
	public void deleteDashboardsUnderGivenFolder(String user, List<String> oid,String dashboardFolder)
	{
		@SuppressWarnings("unused")
		int count =0;

		HttpResponse httpResponse = null;
		sisenseRestApiForDeletingDahboardFolder = getUrlForAPICalls("sisenseRestApiForDeletingDahboardFolder");

		for (int i = 0; i < oid.size(); i++) 
		{
			String deleteDashboardFolder_URL = sisenseRestApiForDeletingDahboardFolder
					+ "/" + oid.get(i);
			HttpDelete httpDelete = new HttpDelete(deleteDashboardFolder_URL);
			httpDelete.setHeader("Content-Type", "application/json");
			httpDelete.setHeader("Authorization", "Bearer " + sienseAuthToken);
			httpDelete.setHeader("Accept", "application/json");

			if (!(user.equals(SysAdminUsername))) {
				getAuthorizationToken(user, "Philips@123");	
			} else {
				getAuthorizationToken(SysAdminUsername, SysAdminPassword);
			}
			
			try {
				httpResponse = httpClient.execute(httpDelete);
				if (httpResponse.getStatusLine().getStatusCode() == 204) {
					
					logger.info("PASS : Dashboard under " + dashboardFolder
							+ " folder deleted successfully");
				} else {
					logger.info("PASS : No Customized Dashboards availble for user "
							+ user);
				}
			} catch (ClientProtocolException e) {
				logger.error(e.getMessage());
			} catch (IOException e) {
				logger.error(e.getMessage());
			}
		}
	}

	public List<String> getOwnerIdOfTheDashboardFolder(String user, String dashboardFolder)
	{
		HttpResponse httpResponse = null;
		String response = null;
		List<String> oId = new ArrayList<String>();
		String AdminPassword = readPropertyFile("/application.properties",
				"AdminPassword");
		if (!(user.equals(SysAdminUsername))) {
			getAuthorizationToken(user, AdminPassword);	
		} else {
			getAuthorizationToken(SysAdminUsername, SysAdminPassword);
		}
		 sisenseRestApiForGettingAllDashboards = getUrlForAPICalls("sisenseRestApiForGettingAllDashboards");
		   
		try {
			// create http Get
			HttpGet httpGet = new HttpGet(sisenseRestApiForGettingAllDashboards);
			httpGet.setHeader("Content-Type", "application/json");
			httpGet.setHeader("Authorization", "Bearer " + sienseAuthToken);
			httpGet.setHeader("Accept", "application/json");

			httpResponse = httpClient.execute(httpGet);
			Assert.assertEquals(200, httpResponse.getStatusLine()
					.getStatusCode());
			// Read the httpRsponse and get JSON Object
			response = BufferedReaderAndGetJsonObject(httpResponse);
			Object obj = JSONValue.parse(response);
			org.json.simple.JSONArray finalResult = (org.json.simple.JSONArray) obj;
			for(int i =0;i<finalResult.size();i++)
			{
				org.json.simple.JSONObject jsonSimpleObj = (org.json.simple.JSONObject) finalResult.get(i);
					if (jsonSimpleObj.get("name").toString().equals(dashboardFolder)) 
					{
						oId.add(jsonSimpleObj.get("oid").toString());
						
					}
				}
			
		} catch (IOException e) {
			logger.error(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return oId;	
	}
	
	public String getUserId(String user)
	{
		HttpResponse httpResponse = null;
		String response = null;
		String userId = null;
		getAuthorizationToken(SysAdminUsername, SysAdminPassword);
		sisenseRestApiForGettingUserId = getUrlForAPICalls("sisenseRestApiForGettingUserId");
		String geUserId_URL = sisenseRestApiForGettingUserId + "?userName="
				+ user;

		try {
			// create http Get
			HttpGet httpGet = new HttpGet(geUserId_URL);
			httpGet.setHeader("Content-Type", "application/json");
			httpGet.setHeader("Authorization", "Bearer " + sienseAuthToken);
			httpGet.setHeader("Accept", "application/json");

			httpResponse = httpClient.execute(httpGet);
			Assert.assertEquals(200, httpResponse.getStatusLine()
					.getStatusCode());
			// Read the httpRsponse and get JSON Object
			response = BufferedReaderAndGetJsonObject(httpResponse);
			System.out.println("response " + response);
			Object obj = JSONValue.parse(response);
			org.json.simple.JSONArray finalResult = (org.json.simple.JSONArray) obj;
			org.json.simple.JSONObject jsonSimpleObj = (org.json.simple.JSONObject) finalResult
					.get(0);
			userId = jsonSimpleObj.get("_id").toString();

		} catch (IOException e) {
			logger.error(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return userId;
	}
	
	public void deleteDashboard(String user, String dashboard) 
	{
		String password = "Philips@123";
		HttpResponse httpResponse = null;
		//@SuppressWarnings("unused")
		String response = null;
		String dashboardID = null;
		// login to sisense as SystemAdmin
		if (!(user.equals(SysAdminUsername))) {
			getAuthorizationToken(user, password);	
		} else {
			getAuthorizationToken(SysAdminUsername, SysAdminPassword);
		}
		// Get RestAPIURL to get the Dashboard ID
		sisenseRestApiForGettingDashboardId = getUrlForAPICalls("sisenseRestApiForGettingDashboardId");
		String getDashboardId_URL = sisenseRestApiForGettingDashboardId
				+ dashboard.replace(":", "%3A").replace(" ", "%20");

		try {
			// create http Get
			HttpGet httpGet = new HttpGet(getDashboardId_URL);
			httpGet.setHeader("Content-Type", "application/json");
			httpGet.setHeader("Authorization", "Bearer " + sienseAuthToken);
			httpGet.setHeader("Accept", "application/json");

			httpResponse = httpClient.execute(httpGet);
			Assert.assertEquals(200, httpResponse.getStatusLine()
					.getStatusCode());
			// Read the httpRsponse and get JSON Object
			response = BufferedReaderAndGetJsonObject(httpResponse);
			Object obj = JSONValue.parse(response);
			org.json.simple.JSONArray finalResult = (org.json.simple.JSONArray) obj;
			org.json.simple.JSONObject jsonSimpleObj = (org.json.simple.JSONObject) finalResult
					.get(0);
			dashboardID = jsonSimpleObj.get("oid").toString();
		} catch (IOException e) {
			logger.error(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		// Get RestAPIURL to delete dashboard
		sisenseRestApiForDeletingDashboard = getUrlForAPICalls("sisenseRestApiForDeletingDashboard");
		String deleteDashboard_URL = sisenseRestApiForDeletingDashboard
				+ dashboardID;

		if (!(user.equals(SysAdminUsername))) {
			getAuthorizationToken(user, password);
		} else {
			getAuthorizationToken(SysAdminUsername, SysAdminPassword);
		}
		
		// create http Delete
		HttpDelete httpDelete = new HttpDelete(deleteDashboard_URL);
		httpDelete.setHeader("Content-Type", "application/json");
		httpDelete.setHeader("Authorization", "Bearer " + sienseAuthToken);
		httpDelete.setHeader("Accept", "application/json");

		try {
			httpResponse = httpClient.execute(httpDelete);
			Assert.assertEquals(204, httpResponse.getStatusLine().getStatusCode());
			logger.info("PASS :"+dashboard +"deleted successfully");
		} catch (ClientProtocolException e) {
			logger.error(e.getMessage());
		} catch (IOException e) {
			logger.error(e.getMessage());
		}
	}
	public void currentUserLoggingOut() throws ClientProtocolException, IOException
	{

		// create httpClient
		httpClient = getHTTPClient();
		
		// Get RestAPIURL to logout 
		sisenseRestApiToLogout = getUrlForAPICalls("sisenseRestApiToLogout");
		
		HttpGet httpGet = new HttpGet(sisenseRestApiToLogout);
		httpGet.addHeader("Accept", "application/json");
		httpGet.addHeader("Authorization", "Bearer " + sienseAuthToken);
		HttpResponse httpResponse = httpClient.execute(httpGet);
		logger.info("Build status response  = "
				+ httpResponse.getStatusLine());
		Assert.assertEquals(204, httpResponse.getStatusLine()
				.getStatusCode());

	}
	
	
	public static boolean readHttpResponse(StringBuffer response) {
		boolean flag = false;
		String httpResponse = response.toString();
		try {
			JSONObject responseBody = new JSONObject(httpResponse);
			if (!responseBody.getString("status").matches("error")
					|| !responseBody.getString("userName").matches("null")) {
				flag = true;
			} else {
				// check if user exists here
			}
		} catch (JSONException e) {
			logger.error(e.getMessage());
			flag = false;
			logger.debug("Revist the rest api call");
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error(e.getStackTrace());
			flag = false;
		}
		return flag;
	}

	public String getBuildStartTime() {
		return buildStartTime;
	}

	public String getBuildEndTime() {
		return buildEndTime;
	}

	/*
	 * Reading value form property file
	 */
	public static String readPropertyFile(String fileName, String key) {
		CONFIG = new Properties();
		fileName = "src/test/resources" + fileName;
		try {
			InputStream inputStream = new FileInputStream(fileName);
			CONFIG.load(inputStream);
			
		} catch (IOException e) {
			logger.error("ERROR readin the properties file: " + fileName);
		}
		return CONFIG.getProperty(key);

	}
	


	public void captureException(Exception e) {
		logger.error(e.getMessage());
		logger.debug(e);
	}
	
	

	// ---------------------------------- Will make us of it later
	// ----------------------------------------------//

	/*
	 * public static HttpResponse executePostAPICall(String url, String payload)
	 * { HttpResponse httpResponse = null; try {
	 * 
	 * HttpPost httpPost = new HttpPost(url);
	 * 
	 * httpPost.setHeader("Content-Type", "application/json");
	 * httpPost.setHeader("Accept", "application/json");
	 * httpPost.setHeader("Authorization", "Bearer " + sienseAuthToken);
	 * 
	 * if (payload.equals(null)) { httpResponse = httpClient.execute(httpPost);
	 * } else { httpPost.setEntity(new StringEntity(payload)); httpResponse =
	 * httpClient.execute(httpPost); }
	 * 
	 * BufferedReader reader = new BufferedReader(new InputStreamReader(
	 * httpResponse.getEntity().getContent()));
	 * 
	 * String inputLine; StringBuffer response = new StringBuffer();
	 * 
	 * while ((inputLine = reader.readLine()) != null) {
	 * response.append(inputLine); } if (readHttpResponse(response) == true) {
	 * logger.info("POST Response Status:: " +
	 * httpResponse.getStatusLine().getStatusCode()); } else {
	 * logger.info("POST Response Status:: " +
	 * httpResponse.getStatusLine().getStatusCode());
	 * logger.error("An error ocured in adding the user ");
	 * logger.error(response); } reader.close(); httpClient.close();
	 * 
	 * } catch (UnsupportedOperationException e) {
	 * logger.error("Error !!! REST API call not executed properly");
	 * logger.error(e.getMessage()); logger.error(e.getStackTrace()); } catch
	 * (IOException e) {
	 * logger.error("Error !!! REST API call not executed properly");
	 * logger.error(e.getMessage()); logger.error(e.getStackTrace()); } catch
	 * (Exception e) {
	 * logger.error("Error !!! REST API call not executed properly");
	 * logger.error(e.getMessage()); logger.error(e.getStackTrace()); } return
	 * httpResponse; }
	 */
}
