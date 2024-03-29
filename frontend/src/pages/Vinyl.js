import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import axios from 'axios';
import vinylReducer from '../reducers/vinylReducer';
import { Store } from '../Store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../errors';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Rating from '../components/Rating';
import Loading from '../components/Loading';
import Message from '../components/Message';

function Vinyl() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { path } = params;

  const [{ loading, error, vinyl, loadingComments }, dispatch] = useReducer(
    vinylReducer,
    {
      vinyl: {},
      loading: true,
      loadingComments: false,
      error: '',
    }
  );

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
  // destrutturiamo l'oggetto cart dallo state e le informazioni dell'utente
  const { cart, userInfo } = state;

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

  const submitHandler = async (e) => {
    e.preventDefault();

    // dispacciamo l'azione di richiesta salvataggio della recensione
    // il bottone 'Salva' viene momentaneamente disabilitato
    dispatch({
      type: 'SAVE_REVIEW_REQUEST',
    });

    if (!comment || !rating) {
      toast.error('Per favore esprimi una valutazione e lascia un commento!');
      dispatch({
        type: 'SAVE_REVIEW_FAIL',
      });
      return;
    }
    try {
      // controlliamo se l'utente ha già salvato una recensione
      const result = await axios.get(`/api/vinyls/${vinyl._id}/reviews`, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (result.data.statusCode === 200) {
        toast.error(result.data.message);
        dispatch({
          type: 'SAVE_REVIEW_FAIL',
        });
        return;
      }

      // salviamo la recensione nel database remoto
      const { data } = await axios.post(
        `/api/vinyls/${vinyl._id}/reviews`,
        {
          name: userInfo.name,
          comment,
          rating,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch({
        type: 'SAVE_REVIEW_SUCCESS',
      });
      toast.success('Recensione salvata correttamente');
      // aggiunge la recensione salvata nel database remoto
      // all'inizio del vettore reviews del vinile selezionato
      vinyl.reviews.unshift(data.review);
      // aggiorna il numero delle recensioni del disco selezionato
      vinyl.numReviews = data.numReviews;
      // aggiorna la valutazione del vinile selezionato
      vinyl.rating = data.rating;

      // dispacciamo l'azione per aggiornare i dati del vinile
      dispatch({
        type: 'UPDATE_VINYL',
        payload: vinyl,
      });

      // portiamo gradualmente l'utente sul titolo 'Recensioni'
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'SAVE_REVIEW_FAIL' });
    }
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
      <div className="my-3">
        <h2 ref={reviewsRef}>Recensioni</h2>
        <div className="mb-3">
          {vinyl.reviews.length === 0 && (
            <Message>Non ci sono recensioni per questo disco</Message>
          )}
        </div>
        <ListGroup>
          {vinyl.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Scrivi una recensione</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Valutazione</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Seleziona...</option>
                  <option value="1">1 - Scadente</option>
                  <option value="2">2 - Discreto</option>
                  <option value="3">3 - Buono</option>
                  <option value="4">4 - Fantastico</option>
                  <option value="5">5 - Eccezionale</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                className="mb-3"
                controlId="floatingTextarea"
                labels="Comments"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Lascia qui il tuo commento"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>
              <div className="mb-3">
                <Button type="submit" disabled={loadingComments}>
                  Salva
                </Button>
                {loadingComments && <Loading></Loading>}
              </div>
            </form>
          ) : (
            <Message>
              Per favore{' '}
              <Link to={`/login?redirect=/vinyl/${vinyl.path}`}>
                effettua il login
              </Link>{' '}
              per scrivere una recensione
            </Message>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vinyl;
