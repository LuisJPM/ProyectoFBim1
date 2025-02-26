import { Router } from "express";
import { check } from "express-validator";
import { addProductToCart, getCart, removeProductFromCart, checkoutCart, purchaseHistory } from "./cart.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRole } from "../middlewares/validate-roles.js";

const router = Router();

router.post(
    "/cart",
    [
        validateJWT,
        hasRole("CLIENT_ROLE"),
        check("productId", "Invalid Product ID!").isMongoId(),
        check("quantity", "Quantity should be a positive number").isInt({ gt: 0 }),
        validateFields
    ],
    addProductToCart
);

router.get("/", validateJWT, getCart);

router.delete(
    "/:productId",
    [
        validateJWT,
        hasRole("CLIENT_ROLE"),
        check("productId", "Invalid Product ID!").isMongoId(),
        validateFields
    ],
    removeProductFromCart
);

router.post(
    "/checkout",
    [
        validateJWT,
        hasRole("CLIENT_ROLE"),
        validateFields
    ],
    checkoutCart
);

router.get("/purchase-history", validateJWT, purchaseHistory);

export default router;
