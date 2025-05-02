import { createSlice } from "@reduxjs/toolkit";

const calculateCartPrices = (cartItems) => {
  const itemsPrice = Number(
    cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0)
  ).toFixed(2);
  
  const shippingPrice = Number((itemsPrice > 100 ? 0 : 10).toFixed(2));
  const taxPrice = Number((itemsPrice * 0.15).toFixed(2));
  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const getInitialState = () => {
  try {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "PayPal",
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0
    };
  } catch (error) {
    console.error("Error parsing cart data:", error);
    return {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "PayPal",
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0
    };
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      const prices = calculateCartPrices(state.cartItems);
      Object.assign(state, prices);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      const prices = calculateCartPrices(state.cartItems);
      Object.assign(state, prices);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    resetCart: (state) => {
      Object.assign(state, {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "PayPal",
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0
      });
      localStorage.setItem("cart", JSON.stringify(state));
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
  calculateCartPrices
} = cartSlice.actions;

export default cartSlice.reducer;
