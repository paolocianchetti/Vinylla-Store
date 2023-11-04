import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Steps from '../components/Steps';

export default function Payment() {
  const navigate = useNavigate();

  const { state, dispatch: contextDispatch } = useContext(Store);

  // preleviamo dallo state i dati per la spedizione e il metodo
  // di pagamento scelto
  const {
    cart: { shippingData, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingData.address) {
      navigate('/shipping');
    }
  }, [shippingData, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    contextDispatch({
      type: 'CONFIRM_PAYMENT',
      payload: paymentMethodName,
    });
    // salviamo il metodo di pagamento scelto anche nel localStorage
    localStorage.setItem('paymentMethod', paymentMethodName);
    // spostiamo l'utente sulla pagina degli ordini
    navigate('/order');
  };

  return (
    <div>
      <Steps login shipping payment></Steps>
      <div className="container payment-container">
        <title>Metodo di Pagamento</title>
        <h1 className="my-3">Medoto di Pagamento</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Conferma</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
