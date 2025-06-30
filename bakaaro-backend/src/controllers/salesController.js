import Sale from '../models/Sale.js';
import Product from '../models/Product.js';

export const getSales = async (req, res) => {
  const user = req.user;
  try {
    const sales = await Sale.find({ branch: user.branch }).populate('items.productId');
    console.log('Fetched sales:', sales);
    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const createSale = async (req, res) => {
  const { items, paymentMethod } = req.body;
  const user = req.user;

  console.log('Create sale data:', { items, paymentMethod, user });

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and cannot be empty' });
    }
    if (!paymentMethod || !['Cash', 'EVC Plus'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid or missing payment method' });
    }

    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product: ${product.name}` });
      }
      if (product.branch !== user.branch) {
        return res.status(403).json({ error: `Product ${product.name} belongs to another branch` });
      }
      item.price = product.price;
      totalPrice += product.price * item.quantity;
      product.quantity -= item.quantity;
      await product.save();
    }

    const sale = new Sale({
      items,
      totalPrice,
      paymentMethod,
      branch: user.branch,
      createdBy: user._id,
    });

    const savedSale = await sale.save();
    console.log('Saved sale to database:', savedSale);
    const populatedSale = await Sale.findById(savedSale._id).populate('items.productId');
    console.log('Created sale:', populatedSale);
    res.status(201).json(populatedSale);
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

export const deleteSale = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    if (sale.branch !== user.branch) {
      return res.status(403).json({ error: 'Forbidden: Sale belongs to another branch' });
    }

    await sale.deleteOne();
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Delete sale error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};