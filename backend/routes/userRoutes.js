import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { createToken } from '../token.js';

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

export default userRouter;
