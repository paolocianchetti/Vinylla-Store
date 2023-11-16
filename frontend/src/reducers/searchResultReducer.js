const searchResultReducer = (state, action) => {
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

export default searchResultReducer;
