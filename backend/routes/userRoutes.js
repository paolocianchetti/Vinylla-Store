import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { createToken } from '../token.js';
import { isAuth } from '../middlewares/isAuth.js';

const userRouter = express.Router();

userRouter.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    // cerchiamo l'utente in base alla sua email
    const user = await User.findOne({
      email: req.body.email,
    });

    // controlliamo se l'utente esiste e se la password è conforme
    // a quella memorizzata in formato criptato nel database
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: createToken(user),
        });
        return;
      }
    }
    res.status(401).send({
      message: 'Email o password non valida!',
    });
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    // creaimo un nuovo utente
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    // lo salviamo nel database
    const user = await newUser.save();
    // restituiamone i dati al frontend
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: createToken(user),
    });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // vediamo se l'untente esiste nel database remoto
    const user = await User.findById(req.user._id);
    // se esiste allora aggiorniamo i dati dell'utente
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // se è stata inviata la password la criptiamo e aggiorniamo
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      // inviamo i dati dell'utente aggiornati al database remoto
      const updatedUser = await user.save();

      // restituiamo al frontend l'oggetto dei dati aggiornati dell'utente
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: createToken(updatedUser),
      });
    } else {
      res.status(404).send({
        message: 'Utente non trovato!',
      });
    }
  })
);

export default userRouter;
