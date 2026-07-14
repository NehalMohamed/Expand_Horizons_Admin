/**
 * ExchangeRates Component
 *
 * Manages daily currency exchange rates.
 *
 * Features:
 * - Load company base currency
 * - View exchange rates for a selected date
 * - Edit today's or future exchange rates
 * - Prevent editing historical rates
 * - Save updated exchange rates
 * - Display loading and save status
 */
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
  const { rates, loading, saving, error, saveResult, companyCurrencyCode } =
    useSelector((state) => state.exchange);
  // Today's date formatted as YYYY-MM-DD.
  // useMemo prevents recreating the value on every render.
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  // Currently selected date for exchange rates
  const [selectedDate, setSelectedDate] = useState(today);

  // Success or error message displayed to the user
  const [message, setMessage] = useState(null);
  // Indicates whether the selected date is today or in the future.
  // Past dates are read-only.
  const isNotPastDate = selectedDate >= today;
  /**
   * Loads company settings when the component
   * is first rendered.
   *
   * Company settings include the base currency
   * used for exchange rate calculations.
   */
  useEffect(() => {
    dispatch(GetCompanySetting(1));
  }, [dispatch]);

  /**
   * Reloads exchange rates whenever
   * the selected date changes.
   *
   * Also clears any previous success
   * or error messages.
   */
  useEffect(() => {
    setMessage(null);
    dispatch(clearExchangeMessage());
    dispatch(GetExchangeRates(selectedDate));
  }, [dispatch, selectedDate]);
  /**
   * Updates the displayed message whenever
   * an error or save result changes.
   */
  useEffect(() => {
    if (error) {
      setMessage(error);
    } else if (saveResult) {
      setMessage(saveResult);
    }
  }, [error, saveResult]);

  /**
   * Updates the exchange rate for a currency.
   *
   * Editing is only allowed for today's
   * or future exchange rates.
   *
   * @param {string} currency_code Currency code.
   * @param {number|string} value New exchange rate.
   */
  const handleRateChange = (currency_code, value) => {
    if (!isNotPastDate) return;
    dispatch(updateRate({ currency_code, rate: value }));
  };
  /**
   * Saves all exchange rates for
   * the selected date.
   *
   * On successful save:
   * - Refresh exchange rates
   * - Display success message
   *
   * Historical rates cannot be modified.
   */
  const handleSave = async () => {
    if (!isNotPastDate) return;
    setMessage(null);
    dispatch(clearExchangeMessage());

    const resultAction = await dispatch(
      SaveExchangeRate({ rates, date: selectedDate }),
    );

    if (SaveExchangeRate.fulfilled.match(resultAction)) {
      // Small delay to ensure backend processing is complete
      // Reload exchange rates after saving to ensure
      // the latest values are displayed.
      setTimeout(() => {
        dispatch(GetExchangeRates(selectedDate));
      }, 300);
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
            disabled={!isNotPastDate || rates.length === 0 || saving}
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
                        {isNotPastDate ? (
                          <input
                            type="number"
                            min="0"
                            step="0.000001"
                            value={item.rate}
                            onChange={(e) =>
                              handleRateChange(
                                item.currency_code,
                                e.target.value,
                              )
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
