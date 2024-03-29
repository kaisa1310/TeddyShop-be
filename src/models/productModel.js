const mongoose = require('mongoose')

var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    // productCode: {
    //   type: String,
    //   required: true,
    //   uppercase: true
    // },
    slug: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    priceSale: {
      type: Number
    },
    price: {
      type: Number,
      required: true
    },
    // các thuộc tính của sản phầm
    options: [
      {
        name: String,
        code: String
      }
    ],
    // mà sắc sản phẩm
    colors: [
      {
        name: String,
        code: String
      }
    ],
    // kiểu switch của sản phẩm
    types: [
      {
        name: String,
        code: String
      }
    ],
    attributes: [
      {
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        option: {
          code: String
        },
        color: {
          code: String
        },
        switch: {
          code: String
        }
      }
    ],
    // số lượng tổng
    quantity: {
      type: Number,
      required: true
    },
    // số lượng đã bán
    quantitySold: {
      type: Number,
      default: 0
    },
    // số lượng có sẵn
    quantityAvailable: {
      type: Number,
      default: function () {
        return this.quantity - this.quantitySold
      }
    },
    // bảo hành: ví dụ 6 tháng, 12 tháng,...
    warranty: {
      type: String,
      required: true
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
      required: true
    },
    images: [
      {
        public_id: String,
        url: String
      }
    ],
    tags: [],
    ratings: [
      {
        start: Number,
        comment: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    totalRating: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      required: true,
      default: 'active',
      enum: ['active', 'inactive']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

//Export the model
module.exports = mongoose.model('Product', productSchema)
