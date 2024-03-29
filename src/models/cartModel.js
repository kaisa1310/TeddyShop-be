const mongoose = require('mongoose') // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    option: {
      name: String,
      code: String
    },
    color: {
      name: String,
      code: String
    },
    switch: {
      name: String,
      code: String
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    },
    attributeId: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

// save totalPrice
cartSchema.pre('save', function (next) {
  this.totalPrice = this.price * this.quantity
  next()
})

//Export the model
module.exports = mongoose.model('Cart', cartSchema)
