import React, { useState, useEffect ,useRef,useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  BackHandler,
  TouchableOpacity, // Import TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const Paymentnetopia = () => {
const navigation = useNavigation();
const route = useRoute();
const { Netopiapayment } = route.params;
const webviewRef = useRef(null);
const [canGoBack, setCanGoBack] = useState(false);

useFocusEffect(
  useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
      } else {
        // Force navigation to Mapsearch screen and remove current screen from stack
        navigation.replace('Mapsearch');
      }
      return true; // Prevent default behavior
    });

    return () => backHandler.remove();
  }, [canGoBack])
);

  const extractQueryParam = (url, param) => {
    const match = url.match(new RegExp('[?&]' + param + '=([^&]+)'));
    return match ? decodeURIComponent(match[1]) : null;
};

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  //   return () => backHandler.remove();
  // }, [canGoBack]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* <WebView 
                source={{ uri:Netopiapayment}} 
                onNavigationStateChange={(navState) => {
                setCanGoBack(navState.canGoBack);
                }}
            /> */}
            <WebView
              source={{ uri: Netopiapayment }}
              onShouldStartLoadWithRequest={(request) => {
                const { url } = request;

                if (url.includes('my_redirect_url')) {
                  const orderId = extractQueryParam(url, 'orderId');

                  if (orderId) {
                    navigation.navigate('Mapsearch', {
                      orderId,
                    });
                  } else {
                    console.warn('Order ID not found in URL');
                  }

                  return false;
                }

                return true;
              }}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error:', nativeEvent.description);
              }}
            />                  
        </SafeAreaView>
    )
};

export default Paymentnetopia;