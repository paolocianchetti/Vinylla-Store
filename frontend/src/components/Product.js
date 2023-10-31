import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useState, useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { vinyl } = props;
  const [isDisableBtn, setIsDisableBtn] = useState(false);
  const { state, dispatch: contextDispatch } = useContext(Store);

  // destrutturiamo l'array cartItems dallo state
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    // verifichiamo se nel carrello già esiste quel prodotto con _id
    const existItem = cartItems.find((x) => x._id === vinyl._id);

    // incrementiamone la quantità presente solo se esiste nel carrello
    // quando clicchiamo su un prodotto e lo aggiungiamo al carrello
    // deve essere aggiornata solo la quantità già presente
    const quantity = existItem ? existItem.quantity + 1 : 1;

    // richiediamo al server i dati del prodotto specifico
    const { data } = await axios.get(`/api/vinyls/${item._id}`);

    // ora verifichiamo se la quantità presente in magazzino di quel
    // prodotto sia uguale alla quantità aggiunta nel carrello per
    // disabilitare il bottone di aggiungi al carrello
    if (data.countInStock === quantity) {
      setIsDisableBtn(true);
    }

    contextDispatch({
      type: 'ADD_ITEM_CART',
      payload: {
        ...item,
        quantity,
      },
    });
  };

  return (
    <Card>
      <Link to={`/vinyl/${vinyl.path}`}>
        <img src={vinyl.cover} className="card-img-top" alt={vinyl.title} />
      </Link>
      <Card.Body>
        <Link to={`/vinyl/${vinyl.path}`}>
          <Card.Title>{vinyl.title}</Card.Title>
        </Link>
        <Rating rating={vinyl.rating} numReviews={vinyl.numReviews} />
        <Card.Text>€{vinyl.price}</Card.Text>
        {isDisableBtn ? (
          <Button variant="light" disabled>
            Non disponibile
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(vinyl)}>
            Aggiungi al carrello
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
