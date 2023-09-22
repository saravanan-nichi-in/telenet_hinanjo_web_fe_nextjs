import { persistReducer } from 'redux-persist';
import persistConfig from '@/redux/redux-persist-config';

import authReducer from "./auth";

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

let rootReducer = {
  authReducer: persistedAuthReducer,
};

export default rootReducer;
