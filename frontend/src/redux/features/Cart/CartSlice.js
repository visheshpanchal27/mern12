import { createSlice } from "@reduxjs/toolkit";

// Helper function to calculate all cart prices
const calculateCartPrices = (cartItems) => {
  const itemsPrice = parseFloat(
    cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.qty), 0)
  ).toFixed(2);
  
  const shippingPrice = parseFloat((itemsPrice > 100 ? 0 : 10).toFixed(2));
  const taxPrice = parseFloat((0.15 * itemsPrice).toFixed(2));
  const totalPrice = parseFloat((
    parseFloat(itemsPrice) + 
    parseFloat(shippingPrice) + 
    parseFloat(taxPrice)
  ).toFixed(2));

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  };
};

// Initialize cart state
const initialState = (() => {
  try {
    const cartData = localStorage.getItem("cart");
    if (!cartData) {
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
    return JSON.parse(cartData);
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
})();

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

      // Calculate and update prices
      const prices = calculateCartPrices(state.cartItems);
      state.itemsPrice = prices.itemsPrice;
      state.shippingPrice = prices.shippingPrice;
      state.taxPrice = prices.taxPrice;
      state.totalPrice = prices.totalPrice;

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      
      // Calculate and update prices
      const prices = calculateCartPrices(state.cartItems);
      state.itemsPrice = prices.itemsPrice;
      state.shippingPrice = prices.shippingPrice;
      state.taxPrice = prices.taxPrice;
      state.totalPrice = prices.totalPrice;

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
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = "PayPal";
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
