import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createRoutesFromElements } from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store.js';
import Home from './pages/Home.jsx';


import PrivateRoute from './components/PrivateRoute.jsx';


import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'

import Profile from './pages/User/Profile.jsx';


import AdminRoute from './pages/Admin/AdminRoute.jsx';
import UserList from './pages/Admin/UserList.jsx';
import CategoryList from './pages/Admin/CategoryList.jsx';
import ProductList from './pages/Admin/ProductList.jsx';
import ProductUpdate from './pages/Admin/ProductUpdate.jsx';
import AllProducts from './pages/Admin/AllProducts.jsx';


import Favorites from './pages/Products_temp/Favorites.jsx';
import ProductDetails from './pages/Products_temp/productDetails.jsx';

import Cart from './pages/Cart.jsx';
import Shop from './pages/Shop.jsx';
import Shipping from './pages/Orders/shipping.jsx';
import PlaceOrder from './pages/Orders/PlaceOrder.jsx';
import Order from './pages/Orders/Order.jsx';

import {PayPalScriptProvider} from "@paypal/react-paypal-js"
import UserOrder from './pages/User/UserOrder.jsx';
import OrderList from './pages/Admin/OrderList.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={< ProductDetails />} />
      <Route path="/cart" element={< Cart />} />
      <Route path="/shop" element={< Shop />} />
      <Route path="/user-orders" element={< UserOrder />} />
        
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/shipping' element={<Shipping/>} />
        <Route path='/placeorder' element={<PlaceOrder/>} />
        <Route path='/order/:id' element={<Order/>} />
      </Route>

      {/*admin routes*/}
      <Route path='/admin' element={<AdminRoute/>}>
        <Route path='userList' element={<UserList/>}/>
        <Route path='categoryList' element={<CategoryList/>}/>
        <Route path='productList' element={<ProductList/>}/>
        <Route path='allProductsList' element={<AllProducts/>}/>
        <Route path='orderlist' element={<OrderList/>}/>
        <Route path="/admin/product/update/:id" element={<ProductUpdate />} />
        <Route path='dashboard' element={< AdminDashboard />}/>
      </Route> 
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PayPalScriptProvider options={{ "client-id": "Aeg2zlMRergds1TlbocZrTeAzY9VPV91ID_2QuxtQzfJXsrEu2HUO6Q3QG4_At9kGtAnB4rx7NBhlzUQ" }}>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);


