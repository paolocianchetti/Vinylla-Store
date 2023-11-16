const vinylReducer = (state, action) => {
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
    case 'SAVE_REVIEW_REQUEST':
      return {
        ...state,
        loadingComments: true,
      };
    case 'SAVE_REVIEW_SUCCESS':
      return {
        ...state,
        loadingComments: false,
      };
    case 'SAVE_REVIEW_FAIL':
      return {
        ...state,
        loadingComments: false,
      };
    case 'UPDATE_VINYL':
      return {
        ...state,
        vinyl: action.payload,
      };
    default:
      return state;
  }
};

export default vinylReducer;
