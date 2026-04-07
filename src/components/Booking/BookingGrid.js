import React, { useMemo, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { GetAllBooking } from "../../slices/BookingSlice";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import { Table, Pagination, Form, Col, Row, Button } from "react-bootstrap";
import { format } from "date-fns";
import { FaChevronUp, FaChevronDown, FaSearch, FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";
import { GetTrip_Mains } from "../../slices/tripSlice";
import DatePicker from "react-datepicker";
import "./Booking.scss";
function BookingGrid() {
  const dispatch = useDispatch();
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() + 1);
  const [query, setQuery] = useState("");
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  //   const [page, setPage] = useState(1);
  //   const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState({ key: null, dir: "asc" });
  const [date_from, setDate_from] = useState(new Date());
  const [date_to, setDate_to] = useState(newDate);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
  const [formData, setFormData] = useState({
    client_email: "",
    booking_code: "",
    trip_id: 0,
    date_from: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
    date_to: format(newDate, "dd-MM-yyyy HH:mm:ss"),
    pageNumber: currentPage,
    pageSize: itemsPerPage,
  });
  const { loading, error, BookingData } = useSelector((state) => state.booking);
  const { TripsMain } = useSelector((state) => state.trips);

  useEffect(() => {
    dispatch(GetAllBooking(formData));
    let data = { destination_id: 0, trip_type: 0 };
    dispatch(GetTrip_Mains(data));
    return () => {};
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(BookingData?.totalPages / itemsPerPage);
    setTotalPages(totalPages);
    return () => {};
  }, [BookingData]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // let req = { pageNumber: page, pageSize: itemsPerPage };
      formData["pageNumber"] = page;
      formData["itemsPerPage"] = itemsPerPage;
      dispatch(GetAllBooking(formData));
    }
  };
  const GetBookingByFilter = (e) => {
    e.preventDefault();
    formData["date_from"] = format(date_from, "dd-MM-yyyy hh:mm:ss");
    formData["date_to"] = format(date_to, "dd-MM-yyyy hh:mm:ss");
    dispatch(GetAllBooking(formData)).catch((error) => {
      setPopupMessage(error || "Failed to fetch booking");
      setPopupType("error");
      setShowPopup(true);
    });
  };
  // columns derived from keys of first row
  const columns = useMemo(() => {
    //const keys = data.length ? Object.keys(data[0]) : [];
    const keys = [
      { id: "booking_code", name: "booking code" },
      { id: "booking_status", name: "status" },
      { id: "trip_name", name: "trip name" },
      { id: "trip_datestr", name: "trip date" },
      { id: "total_pax", name: "Adult" },
      { id: "child_num", name: "child" },
      { id: "infant_num", name: "infant" },
      { id: "client_email", name: "client email" },
      { id: "client_phone", name: "client phone" },
      { id: "client_name", name: "client name" },
      { id: "pickup_address", name: "pickup address" },
      { id: "pickup_time", name: "pickup time" },
      { id: "is_two_way", name: "two way" },
      { id: "total_price", name: "total price" },
      { id: "trip_return_datestr", name: "Return Date" },
      { id: "child_ages", name: "child ages" },
    ];
    return keys; // keep id hidden as column in this example
  }, []);

  // filter
  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, query]);

  // sort
  //   const sorted = useMemo(() => {
  //     if (!sortBy.key) return filtered;
  //     const sortedCopy = [...filtered].sort((a, b) => {
  //       const va = a[sortBy.key];
  //       const vb = b[sortBy.key];
  //       if (va == null) return 1;
  //       if (vb == null) return -1;
  //       if (typeof va === "number" && typeof vb === "number") {
  //         return sortBy.dir === "asc" ? va - vb : vb - va;
  //       }
  //       return sortBy.dir === "asc"
  //         ? String(va).localeCompare(String(vb))
  //         : String(vb).localeCompare(String(va));
  //     });
  //     return sortedCopy;
  //   }, [filtered, sortBy]);

  // pagination
  //   const total = sorted.length;
  //   const totalPages = Math.max(1, Math.ceil(total / pageSize));
  //   const paged = useMemo(() => {
  //     const start = (page - 1) * pageSize;
  //     return sorted.slice(start, start + pageSize);
  //   }, [sorted, page, pageSize]);

  // Handlers
  const toggleSort = (key) => {
    if (sortBy.key === key) {
      setSortBy({ key, dir: sortBy.dir === "asc" ? "desc" : "asc" });
    } else {
      setSortBy({ key, dir: "asc" });
    }
  };

  const exportToExcel = () => {
    // exportAll: if true export filtered & sorted FULL set; if false export currently visible page
    const exportData = BookingData?.bookings;

    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Write workbook to binary array
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create blob and save
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(
      blob,
      `grid-data-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.xlsx`
    );
  };
  const fillFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section className="layout_section">
      <div className="d-flex justify-content-between align-items-center header_title">
        <h2 className="mb-4 page-title">Trips Booking</h2>
        <Button
          variant="light"
          onClick={() => setFilterExpanded(!filterExpanded)}
          className="filter-toggle-btn mb-4 mx-4"
        >
          {filterExpanded ? <FaChevronUp /> : <FaChevronDown />}
          <span className="ms-2">Filter</span>
        </Button>
      </div>
      {filterExpanded && (
        <div className="filter_panel">
          <Form>
            <Row>
              <Col md={6} xs={12}>
                <Form.Label className="formLabel">Date From</Form.Label>
                <DatePicker
                  selected={date_from}
                  onChange={(date) => setDate_from(date)}
                  className="date_picker"
                  dateFormat="dd-MM-yyyy"
                />
              </Col>
              <Col md={6} xs={12}>
                <Form.Label className="formLabel">Date To</Form.Label>
                <DatePicker
                  selected={date_to}
                  dateFormat="dd-MM-yyyy"
                  onChange={(date) => setDate_to(date)}
                  className="date_picker"
                />
              </Col>
            </Row>
            <Row>
              <Col md={4} xs={12}>
                {" "}
                <Form.Group className="mb-3">
                  <Form.Label className="formLabel">Client Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="client email"
                    required
                    name="client_email"
                    className="formInput"
                    value={formData.client_email}
                    onChange={fillFormData}
                  />
                </Form.Group>
              </Col>
              <Col md={4} xs={12}>
                {" "}
                <Form.Group className="mb-3">
                  <Form.Label className="formLabel">Booking code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Booking code"
                    required
                    name="booking_code"
                    className="formInput"
                    onChange={fillFormData}
                    value={formData.booking_code}
                  />
                </Form.Group>
              </Col>
              <Col md={4} xs={12}>
                <Form.Group>
                  <Form.Label>Trip</Form.Label>
                  <Form.Control
                    as="select"
                    name="trip_id"
                    onChange={fillFormData}
                    value={formData.trip_id}
                    required
                    className="formInput"
                  >
                    <option value={0}>select trip</option>

                    {TripsMain &&
                      TripsMain.map((trip, index) => (
                        <option key={index} value={trip.id}>
                          {trip.trip_code} - {trip.trip_default_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}></Col>
              <Col md={{ span: 4, offset: 4 }}>
                <Button
                  className="secondryBtn FullWidthBtn"
                  onClick={GetBookingByFilter}
                >
                  <FiFilter className="btn_icon" />
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center">
        <div className="position-relative" style={{ width: "250px" }}>
          <FaSearch
            className="position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
          <input
            type="text"
            className="form-control ps-6"
            placeholder="Search trip..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>

        {/* <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => exportToExcel(true)}
        >
          Export all to Excel
        </button> */}

        <Button
          disabled={BookingData == null || BookingData?.bookings?.length == 0}
          className="px-4 py-2 border rounded darkBlue-Btn mx-4"
          onClick={() => exportToExcel()}
        >
          Export to Excel
        </Button>
      </div>
      <div className="result_list">
        {" "}
        <Table responsive hover bordered className="w-auto">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 cursor-pointer select-none"
                  //   onClick={() => toggleSort(col.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{col.name}</span>
                    {/* {sortBy.key === col && (
                      <span className="text-sm">
                        {sortBy.dir === "asc" ? "▲" : "▼"}
                      </span>
                    )} */}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BookingData && BookingData?.bookings?.length > 0 ? (
              BookingData?.bookings
                ?.filter((item) =>
                  item.trip_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((row) => (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    {columns.map((col) => {
                      return col.id == "is_two_way" ? (
                        <td>
                          {row[col.id] == true ? (
                            <FaCheck className="check_icon" />
                          ) : (
                            <FaX className="x_icon" />
                          )}
                        </td>
                      ) : (
                        <td key={col.id} className="px-4 py-2">
                          {String(row[col.id])}
                        </td>
                      );
                    })}
                  </tr>
                ))
            ) : (
              <tr>
                <td className="p-4" colSpan={columns.length}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {/* Pagination */}
        <Pagination className="mt-3 justify-content-center">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
      {loading ? <LoadingPage /> : null}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
      {/* <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 cursor-pointer select-none"
                  onClick={() => toggleSort(col.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{col.name}</span>
                    {sortBy.key === col && (
                      <span className="text-sm">
                        {sortBy.dir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BookingData && BookingData?.bookings?.length > 0 ? (
              BookingData?.bookings?.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.id} className="px-4 py-2">
                      {String(row[col.id])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4" colSpan={columns.length}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </section>
  );
}

export default BookingGrid;
