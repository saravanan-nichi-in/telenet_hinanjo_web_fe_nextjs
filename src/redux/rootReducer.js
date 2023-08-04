import { persistReducer } from 'redux-persist';
import persistConfig from '@/redux/redux-persist-config';
import counterReducer from "./features/counterSlice";
import authReducer from "./auth";

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

let rootReducer = {
  counterReducer: counterReducer,
  authReducer: persistedAuthReducer,
};

export default rootReducer;
