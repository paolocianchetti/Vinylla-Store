import { useEffect, useReducer } from 'react';
import axios from 'axios';
import homeReducer from '../reducers/homeReducer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import Loading from '../components/Loading';
import Message from '../components/Message';

function Home() {
  const [{ loading, error, vinyls }, dispatch] = useReducer(homeReducer, {
    vinyls: [],
    loading: true,
    error: '',
  });

  const getData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const result = await axios.get('/api/vinyls');
      dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: err.message });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>I nostri dischi in vendita</h1>
      <div className="vinyls">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row>
            {vinyls.map((vinyl) => (
              <Col key={vinyl.path} sm={6} md={4} lg={3} className="mb-3">
                <Product vinyl={vinyl}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default Home;
