import { persistReducer } from 'redux-persist';
import persistConfig from '@/redux/redux-persist-config';

import authReducer from "./auth";
import placeReducer from "./place";
import layoutReducer from './layout';

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistPlaceReducer = persistReducer(persistConfig, placeReducer);
const persistLayoutReducer = persistReducer(persistConfig,layoutReducer);

let rootReducer = {
  authReducer: persistedAuthReducer,
  placeReducer: persistPlaceReducer,
  layoutReducer: persistLayoutReducer
};

export default rootReducer;
