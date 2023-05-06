import { ProductModel } from '../models/Product.js'
import CusError from '../utils/cusError.js'

export const getAllProducts = async (req, res, next) => {
  try {
    const selectedFields = 'name price rating coverImg _id prdId reviewsCount'
    let queryObj = ProductModel.find()
    queryObj = queryObj.select(selectedFields)

    // only handling query related to category field
    const category = req.query.category || null
    if (category) queryObj = queryObj.find({ category })

    const products = await queryObj

    if (products.length === 0) throw new CusError('No Data Found', 404)

    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      totalProducts: products.length,
      data: {
        products,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const createNewProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.create(req.body)

    res.status(201).json({
      status: 'progress',
      statusCode: 201,
      data: {
        product,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getSingleProduct = async (req, res, next) => {
  try {
    const prdId = req.params.id
    const product = await ProductModel.findById(prdId).select('-__v -category')

    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      data: {
        product,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getHeadlines = async (req, res, next) => {
  try {
    const selectedField = 'name rating coverImg _id price'

    const products = await ProductModel.find().select(selectedField)

    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      totalProducts: products.length,
      data: {
        products,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getTopRatedProducts = async (req, res, next) => {
  try {
    const selectedFields = 'name price rating coverImg _id prdId reviewsCount'
    const products = await ProductModel.find({ rating: { $gt: 4.4 } }).select(
      selectedFields
    )

    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      totalProducts: products.length,
      data: {
        products,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await ProductModel.aggregate([
      {
        $match: { category: { $exists: true } },
      },
      {
        $group: {
          _id: '$category',
        },
      },
      {
        $addFields: {
          title: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])

    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      totalCategories: categories.length,
      data: {
        categories,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const addProductReview = async (req, res, next) => {
  try {
    // storing user we got by verifyUser middleware
    const user = req.user

    // extracting product
    const prdId = req.params.id

    // user Review
    const review = req.body.review
    const rating = req.body.rating

    const product = await ProductModel.findById(prdId)

    // if no product found
    if (!product)
      throw new CusError('Invalid request or this product is deleted', 404)

    // checking if user already reviewed the product or not
    if (
      product.reviews.some((el) => el.userId.toString() === user._id.toString())
    )
      throw new CusError('you already reviewed this product', 401)

    // adding user review
    const userData = {
      userId: user._id,
      reviewDate: new Date(),
      username: user.fname,
      rating,
      review,
    }
    product.reviews.push(userData)
    const newProduct = await product.save() // saving to database

    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      data: {
        reviews: newProduct.reviews,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const updateReview = async (req, res, next) => {
  try {
    const user = req.user

    // product ID
    const prdId = req.params.id

    // updatedReview
    const review = req.body.review

    const product = await ProductModel.findById(prdId)

    const reviews = [...product.reviews]

    // finding user review
    const index = reviews.findIndex(
      (el) => el.userId.toString() === user._id.toString()
    )
    const userData = {
      userId: user._id,
      reviewDate: new Date(),
      username: user.fname,
      rating: product.reviews[index].rating,
      review,
    }
    reviews.splice(index, 1, userData)

    product.reviews = reviews
    const newProduct = await product.save() // saving to database

    res.status(200).json({
      status: 'Success✅',
      statusCode: 200,
      data: {
        reviews: newProduct.reviews,
      },
    })
  } catch (err) {
    next(err)
  }
}
