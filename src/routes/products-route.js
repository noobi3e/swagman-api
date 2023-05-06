import { Router } from 'express'
import * as ProductController from '../controllers/productController.js'
import * as AuthController from '../controllers/AuthController.js'

const router = Router()

router.get('/categories', ProductController.getAllCategories)
router.get('/top-rated', ProductController.getTopRatedProducts)
router.get('/headlines', ProductController.getHeadlines)

router
  .route('/')
  .get(ProductController.getAllProducts)
  .post(ProductController.createNewProduct)

router
  .route('/review/:id')
  .post(AuthController.verifyUser, ProductController.addProductReview)
  .patch(AuthController.verifyUser, ProductController.updateReview)

router.route('/product/:id').get(ProductController.getSingleProduct)

export default router
