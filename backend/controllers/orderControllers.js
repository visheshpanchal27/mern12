import Order from "../models/orderModel.js";
import Product from "../models/productModal.js";
import Stripe from 'stripe';

// Utility Function
function calcPrices(orderItems) {
  // Validate items
  if (!orderItems || orderItems.length === 0) {
    throw new Error("No order items provided");
  }

  const itemsPrice = orderItems.reduce((acc, item) => {
    if (item.price < 0 || item.qty < 0) {
      throw new Error("Invalid price or quantity");
    }
    return acc + (item.price * item.qty);
  }, 0);

  // Rest of the calculation remains the same
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
  };
}

const createOrder = async (req, res) => {
    try {
      const { orderItems, shippingAddress, paymentMethod } = req.body;
  
      if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
      }
  
      const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x._id) },
      });
  
      const dbOrderItems = orderItems.map((itemFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
          (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
        );
  
        if (!matchingItemFromDB) {
          res.status(404);
          throw new Error(`Product not found: ${itemFromClient._id}`);
        }
  
        return {
          ...itemFromClient,
          product: itemFromClient._id,
          price: matchingItemFromDB.price,
          _id: undefined,
        };
      });
  
      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrices(dbOrderItems);
  
      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
  
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find({}).populate("user", "id username");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const countTotalOrders = async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();
      res.json({ totalOrders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const calculateTotalSales = async (req, res) => {
    try {
      const orders = await Order.find();
      const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      res.json({ totalSales });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const calcualteTotalSalesByDate = async (req, res) => {
    try {
      const salesByDate = await Order.aggregate([
        {
          $match: {
            isPaid: true,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
            },
            totalSales: { $sum: "$totalPrice" },
          },
        },
      ]);
  
      res.json(salesByDate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const processStripePayment = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `Order ID: ${order._id}`,
      metadata: { orderId: order._id.toString() }
    });

    // Update order
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      stripePaymentIntentId: paymentIntent.id,
      stripePaymentMethod: paymentIntent.payment_method,
      stripeReceiptUrl: paymentIntent.charges.data[0].receipt_url,
      status: paymentIntent.status
    };

    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Process Cash on Delivery
export const processCashOnDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // For COD, we just mark as paid (or you can keep isPaid false until delivery)
    order.paymentMethod = 'CashOnDelivery';
    order.isPaid = true; // Or false depending on your business logic
    order.paidAt = Date.now();
    
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { 
    createOrder,
    getAllOrders, 
    getUserOrders, 
    countTotalOrders, 
    calculateTotalSales,
    calcualteTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered
};
