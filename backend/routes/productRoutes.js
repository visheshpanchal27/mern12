import express from 'express';
import formidable from 'express-formidable';

const router = express.Router()

import { 
    addProduct,
    removeProduct,
    updateProductDetails,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProduct,
    fetchNewProduct,
    filterProducts,
    fetchRandomProducts,
} from '../controllers/productController.js';
import { authentication,authorizeAdmin } from '../middlewares/authMiddleware.js';
import checkId from '../middlewares/checkId.js';

router.route('/')
    .get(fetchProducts)
    .post(authentication,authorizeAdmin,formidable(),addProduct);

router.route('/allProducts').get(fetchAllProducts);
router.route('/:id/reviews').post(authentication, checkId, addProductReview);

router.get('/top', fetchTopProduct)
router.get('/new', fetchNewProduct)
router.get('/random', fetchRandomProducts);


router
    .route('/:id')
    .put(authentication, authorizeAdmin, checkId , formidable(), updateProductDetails)
    .get(checkId , fetchProductById)
    .delete(authentication, authorizeAdmin, checkId , removeProduct);

router.route("/filtered-products").post(filterProducts);


export default router;
