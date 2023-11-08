import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import { toast } from 'react-toastify';
import { getError } from '../errors';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Product from '../components/Product';

// definiamo un reducer
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
        loading: false,
        vinyls: action.payload.vinyls,
        page: action.payload.page,
        pages: action.payload.pages,
        numVinyls: action.payload.numVinyls,
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

// definiamo il vettore dei prezzi
const prices = [
  {
    name: '€ 30 a € 80',
    value: '30-80',
  },
  {
    name: '€ 81 a € 200',
    value: '81-150',
  },
  {
    name: '€ 201 a € 400',
    value: '201-400',
  },
];

// definiamo il vettore per le recensioni
export const ratings = [
  {
    name: '1stelle e oltre',
    rating: 1,
  },
  {
    name: '2stelle e oltre',
    rating: 2,
  },
  {
    name: '3stelle e oltre',
    rating: 3,
  },
  {
    name: '4stelle e oltre',
    rating: 4,
  },
];

export default function SearchResult() {
  const navigate = useNavigate();

  // prendiamo la query string con useLocation
  const { search } = useLocation();

  // ricaviamo i valori inseriti differenziati a seconda della chiave di ricerca
  const parameters = new URLSearchParams(search); // es: /search?genre=Pop
  const genre = parameters.get('genre') || 'all'; // Pop
  const query = parameters.get('query') || 'all';
  const price = parameters.get('price') || 'all';
  const rating = parameters.get('rating') || 'all';
  const order = parameters.get('order') || 'newest';
  const page = parameters.get('page') || 1;

  const [{ loading, error, vinyls, pages, numVinyls }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
      vinyls: [],
      pages: 1,
      numVinyls: 0,
    }
  );

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch({
          type: 'FETCH_REQUEST',
        });
        const { data } = await axios.get(
          `/api/vinyls/search?page=${page}&query=${query}&genre=${genre}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    getData();
  }, [genre, error, order, page, price, query, rating]);

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const { data } = await axios.get(`/api/vinyls/genres`);
        setGenres(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    getGenres();
  }, [dispatch]);

  // questa funzione crea l'URL con le chiavi per effettuare la ricerca
  const createFilteredUrl = (filter, skipPathname) => {
    const pageValue = filter.page || page;
    const genreValue = filter.genre || genre;
    const queryValue = filter.query || query;
    const ratingValue = filter.rating || rating;
    const priceValue = filter.price || price;
    const orderSort = filter.order || order;
    return `${
      skipPathname ? '' : '/search?'
    }genre=${genreValue}&query=${queryValue}&price=${priceValue}&rating=${ratingValue}&order=${orderSort}&page=${pageValue}`;
  };

  return (
    <div>
      <title>Cerca Vinili</title>
      <Row>
        <Col md={3}>
          <h3>Genere</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === genre ? 'text-bold' : ''}
                  to={createFilteredUrl({ genre: 'all' })}
                >
                  Tutti
                </Link>
              </li>
              {genres.map((taste) => (
                <li key={taste}>
                  <Link
                    className={taste === genre ? 'text-bold' : ''}
                    to={createFilteredUrl({ genre: taste })}
                  >
                    {taste}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Prezzo</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={createFilteredUrl({ price: 'all' })}
                >
                  Qualsiasi
                </Link>
              </li>
              {prices.map((vinylPrice) => (
                <li key={vinylPrice.value}>
                  <Link
                    to={createFilteredUrl({ price: vinylPrice.value })}
                    className={vinylPrice.value === price ? 'text-bold' : ''}
                  >
                    {vinylPrice.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <h3>Recensioni</h3>
          <ul>
            {ratings.map((rate) => (
              <li key={rate.name}>
                <Link
                  to={createFilteredUrl({ rating: rate.rating })}
                  className={
                    `${rate.rating}` === `${rating}` ? 'text-bold' : ''
                  }
                >
                  <Rating rating={rate.rating} caption={' e oltre'}></Rating>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={createFilteredUrl({ rating: 'all' })}
                className={rating === 'all' ? 'text-bold' : ''}
              >
                <Rating caption={' e oltre'} rating={0}></Rating>
              </Link>
            </li>
          </ul>
        </Col>
        <Col md={9}>
          {loading ? (
            <Loading></Loading>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {numVinyls === 0 ? 'No' : numVinyls} Risultati
                    {query !== 'all' && ' : ' + query}
                    {genre !== 'all' && ' : ' + genre}
                    {price !== 'all' && ' : Prezzo ' + price}
                    {rating !== 'all' && ' : Voto ' + rating + ' e oltre'}
                    {query !== 'all' ||
                    genre !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Ordina per{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(createFilteredUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Nuovi Arrivi</option>
                    <option value="lowest">Economici</option>
                    <option value="highest">Costosi</option>
                    <option value="toprated">Recensiti</option>
                  </select>
                </Col>
              </Row>
              {vinyls.length === 0 && <Message>Nessun vinile trovato</Message>}
              <Row>
                {vinyls.map((vinyl) => (
                  <Col sm={6} lg={4} key={vinyl._id} className="mb-3">
                    <Product vinyl={vinyl}></Product>
                  </Col>
                ))}
              </Row>
              {[...Array(pages).keys()].map((n) => (
                <LinkContainer
                  key={n + 1}
                  className="mx-1"
                  to={{
                    pathname: '/search',
                    search: createFilteredUrl({ page: n + 1 }, true),
                  }}
                >
                  <Button
                    className={Number(page) === n + 1 ? 'text-bold' : ''}
                    variant="light"
                  >
                    {n + 1}
                  </Button>
                </LinkContainer>
              ))}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
