import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {thunk}  from 'redux-thunk'; // Import thunk correctly

import UserSlice from "../features/UserSlice";
import ReserveSlice from "../features/ReserveSlice";

const reducers = combineReducers({
    UserSlice,
    ReserveSlice
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["UserSlice", "ReserveSlice"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export default store;
