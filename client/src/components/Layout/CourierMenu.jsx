import React from "react";
import { NavLink } from "react-router-dom";

const CourierMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group dashboard-menu">
          <h4>Courier Panel</h4>
{/*           <NavLink
            to="/dashboard/courier"
            className="list-group-item list-group-item-action"
          >
            Dashboard
          </NavLink> */}
          <NavLink
            to="/dashboard/courier/orders"
            className="list-group-item list-group-item-action"
          >
            All Orders
          </NavLink>
          <NavLink
            to="/dashboard/courier/progress-orders"
            className="list-group-item list-group-item-action"
          >
            Orders in progress
          </NavLink>
          <NavLink
            to="/dashboard/courier/completed-orders"
            className="list-group-item list-group-item-action"
          >
            Completed orders
          </NavLink>
          {/* <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action"
          >
            Users
          </NavLink> */}
        </div>
      </div>
    </>
  );
};

export default CourierMenu;