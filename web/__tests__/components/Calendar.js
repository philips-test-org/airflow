import Calendar from "../../app/components/Calendar";
import BaseNotecard from "../../app/components/Notecard/BaseNotecard";
import OrderModal from "../../app/components/OrderModal";
import fetchMock from "fetch-mock";
import moment from "moment";

import afterMidnightExams from "../mockState/afterMidnightExams";
import noDurationExams from "../mockState/noDurationExams";
import {flushAllPromises, mountAirflow} from "../helpers";

describe("<Calendar>", () => {
  let airflow;
  let calendar;

  beforeEach(async () => {
    airflow = mountAirflow("calendar").airflow;
    await flushAllPromises();
    airflow.update();

    calendar = airflow.find(Calendar);
  });

  it("renders 6 BaseNotecards (8 orders, 2 groups of 2)", async () => {
    expect(calendar.find(BaseNotecard)).toHaveLength(6);
  });

  it("filters cards based on mrn", async () => {
    expect(calendar.find(".notecard")).toHaveLength(6);

    const input = airflow.find("#search-field");
    input.instance().value = "2174069";
    input.simulate("change");

    // 1 card matches, so 5 are filtered out of the 6
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(5);
  });

  it("filters cards based on name", async () => {
    expect(calendar.find(".notecard")).toHaveLength(6);

    const input = airflow.find("#search-field");
    input.instance().value = "Marnell";
    input.simulate("change");

    // 1 card matches, so 5 are filtered out of the 6
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(5);
  });

  it("filters cards based on rad exam accession", async () => {
    expect(calendar.find(".notecard")).toHaveLength(6);

    const input = airflow.find("#search-field");
    input.instance().value = "2174070";
    input.simulate("change");

    // 1 card matches, so 5 are filtered out of the 6
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(5);
  });

  it("filters cards based on rad exam precedure description", async () => {
    expect(calendar.find(".notecard")).toHaveLength(6);

    const input = airflow.find("#search-field");
    input.instance().value = "XORPDF";
    input.simulate("change");

    // 1 card matches, so 5 are filtered out of the 6
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(5);
  });

  it("filters cards based on precedure code", async () => {
    expect(calendar.find(".notecard")).toHaveLength(6);

    const input = airflow.find("#search-field");
    input.instance().value = "CT-2554";
    input.simulate("change");

    // 1 card matches, so 5 are filtered out of the 6
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(5);
  });

  it("filters cards based on precedure code", async () => {
    expect(calendar.find(".notecard")).toHaveLength(6);

    const input = airflow.find("#search-field");
    input.instance().value = "890FSDFS";
    input.simulate("change");

    // 1 card matches, so 5 are filtered out of the 6
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(5);
  });

  it("closes the modal when clicking off the modal", async () => {
    expect(airflow.find(OrderModal)).toHaveLength(0);

    airflow.find(".notecard").first().simulate("click");
    expect(airflow.find(OrderModal)).toHaveLength(1);

    airflow.find("#order-modal").simulate("click");
    expect(airflow.find(OrderModal)).toHaveLength(0);
  });
});

describe("<Calendar> card", () => {
  it("does not have a duration that goes past midnight", async () => {
    // Couldn't figure out how to change the exams fetch without redoing them all
    fetchMock.restore();
    fetchMock.get("glob:/exams*", afterMidnightExams, {overwriteRoutes: false});
    fetchMock.get("/employees/current?", {
      active: true,
      fte: 1,
      id: 21,
      name :"Some Person",
      person_id: 21,
      updated_at: "2017-11-09T14:00:37-05:00",
    });
    fetchMock.get("glob:/persons/*", []);

    const airflow = mountAirflow("calendar", {board: {startDate: moment("2018-05-16T04:00:00.000Z")}}).airflow;
    await flushAllPromises();
    airflow.update();

    const calendar = airflow.find(Calendar);

    calendar.find(BaseNotecard).forEach(card => {
      expect(card.prop("style").height).toEqual("500px");
    });
  });

  it("has card height of 30 seconds if no duration given in orders that are merged", async () => {
    // Couldn't figure out how to change the exams fetch without redoing them all
    fetchMock.restore();
    fetchMock.get("glob:/exams*", noDurationExams, {overwriteRoutes: false});
    fetchMock.get("/employees/current?", {
      active: true,
      fte: 1,
      id: 21,
      name :"Some Person",
      person_id: 21,
      updated_at: "2017-11-09T14:00:37-05:00",
    });
    fetchMock.get("glob:/persons/*", []);

    const airflow = mountAirflow("calendar", {board: {startDate: moment("2018-05-16T04:00:00.000Z")}}).airflow;
    await flushAllPromises();
    airflow.update();

    const calendar = airflow.find(Calendar);

    calendar.find(BaseNotecard).forEach(card => {
      expect(card.prop("style").height).toEqual("30px");
    });
  });
});
