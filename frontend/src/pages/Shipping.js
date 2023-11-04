import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Steps from '../components/Steps';

export default function Shipping() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);

  // recuperiamo i dati dell'utente che ha effettuato il login e i
  // dati della spedizione dallo state nello Store
  const {
    userInfo,
    cart: { shippingData },
  } = state;

  const [name, setName] = useState(shippingData.name || '');
  const [address, setAddress] = useState(shippingData.address || '');
  const [city, setCity] = useState(shippingData.city || '');
  const [postalCode, setPostalCode] = useState(shippingData.postalCode || '');
  const [country, setCountry] = useState(shippingData.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    contextDispatch({
      type: 'SAVE_SHIPPING_DATA',
      payload: {
        name,
        address,
        city,
        postalCode,
        country,
      },
    });
    // salviamo i dati di spedizione anche nel localStorage
    localStorage.setItem(
      'shippingData',
      JSON.stringify({
        name,
        address,
        city,
        postalCode,
        country,
      })
    );
    // spotiamo l'utente sulla pagina del pagamento
    navigate('/payment');
  };

  return (
    <div>
      <title>Dati per la spedizione</title>
      <Steps login shipping></Steps>
      <div className="container shipping-container">
        <h1 className="my-3">Dati di spedizione</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nome e Cognome</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Indirizzo</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Città</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Codice Postale</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Nazione</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continua
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
