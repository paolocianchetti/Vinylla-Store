import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM_CART':
      // salviamo il prodotto che aggiungiamo al carrello in newItem
      const newItem = action.payload;

      // recuperiamo il prodotto già presente nel carrello
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      // se abbiamo già quel prodotto nel carrello, usiamo la
      // funzione map per aggiornare il prodotto corrente con quello
      // nuovo che otteniamo dal payload, altrimenti manteniamo il
      // prodotto già esistente nel carrello. Se 'existItem' è null
      // allora si tratta di un nuovo prodotto e dobbiamo aggiungerlo
      // alla fine dell'array
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      // salviamo i prodotti presenti nel carrello nel localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };

    case 'DELETE_ITEM_CART': {
      // filtriamo tutti i prodotti che non hanno l'id
      // del prodotto che si vuole eliminare
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      // salviamo i prodotti rimasti nel carrello nel localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
