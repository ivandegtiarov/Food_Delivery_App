import React, { useState, useEffect } from "react";
import axios from "axios";
/* import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu"; */
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import CourierMenu from "../../components/Layout/CourierMenu";
/* import CourierRoute from "../../components/Layout/courierRoute"; */
/* import RouteCor from "../../components/Layout/Route" */
import { /* Link, */ NavLink } from "react-router-dom";
import "../../styles/userOrders.css"
const { Option } = Select;

const CourierCompleted = () => {
 // eslint-disable-next-line
 const [status, setStatus] = useState([
    "Доставляется",
    "Доставлено",
  ]);
 // eslint-disable-next-line
 const [changeStatus, setCHangeStatus] = useState("");
 const [orders, setOrders] = useState([]);
 // eslint-disable-next-line
 const [auth, setAuth] = useAuth();
 // eslint-disable-next-line
 const [open, setOpen] = useState(false)
 const [money, setMoney] = useState("")
 
 // eslint-disable-next-line
 const [isOpen, setIsOpen] = useState([]);

 const getOrders = async () => {
   try {
     const { data } = await axios.get("/api/v1/auth/cor-completed");
     setOrders(data);
   } catch (error) {
     console.log(error);
   }
 };

 const getTotalMoney = async () => {
  try {
    const { data } = await axios.get(`/api/v1/auth/earnings/${orders[0].courier._id}`);
    setMoney(data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  const interval = setInterval(() => {
    getOrders();
    getTotalMoney();
  }, 3000);

  return () => clearInterval(interval);
});
 
 useEffect(() => {
   if (auth?.token) 
    getOrders() 
 }, [auth?.token]);


 const handleTakeOrder = async (orderId) => {
   try {
     const { data } = await axios.put(`/api/v1/auth/cor-orders/${orderId}`, {
       courier: auth.user.role === 2 ? auth.user._id : null,
       status: status,
     });
     setOrders((prev) =>
       prev.map((order) => (order._id === orderId ? data : order))
     );
     
   } catch (error) {
     console.log(error);
   }
 };

 const handleChange = async (orderId, value) => {
   try {
     // eslint-disable-next-line
     const { data } = await axios.put(`/api/v1/auth/order-statuss/${orderId}`, {
       status: value,
     });
     getOrders();
   } catch (error) {
     console.log(error);
   }
 };

     // Функция-обработчик события onClick для кнопки
   const handleToggle = (index) => {
     setIsOpen((prev) => {
       const newState = [...prev];
       newState[index] = !newState[index];
       return newState;
     });
   };

   /* console.log(orders[0].courier._id); */
   console.log(money);
   console.log(status);
   console.log(orders);

 return (
   <Layout title={"All Orders Data"}>
     <div className="row dashboard">
       <div className="col-md-3">
         <CourierMenu />
       </div>
       <div className="col-md-9">
         <h1 className="text-center">All Orders</h1>
         <p>Повний заробіток: {money.totalEarnings}</p>
         {orders?.map((o, i) => {
           return (
             <div className="border shadow" key={i}>
               <table className="table">
                 <thead>
                   <tr>
                     <th scope="col">#</th>
                     <th scope="col">Status</th>
                     <th scope="col">Buyer</th>
                     <th scope="col">Adress</th>
                     <th scope="col">Res Adress</th>
                     <th scope="col"> date</th>
                     <th scope="col">Payment</th>
                     <th scope="col">Quantity</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr>
                     <td>{i + 1}</td>
                     <td>
                        <Select
                         bordered={false}
                         onChange={(value) => handleChange(o._id, value)}
                         defaultValue={o?.status}
                       >
                         {status.map((s, i) => (
                           <Option key={i} value={s}>
                             {s}
                           </Option>
                         ))}
                       </Select>
                     </td>
                     <td>{o?.buyer?.name}</td>
                     <td>{o?.buyer?.adress}</td>
                     <td>{o?.products[0].category.adress}</td>
                     <td>{moment(o?.createAt).fromNow()}</td>
                     <td>{o?.payment.success ? "Success" : "Failed"}</td>
                     <td>{o?.products?.length}</td>
                     {/* <td>{o?.courier.name ? "hello" : ""}</td> */}
                   </tr>
                 </tbody>
               </table>
               <div className="container">
                {/* <h2>{o?.courier.name}</h2> */}
                <p>Заробіток з цього замовлення: {o?.courierPrice} грн.</p>
                 <button className="button_drop" onClick={() => handleToggle(i)}>
                   {isOpen[i] ? "Hide Products" : "Show Products"}
                 </button>
{/*                   {isOpen[i] && 
                 <img src={o?.products[0].category.img} alt=""/>
                 } */}
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
                       <p>{p.category.name}</p>
                       <p>Price : {p.price}</p>
                       <p>Quantity: {p.quantity}</p>
                     </div>
                   </div>
                 )))}
                 <div className="main_buttons">
                   <div className="route_button">
{/*                      <NavLink
                         to={{
                           pathname: `/route/${o?._id}`,
                           state: {
                             orders: o?.products
                           }
                         }}
                       className="list-group-item list-group-item-action"
                     >
                       <button type="button" class="btn btn-outline-success">Шлях</button>

                     </NavLink> */}
                   </div>
                   <div className="take_order">
                     <button onClick={() => handleTakeOrder(o?._id)} onChange={() => handleChange(o._id, status)} type="button" className="btn btn-success p-10">Завершити замовлення</button>
                   </div>
                 </div>

               </div>
             </div>
           );
         })}
       </div>
     </div>
   </Layout>
 );
}

export default CourierCompleted;