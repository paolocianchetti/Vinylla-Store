import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import orderListReducer from '../reducers/orderListReducer';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../errors';
import Button from 'react-bootstrap/Button';
import Loading from '../components/Loading';
import Message from '../components/Message';

export default function OrderList() {
  const navigate = useNavigate();
  const { state } = useContext(Store);

  // prendiamo le informazioni dell'utente dallo state
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(orderListReducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchOrderList = async () => {
      dispatch({
        type: 'FETCH_REQUEST',
      });

      try {
        const { data } = await axios.get(`/api/orders/user`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
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
    // richiediamo i dati al server
    fetchOrderList();
  }, [userInfo]);

  return (
    <div>
      <title>Riepilogo Ordini</title>
      <h1>Riepilogo Ordini</h1>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATA</th>
              <th>TOTALE</th>
              <th>PAGATO</th>
              <th>CONSEGNATO</th>
              <th>AZIONI</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Dettagli
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
