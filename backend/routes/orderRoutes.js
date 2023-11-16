import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../middlewares/isAuth.js';
import { createTemplate } from '../functions/setEmail.js';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

orderRouter.get(
  '/user',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // estraiamo dalla tabella Order tutti gli ordini effettuati
    // dall'utente autorizzato
    const orders = await Order.find({
      user: req.user._id,
    });
    // restituiamo il vettore degli ordini al frontend
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // cerchiamo l'ordine specificato dal parametro id
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({
        message: 'Ordine non trovato!',
      });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // cerchiamo l'ordine con id passato come parametro nel database remoto
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    // se l'ordine esiste, impostiamo lo stato del suo pagamento a true
    // e il momento in cui è stato pagato con la data corrente
    // inoltre aggiorno i dati di pagamento dell'ordine con le informazioni
    // ricevute da PayPal (oggetto details passato dal frontend)
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      // salviamo i dati del pagamento dell'ordine nel database remoto
      const updatedOrder = await order.save();

      // inviamo email al cliente attraverso il servizio sendGrid
      const msg = {
        to: `${order.user.name} <${order.user.email}>`,
        from: 'paolo.cianchetti@gmail.com',
        subject: `Nuovo ordine ${order._id}`,
        text: 'di seguito trovi i dati del tuo ordine...',
        html: createTemplate(order),
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email dettaglio ordine inviata al cliente...');
        })
        .catch((error) => {
          console.error(error);
        });

      // restituiamo la risposta al frontend
      res.send({
        message: 'Ordine Pagato',
        order: updatedOrder,
      });
    } else {
      // ordine non trovato
      res.status(404).send({
        message: 'Ordine non trovato!',
      });
    }
  })
);

export default orderRouter;
