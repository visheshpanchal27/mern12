import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { 
      cartItems: [], 
      shippingAddress: {}, 
      paymentMethod: "PayPal",
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0
    };

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
      return calculateAndUpdateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return calculateAndUpdateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      return calculateAndUpdateCart(state);
    },

    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = "PayPal";
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      return updateCart(state);
    },

    calculatePrices: (state) => {
      return calculateAndUpdateCart(state);
    }
  },
});

const calculateAndUpdateCart = (state) => {
  const itemsPrice = parseFloat(state.cartItems.reduce(
    (acc, item) => acc + (parseFloat(item.price) * parseInt(item.qty)),
    0
  ));
  
  state.itemsPrice = parseFloat(itemsPrice.toFixed(2));
  state.shippingPrice = parseFloat((itemsPrice > 100 ? 0 : 10).toFixed(2));
  state.taxPrice = parseFloat((0.15 * itemsPrice).toFixed(2));
  state.totalPrice = parseFloat((
    state.itemsPrice + state.shippingPrice + state.taxPrice
  ).toFixed(2));
  
  return updateCart(state);
};

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
  calculatePrices
} = cartSlice.actions;

export default cartSlice.reducer;
