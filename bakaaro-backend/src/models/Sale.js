import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative'],
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'EVC Plus'],
    required: [true, 'Payment method is required'],
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Sale', saleSchema);