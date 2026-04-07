import { Get_Languages } from "../../../slices/GlobalSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

function LangSelect() {
  const dispatch = useDispatch();
  const { Languages } = useSelector((state) => state.GlobalSetting);
  useEffect(() => {
    dispatch(Get_Languages());
    return () => {};
  }, []);
  return (
    <>
      {Languages &&
        Languages?.map((lang, index) => {
          return (
            <option value={lang.lang_code} key={index}>
              {lang.lang_code}-{lang.lang_name}
            </option>
          );
        })}
    </>
  );
}

export default LangSelect;
