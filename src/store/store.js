import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { navigationReducer } from "./genericReducer";
import { applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

const rootReducer = combineReducers({
  navigation: navigationReducer,
});

export const store = configureStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
