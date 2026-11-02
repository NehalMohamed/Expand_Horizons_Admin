import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import DestinationDropDown from "./DestinationDropDown";
import { GetTripCategories } from "../../slices/tripSlice";
import {
  GetTripTypesByDestination,
  clearDestinationTypes,
  SaveDestinationTypes,
} from "../../slices/destinationSlice";
import Swal from "sweetalert2";
function CategoriesConfiguration() {
  const dispatch = useDispatch();
  // Currently selected destination identifier
  const [destination_id, setDestinationId] = useState(0);

  // Selected destination route used when generating image file names
  const [CategoryId, setCategoryId] = useState(0);
  const { TripCategories } = useSelector((state) => state.trips);
  const { DestTripTypes } = useSelector((state) => state.destinations);
  //   const [formData, setFormData] = useState({
  //     isChecked: false,
  //     DestinationId: 0,
  //     TripTypeId: 0,
  //     TripCategoryId: 0,
  //     IsActive: true,
  //     DisplayOrder: 0,
  //   });
  useEffect(() => {
    dispatch(GetTripCategories());

    return () => {};
  }, [dispatch]);
  useEffect(() => {
    dispatch(clearDestinationTypes());
    return () => {};
  }, [dispatch, destination_id, CategoryId]);
  const GetTypes = () => {
    dispatch(
      GetTripTypesByDestination({
        destinationId: destination_id,
        CategoryId: CategoryId,
      }),
    );
  };
  const handleInputChange = (dest) => {
    // const id = e.target.value;
    setDestinationId(dest?.id);
  };
  const handleTypeChange = (e, typ) => {
    console.log(typ);

    let checked = e.target.checked;

    let data = {
      isChecked: checked,
      DestinationId: destination_id,
      TripTypeId: typ.tripTypeId,
      TripCategoryId: typ.tripCategoryId,
      IsActive: true,
      DisplayOrder: 0,
      id: typ.id,
    };

    dispatch(SaveDestinationTypes(data)).then((result) => {
      if (result.payload && result.payload.success) {
        dispatch(
          GetTripTypesByDestination({
            destinationId: destination_id,
            CategoryId: CategoryId,
          }),
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.payload?.message,
        });
      }
    });
  };
  return (
    <section className="layout_section">
      <div className="header_title">
        <h2 className="mb-4 page-title">Categories & Types</h2>
        {/* <small>Manage categories and trip types for each destination.</small> */}
        <Row>
          <Col lg={5} xs={12}>
            {" "}
            <DestinationDropDown handleChange={handleInputChange} />
          </Col>
          <Col lg={5} xs={12}>
            {" "}
            <Form.Group>
              {/* <Form.Label>Trip Category</Form.Label> */}
              <Form.Control
                as="select"
                name="TripCategoryId"
                onChange={(e) => {
                  setCategoryId(e.target.value);
                }}
                value={CategoryId}
                required
                className="formInput"
              >
                <option value="">select category</option>
                {TripCategories &&
                  TripCategories?.map((cat, index) => (
                    <option key={index} value={cat.id}>
                      {cat.category_code} - {cat.category_name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col lg={2} xs={12}>
            <button
              type="button"
              className="btn green-btn"
              disabled={destination_id == 0 || CategoryId == 0}
              onClick={GetTypes}
            >
              Get Types
            </button>
          </Col>
        </Row>{" "}
      </div>
      <hr className="divider" />
      {destination_id > 0 ? (
        <div className="result_list">
          <Form>
            <Row>
              {DestTripTypes && DestTripTypes.length > 0 ? (
                DestTripTypes.map((typ, index) => (
                  <Col md={6} xs={12} key={index}>
                    <Form.Check
                      type="checkbox"
                      id={`check-${index}`}
                      label={typ.type_name}
                      className="fac_check"
                      checked={typ.isChecked}
                      onChange={(e) => handleTypeChange(e, typ)}
                    />
                  </Col>
                ))
              ) : (
                <div className="centerSection">
                  <p>No data</p>
                </div>
              )}
            </Row>
          </Form>
        </div>
      ) : (
        // Display placeholder until a trip is selected
        <div className="centerSection">
          <p>No data</p>
        </div>
      )}
    </section>
  );
}

export default CategoriesConfiguration;
