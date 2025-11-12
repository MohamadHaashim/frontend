// ErrorHandlerContext.tsx
import React, { createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type ErrorHandler = (error: any) => void;

const ErrorHandlerContext = createContext<ErrorHandler>(() => {});

export const ErrorHandlerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleError: ErrorHandler = (error) => {
    console.error("Global error handler:", error);

    const path = location.pathname;

    if (path.startsWith("/super-admin")) {
      navigate("/super-admin/sign-in");
    } else if (path.startsWith("/vendor")) {
      navigate("/sign-in");
    } else {
      navigate("/");
    }
  };

  return (
    <ErrorHandlerContext.Provider value={handleError}>
      {children}
    </ErrorHandlerContext.Provider>
  );
};

export const useErrorHandler = () => useContext(ErrorHandlerContext);
