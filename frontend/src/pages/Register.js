import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../errors';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Register() {
  const navigate = useNavigate();
  // prendiamo l'url dal browser //localhost:3000/register?redirect=/shipping
  const { search } = useLocation();
  // prendiamo '/shipping' da search usando la chiave redirect
  const redirectUrl = new URLSearchParams(search).get('redirect');
  // se lo abbiamo settiamo redirect a /shipping, altrimenti alla root
  const redirect = redirectUrl ? redirectUrl : '/';

  // definiamo uno state per il nome, l'email, la password e
  // un altro state per confermare la password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: contextDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();

    // controlliamo che le password inserite corrispondano
    if (password !== confirmPassword) {
      toast.error('Le password inserite non corrispondono!');
      return;
    }

    try {
      const { data } = await Axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      contextDispatch({
        type: 'USER_LOGIN',
        payload: data,
      });
      // salviamo i dati dell'utente nel localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      // spostiamo l'utente sulla rotta /shipping o alla root
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="login-container">
      <title>Registrazione</title>
      <h1 className="my-3">Registrazione</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nome e Cognome</Form.Label>
          <Form.Control required onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Conferma Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Registrati</Button>
        </div>
        <div className="mb-3">
          Hai già un account?{' '}
          <Link to={`/login?redirect=${redirect}`}>Login</Link>
        </div>
      </Form>
    </Container>
  );
}
