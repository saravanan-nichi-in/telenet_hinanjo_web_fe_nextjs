import storage from 'redux-persist/lib/storage'; // You can choose session storage or other storage engines

const persistConfig = {
    key: 'root', // Key under which your persisted data will be stored in storage
    storage,
};

export default persistConfig;