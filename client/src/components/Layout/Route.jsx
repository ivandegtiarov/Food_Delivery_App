import React, { useEffect, useState } from 'react'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";
import axios from "axios";
import { useParams } from 'react-router-dom';


const RouteCor = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  // eslint-disable-next-line
  const [errorr, setError] = useState(null);

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [coordinates1, setCoordinates1] = useState(null);
  const [coordinates2, setCoordinates2] = useState(null);
  const [map, setMap] = useState(null);
  const [open, setOpen] = useState(false)

  //Distance value
  const [dist, setDist] = useState("")

  console.log(order);
  console.log(address1);
  console.log(address2);


/*   const adress1 = `${order?.buyer?.adress}`
  const adress2 = `${order?.products[0].category.adress}` */
/*   console.log(secondAdress);
  console.log(firstAdress); */


  // States for coordinates
  const [couerierLat, setCourierLat] = useState("46.473361")
  const [couerierLng, setCourierLng] = useState("30.732683")




  const [geo, setGeo] = useState("");



  // FLAG ICONS
  const flagIconHome = L.icon({
    iconUrl: 'https://www.freeiconspng.com/thumbs/house-png/home-icon-png-home-house-icon-24.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });


  const flagIconRest = L.icon({
    iconUrl: 'https://static.vecteezy.com/system/resources/previews/015/079/413/original/fast-food-restaurant-png.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  
  const flagIconMoto = L.icon({
    iconUrl: 'https://cdni.iconscout.com/illustration/premium/thumb/food-delivery-on-motorbike-4095611-3408206.png',
    iconSize: [42, 32],
    iconAnchor: [16, 32],
  });
  ////////////////



  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/route/${orderId}`);
        setOrder(response.data.order);
      } catch (errorr) {
        setError(errorr.response.data.message);
      }
    };

    fetchOrder();
  }, [orderId]);

  
/*       useEffect(()=>{
        setAddress1(order?.buyer?.adress);
        setAddress2(order?.products[0]?.category?.adress);
      }, []) */
  
/*     const flagIcon = L.icon({
      iconUrl: 'https://static.wikia.nocookie.net/0c9787f8-4011-4dbe-9ca0-44fafba10dec/scale-to-width/755',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
   */
    useEffect(() => {
      // Получить координаты для первого адреса
      const getCoordinates1 = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${address1}&format=json`
          );
          const data = await response.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            setCoordinates1([lat, lon]);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      // Получить координаты для второго адреса
      const getCoordinates2 = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${address2}&format=json`
          );
          const data = await response.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            setCoordinates2([lat, lon]);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      getCoordinates1();
      getCoordinates2();
    }, [address1, address2]);

  
     useEffect(() => {
      // Создать карту Leaflet и построить маршрут между двумя координатами
      if (coordinates1 && coordinates2 && !map) {
        const newMap = L.map("map").fitBounds([coordinates1, coordinates2]);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(newMap);
        L.marker(coordinates1, { icon: flagIconHome }).addTo(newMap);
        L.marker(coordinates2, { icon: flagIconRest }).addTo(newMap);
        const control = L.Routing.control({
          waypoints: [L.latLng(coordinates1), L.latLng(coordinates2)],
          routeWhileDragging: true,
          showAlternatives: false,
          lineOptions: { addWaypoints: false },
          createMarker: function (i, wp, nWps) {
            return L.marker(wp.latLng);
          },
        }).addTo(newMap);
        setMap(newMap);

        control.on("routesfound", function (event) {
          const routes = event.routes;
          const distance = routes[0].summary.totalDistance;
          setDist(distance)
          console.log(`Distance: ${distance} meters`);
        });
      }
    }, [coordinates1, coordinates2, map]);


    const [marker, setMarker] = useState(null);

/* 
    console.log(`Courier ID: ${order.courier}`);
    console.log(`Order ID: ${order._id}`);
    console.log(couerierLat); // latitude for courier location
    console.log(couerierLng); // longtitude for courier location */

    console.log(marker);




    // Create delivery collection
    const createDelivery = async () => {
      try {
        const requestBody = {
          courier: order.courier,
          orderId: order._id,
          latitude: couerierLat,
          longitude: couerierLng,
        };
    
        const deliveryCheckResponse = await axios.get(`/api/v1/auth/delivery/${orderId}`);
        if (deliveryCheckResponse.data) {
          // Доставка уже существует, не создавать повторный документ
          console.log('Delivery already exists:', deliveryCheckResponse.data);
          return;
        }

        const response = await axios.post('/api/v1/auth/delivery', requestBody);
    
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };


    useEffect(() => {
      createDelivery()
    }, []);


    const updateDelivery = async (orderId, latitude, longitude) => {
      try {

        if (!orderId) {
          return; // Проверяем, есть ли orderId
        }

        const requestBody = {
          latitude,
          longitude,
        };
    
        const response = await axios.put(`/api/v1/auth/delivery/${orderId}`, requestBody);
    
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      const intervalId = setInterval(() => {
        updateDelivery(orderId,couerierLat,couerierLng)
      }, 5000);
    
      return () => {
        clearInterval(intervalId);
      };
    }, [orderId,couerierLat,couerierLng]);


    const handleLocate = async() => {
/*       console.log(`Courier ID: ${order.courier}`);
      console.log(`Order ID: ${order._id}`); */
/*       console.log(couerierLat); // latitude for courier location
      console.log(couerierLng); // longtitude for courier location */
      if (map) {
        map.locate({ setView: true, maxZoom: 16 });
  
        map.on("locationfound", (e) => {
          const { lat, lng } = e.latlng;
          setGeo([lat, lng])
          
          if (marker) {
            marker.setLatLng([lat, lng]); // Перемещаем существующий маркер в новые координаты
          } else {
            const newMarker = L.marker([lat, lng], { icon: flagIconMoto }).addTo(map);
            setMarker(newMarker);
          }

          setCourierLat(lat)
          setCourierLng(lng)
          // Do something with the marker or coordinates
          console.log("Marker added at:", lat, lng);
        });
      }
    };

    useEffect(() => {
      const intervalId = setInterval(() => {
        handleLocate();
      }, 3000);
    
      return () => {
        clearInterval(intervalId);
      };
    }, [couerierLat,couerierLng]);

    useEffect(() => {
      return () => {
        if (marker) {
          map.removeLayer(marker);
        }
      };
    }, [marker, map]);

    const handleSubmit = async() => {
      setAddress1(order?.buyer?.adress)
      setAddress2(order?.products[0]?.category?.adress)
      setOpen(!open) 
      createDelivery()
    }

  return (
    <div>
    { 
      open === true ? 
      <div id="map" style={{ height: "500px" }}></div> : <h1>Нажмите для получения пути</h1>
    }
    <h2>{address1}</h2>
    <h2>{address2}</h2>
    <h2>distance: {dist} meters</h2>
    <div>
      <label>{order?.buyer?.adress}</label>
{/*       <input
        type="text"
        value={address1}
        onChange={(event) => setAddress1(event.target.value)}
      /> */}
    </div>
    <div>
        <label>{order?.products[0]?.category?.adress}</label>
{/*         <input
          type="text"
          value={address2}
          onChange={(event) => setAddress2(event.target.value)}
        /> */}
        <button onClick={() => handleLocate()}>Locate</button>
        {
          open === true ? "" : 
          <button onClick={() =>  
            handleSubmit()
          } className="btn btn-success">
            Получить путь
          </button>
          
        }
      </div>
    </div>
  )
}

export default RouteCor;