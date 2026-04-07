import React, { useState } from "react";

import Users from "./UsersComp";

const UsersPage = () => {
  return (
    <div className="app-container">
      <Users /> {/* Renders the Users component */}
    </div>
  );
};

export default UsersPage;
