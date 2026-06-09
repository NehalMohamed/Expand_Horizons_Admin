import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetExchangeRates,
  SaveExchangeRate,
  GetCompanySetting,
  updateRate,
  clearExchangeMessage,
} from "../../slices/exchangeSlice";
import "./ExchangeRates.scss";

function ExchangeRates() {
  const dispatch = useDispatch();
  const {
    rates,
    loading,
    saving,
    error,
    saveResult,
    companyCurrencyCode,
  } = useSelector((state) => state.exchange);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [message, setMessage] = useState(null);

  const isToday = selectedDate === today;

  useEffect(() => {
    dispatch(GetCompanySetting(1));
  }, [dispatch]);

  useEffect(() => {
    setMessage(null);
    dispatch(clearExchangeMessage());
    dispatch(GetExchangeRates(selectedDate));
  }, [dispatch, selectedDate]);

  useEffect(() => {
    if (error) {
      setMessage(error);
    } else if (saveResult) {
      setMessage(saveResult);
    }
  }, [error, saveResult]);

  const handleRateChange = (currency_code, value) => {
    if (!isToday) return;
    dispatch(updateRate({ currency_code, rate: value }));
  };

  const handleSave = async () => {
    if (!isToday) return;
    setMessage(null);
    const resultAction = await dispatch(
      SaveExchangeRate({ rates, date: selectedDate }),
    );

    if (SaveExchangeRate.fulfilled.match(resultAction)) {
      dispatch(GetExchangeRates(selectedDate));
    }
  };

  return (
    <section className="layout_section">
      <div className="d-flex justify-content-between align-items-center header_title">
        <h2 className="mb-4 page-title">Exchange Rate Setting</h2>
        <div className="button-group">
          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={() => dispatch(GetExchangeRates(selectedDate))}
          >
            Reload
          </button>
          <button
            type="button"
            className="btn green-btn"
            disabled={!isToday || rates.length === 0 || saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Rates"}
          </button>
        </div>
      </div>

      <div className="exchange-panel form_crud">
        <div className="exchange-header">
          <div className="exchange-field">
            <label>Currency</label>
            <input value={companyCurrencyCode || "EUR"} readOnly />
          </div>
          <div className="exchange-field">
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="exchange-table-wrap">
          {loading ? (
            <div className="exchange-loading">Loading exchange rates...</div>
          ) : (
            <table className="exchange-table">
              <thead>
                <tr>
                  <th>Currency Code</th>
                  <th>Currency Name</th>
                  <th>Rate Against {companyCurrencyCode || "EUR"}</th>
                </tr>
              </thead>
              <tbody>
                {rates.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="empty-row">
                      No rates found for this date.
                    </td>
                  </tr>
                ) : (
                  rates.map((item) => (
                    <tr key={item.currency_code}>
                      <td>{item.currency_code}</td>
                      <td>{item.currency_name}</td>
                      <td>
                        {isToday ? (
                          <input
                            type="number"
                            min="0"
                            step="0.000001"
                            value={item.rate}
                            onChange={(e) =>
                              handleRateChange(item.currency_code, e.target.value)
                            }
                          />
                        ) : (
                          item.rate
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="exchange-footer">
          {message && <div className="exchange-message">{message}</div>}
        </div>
      </div>
    </section>
  );
}

export default ExchangeRates;
