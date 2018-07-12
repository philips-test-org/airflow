package com.philips.rs.performancebridge.test.utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import org.apache.poi.xwpf.usermodel.UnderlinePatterns;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;

public class Reporter {

	public static XWPFTableRow rowDetail = null;
	public static XWPFTable testInfoTableInDetail = null;
	public static XWPFDocument document = new XWPFDocument();

	public void ScriptValidationReport() throws IOException {

		File file = new File("C://Temp//create_table.docx");
		if (!file.exists())
			file.createNewFile();
		FileOutputStream out = new FileOutputStream(file);

		// Creation oF Test Info TAble
		XWPFParagraph paragraph = document.createParagraph();
		XWPFRun testInfo = paragraph.createRun();

		testInfo.setBold(true);
		testInfo.setFontSize(15);
		testInfo.setUnderline(UnderlinePatterns.SINGLE);
		testInfo.setText("Test Info:");

		XWPFTable testInfoTable = document.createTable();
		XWPFTableRow row = testInfoTable.getRow(0);
		row.getCell(0).setText("Feature Name");
		row.addNewTableCell().setText(ScenarioCleanUp.featurename);
		String testInfofiled = UITestUtils.readPropertyFile("/report.properties", "testInfofeilds");
		String tsetInfo[] = testInfofiled.split(",");

		for (int i = 1; i < tsetInfo.length; i++) {
			row = testInfoTable.createRow();
			row.getCell(0).setText(tsetInfo[i]);
			row.getCell(1).setText(ScenarioCleanUp.scname);
		}

		// Detailed Table Creation Block
		document.createParagraph().createRun().addBreak();
		testInfoTableInDetail = document.createTable();

		rowDetail = testInfoTableInDetail.getRow(0);
		String testInfoDetailfield = UITestUtils.readPropertyFile("/report.properties", "testInfoInDetails");
		String testInfoDetailField[] = testInfoDetailfield.split(",");

		for (int i = 0; i < testInfoDetailField.length; i++) {
			if (i == 0) {
				rowDetail.getCell(i).setText(testInfoDetailField[i]);
			} else
				rowDetail.addNewTableCell().setText(testInfoDetailField[i]);
		}

		document.write(out);
		out.flush();
		out.close();

	}

	public static void featureStepInfo(String Description, String Expected) throws IOException {

		FileOutputStream out = new FileOutputStream(new File("C://Temp//create_table.docx"));
		rowDetail = testInfoTableInDetail.createRow();
		rowDetail.getCell(1).setText(Description);
		rowDetail.getCell(2).setText(Expected);

		document.write(out);
		out.flush();
		out.close();

	}

	public static void featureStepResult(String actual, String AutomationStatus) {

		FileOutputStream out = null;
		try {
			out = new FileOutputStream(new File("C://Temp//create_table.docx"));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		int rowNumber = testInfoTableInDetail.getNumberOfRows();

		rowDetail = testInfoTableInDetail.getRow(rowNumber - 1);
		rowDetail.getCell(3).setText(actual);
		rowDetail.getCell(4).setText(AutomationStatus);
		try {
			document.write(out);
			out.flush();
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
