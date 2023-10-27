import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // You may choose a different storage engine

import authReducer from "./auth";
import placeReducer from "./place";
import layoutReducer from './layout';

// Define separate persist configs for each reducer
const authPersistConfig = {
  key: 'auth',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const placePersistConfig = {
  key: 'place',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const layoutPersistConfig = {
  key: 'layout',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

// Wrap each reducer with persistReducer using the corresponding config
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistPlaceReducer = persistReducer(placePersistConfig, placeReducer);
const persistLayoutReducer = persistReducer(layoutPersistConfig, layoutReducer);

let rootReducer = {
  authReducer: persistedAuthReducer,
  placeReducer: persistPlaceReducer,
  layoutReducer: persistLayoutReducer
};

export default rootReducer;
