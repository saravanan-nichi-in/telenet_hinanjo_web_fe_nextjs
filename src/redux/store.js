import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga";
import rootReducer from './rootReducer';
import rootSaga from "@/middleware/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ thunk: false }).prepend(sagaMiddleware);
  }
})
sagaMiddleware.run(rootSaga);