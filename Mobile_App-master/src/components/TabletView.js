import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions, StatusBar, Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const ResponsiveContext = createContext();

export const ResponsiveProvider = ({ children }) => {
  const [screen, setScreen] = useState(Dimensions.get('window'));
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const updateScreen = () => {
      const newScreen = Dimensions.get('window');
      setScreen(newScreen);
      setIsTablet(newScreen.width >= 768); 
    };

    Dimensions.addEventListener('change', updateScreen);
    updateScreen();

    return () => {
      Dimensions.removeEventListener('change', updateScreen);
    };
  }, []);

  // Enable immersive sticky mode on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Hide status bar
      StatusBar.setHidden(true, 'fade');

      // Hide navigation bar (immersive sticky)
      SystemNavigationBar.stickyImmersive();  
    }
  }, []);

  return (
    <ResponsiveContext.Provider value={{ screen, isTablet }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => useContext(ResponsiveContext);
