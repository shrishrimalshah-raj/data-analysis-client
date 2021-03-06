import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import {
  DailyChartOI,
  NiftyChart,
  MixedChartOI,
  SelectComponent,
  FilterByPickers,
  PieChart,
} from "../components";

import config from "../../../config";

const CLIENTIndexBar = () => {
  const { serviceURL } = config;
  const [lastRecord, setLastRecord] = useState(10);
  const [filterBy, setFilterBy] = useState("");
  const [clientURL, setClientURL] = useState(
    `${serviceURL}/client/index/${lastRecord}`
  );
  const [niftyURL, setNiftyURL] = useState(
    `${serviceURL}/nifty/index/${lastRecord}`
  );

  // clientData, setClientData
  const [clientData, setClientData] = useState([]);
  const [niftyData, setNiftyData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const requestOne = axios.get(clientURL);
      const requestTwo = axios.get(niftyURL);

      axios
        .all([requestOne, requestTwo])
        .then(
          axios.spread((...responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];

            setClientData(responseOne.data.data);
            setNiftyData(responseTwo.data.data);
          })
        )
        .catch((errors) => {
          console.error(errors);
        });
    }

    fetchData();
  }, [clientURL, niftyURL]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setFilterBy(value);
  };

  return (
    <>
      <SelectComponent filterBy={filterBy} handleChange={handleChange} />

      {filterBy !== "" && (
        <FilterByPickers
          setClientURL={setClientURL}
          setNiftyURL={setNiftyURL}
          filterBy={filterBy}
          lastRecord={lastRecord}
          setLastRecord={setLastRecord}
          url="client/index"
          clientCode="CLIENT INDEX DATA OI"
        />
      )}

      {/* DAILY LONG AND SHORT POSITION CHART */}
      <DailyChartOI
        name="Daily Long and Short Position"
        data={clientData}
        title="CLIENT INDEX DATA OI CHANGE 2020"
      />

      {/* NIFTY CHART */}
      <NiftyChart name="NIFTY CHART" data={niftyData} />

      {/* NIFTY CHART */}
      <MixedChartOI
        name="NIFTY CHART"
        data={niftyData}
        filterColumn={["date", "close"]}
      />

      {/* LONG AND SHORT POSITION CHART */}
      <MixedChartOI
        name="Long and Short Position"
        data={clientData}
        filterColumn={["date", "longPosition", "shortPosition"]}
        extraColumn={["dailyLongPercentage", "dailyShortPercentage"]}
      />

      {/* NET POSITION CHART */}
      <MixedChartOI
        name="Net Position"
        data={clientData}
        filterColumn={["date", "netPosition"]}
        color={["#a52714"]}
      />

      {/*DAILY PERCENTAGE POSITION CHART */}
      <PieChart
        data={clientData}
        filterColumn={["dailyLongPercentage", "dailyShortPercentage"]}
        clientCode="CLIENT INDEX POSITION"
        name="DAILY PERCENTAGE POSITION CHART"
      />
    </>
  );
};

export default CLIENTIndexBar;
