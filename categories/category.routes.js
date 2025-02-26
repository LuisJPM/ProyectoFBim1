import { Router } from "express";
import { check } from "express-validator";
import { saveCategory, getCategories, getCategoryById, deleteCategory, updateCategory } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { existeCategoryById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,              
        tieneRole("ADMIN_ROLE"),  
        check("name", "Category name is required!").not().isEmpty(),  
        validarCampos            
    ],
    saveCategory
);

router.get("/", getCategories);

router.get(
    "/:id",  
    [
        validarJWT,                            
        tieneRole("ADMIN_ROLE", "CLIENT_ROLE"),
        check("id", "Invalid category ID").isMongoId(),  
        check("id").custom(existeCategoryById), 
        validarCampos                            
    ],
    getCategoryById
);

router.put(
    "/:id",
    [
        validarJWT,         
        tieneRole("ADMIN_ROLE"), 
        check("id", "Invalid category ID").isMongoId(),  
        check("id").custom(existeCategoryById),  
        validarCampos            
    ],
    updateCategory
);

router.delete(
    "/:id",
    [
        validarJWT,              
        tieneRole("ADMIN_ROLE"),
        check("id", "Invalid category ID").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos             
    ],
    deleteCategory
);

export default router;
