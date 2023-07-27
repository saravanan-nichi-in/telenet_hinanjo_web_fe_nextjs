import counterReducer from "./features/counterSlice";
import localeReducer from "./localization";

let rootReducer = {
  counterReducer: counterReducer,
  localeReducer: localeReducer,
};

export default rootReducer;
