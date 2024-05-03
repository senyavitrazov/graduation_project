const defaultState = {
  currentNavigationState: "defects",
};

const SET_CURRENT_PATH = "SET_CURRENT_PATH";

export const navigationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CURRENT_PATH:
      return {
        ...state,
        currentPath: action.payload,
      };
    default:
      return state;
  }
};

export const setCurrentPath = (payload) => ({ type: SET_CURRENT_PATH, payload });
