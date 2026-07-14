/**
 * TripTranslation Component
 *
 * Purpose:
 * - Manages multilingual translations for a selected trip.
 * - Displays one tab per supported language.
 * - Allows administrators to add or edit trip translations.
 *
 * Workflow:
 * 1. Select a trip using the TripHeader component.
 * 2. Load all available translations for the selected trip.
 * 3. Display each language as a separate tab.
 * 4. Edit translations using the TranslationTab component.
 *
 * Dependencies:
 * - Redux (tripSlice)
 * - TripHeader
 * - TranslationTab
 * - LoadingPage
 */
import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { GetTripTranslationGrp } from "../../slices/tripSlice";
import LoadingPage from "../Loader/LoadingPage";
import TranslationTab from "./TranslationTab";
import TripHeader from "./TripHeader";
function TripTranslation() {
  const dispatch = useDispatch();
  // Currently selected trip
  const [trip_id, setTrip_id] = useState(0);

  // Currently active language tab
  const [activeTab, setActiveTab] = useState("en");
  const { loading, error, TranslationsData } = useSelector(
    (state) => state.trips,
  );
  // Called when a trip is selected.
  // Loads all translation records for the selected trip.
  const handleTripChange = (trip) => {
    setTrip_id(trip?.id);
    dispatch(GetTripTranslationGrp(trip?.id));
  };

  return (
    <section className="layout_section">
      <TripHeader
        title="Trip Translation"
        handleTripChange={handleTripChange}
      />
      <hr className="divider" />

      {trip_id > 0 ? (
        <div className="result_list">
          {TranslationsData && TranslationsData.length > 0 ? (
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              //defaultActiveKey={TranslationsData[0]?.lang_code}
              className="mb-3"
              justify
            >
              {TranslationsData.map((data, index) => {
                const row = data.translation;
                return (
                  <Tab
                    eventKey={data.lang_code}
                    title={data.lang_code}
                    key={index}
                  >
                    <TranslationTab
                      key={`tab-${activeTab}`}
                      data={row}
                      trip_id={trip_id}
                      lang_code={data.lang_code}
                      RefreshList={() =>
                        dispatch(GetTripTranslationGrp(trip_id))
                      }
                    />
                  </Tab>
                );
              })}
            </Tabs>
          ) : (
            <div className="centerSection">
              <p>No data</p>
            </div>
          )}
        </div>
      ) : (
        <div className="centerSection">
          <p>No data</p>
        </div>
      )}

      {loading ? <LoadingPage /> : null}
    </section>
  );
}

export default TripTranslation;
