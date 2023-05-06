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

router.post(
  '/review/:id',
  AuthController.verifyUser,
  ProductController.addProductReview
)

router.route('/product/:id').get(ProductController.getSingleProduct)

export default router
