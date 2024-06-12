import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
/* import moment from "moment"; */
import { Steps } from 'antd';
import moment from "moment";
import "../../styles/userOrders.css"
import { NavLink } from "react-router-dom";


const CompletedOrders = () => {
    const [orders, setOrders] = useState([]);
    // eslint-disable-next-line
    const [auth, setAuth] = useAuth();
    // eslint-disable-next-line
    const [open, setOpen] = useState(false)
  
  
    const [isOpen, setIsOpen] = useState([]);
  
    // Заполняем массив isOpen значениями false при получении заказов
    useEffect(() => {
      setIsOpen(new Array(orders.length).fill(false));
    }, [orders]);
  
    // Функция-обработчик события onClick для кнопки
    const handleToggle = (index) => {
      setIsOpen((prev) => {
        const newState = [...prev];
        newState[index] = !newState[index];
        return newState;
      });
    };
  
    const getOrders = async () => {
      try {
        const { data } = await axios.get("/api/v1/auth/order-info");
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      if (auth?.token) getOrders();
    }, [auth?.token]);

    const description = 'This is a description.';
    console.log(orders);
    return (
    <Layout title={"Your Orders"}>
    <div className="container-flui p-3 m-3 dashboard">
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          {orders?.map((o, i) => {
            let status = 0;
              if (o?.status === "Готується") {
                status = 0;
              } else if (o?.status === "Приймається кур'єром") {
                status = 1;
              } else if (o?.status === "Доставляется") {
                status = 2;
              } else if (o?.status === "Доставлено") {
                status = 3;
              }
            return (
              <div className="border shadow order">
                {/* {o?.status === "Доставлено" ? () => setStatus(3) :  ""} */}
                <p>№ замовлення {i + 1}</p>
                <p>id замовлення: {o?._id}</p>
                <p>Час замовлення: {moment(o?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                <p>Ім'я кур'єра {o?.courier?.name}</p>
                <Steps
                    direction="vertical"
                    current={status}
                    /* status="error" */
                    items={[
                    {
                        title: 'Готується',
                        description,
                    },
                    {
                        title: `Приймається кур'єром`,
                        description,
                    },
                    {
                        title: 'Доставляється',
                        description,
                    },
                    {
                        title: 'Доставлено',
                        description,
                    },
                    ]}
                />
                <h1>{o?.status}</h1>
{/*                 <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col"> date</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{o?.status}</td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table> */}
                <div className="container">
                  <button className="button_drop" onClick={() => handleToggle(i)}>
                    {isOpen[i] ? "Hide Products" : "Show Products"}
                  </button>
                  {isOpen[i] && (o?.products?.map((p, i) => (
                    <div className="row mb-2 p-3 card flex-row" key={p._id}>
                      <div className="col-md-4">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          width="100px"
                          height={"100px"}
                        />
                      </div>
                      <div className="col-md-8">
                        <p>{p.name}</p>
                        <p>{p.description.substring(0, 30)}</p>
                        <p>Price : {p.price}</p>
                      </div>
                    </div>
                  )))}
                </div>
                <div className="route_button">
                    <NavLink
                        to={{
                           pathname: `/route-client/${o?._id}`,
                           state: {
                             orders: o?.products
                           }
                        }}
                      className="list-group-item list-group-item-action"
                    >
                    <button type="button" class="btn btn-outline-success">Шлях</button>

                    </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </Layout>
);
}

export default CompletedOrders