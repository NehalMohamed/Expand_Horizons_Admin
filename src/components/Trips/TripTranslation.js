import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { GetTripTranslationGrp } from "../../slices/tripSlice";
import LoadingPage from "../Loader/LoadingPage";
import TranslationTab from "./TranslationTab";
import TripHeader from "./TripHeader";
function TripTranslation() {
  const dispatch = useDispatch();
  const [trip_id, setTrip_id] = useState(0);
  const [activeTab, setActiveTab] = useState("en");
  const { loading, error, TranslationsData } = useSelector(
    (state) => state.trips
  );
  const handleTripChange = (trip) => {
    setTrip_id(trip?.id);
    dispatch(GetTripTranslationGrp(trip?.id));
  };
  //   useEffect(() => {
  //     dispatch(GetTrip_Mains(0));
  //     return () => {};
  //   }, [dispatch]);
  return (
    <section className="layout_section">
      <TripHeader
        title="Trip Translation"
        handleTripChange={handleTripChange}
      />
      <hr className="divider" />
      {/* <div className="d-flex justify-content-between align-items-center header_title">
        <h2 className="mb-4 page-title">Trip Translation</h2>
        <div className="position-relative" style={{ width: "250px" }}>
          <Form.Group controlId="service">
            <Form.Control
              as="select"
              name="trip_id"
              onChange={handleTripChange}
              value={trip_id}
              required
              className="formInput"
            >
              <option value="">select trip</option>
              {TripsMain &&
                TripsMain?.map((trip, index) => (
                  <option key={index} value={trip.id}>
                    {trip.trip_code} - {trip.trip_default_name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </div>
      </div> */}
      {trip_id > 0 ? (
        <div className="result_list">
          {TranslationsData && TranslationsData.length > 0 ? (
            <Tabs
              // id="controlled-tab-trips"
              //activeKey={TranslationsData[0]?.lang_code}
              // activeKey={activeLang}
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
      {/* <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      /> */}
    </section>
  );
}

export default TripTranslation;
