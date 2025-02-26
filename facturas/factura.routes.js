import { Router } from "express";
import { check } from "express-validator";
import {saveFactura, getFacturas, getFacturaById, updateFactura,updateEstadoFactura} from "./factura.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { existeFacturaById } from "../helpers/db-validator.js";

const router = Router();


router.post(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("products", "Products are required!").isArray().notEmpty(),
        check("user", "User ID is required!").isMongoId(),
        validarCampos
    ],
    saveFactura
);

router.get("/", getFacturas);


router.get(
    "/findFactura/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "Invalid ID format!").isMongoId(),
        check("id").custom(existeFacturaById),
        validarCampos
    ],
    getFacturaById
);


router.put(
    "/updateFactura/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "Invalid ID format!").isMongoId(),
        check("id").custom(existeFacturaById),
        validarCampos
    ],
    updateFactura
);

router.put(
    "/updateEstadoFactura/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "Invalid ID format!").isMongoId(),
        check("id").custom(existeFacturaById),
        check("status", "Invalid status!").isIn(["Pending", "Paid", "Cancelled"]),
        validarCampos
    ],
    updateEstadoFactura
);

export default router;
