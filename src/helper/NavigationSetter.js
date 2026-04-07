// src/components/NavigationSetter.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./navigate";

export default function NavigationSetter() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return null; // nothing to render
}
