import React, { useEffect, useState } from "react";
import { RadioBrowserApi } from "radio-browser-api";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import defaultImage from "./radio.png";

export default function Radio() {
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState();
  const [stationFilter, setStationFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    setupApi(stationFilter).then((data) => {
      console.log(data);
      setStations(data);
      setLoading(false);
    });
  }, [stationFilter]);

  const setupApi = async (stationFilter) => {
    const api = new RadioBrowserApi('Muse Radio App')
    console.log(api)
    const stations = await api
      .searchStations({
        language: "english",
        tag: stationFilter,
        limit: 30,
      })
      .then((data) => {
        return data;
      });

    return stations;
  };

  const filters = [
    "all",
    "classical",
    "country",
    "dance",
    "disco",
    "house",
    "jazz",
    "pop",
    "rap",
    "retro",
    "rock",
  ];

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return (
    <div className="radio">
      <div className="filters">
        {filters.map((filter) => (
          <span
            className={stationFilter === filter ? "selected" : ""}
            onClick={() => setStationFilter(filter)}
          >
            {filter}
          </span>
        ))}
      </div>
      <h3 style={{
  marginBottom: "2em"}}>Pick a genre, choose a station, start listening!</h3>

      <div className="stations">
        {loading ? <h1>Loading Stations...</h1> :
          <div>
            {stations &&
              stations.map((station, index) => {
                return (
                  <div className="station" key={index}>
                    <div className="stationName">
                      <img
                        className="logo"
                        src={station.favicon}
                        alt="station logo"
                        onError={setDefaultSrc}
                      />
                      <div className="name">{station.name.substring(0, Math.min(15, station.name.length))}</div>
                    </div>

                    <AudioPlayer
                      className="player"
                      src={station.urlResolved}
                      showJumpControls={false}
                      layout="stacked"
                      customProgressBarSection={[]}
                      customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                      autoPlayAfterSrcChange={false}
                    />
                  </div>
                );
              })}
          </div>}
        </div>
    </div>
  );
}
