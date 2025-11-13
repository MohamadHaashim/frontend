import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { navigate } from './navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { ToastAndroid } from 'react-native';
import { ENDPOINTS } from '../environments/environment';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform, PermissionsAndroid, Alert, Linking } from "react-native";
// import Geolocation from "react-native-geolocation-service";
import { promptForEnableLocationIfNeeded,PRIORITIES} from 'react-native-android-location-enabler';


const firebaseConfig = {
    apiKey: "AIzaSyA1mNcs2WaASM2gfrvyzLVe7s-CybWJOpM",
    authDomain: "klassride-56d41.firebasestorage.app",
    projectId: "klassride-56d41",
    storageBucket: "klassride-56d41.firebasestorage.app",
    messagingSenderId: "490509769992",
    appId: "1:490509769992:android:15eec0e7b16570e5c9a0bd"
};

// Auth singleton initialization
let FIREBASE_AUTH;
if (getApps().length === 0) {
  const FIREBASE_APP = initializeApp(firebaseConfig);
  FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  FIREBASE_AUTH = getAuth();
}

export default FIREBASE_AUTH;

const requestFCMPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('🔓 FCM permission granted:', authStatus);
    return true;
  } else {
    console.warn('🔒 FCM permission denied');
    return false;
  }
};

export const getFCMToken = async () => {
  
  try {
    const hasPermission = await requestFCMPermission();
    if (!hasPermission) return null;
   
    const fcmToken = await messaging().getToken();
   
    if (fcmToken) {
      return fcmToken;
    } else {
      console.warn(' FCM Token not generated');
      return null;
    }
  } catch (error) {
    console.error(' Error fetching FCM token:', error);
    return null;
  }
};

// 🔐 Secure Device Data Sender
export const sendDeviceData = async () => {
 try {
    const email = await AsyncStorage.getItem("emailId");
    const phoneNumber = await AsyncStorage.getItem("phoneNumber");

    let fcmToken = '';
    let deviceId = '';

    try {
      fcmToken = await messaging().getToken();
      console.log('[FCM Token]', fcmToken);
    } catch (tokenError) {
      console.error('[FCM Token Error]', tokenError);
    }

    try {
      deviceId = await DeviceInfo.getUniqueId();
      console.log('[Device ID]', deviceId);
    } catch (deviceError) {
      console.error('[Device ID Error]', deviceError);
    }

    const payload = {
      email: email,
      phoneNumber: phoneNumber,
      token: fcmToken || '',
      deviceId: deviceId || '',
    };

    console.log('[Sending Device Data]', payload);

    const response = await fetch(ENDPOINTS.Firebase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text(); 
    console.log('[Raw Server Response]', text);
    console.log('[data]', payload);

  } catch (error) {
    console.error('[sendDeviceData Error]', error);
    // Alert.alert('Error', 'An unexpected error occurred while sending device data.');
    ToastAndroid.show("Error', 'An unexpected error occurred while sending device data.", ToastAndroid.SHORT);
    
  }
};

// 📡 FCM Channel Setup
export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      return settings.authorizationStatus === 1 || settings.authorizationStatus === 2;
    } else {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    }
  } catch (err) {
    console.error('Notification permission error:', err);
    return false;
  }
};

// Setup channel after permission
export const setupNotificationChannel = async () => {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  try {
    await notifee.createChannel({
      id: 'promo',
      name: 'Promotions',
      importance: AndroidImportance.HIGH,
    });
    console.log('✅ Notification channel ready');
  } catch (error) {
    console.error('[NotificationChannel Error]', error);
  }
};

// 🧩 Foreground FCM Handler
export const listenToPromoMessages = () => {
  try {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        const data = remoteMessage?.data;
        const notification = remoteMessage?.notification;

        if (data?.type === 'promo') {
          await notifee.displayNotification({
            title: notification?.title,
            body: notification?.body,
            android: {
              channelId: 'promo',
              smallIcon: 'ic_launcher',
              color: '#FF5722',
              pressAction: { id: 'default' },
            },
          });
          console.log('[Foreground Promo FCM]', data);
        }
      } catch (innerError) {
        console.error('[Foreground FCM Error]', innerError);
      }
    });
    return unsubscribe; // ✅ Important
  } catch (error) {
    console.error('[listenToPromoMessages Error]', error);
    return null;
  }
};

