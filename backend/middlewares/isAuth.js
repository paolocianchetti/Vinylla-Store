import jwt from 'jsonwebtoken';

export const isAuth = (req, res, next) => {
  // prendiamo la stringa di autorizzazione con il token dell'utente
  const authorization = req.headers.authorization;
  // controlliamo che esiste
  if (authorization) {
    // prendiamo solo il token dalla stringa, togliendo Bearer
    const token = authorization.slice(7, authorization.length);
    // usiamo ora il metodo verify di jwt per controllare
    // se il token dell'utente è ancora valido e lo decodifica
    // ricavando tutte le informazioni sull'utente
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({
          message: 'Token non valido!',
        });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({
      message: 'Utente non autorizzato!',
    });
  }
};
