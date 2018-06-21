import Overview from "../../app/components/Overview";
import BaseNotecard from "../../app/components/Notecard/BaseNotecard";

import {flushAllPromises, mountAirflow} from "../helpers";

describe("<Overview>", () => {
  let airflow;
  let overview;

  beforeEach(async () => {
    airflow = mountAirflow("overview").airflow;
    await flushAllPromises();
    airflow.update();

    overview = airflow.find(Overview);
  });

  it("renders 6 BaseNotecards (8 orders, 2 groups of 2)", async () => {
    expect(overview.find(BaseNotecard)).toHaveLength(6);
  });

  it("filters cards based on mrn", async () => {
    expect(overview.find(".notecard")).toHaveLength(6);

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
    expect(overview.find(".notecard")).toHaveLength(6);

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
    expect(overview.find(".notecard")).toHaveLength(6);

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
    expect(overview.find(".notecard")).toHaveLength(6);

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
    expect(overview.find(".notecard")).toHaveLength(6);

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
    expect(overview.find(".notecard")).toHaveLength(6);

    const input = airflow.find("#search-field");
    input.instance().value = "890FSDFS";
    input.simulate("change");

    // 1 card matches, so 5 are filtered out of the 6
    const filteredCardsCount = airflow.find(BaseNotecard).reduce((acc, notecard) => (
      notecard.prop("isFiltered") ? acc + 1 : acc
    ), 0);
    expect(filteredCardsCount).toEqual(5);
  });
});