// 🎯 Unified Handler for Tapped/Initial Notifications
export const handlePromoNotification = async remoteMessage => {
  try {
    const { data, notification } = remoteMessage || {};
    if (!data || data.type !== 'promo') return;

    const { campaignId, discount, deepLink, expires } = data;
    if (!campaignId || !discount || !deepLink) {
      console.warn('[Promo Notification Invalid]', data);
      return;
    }

    navigate('Mapsearch', {
      promoData: {
        campaignId,
        discount,
        deepLink,
        expires,
        title: notification?.title,
        body: notification?.body,
      },
    });

    console.log('[Handled Promo Notification]', data);
  } catch (error) {
    console.error('[handlePromoNotification Error]', error);
    Alert.alert('Notification Error', 'Failed to process the promotion.');
  }
};

export const ensureHighAccuracy = async () => {
  try {
    const status = await promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
      priority: 'high',
    });
    console.log('Location accuracy status:', status);
    return true;
  } catch (err) {
    console.warn('User denied location accuracy:', err);
    return false;
  }
};
export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('✅ Android location permission granted');
        await promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 });
      } else {
        console.warn('🔒 Android location permission denied');
      }
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (result === RESULTS.GRANTED) {
        console.log('✅ iOS location permission granted');
      } else {
        console.warn('🔒 iOS location permission denied');
      }
    }
  } catch (err) {
    console.error('Location permission error:', err);
  }
};


//   const getCurrentLocation = async () => {
//   try {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) return;

//     // 🌍 Try low accuracy first
//     try {
//       const position = await getLocation(false);
//       if (position?.coords) {
//         const { latitude, longitude } = position.coords;
//         const quickLocation = {
//           latitude,
//           longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         };

//         setLocation(quickLocation);
//         setIsLocationEnabled(true);

//         const address = await reverseGeocode(latitude, longitude);
//         setOriginInput(address);
//         setOrigin({ latitude, longitude, description: address });
//         setOriginSuggestions([]);
//         mapRef.current?.animateToRegion(quickLocation, 1000);
//         return;
//       }
//     } catch (lowAccuracyError) {
//       console.warn("Low accuracy location fetch failed:", lowAccuracyError);
//     }

//     // 📍 Fallback to high accuracy if low fails
//     try {
//       const position = await getLocation(true);
//       if (position?.coords) {
//         const { latitude, longitude } = position.coords;
//         const preciseLocation = {
//           latitude,
//           longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         };

//         setLocation(preciseLocation);
//         setIsLocationEnabled(true);

//         const address = await reverseGeocode(latitude, longitude);
//         setOriginInput(address);
//         setOrigin({ latitude, longitude, description: address });
//         setOriginSuggestions([]);
//         mapRef.current?.animateToRegion(preciseLocation, 1000);
//         return;
//       }
//     } catch (highAccuracyError) {
//       console.error("High accuracy location fetch failed:", highAccuracyError);
//     }

//     // 🚫 If both low & high accuracy fail
//     setIsLocationEnabled(false);

//     const highAccuracyEnabled = await ensureHighAccuracy();
//     if (!highAccuracyEnabled) {
//       ToastAndroid.show(
//         "Please enable location for best experience.",
//         ToastAndroid.SHORT
//       );

//       // if (!alertShownRef.current) {
//       //   alertShownRef.current = true;
//       //   Alert.alert(
//       //     "Location unavailable",
//       //     "Please enable location for better experience.",
//       //     [
//       //       { text: "Cancel", style: "cancel" },
//       //       { text: "Open Settings", onPress: openLocationSettings },
//       //     ]
//       //   );
//       // }

//       return; // ⬅️ Exit cleanly after feedback
//     }
//   } catch (err) {
//     console.error("Unexpected error fetching location:", err);
//   }
// };








