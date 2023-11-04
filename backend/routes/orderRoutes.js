import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../middlewares/isAuth.js';

const orderRouter = express.Router();

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, vinyl: x._id })),
      shippingData: req.body.shippingData,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    // salviamo il nuovo ordine nel database
    const order = await newOrder.save();

    // inviamo al frontend l'ordine e il messaggio di avvenuto salvataggio
    // nel database remoto
    res.status(201).send({
      message: 'Nuovo ordine salvato con successo',
      order,
    });
  })
);

export default orderRouter;
