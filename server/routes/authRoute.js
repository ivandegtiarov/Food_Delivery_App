import express from "express";
import {countProductPurchases, createDelivery, forgotPasswordController, getAllOrdersController, getCourierOrdersCompletedController, getCourierOrdersController, getCourierOrdersInProgressController, getDelivery, getInfoStatus, getOrderById, getOrderByStatus, getOrdersController, getTotalEarnings, getUsersByRole, loginController, orderStatusController, registerController, takeOrder, testController, updateDelivery, updateProfileController} from "../controllers/authController.js";
import { isAdmin, isCor, requireSignIn } from "../middlewares/authMiddleware.js";

// router object 
const router = express.Router();

//routing



router.post("/delivery", createDelivery)

router.get("/delivery/:orderId", getDelivery)

router.put("/delivery/:orderId", updateDelivery)



//REGISTER || METHOD POST
router.post("/register", registerController)

//LOGIN || POST
router.post('/login', loginController)

//FORGOT PASSWORD || POST
router.post("/forgot-password", forgotPasswordController)

//test routes
router.get("/test", requireSignIn, isAdmin, testController)

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true})
})

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

router.get("/courier-auth", requireSignIn, isCor, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);




//ORDERS
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

router.get("/all-orderss", requireSignIn, isCor, getAllOrdersController);





//COURIER ORDERS
router.get("/cor-orders", requireSignIn, isCor, getCourierOrdersController);

/// Orders that have status "Доставляется"
router.get("/cor-progress", requireSignIn, isCor, getCourierOrdersInProgressController);
/// Orders that have status "Доставлено"
router.get("/cor-completed", requireSignIn, isCor, getCourierOrdersCompletedController);

router.put("/cor-orders/:orderId", requireSignIn, isCor, takeOrder);


router.get("/earnings/:courierId", requireSignIn, isCor, getTotalEarnings);

////////////////////


router.get("/users", getUsersByRole)

router.get("/order-completed", requireSignIn, getOrderByStatus);
router.get("/order-info", requireSignIn, getInfoStatus);

router.get("/product-count", requireSignIn, countProductPurchases);

router.get("/route/:orderId", getOrderById);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

// order status update
router.put(
  "/order-statuss/:orderId",
  requireSignIn,
  isCor,
  orderStatusController
);

export default router;