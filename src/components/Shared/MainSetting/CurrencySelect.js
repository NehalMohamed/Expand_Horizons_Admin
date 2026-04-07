import { Get_Currencies } from "../../../slices/GlobalSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

function CurrencySelect() {
  const dispatch = useDispatch();
  const { Currencies } = useSelector((state) => state.GlobalSetting);
  useEffect(() => {
    dispatch(Get_Currencies());
    return () => {};
  }, []);
  return (
    <>
      {Currencies &&
        Currencies?.map((curr, index) => (
          <option value={curr.currency_code} key={index}>
            {curr.currency_code}
          </option>
        ))}
    </>
  );
}

export default CurrencySelect;
