import { Schema, model } from 'mongoose'

const productSchema = new Schema({
  prdId: {
    type: String,
    required: [true, 'Product must have an id'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Product must have a name'],
    unique: true,
    minLength: [6, 'Product must be minimum 6 character long'],
    toLower: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product must a price'],
    min: [100, 'Product price must greater than or equal to 100'],
  },
  category: {
    type: String,
    required: [true, 'Product must have category'],
    toLower: true,
    enum: {
      values: [
        'face',
        'beard',
        'hair',
        'combo',
        'fragrance',
        'clothing',
        'body',
      ],
      message:
        'category can only be one of these: FACE | BODY | HAIR | CLOTHING | BEARD | FRAGRANCES | COMBO',
    },
  },
  coverImg: {
    type: String,
    required: [true, 'Product must a photo'],
  },
  images: {
    type: [String],
  },
  reviews: {
    type: [Object],
  },
  reviewsCount: {
    type: Number,
  },
  rating: {
    type: Number,
    min: [0, "rating can't be less than 0⭐"],
    max: [5, "rating can't be more than 5⭐"],
    default: 4.5,
  },
  ingredients: {
    type: [String],
  },
  details: {
    type: String,
    required: [true, 'Product must have some details'],
  },
})

// calculating ratings
productSchema.pre('save', function (next) {
  this.reviewsCount = this.reviews.length

  const sumOfAllRating = this.reviews.reduce((sum, el) => sum + el.rating, 0)
  this.rating = +(sumOfAllRating / this.reviews.length).toFixed(1)

  next()
})

export const ProductModel = model('products', productSchema)
