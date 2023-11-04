import React, { useContext, useEffect, useReducer } from 'react';
import Axios from 'axios';
import { Store } from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../errors';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Steps from '../components/Steps';
import Loading from '../components/Loading';

const reducer = (state, action) => {
  switch (action.type) {
    case 'ORDER_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'ORDER_SUCCESS':
      return {
        ...state,
        loading: false,
      };
    case 'ORDER_FAIL':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default function Order() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // definiamo una funzione di arrotondamento
  // se abbiamo un numero 256.5432 lo trasforma in 256.54
  const trunc = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  // calcoliamo il costo dei dischi presenti nel carrello
  cart.itemsPrice = trunc(
    cart.cartItems.reduce(
      (acc, current) => acc + current.quantity * current.price,
      0
    )
  );

  // calcoliamo il costo della spedizione. Se il costo dei dischi
  // è maggiore di € 80 non vengono applicate spese di spedizione,
  // altrimenti le spese per la spedizione ammontano a € 6
  cart.shippingPrice = cart.itemsPrice > 80 ? trunc(0) : trunc(6);

  // applichiamo l'IVA del 22%
  cart.taxPrice = trunc(0.22 * cart.itemsPrice);

  // calcoliamo il totale dell'ordine
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const confirmOrderHandler = async () => {
    try {
      dispatch({
        type: 'ORDER_REQUEST',
      });
      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingData: cart.shippingData,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // dopo la richiesta al server svuotiamo il carrello
      // per accoglere nuovi ordini
      contextDispatch({
        type: 'EMPTY_CART',
      });
      // a questo punto l'ordine è andato a buon fine
      dispatch({
        type: 'ORDER_SUCCESS',
      });
      // cancelliamo anche i dischi nel carrello dal localStorage
      localStorage.removeItem('cartItems');
      // spostiamo l'utente sulla pagina dell'ordine, passandoci
      // l'_id univoco come parametro
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({
        type: 'ORDER_FAIL',
      });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <div>
      <Steps login shipping payment order></Steps>
      <title>Riepilogo Ordine</title>
      <h1 className="my-3">Riepilogo Ordine</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dati di spedizione</Card.Title>
              <Card.Text>
                <strong>Nome: </strong> {cart.shippingData.name} <br />
                <strong>Indirizzo: </strong> {cart.shippingData.address},
                {cart.shippingData.city}, {cart.shippingData.postalCode},
                {cart.shippingData.country}
              </Card.Text>
              <Link to="/shipping">Modifica</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pagamento</Card.Title>
              <Card.Text>
                <strong>Metodo:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Modifica</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dischi nel carrello</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
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
                      <Col md={3}>€ {item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Modifica</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Riepilogo</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Dischi</Col>
                    <Col>€ {cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Spedizione</Col>
                    <Col>€ {cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>IVA</Col>
                    <Col>€ {cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Totale</strong>
                    </Col>
                    <Col>
                      <strong>€ {cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={confirmOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Conferma Ordine
                    </Button>
                  </div>
                  {loading && <Loading></Loading>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
