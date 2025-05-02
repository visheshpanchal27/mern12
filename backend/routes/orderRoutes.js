import express from "express";
const router = express.Router();

import { 
    createOrder, 
    getAllOrders, 
    getUserOrders, 
    countTotalOrders, 
    calculateTotalSales,
    calculateTotalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered,
    processStripePayment,
    processCashOnDelivery,
} from "../controllers/orderControllers.js"

import { 
    authentication, 
    authorizeAdmin 
} from "../middlewares/authMiddleware.js";


router.route("/")
    .post(authentication, createOrder)
    .get( authentication, authorizeAdmin, getAllOrders );

router.route("/mine").get( authentication , getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);
router.route("/:id").get(authentication, findOrderById);
router.route("/:id/pay").put(authentication, markOrderAsPaid);
router.route('/:id/stripe-pay').post(authentication, processStripePayment);
router.route('/:id/cod-pay').post(authentication, processCashOnDelivery);
router
  .route("/:id/deliver")
  .put(authentication, authorizeAdmin, markOrderAsDelivered);

export default router;
