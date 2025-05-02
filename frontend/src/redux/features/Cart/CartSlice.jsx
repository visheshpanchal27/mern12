import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cart";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = "PayPal";
      localStorage.setItem("cart", JSON.stringify(state));
    },

    calculateCartPrices: (state) => {
      const itemsPrice = state.cartItems.reduce((acc, item) => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.price) || 0;
        return acc + qty * price;
      }, 0);
    
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
      const totalPrice = itemsPrice + shippingPrice + taxPrice;
    
      state.itemsPrice = Number(itemsPrice.toFixed(2));
      state.shippingPrice = shippingPrice;
      state.taxPrice = taxPrice;
      state.totalPrice = Number(totalPrice.toFixed(2));
    
      localStorage.setItem("cart", JSON.stringify(state));
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
  calculateCartPrices,
} = cartSlice.actions;

export default cartSlice.reducer;
