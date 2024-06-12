import React from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import CourierMenu from "../../components/Layout/CourierMenu";

import { Alert, Calendar } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const AdminDashboard = () => {
  const [auth] = useAuth();


  const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));
  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };
  const onPanelChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <Layout>
      <div className="container-fluid mt-2 p-4">
        <div className="row">
          <div className="col-md-3">
            <CourierMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3> Courier Name : {auth?.user?.name}</h3>
              <h3> Courier Email : {auth?.user?.email}</h3>
              <h3> Courier Contact : {auth?.user?.phone}</h3>
            </div>
            <div>
              <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} />
              <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;