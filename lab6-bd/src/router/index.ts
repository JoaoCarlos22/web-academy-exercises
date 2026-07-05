import { Router } from "express"
import productController from "../controllers/productController.js"

const router = Router()

router.get("/", productController.getAllProducts)
router.get("/categories", productController.getCategories)
router.post("/create", productController.createProduct)
router.get("/:id", productController.getProductById)
// router.put("/:id", productController.updateProduct)
// router.delete("/:id", productController.deleteProduct)

export default router
