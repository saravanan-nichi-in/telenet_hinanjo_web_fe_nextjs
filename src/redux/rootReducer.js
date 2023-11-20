import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // You may choose a different storage engine

import authReducer from "./auth";
import placeReducer from "./place";
import layoutReducer from './layout';
import familyReducer from './family';
import eventReducer from './event';

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

const familyPersistConfig = {
  key: 'family',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const eventPersistConfig = {
  key: 'event',
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
const persistFamilyReducer = persistReducer(familyPersistConfig, familyReducer);
const persistLayoutReducer = persistReducer(layoutPersistConfig, layoutReducer);
const persistEventReducer = persistReducer(eventPersistConfig, eventReducer);

let rootReducer = {
  authReducer: persistedAuthReducer,
  placeReducer: persistPlaceReducer,
  layoutReducer: persistLayoutReducer,
  familyReducer: persistFamilyReducer,
  eventReducer: persistEventReducer
};

export default rootReducer;
