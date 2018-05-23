import Calendar from "../../app/components/Calendar";
import Overview from "../../app/components/Overview";

import {flushAllPromises, mountAirflow} from "../helpers";

describe("<Airflow>", () => {
  it("renders a Calendar", async () => {
    const {airflow} = mountAirflow("calendar");

    expect(airflow.find("img.spinner").exists()).toEqual(true);

    await flushAllPromises();
    airflow.update();

    // After the componentDidMount initial fetches happen
    expect(airflow.find("img.spinner").exists()).toEqual(false);
    expect(airflow.find(Calendar).exists()).toEqual(true);
  });

  it("renders the Overview", async () => {
    const {airflow} = mountAirflow("overview");

    expect(airflow.find("img.spinner").exists()).toEqual(true);

    await flushAllPromises();
    airflow.update();

    // After the componentDidMount initial fetches happen
    expect(airflow.find("img.spinner").exists()).toEqual(false);
    expect(airflow.find(Overview).exists()).toEqual(true);
  });
});
