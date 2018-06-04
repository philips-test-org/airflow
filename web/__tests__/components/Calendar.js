import Calendar from "../../app/components/Calendar";
import BaseNotecard from "../../app/components/Notecard/BaseNotecard";

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

  it("renders 5 BaseNotecards (6 orders, 2 are grouped)", async () => {
    expect(calendar.find(BaseNotecard)).toHaveLength(5);
  });

  it("filters cards based on mrn", async () => {
    expect(calendar.find(".notecard")).toHaveLength(5);

    const input = airflow.find("#search-field");
    input.instance().value = "2174069";
    input.simulate("change");

    // 1 card matches, so 4 are filtered out of the 5
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(4);
  });

  it("filters cards based on name", async () => {
    expect(calendar.find(".notecard")).toHaveLength(5);

    const input = airflow.find("#search-field");
    input.instance().value = "Marnell";
    input.simulate("change");

    // 1 card matches, so 4 are filtered out of the 5
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(4);
  });

  it("filters cards based on rad exam accession", async () => {
    expect(calendar.find(".notecard")).toHaveLength(5);

    const input = airflow.find("#search-field");
    input.instance().value = "2174070";
    input.simulate("change");

    // 1 card matches, so 4 are filtered out of the 5
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(4);
  });

  it("filters cards based on rad exam precedure description", async () => {
    expect(calendar.find(".notecard")).toHaveLength(5);

    const input = airflow.find("#search-field");
    input.instance().value = "XORPDF";
    input.simulate("change");

    // 1 card matches, so 4 are filtered out of the 5
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(4);
  });

  it("filters cards based on precedure code", async () => {
    expect(calendar.find(".notecard")).toHaveLength(5);

    const input = airflow.find("#search-field");
    input.instance().value = "CT-2554";
    input.simulate("change");

    // 1 card matches, so 4 are filtered out of the 5
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(4);
  });

  it("filters cards based on precedure code", async () => {
    expect(calendar.find(".notecard")).toHaveLength(5);

    const input = airflow.find("#search-field");
    input.instance().value = "890FSDFS";
    input.simulate("change");

    // 1 card matches, so 4 are filtered out of the 5
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(4);
  });
});
