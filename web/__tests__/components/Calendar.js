import Calendar from "../../app/components/Calendar";
import BaseNotecard from "../../app/components/Notecard/BaseNotecard";

import {flushAllPromises, mountAirflow} from "../helpers";

describe("<Calendar>", () => {
  let calendar;

  beforeEach(async () => {
    const {airflow} = mountAirflow("calendar");
    await flushAllPromises();
    airflow.update();

    calendar = airflow.find(Calendar);
  });

  it("renders 5 BaseNotecards (6 orders, 2 are grouped)", async () => {
    expect(calendar.find(BaseNotecard).length).toEqual(5);
  });
});
