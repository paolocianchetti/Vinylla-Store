const orderReducer = (state, action) => {
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

export default orderReducer;
