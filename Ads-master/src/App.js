import React, { Suspense } from "react";
import "./App.css";
import Routing from "./Route";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Spinner from "./views/other/Spinner";
import { ToastContainer } from "react-toastify";
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <Suspense fallback={<Spinner />}>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </Suspense>
    </Provider>
  );
}

export default App;
