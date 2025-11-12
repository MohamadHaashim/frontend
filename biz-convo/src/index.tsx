import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import CacheService from './services/CacheService';
import metaData from './shared/Cache/metaData.json';
import { ErrorHandlerProvider } from './ErrorHandleContext';

const initializeApp = async () => {
    try {
        await CacheService.updateCache('metaData', metaData.result.data);

        const reactRoot = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

        reactRoot.render(
            <BrowserRouter>
                <ErrorHandlerProvider>
                    {/* <React.StrictMode> */}
                    <App />
                    {/* </React.StrictMode> */}
                </ErrorHandlerProvider>
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
