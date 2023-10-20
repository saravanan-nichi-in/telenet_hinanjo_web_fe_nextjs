import { persistReducer } from 'redux-persist';
import persistConfig from '@/redux/redux-persist-config';

import authReducer from "./auth";
import placeReducer from "./place"

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistPlaceReducer = persistReducer(persistConfig, placeReducer);

let rootReducer = {
  authReducer: persistedAuthReducer,
  placeReducer: persistPlaceReducer
};

export default rootReducer;
