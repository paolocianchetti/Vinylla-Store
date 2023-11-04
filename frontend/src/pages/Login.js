import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getError } from '../errors';

export default function Login() {
  const navigate = useNavigate();
  // prendiamo l'url dal browser //localhost:3000/login?redirect=/shipping
  const { search } = useLocation();
  // prendiamo '/shipping' da search usando la chiave redirect
  const redirectUrl = new URLSearchParams(search).get('redirect');
  // se lo abbiamo settiamo redirect a /shipping, altrimenti alla root
  const redirect = redirectUrl ? redirectUrl : '/';

  // definiamo uno state per l'email e uno per la password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: contextDispatch } = useContext(Store);
  // prendiamo le info dell'utente loggato dallo state
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/login', {
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
      <title>Login</title>
      <h1 className="my-3">Login</h1>
      <Form onSubmit={submitHandler}>
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
        <div className="mb-3">
          <Button type="submit">Login</Button>
        </div>
        <div className="mb-3">
          Sei un nuovo cliente?{' '}
          <Link to={`/register?redirect=${redirect}`}>Crea un account</Link>
        </div>
      </Form>
    </Container>
  );
}
