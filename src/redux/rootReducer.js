import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // You may choose a different storage engine

import authReducer from "./auth";
import placeReducer from "./place";
import layoutReducer from './layout';
import familyReducer from './family';
import eventReducer from './event';
import checkInReducer from './check_in';
import checkOutReducer from './checkout';
import registerReducer from './register'
import selfIDReducer from './self_id'
import staffRegisterReducer from './staff_register'
import stockpileReducer from "./stockpile";
import forgetPasswordReducer from './fwd_password';

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

const checkoutPersistConfig = {
  key: 'checkout',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const checkInPersistConfig = {
  key: 'checkIn',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const registerPersistConfig = {
  key: 'register',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const selfIDPersistConfig = {
  key: 'selfID',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const staffRegisterPersistConfig = {
  key: 'StaffRegister',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const stockpilePersistConfig = {
  key: 'editedStockpile',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

const forgetPasswordPersistConfig = {
  key: 'forgetPassword',
  storage: storage,
  // whitelist: ['/* specify which parts of the state you want to persist */'],
};

// Wrap each reducer with persistReducer using the corresponding config
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistPlaceReducer = persistReducer(placePersistConfig, placeReducer);
const persistFamilyReducer = persistReducer(familyPersistConfig, familyReducer);
const persistLayoutReducer = persistReducer(layoutPersistConfig, layoutReducer);
const persistEventReducer = persistReducer(eventPersistConfig, eventReducer);
const persistCheckInReducer = persistReducer(checkInPersistConfig, checkInReducer);
const persistCheckOutReducer = persistReducer(checkoutPersistConfig, checkOutReducer);
const persistRegisterReducer = persistReducer(registerPersistConfig, registerReducer);
const persistSelfIDReducer = persistReducer(selfIDPersistConfig, selfIDReducer);
const persistStaffRegisterReducer = persistReducer(staffRegisterPersistConfig, staffRegisterReducer);
const persistStockpileReducer = persistReducer(stockpilePersistConfig, stockpileReducer);
const persistForgetPasswordReducer = persistReducer(forgetPasswordPersistConfig, forgetPasswordReducer);

let rootReducer = {
  authReducer: persistedAuthReducer,
  placeReducer: persistPlaceReducer,
  layoutReducer: persistLayoutReducer,
  familyReducer: persistFamilyReducer,
  eventReducer: persistEventReducer,
  checkInReducer: persistCheckInReducer,
  checkOutReducer: persistCheckOutReducer,
  registerReducer: persistRegisterReducer,
  selfIDReducer: persistSelfIDReducer,
  staffRegisterReducer:persistStaffRegisterReducer,
  stockpileReducer:persistStockpileReducer,
  forgetPasswordReducer:persistForgetPasswordReducer
};

export default rootReducer;
