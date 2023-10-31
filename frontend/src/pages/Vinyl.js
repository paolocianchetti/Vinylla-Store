import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { getError } from '../errors';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        vinyl: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

function Vinyl() {
  const navigate = useNavigate();
  const params = useParams();
  const { path } = params;

  const [{ loading, error, vinyl }, dispatch] = useReducer(reducer, {
    vinyl: {},
    loading: true,
    error: '',
  });

  useEffect(() => {
    const getData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/vinyls/path/${path}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    getData();
  }, [path]);

  const { state, dispatch: contextDispatch } = useContext(Store);
  // destrutturiamo l'oggetto cart dallo state
  const { cart } = state;

  const addToCartHandler = async () => {
    // verifichiamo se nel carrello già esiste quel prodotto con _id
    const existItem = cart.cartItems.find((x) => x._id === vinyl._id);

    // incrementiamone la quantità presente solo se esiste nel carrello
    // quando clicchiamo su un prodotto e lo aggiungiamo al carrello
    // deve essere aggiornata solo la quantità già presente
    const quantity = existItem ? existItem.quantity + 1 : 1;

    // effettuiamo una nuova richiesta al server per verificare che
    // il prodotto selezionato con id univoco esista effettivamente
    const { data } = await axios.get(`/api/vinyls/${vinyl._id}`);

    // ora verifichiamo che la quantità presente in magazzino di quel
    // prodotto non sia inferiore a quella calcolata quando aggiungiamo
    // al carrello, altrimenti mostriamo un messaggio all'utente
    if (data.countInStock < quantity) {
      window.alert('Attenzione! Il vinile non è più disponibile...');
      return;
    }

    contextDispatch({
      type: 'ADD_ITEM_CART',
      payload: {
        ...vinyl,
        quantity,
      },
    });
    // spostiamo l'utente sulla pagina del Carrello
    navigate('/cart');
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className="img-large" src={vinyl.cover} alt={vinyl.title}></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{vinyl.title}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={vinyl.rating}
                numReviews={vinyl.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Prezzo : € {vinyl.price}</ListGroup.Item>
            <ListGroup.Item>
              Descrizione:
              <p>{vinyl.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Prezzo: </Col>
                    <Col>€ {vinyl.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {vinyl.countInStock > 0 ? (
                        <Badge bg="success">Disponibile</Badge>
                      ) : (
                        <Badge bg="danger">Non disponibile</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {vinyl.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Aggiungi al carrello
                      </Button>
                    </div>
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

export default Vinyl;
