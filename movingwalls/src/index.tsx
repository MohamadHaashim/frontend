import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './Graphql/apolloClient';

const initializeApp = async () => {
  try {
    const reactRoot = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );
    reactRoot.render(
      <BrowserRouter>
        <React.StrictMode>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </React.StrictMode>
      </BrowserRouter>
    );
  } catch (error) {
    console.error('Error initializing the app:', error);
  }
};
initializeApp();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
