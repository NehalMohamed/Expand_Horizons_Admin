// src/layouts/MainLayout.js
import { useState } from "react";
import SideMenu from "./SideMenu/SideMenu";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const ChangeLayoutWidth = (val) => {
    setCollapsed(val);
  };
  return (
    <div style={{ display: "flex" }}>
      <SideMenu ChangeLayoutWidth={ChangeLayoutWidth} />
      <div
        style={{ flex: 1, padding: "1rem" }}
        className={collapsed ? "layout FullWidthLayout " : "layout SmallWidthLayout"}
      >
        <Outlet />
      </div>
    </div>
  );
}
