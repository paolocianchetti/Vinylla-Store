import { useContext } from 'react';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Message from '../components/Message';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cart() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);

  // destrutturiamo l'array cartItems dallo state
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    // richiediamo al server i dati del prodotto specifico
    const { data } = await axios.get(`/api/vinyls/${item._id}`);

    // ora verifichiamo che la quantità presente in magazzino di quel
    // prodotto non sia inferiore a quella calcolata
    if (data.countInStock < quantity) {
      window.alert('Attenzione! Il vinile non è più disponibile...');
      return;
    }

    contextDispatch({
      type: 'ADD_ITEM_CART',
      payload: {
        ...item,
        quantity,
      },
    });
  };

  const deleteItemHandler = (item) => {
    contextDispatch({ type: 'DELETE_ITEM_CART', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div>
      <title>Carrello</title>
      <h1>Carrello</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Message>
              Il carrello è vuoto. <Link to="/">Ritorna al negozio</Link>
            </Message>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/vinyl/${item.path}`}>{item.title}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>€ {item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => deleteItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Totale ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    prodotti) : €
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Procedi al Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
