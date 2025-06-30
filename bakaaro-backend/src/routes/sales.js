import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { createSale, getSales, deleteSale } from '../controllers/salesController.js';

const salesRouter = express.Router();

// Diiwaan geli iib cusub
salesRouter.post('/', protect, createSale);

// Soo qaado iibka
salesRouter.get('/', protect, getSales);

// Tirtir iib
salesRouter.delete('/:id', protect, admin, deleteSale);

export default salesRouter;