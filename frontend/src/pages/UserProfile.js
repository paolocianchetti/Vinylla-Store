import React, { useContext, useReducer, useState } from 'react';
import axios from 'axios';
import userProfileReducer from '../reducers/userProfileReducer';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../errors';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function UserProfile() {
  // le info sull'utente le prendiamo dal contesto fornito dallo Store
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { userInfo } = state;

  // definiamo uno state per il nome utente
  const [name, setName] = useState(userInfo.name);
  // definiamo uno stato per l'email dell'utente
  const [email, setEmail] = useState(userInfo.email);
  // definiamo uno stato per la password e per la conferma della password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(userProfileReducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    // controlliamo che le password inserite corrispondano
    if (password !== confirmPassword) {
      toast.error('Le password inserite non corrispondono!');
      return;
    }

    // inviamo una richiesta ajax al server
    dispatch({
      type: 'UPDATE_REQUEST',
    });
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      // se la risposta del server ha avuto riscontro
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      // aggiorniamo i dati dell'utente nello Store
      contextDispatch({
        type: 'USER_LOGIN',
        payload: data,
      });
      // aggiorniamo i dati dell'utente anche nel localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      // mostriamo un messaggio all'utente
      toast.success(`Dati dell'utente aggiornati con successo`);
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container profile-container">
      <title>Profilo Utente</title>
      <h1 className="my-3">Profilo Utente</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nome e Cognome</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Conferma Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={loadingUpdate}>
            Aggiorna
          </Button>
        </div>
      </form>
    </div>
  );
}
