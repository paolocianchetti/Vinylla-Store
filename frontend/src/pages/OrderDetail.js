import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../errors';
import { toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Loading from '../components/Loading';
import Message from '../components/Message';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
        error: '',
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: '',
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'PAY_REQUEST':
      return {
        ...state,
        loadingPay: true,
      };
    case 'PAY_SUCCESS':
      return {
        ...state,
        loadingPay: false,
        successPay: true,
      };
    case 'PAY_FAIL':
      return {
        ...state,
        loadingPay: false,
      };
    case 'PAY_RESET':
      return {
        ...state,
        loadingPay: false,
        successPay: false,
      };
    default:
      return state;
  }
}

export default function OrderDetail() {
  const { state } = useContext(Store);
  // prendo le informazioni sull'utente dallo state nello Store
  const { userInfo } = state;
  // prendiamo l'id dell'ordine come parametro nell'url
  const params = useParams();
  const { id: orderId } = params;

  const navigate = useNavigate();

  const [{ loading, error, order, loadingPay, successPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      loadingPay: false,
      successPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({
          type: 'PAY_REQUEST',
        });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'PAY_SUCCESS',
          payload: data,
        });

        toast.success('Pagamento effettuato con successo');
      } catch (err) {
        dispatch({
          type: 'PAY_FAIL',
          payload: getError(err),
        });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({
          type: 'FETCH_REQUEST',
        });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    // se non ci sono i dati dell'utente spostiamolo sulla pagina di login
    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      // chiediamo al server i dati dell'ordine confermato dall'utente
      // per aggiornare lo stato dell'ordine nella pagina
      fetchOrder();
      // se il pagamento è andato a buon fine resettiamo il suo status
      if (successPay) {
        dispatch({
          type: 'PAY_RESET',
        });
      }
    } else {
      // richiediamo al server il clientID fornito da PayPal
      const getPaypalClientId = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'EUR',
          },
        });
        paypalDispatch({
          type: 'setLoadingStatus',
          value: 'pending',
        });
      };
      getPaypalClientId();
    }
  }, [userInfo, order, orderId, navigate, paypalDispatch, successPay]);

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <title>Ordine {orderId}</title>
      <h1 className="my-3">Ordine {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dati di spedizione</Card.Title>
              <Card.Text>
                <strong>Nome e Cognome:</strong> {order.shippingData.name}{' '}
                <br />
                <strong>Indirizzo: </strong> {order.shippingData.address},
                {order.shippingData.city}, {order.shippingData.postalCode},
                {order.shippingData.country}
              </Card.Text>
              {order.isDelivered ? (
                <Message variant="success">
                  Consegnato a {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Non consegnato</Message>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pagamento</Card.Title>
              <Card.Text>
                <strong>Metodo:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <Message variant="success">Pagato il {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Non pagato</Message>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Vinili</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/vinyl/${item.path}`}>{item.title}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Riepilogo Ordine</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Vinili</Col>
                    <Col>€ {order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Spedizione</Col>
                    <Col>€ {order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>IVA</Col>
                    <Col>€ {order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Totale ordine</strong>
                    </Col>
                    <Col>
                      <strong>€ {order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <Loading />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <Loading />}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
