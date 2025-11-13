import 'react-native-get-random-values';
import { useState, useRef, useEffect, useCallback, useMemo, useContext } from "react";
import React from 'react';
import {
  Modal, Dimensions, StyleSheet, Text, TextInput, View, Image, Animated, SafeAreaView, TouchableOpacity, ScrollView, Button, PermissionsAndroid, Platform, Alert, Linking,
  Keyboard, BackHandler, ToastAndroid, ActivityIndicator, Easing
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { fonts } from "../../components/customfont";
import { wp, hp } from "../common/responsive";
import MySidebar from "../common/sidebar";
import MyAccount from "../profile/myaccount";

import FastestImage from "../../assets/images/fastest_svg.svg";
import EconomyImage from "../../assets/images/economy_svg.svg";
import XlImage from "../../assets/images/xl_svg.svg";
import PetImage from "../../assets/images/pet_svg.svg";
import DeliveryImage from "../../assets/images/delivery_svg.svg";
import AssistImage from "../../assets/images/assist_svg.svg";
import WomenImage from "../../assets/images/women_svg.svg";
import PremiumImage from "../../assets/images/premium_svg.svg";
import ElectricImage from "../../assets/images/electric_svg.svg";
import ComfortImage from "../../assets/images/comfort_svg.svg";
import LocationIcon from "../../assets/images/location_svg.svg";
import DestinationIcon from "../../assets/images/destination_svg.svg";
import ChooseOnMapIcon from "../../assets/images/chooseOnMap_svg.svg";
import SearchLocationIcon from "../../assets/images/searchLocation_svg.svg";
import SearchHistoryIcon from "../../assets/images/searchHistory_svg.svg";
import BoltIcon from "../../assets/images/bolt_svg.svg";
import UberIcon from "../../assets/images/uber_svg.svg";
import LocationOvalIcon from "../../assets/images/locationOval_svg.svg";
import LocationOvalDotIcon from "../../assets/images/locationOvalDot_svg.svg";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import klassride from '../../assets/images/klassride1.png';
import addcard from '../../assets/images/addcard.png';
// import car from '../../assets/images/car.png';
import { FlatList, GestureHandlerRootView, PanGestureHandler, TapGestureHandler, TouchableWithoutFeedback, NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation'
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { ENDPOINTS } from "../../environments/environment";
import mapStyle from './mapstyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Riderscreen from '../Rider/Riderscreen';
import FooterMenu from '../footer/footer';
import RBSheet from "react-native-raw-bottom-sheet";
import Payment from '../payment/payment';
import Feather from "react-native-vector-icons/Feather";
import Orientation from 'react-native-orientation-locker';
import { sendDeviceData, getFCMToken } from '../../services/firebaseAuth';
import { useResponsive } from "../../components/TabletView";
import { 
  promptForEnableLocationIfNeeded,
  PRIORITIES
} from 'react-native-android-location-enabler';
import klassRideGif from "../../assets/images/KlassRideloader.gif"
import FastImage from "react-native-fast-image";
import Boltview from '../Rider/Boltview';
import StarRating from 'react-native-star-svg-rating';
import profile from '../../assets/images/profile.png';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from 'lottie-react-native';
import klassRideloader from '../../assets/videos/klassRideloader.json';

export default function Mapsearch() {
  const route = useRoute();
  const { promoData } = route.params || {};
  const { campaignId, discount, deepLink, expires, title, body } = promoData || {};
  const [ridesData, setRidesData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [boltData, setBoltData] = useState([]);
  const [uberData, setUberData] = useState([]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  // const [filteredData, setRidesData] = useState([]);

  const [sheetIndex, setSheetIndex] = useState(0);
  const [location, setLocation] = useState();  // Current location
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState();
  const [destination, setDestination] = useState(null);  // Destination
  const [origin, setOrigin] = useState(null);
  const [isSettingOrigin, setIsSettingOrigin] = useState(true);
  const [routeParamdata, setRouteParamdata] = useState([]);
  const [loading, setLoading] = useState();
  const [uberLoading, setUberLoading] = useState(false);
  const [boltLoading, setBoltLoading] = useState(false);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const [ridesData, setRidesData] = useState([]);
  const navigation = useNavigation();
  const [selectedData, setSelectedData] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null); // Selected option for sorting
  const [sortOptions, setSortOptions] = useState([
    { label: "Time", value: "Time" },
    { label: "Price", value: "Price" },
  ]);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedProviderFilter, setSelectedProviderFilter] = useState(null); // Selected provider filter
  const [providerFilterOptions, setProviderFilterOptions] = useState([
    { label: "All", value: "all" },
    { label: "Uber", value: "Uber" },
    { label: "Bolt", value: "Bolt" },
  ]);
  const [selectedCategory1, setSelectedCategory1] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [translateY] = useState(new Animated.Value(0));
  const [lastOffset, setLastOffset] = useState(0);
  const mapRef = useRef(null);
  const watchId = useRef(null);
  const inputRef = useRef(null);
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);
  const bottomSheetRef = useRef(null);
  const RBbottomSheetRef = useRef(null);
  // const [originInput, setOriginInput] = useState("");
  // const [destinationInput, setDestinationInput] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const routeParams = useRoute();

  const [refreshKey, setRefreshKey] = useState(0);
  const [LocationIndex, setLocationIndex] = useState(0);

  const [productId, setProductId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [cancelRide, setCancelRide] = useState("");
  const [requestRide, setRequestRide] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [refreshsidebar, setRefreshsidebar] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [conformationmodel, setConformationmodel] = useState(false);
  const [cancelnmodel, setcancelnmodel] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [Loading, setgobalLoading] = useState(false);
  const [KlassRideloader, setKlassRideloader] = useState(false);
  const [drivermodal, setdrivermodal] = useState(false);

  const [ADSnmodel, setADSnmodel] = useState(false);
  const { isTablet, screen } = useResponsive();
  const prevCoordsRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const pollingRef = useRef(null);
  const [rating, setRating] = useState(3);

   const [currentLocation, setCurrentLocation] = useState(null);
  const [startwatchId, setStartWatchId] = useState(null);


//watchgeolocation
  // useEffect(() => {
  //   let watchId = null;

  //   async function startWatching() {
  //     const hasPermission = await requestLocationPermission();
  //     if (!hasPermission) {
  //       console.warn("Location permission denied");
  //       return;
  //     }

  //     watchId = Geolocation.watchPosition(
  //       async (position) => {
  //         try {
  //           const { latitude, longitude } = position.coords;

  //           const liveLocation = {
  //             latitude,
  //             longitude,
  //             latitudeDelta: 0.01,
  //             longitudeDelta: 0.01,
  //           };

  //           setIsLocationEnabled(true);

  //           // Update location immediately
  //           // Description/address will be added after reverse geocoding
  //           setOrigin(prev => ({
  //             ...liveLocation,
  //             description: prev?.description || '', // temporarily keep existing or empty
  //           }));

  //           // Animate map (optional)
  //           // mapRef.current?.animateToRegion(liveLocation, 1000);

  //           // Fetch address asynchronously, update description only
  //           try {
  //             const address = await reverseGeocode(latitude, longitude);

  //             setOrigin(prev => ({
  //               ...liveLocation,
  //               description: address,
  //             }));

  //             setOriginInput(address);
  //             setOriginSuggestions([]);
  //           } catch (err) {
  //             console.warn("Reverse geocode failed:", err);
  //           }
  //         } catch (err) {
  //           console.warn("Error processing location update:", err);
  //         }
  //       },
  //       (error) => {
  //         console.error('Live location error:', error);
  //         setIsLocationEnabled(false);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         distanceFilter: 10,
  //         interval: 5000,
  //         fastestInterval: 2000,
  //         useSignificantChanges: false,
  //       }
  //     );
  //   }

  //   startWatching();
  //   return () => {
  //     if (watchId !== null) {
  //       Geolocation.clearWatch(watchId);
  //     }
  //   };
  // }, []);

  // const [isRouteViewed, setIsRouteViewed] = useState(false);

   useEffect(() => {
    // Start tracking
    startTracking();

    // Cleanup when component unmounts
    return () => {
      if (startwatchId) Geolocation.clearWatch(startwatchId);
    };
  }, []);

  const startTracking = () => {

    const id = Geolocation.watchPosition(
      ({ coords }) => {
        const position = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        // 🔥 Update the marker’s position dynamically
        setCurrentLocation(position);
        console.log("📍 Moving:", position);
      },
      (error) => console.warn("Geolocation Error:", error),
      { enableHighAccuracy: true, distanceFilter: 2 } // update after 2 meters
    );

    setStartWatchId(id);
  };
    
  useFocusEffect(
    useCallback(() => {
      setKeyboardVisible(false);

      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });

      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [])
  );

  useEffect(() => {
    getFCMToken();
    sendDeviceData();
  }, []);

  useEffect(() => {
    console.log("Received promo params:", {
      campaignId,
      discount,
      deepLink,
      expires,
      body,
      title
    });

    // Show modal for 5 seconds if campaign data is received
    if (promoData?.campaignId) {
      setADSnmodel(true);
      const timer = setTimeout(() => setADSnmodel(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [promoData]);

  const toggleSidemenu = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // State to track alert visibility
  const alertShownRef = useRef(false);
  const addressSetRef = useRef(false);
  const locationRef = useRef(false);
  const animateToRegionRef = useRef(false);
  const destinationRef = useRef(null);
  // const [origin, setOrigin] = useState(null);
  // const [destination, setDestination] = useState(null);
  // const [route, setRoute] = useState([]);

  // const mapRef = useRef(null);

  useEffect(() => {
    alertShownRef.current = false; // Allow alert to show again on new visit
  }, []);

  const ensureHighAccuracy = async () => {
  try {
    const status = await promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    });

    // status will be "enabled" or "already-enabled"
    console.log("Location accuracy status:", status);
    return true;
  } catch (err) {
    console.warn("User denied location accuracy:", err);
    return false;
  }
};


  //romania
  const defaultLocation = {
    latitude: 45.9432,
    longitude: 24.9668,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  };

  // //india
  // const defaultLocation = {
  //   latitude: 20.5937, 
  //   longitude: 78.9629, 
  //   latitudeDelta: 10.0,
  //   longitudeDelta: 10.0, 
  // };
  const [raidermodal, setRaidermodal] = useState(false);
  const slideAnim = useRef(new Animated.Value(800)).current;
  const [shouldFetchCards, setShouldFetchCards] = useState(false);
  const [showDriverIcon, setShowDriverIcon] = useState(false);
  const [showNoCardPopup, setShowNoCardPopup] = useState(false);

  const fetchcombined = async (ride) => {
    setSelectedRide(ride);
    startSpin?.();
    // setgobalLoading(true);
    setKlassRideloader(true)
    console.log(selectedRide, "selectedRide in fetch combined 73e878e3e8");

    const selectedCompanyId = ride.companyId ? ride.companyId : "";
    const selectedProductId = ride.name ? ride.name : "";


    try {
      
      const email = (await AsyncStorage.getItem("emailId"));
      const phoneNumber = (await AsyncStorage.getItem("phoneNumber"));
      // // const hardcodedPhoneNumber = "+40756163006";

      // const cardListResponse = await fetch(ENDPOINTS.CardList, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ phoneNumber: phoneNumber }),
      // });

      // const cardListData = await cardListResponse.json();

      // // setgobalLoading(false);
      // if (!Array.isArray(cardListData) || cardListData.length === 0) {
      //   setgobalLoading(false);
      //   setKlassRideloader(false)

      //   setShowNoCardPopup(true);
        
      //   setShouldFetchCards(true);
      //   setRaidermodal(false);
      //   setIsDestinationFocused(false);
      //   setIsOriginFocused(false);
      //   setSelectedRide([]);
      //   setRidesData([])
      //   setOriginalData([])
      //   handleClearOrigin()
      //   handleClearDestination()
      //   return;
      // } else {
      //   setShouldFetchCards(false);
      // }

      console.log(
        "response in uber response combined-------",
        "email:", email,
        "phoneNumber:", phoneNumber,
        "pickup_lat:", origin.latitude,
        "pickup_long:", origin.longitude,
        "dropoff_lat:", destination.latitude,
        "dropoff_long:", destination.longitude,
        "productName:", selectedProductId,
        "companyId:", selectedCompanyId
      );

      const response = await fetch(ENDPOINTS.combined, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          phoneNumber: phoneNumber,
          pickup_lat: origin.latitude,
          pickup_long: origin.longitude,
          dropoff_lat: destination.latitude,
          dropoff_long: destination.longitude,
          productName: selectedProductId,
          companyId: selectedCompanyId,
        }),
      });
       const responseText = await response.text();
    let data = null;

    // Try to parse JSON safely
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null; 
    }

    if (response.ok && data) {
      setLoading(false);
      setShowDriverIcon(true);
      setRequestRide(data);
      setRaidermodal(true);
      setCancelRide(data.urlRideForBackend || "");

      const rideETA = 120 // 5 min default
      const carPlate = "RO 45 ABC"

      await handleRideValidation({
        userLocation: origin,
        pickupLocation: origin,
        destination,
        rideETA,
        carPlate,
      });

    } else {
      let errorMessage = "";

      if (data) {
        errorMessage =
          data?.errorMessage ||
          data?.message ||
          `Server error: ${response.status} ${response.statusText}`;
      } else {
        const h1Match = responseText.match(/<h1>(.*?)<\/h1>/i);
        const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);

        if (h1Match) {
          errorMessage = h1Match[1]; // e.g. "504 Gateway Time-out"
        } else if (titleMatch) {
          errorMessage = titleMatch[1]; // fallback to title
        } else {
          errorMessage = `Server error: ${response.status}`;
        }
      }

      console.error("API responded with error:", errorMessage);
      setRaidermodal(false);
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    }
  } catch (error) {
    console.error("Network/Fetch error:", error);
    setRaidermodal(false);

    let errorMessage = "Unable to fetch ride data. Please try again.";
    if (error?.message?.includes("Network request failed")) {
      errorMessage = "Network error. Please check your internet connection.";
    }
    ToastAndroid.show(errorMessage, ToastAndroid.LONG);
  } finally {
    setKlassRideloader(false);
    setUberLoading(false);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }
};

  const startSpin = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }



  const handleCancelRide = async () => {
    try {
      startSpin?.();
      setgobalLoading(true);

      const email = await AsyncStorage.getItem("emailId");
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");

      if (!email || !phoneNumber) {
        throw new Error("Missing required information to cancel the ride.");
      }

      const response = await fetch(ENDPOINTS.cancelRide, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phoneNumber,
          urlRideForBackend: cancelRide,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errorMessage || "Cancellation failed.");
      }
      setRaidermodal(true);
      ToastAndroid.show(data.responseMessage || "Ride cancelled successfully", ToastAndroid.SHORT);
      setShowDriverIcon(false);
      setSelectedRide([]);
      closeRiderScreen()
      navigation.navigate("Mapsearch");
    } catch (error) {
      console.error("Error cancelling ride:", error.message || error);
      ToastAndroid.show(error.message || "Failed to cancel ride", ToastAndroid.SHORT);
    } finally {
      setgobalLoading(false);
    }
  };


  const closeRiderScreen = () => {
    Animated.timing(slideAnim, {
      toValue: 800,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setRaidermodal(false);
      setdrivermodal(false);
    });
  };


  const categories = [
    { label: "Fastest", SvgComponent: FastestImage, key: "Fastest" },
    { label: "Economy", SvgComponent: EconomyImage, key: "Economy" },
    { label: "Comfort", SvgComponent: ComfortImage, key: "Comfort" },
    { label: "Electric", SvgComponent: ElectricImage, key: "Electric" },
    { label: "Premium", SvgComponent: PremiumImage, key: "Premium" },
    { label: "Delivery", SvgComponent: DeliveryImage, key: "Delivery", subLabel: "Max 15 Kg" },
    { label: "Pet", SvgComponent: PetImage, key: "PET" },
    { label: "XL", SvgComponent: XlImage, key: "XL", subLabel: "Max 6 Pers." },
    { label: "Assist", SvgComponent: AssistImage, key: "Assist" },
    { label: "Women", SvgComponent: WomenImage, key: "Women" },

  ];

  const openLocationSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=LOCATION_SERVICES')
    } else {
      Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS");
    }
  }

  const openBlockedLocationSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:root=LOCATION_SERVICES')
    } else {
      Linking.openSettings();
    }
  }

  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    try {
      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED) {
        if (!alertShownRef.current) {
          alertShownRef.current = true;
          Alert.alert(
            "Permission Denied",
            "Location permission is required to use this feature.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: openBlockedLocationSettings },
            ]
          );
        }

      } else if (result === RESULTS.BLOCKED) {
        if (!alertShownRef.current) {
          alertShownRef.current = true;
          Alert.alert(
            "Permission Blocked",
            "You have blocked location access. Please enable it in settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: openBlockedLocationSettings },
            ]
          );
        }

      }
    } catch (err) {
      console.error("Permission request error:", err);
    }
  };


  const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    // 🌍 Try low accuracy first
    try {
      const position = await getLocation(false);
      if (position?.coords) {
        const { latitude, longitude } = position.coords;
        const quickLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(quickLocation);
        setIsLocationEnabled(true);
        // setIsOriginFocused(true);
        const address = await reverseGeocode(latitude, longitude);
        setOriginInput(address);
        setOrigin({ latitude, longitude, description: address });
        setOriginSuggestions([]);
        mapRef.current?.animateToRegion(quickLocation, 1000);
        return;
      }
    } catch (lowAccuracyError) {
      console.warn("Low accuracy location fetch failed:", lowAccuracyError);
    }

    // 📍 Fallback to high accuracy if low fails
    try {
      const position = await getLocation(true);
      if (position?.coords) {
        const { latitude, longitude } = position.coords;
        const preciseLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(preciseLocation);
        setIsLocationEnabled(true);

        const address = await reverseGeocode(latitude, longitude);
        setOriginInput(address);
        setOrigin({ latitude, longitude, description: address });
        setOriginSuggestions([]);
        mapRef.current?.animateToRegion(preciseLocation, 1000);
        return;
      }
    } catch (highAccuracyError) {
      console.error("High accuracy location fetch failed:", highAccuracyError);
    }

    // 🚫 If both low & high accuracy fail
    setIsLocationEnabled(false);

    const highAccuracyEnabled = await ensureHighAccuracy();
    if (!highAccuracyEnabled) {
      ToastAndroid.show(
        "Please enable location for best experience.",
        ToastAndroid.SHORT
      );

      // if (!alertShownRef.current) {
      //   alertShownRef.current = true;
      //   Alert.alert(
      //     "Location unavailable",
      //     "Please enable location for better experience.",
      //     [
      //       { text: "Cancel", style: "cancel" },
      //       { text: "Open Settings", onPress: openLocationSettings },
      //     ]
      //   );
      // }

      return; // ⬅️ Exit cleanly after feedback
    }
  } catch (err) {
    console.error("Unexpected error fetching location:", err);
  }
};



//   const getCurrentLocation = async () => {
//   const hasPermission = await requestLocationPermission();
//   if (!hasPermission) return;

//   const highAccuracyEnabled = await ensureHighAccuracy();
//   if (!highAccuracyEnabled) {
//     ToastAndroid.show(
//     "Please enable location for best experience.",
//     ToastAndroid.SHORT
//   );
//   return;

//   }

//   // now safely call your getLocation(true)
//   const position = await getLocation(true);
//   if (position?.coords) {
//     const { latitude, longitude } = position.coords;
//     const preciseLocation = {
//       latitude,
//       longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     };

//     setLocation(preciseLocation);
//     setIsLocationEnabled(true);

//     const address = await reverseGeocode(latitude, longitude);
//     setOriginInput(address);
//     setOrigin({ latitude, longitude, description: address });
//     setOriginSuggestions([]);
//     mapRef.current?.animateToRegion(preciseLocation, 1000);
//   }
// };

  useEffect(() => {
    if (routeParamdata.params?.triggerLocationFetch) {
      getCurrentLocation(); // Call the function locally
    }
  }, [routeParamdata.params?.triggerLocationFetch]);

  const getLocation = (enableHighAccuracy = true) => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('Got position:', position);
          resolve(position);
        },
        error => {
          console.error('Location error:', error);
          reject(error);
        },
        {
          enableHighAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    });
  };


  // Check if location services are enabled and handle blue dot visibility
  // const checkLocationServices = () => {
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       setIsLocationEnabled(true);
  //       console.log('location is enabled with low accuracy');
  //     },
  //     (error) => {

  //       if (error.code === 2 || error.code === 3) {
  //         Geolocation.getCurrentPosition(
  //           (position) => {
  //             setIsLocationEnabled(true); // Location is enabled
  //             console.log('Coords:', position.coords);
  //           },
  //           (highAccuracyError) => {
  //             // console.error("High accuracy location check failed:", highAccuracyError);
  //             setIsLocationEnabled(false);
  //             // setLocation(null);
  //           },
  //           { enableHighAccuracy: true, timeout: 10000 } // High accuracy options
  //         );
  //       } else {
  //         setIsLocationEnabled(false);
  //         // setLocation(null);
  //       }
  //     },
  //     { enableHighAccuracy: false, timeout: 5000 }
  //   );
  // };


  const initializeLocationChecks = async () => {
    let interval;

    // Request permission at the start
    let permissionGranted = await requestLocationPermission();

    const checkPermissionAndStartInterval = () => {
      // If permission is granted, start checking location services
      if (permissionGranted) {
        // Start getting the current location

        getCurrentLocation();
        // Set an interval to check location services periodically (every 1 second)
        // interval = setInterval(() => {
        //   console.log('useEffect interval 5000 running');
        //   checkLocationServices();
        // }, 5000);
      }
    };

    // If permission is granted, start immediately
    checkPermissionAndStartInterval();

    // If permission is not granted, retry every 5 seconds
    if (!permissionGranted) {
      interval = setInterval(async () => {
        // Request permission again
        permissionGranted = await requestLocationPermission();

        if (permissionGranted) {
          getCurrentLocation();
          clearInterval(interval);
          checkPermissionAndStartInterval();
        }
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  };

  useEffect(() => {
    initializeLocationChecks();
  }, []);


  useEffect(() => {
    addressSetRef.current = false;
    animateToRegionRef.current = false;
    getCurrentLocation()
  }, [isLocationEnabled,])

  useEffect(() => {
    // setOriginInput('')
    // setOrigin(null)
    // nearbyTaxis.length === 0
    setLocation(null)
  }, [!isLocationEnabled])


 const fetchBoltandUber = async () => {
  try {
    const email = await AsyncStorage.getItem("emailId");
    const phoneNumber = await AsyncStorage.getItem("phoneNumber");

    const response = await fetch(ENDPOINTS.getBoltandUberList, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        phoneNumber,
        // email:"denis_manolache@yahoo.com",
        // phoneNumber:"+40761641290",
        pickup_lat: origin.latitude,
        pickup_long: origin.longitude,
        dropoff_lat: destination.latitude,
        dropoff_long: destination.longitude,
      }),
    });

    const data = await response.json();

    const uberOptions = (data?.uberOptions || []).map((ride) => ({
      ...ride,
      provider: "Uber",
    }));

    const boltOptions = (data?.boltOptions || []).map((ride) => ({
      ...ride,
      provider: "Bolt",
    }));

    const allRides = [...uberOptions, ...boltOptions];

    if (allRides.length > 0) {
      setRidesData((prev) => {
        if (prev.length === 0) {
          return allRides;
        }
        return prev.map((oldRide) => {
          const updatedRide = allRides.find(
            (newRide) =>
              newRide.name === oldRide.name &&
              newRide.provider === oldRide.provider
          );
          return updatedRide
            ? { ...oldRide, price: updatedRide.price, eta: updatedRide.eta, dropoffTime: updatedRide.dropoffTime }
            : oldRide;
        });
      });

      setOriginalData(allRides); 
    }
  } catch (error) {
    console.error("Error fetching Uber and Bolt data:", error);
  } finally {
    setBoltLoading(false);
    setLoading(false);
  }
};

  const fetchAllRideData = async () => {
    setLoading(true);
    setSelectedProviderFilter(null)
    setSelectedSortOption(null)
    // setSelectedCategories([])

    setRidesData([]); // Clear previous ride data
    setOriginalData([]); // Clear previous original data
    // Start fetching data from both APIs
    // fetchBoltData();
    // fetchUberData();
     await fetchBoltandUber();
 if (!pollingRef.current) {
      pollingRef.current = setInterval(() => {
        fetchBoltandUber();
      }, 180000);
    }
    
    // console.dir("APIDARA------", API);
    // const formattedData = API.map((ride) => ({
    //   ...ride,
    //   provider: "Uber",
    // }));

    // setRidesData((prevData) => [...prevData, ...formattedData]);
    // setOriginalData((prevData) => [...prevData, ...formattedData]);
    // Set a timeout for 20 seconds to stop loading if both fail
    setTimeout(() => {
      if (uberLoading || boltLoading) {
        setLoading(false);
        setUberLoading(false);
        setBoltLoading(false);
      }
    }, 3600000);
  };

  
useEffect(() => {
  return () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
  };
}, []);

  useEffect(() => {
  if (!origin || !destination) return;

  const prev = prevCoordsRef.current;

  const hasChanged =
    !prev ||
    prev.origin?.lat !== origin.lat ||
    prev.origin?.lng !== origin.lng ||
    prev.destination?.lat !== destination.lat ||
    prev.destination?.lng !== destination.lng;

  if (hasChanged) {
    prevCoordsRef.current = { origin, destination };

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      fetchAllRideData();
    }, 1500); 
  }
}, [origin, destination]);


  useEffect(() => {
    // Stop loading if either Uber or Bolt data is fetched
    if (!uberLoading && !boltLoading) {
      setLoading(false);
    }
  }, [uberLoading, boltLoading]);

  const reverseGeocode = async (latitude, longitude) => {
    const API_KEY = ENDPOINTS.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error("No address found");
    }
  };


  // Start watching location
  // const startWatchingLocation = () => {
  //   watchId.current = Geolocation.watchPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       const currentLocation = {
  //         latitude,
  //         longitude,
  //         latitudeDelta: 0.01,
  //         longitudeDelta: 0.01,
  //       };

  //       setLocation(currentLocation);
  //       setIsLocationEnabled(true);

  //       if (mapRef.current) {
  //         mapRef.current.animateToRegion(currentLocation, 1000);
  //       }
  //     },
  //     (error) => {
  //       console.error("Error watching location:", error);

  //       // If location services are off (code 2), handle the error
  //       if (error.code === 2) {
  //         setIsLocationEnabled(false);
  //         setLocation(null);
  //       }
  //     },
  //     { enableHighAccuracy: true, distanceFilter: 10 }
  //   );
  // };

  // // Stop watching location when no longer needed
  // const stopWatchingLocation = () => {
  //   if (watchId.current !== null) {
  //     Geolocation.clearWatch(watchId.current);
  //     watchId.current = null;
  //   }
  // };

  const snapToRoad = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${latitude},${longitude}&key=${ENDPOINTS.GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.snappedPoints && data.snappedPoints.length > 0) {
        const snappedLocation = data.snappedPoints[0].location;
        return {
          latitude: snappedLocation.latitude,
          longitude: snappedLocation.longitude,
        };
      } else {
        console.error("No roads found for the given location.");
        return { latitude, longitude };
      }
    } catch (error) {
      console.error("Error snapping to road:", error);
      return { latitude, longitude };
    }
  };


  const searchLocation = async (query) => {
    if (!query) return;

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${ENDPOINTS.GOOGLE_API_KEY}`);
      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        setDestinationCoordinates({ latitude: lat, longitude: lng });

        // Update the map region to the searched location
        setLocation({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        Alert.alert('Error', 'Location not found.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch location.');
    }
  };

  // On Change text in the "Your Location" input field
  const handleLocationChange = (text) => {
    setSearchText(text);
    if (text.length > 3) {
      searchLocation(text);
    }
  };

  // Handle location selection from the map
  const handleMapSelect = () => {
    if (selectedField === 'origin') {
      setOrigin(tempLocation);
      setOriginInput(''); // Clear the input if selecting manually
    } else if (selectedField === 'destination') {
      setDestination(tempLocation);
      setDestinationInput(''); // Clear the input if selecting manually
    }
    setMapVisible(false);
  };

  const handleMapPress = (e) => {
    const coordinate = e.nativeEvent.coordinate;

    if (isSettingOrigin) {
      setOrigin(coordinate);
    } else {
      setDestination(coordinate);
    }

    // If both origin and destination are set, fetch the route
    if (origin && destination) {
      fetchRoute(origin, destination);
    }
  };

  const handleClear = () => {
    // Clear origin and destination
    setOrigin(null);
    setDestination(null);
    setRouteParamdata([]); // Clear the route as well
  };

  const fetchDirections = async (originCoords, destinationCoords) => {
    try {

      const originString = `${originCoords.latitude},${originCoords.longitude}`;
      const destinationString = `${destinationCoords.latitude},${destinationCoords.longitude}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${destinationString}&key=${ENDPOINTS.GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);

        setRouteParamdata(decodedPoints);

        // Fit the route on the map
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(originString, {
            edgePadding: { top: 100, right: 40, bottom: 300, left: 40 },
            animated: true,
          });

          // Optionally adjust the camera to have the origin appear higher on the map
          const midLat = (originCoords.latitude + destinationCoords.latitude) / 2;
          const midLng = (originCoords.longitude + destinationCoords.longitude) / 2;

          mapRef.current.animateToRegion(
            {
              latitude: midLat,
              longitude: midLng,
              latitudeDelta: Math.abs(originCoords.latitude - destinationCoords.latitude) * 1.5,
              longitudeDelta: Math.abs(originCoords.longitude - destinationCoords.longitude) * 1.5,
            },
            1000
          );
        }
      } else {
        console.error("No routes found:", data);
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };


  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };


  // Clear origin input
  const handleClearOrigin = () => {
    setOriginInput('');
    setOriginSuggestions([]);
    setOrigin(null);
    setRouteParamdata([]);
    setShowSuggestions(true)
    setRidesData([]);
    setOriginalData([]);
  };

  // Clear destination input
  const handleClearDestination = () => {
    setDestinationInput('');
    setDestinationSuggestions([]);
    setDestination(null);
    setRouteParamdata([]);
    setRidesData([]);
    setOriginalData([]);
  };

  const [nearbyTaxis, setNearbyTaxis] = useState([]);

  useEffect(() => {
    if (origin) {
      generateMockTaxis(origin);
    } else if (location) {
      generateMockTaxis(location);
    }
  }, [location, origin]);


  const generateMockTaxis = (referenceLocation) => {
    const { latitude, longitude } = referenceLocation;

    const mockTaxis = Array.from({ length: 8 }, (_, index) => {
      const randomOffsetLat = (Math.random() - 0.5) * 0.005; // Smaller random offset for closer grouping
      const randomOffsetLng = (Math.random() - 0.5) * 0.005; // Smaller random offset for closer grouping
      const randomBearing = Math.floor(Math.random() * 360); // Random bearing for rotation
      const taxiTypes = ['economy', 'premium', 'comfort', 'luxury', 'ceden'];
      const randomType = taxiTypes[Math.floor(Math.random() * taxiTypes.length)]; // Randomly assign a type

      return {
        id: index + 1,
        latitude: latitude + randomOffsetLat,
        longitude: longitude + randomOffsetLng,
        bearing: randomBearing,
        type: randomType,
      };
    });

    setNearbyTaxis(mockTaxis);
  };

  const snapPoints = useMemo(() => ["35%", "50%", "75%"], []);

  const rideOptionsContainerStyle = useMemo(() => {
    const hasData = originalData && originalData.length > 0;
    console.log("ridesdata", JSON.stringify(originalData, null, 2));

    return {
      ...styles.rideOptionsContainer1,
      // marginBottom: origin && destination && hasData ? hp(4.5) : hp(0),
    };
  }, [origin, destination, originalData]);

  useEffect(() => {
    if (origin && destination) {
      // fetchRidesData(origin, destination);
      // setSheetIndex(1)
      fetchDirections(origin, destination);
      fetchAllRideData()
      setIsOriginFocused(false);
      setIsDestinationFocused(false);
      setShowSuggestions(false);
      Keyboard.dismiss();
    } else {
      // setSheetIndex(0)
      setRidesData([]);
      setOriginalData([])
    }
  }, [origin, destination]);

  useEffect(() => {
    if (originInput && destinationInput) {
      setSheetIndex(1)
    } else {
      setSheetIndex(0)
    }
  }, [originInput, destinationInput])

  const convertToMinutes = (timeStr) => {
    if (!timeStr || timeStr === "Busy") return Infinity;

    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;

  };
  const [economySortDirection, setEconomySortDirection] = useState("asc");

  const Price = (priceStr) => {
    return parseFloat(priceStr.replace(/[^\d.]/g, ""));
  };

  const convertEtaToMinutes = (eta) => {
    if (!eta || eta.toLowerCase().includes("busy")) return 999; // Fallback for "Busy"

    const match = eta.match(/\d+/);
    return match ? parseInt(match[0]) : 999;
  };

  const applyFilters = () => {
    let filteredRides = [...originalData];

    const actualCategories = selectedCategories.filter(
      cat => cat !== "Fastest" && cat !== "Economy"
    );

    // Category Filter
    if (actualCategories.length > 0) {
      filteredRides = filteredRides.filter((ride) => {
        if (actualCategories.includes("Comfort") && ride.category === "Comfort") return true;
        if (actualCategories.includes("Electric") && ride.category === "Electric") return true;
        if (actualCategories.includes("Premium") && ride.category === "Premium") return true;
        if (
            (actualCategories.includes("Delivery") && ride.category === "Delivery") ||
            (actualCategories.includes("Send") && ride.category === "Send")
          ) {
            return true;
          }
        if (actualCategories.includes("PET") && ride.category === "Pet") return true;
        if (actualCategories.includes("XL") && ride.category === "XL") return true;
        if (actualCategories.includes("Assist") && ride.name === "Assist") return true;
        if (actualCategories.includes("Women") && ride.category === "Women") return true;
        return false;
      });
    }

    // Provider Filter
    if (selectedProviderFilter && selectedProviderFilter !== "all") {
      filteredRides = filteredRides.filter((ride) => ride.companyId === selectedProviderFilter);
    }

    // Manual Sort Option
    if (selectedSortOption === "Price") {
      filteredRides = filteredRides.sort((a, b) => Price(a.price) - Price(b.price));
    } else if (selectedSortOption === "Time") {
      filteredRides = filteredRides.sort((a, b) => normalizeEta(a.eta) - normalizeEta(b.eta));
    }

    // Fastest Sort
    if (selectedCategories.includes("Fastest")) {
      filteredRides = filteredRides
        .filter(ride => ride.eta && !ride.eta.toLowerCase().includes("busy"))
        .sort((a, b) => convertEtaToMinutes(a.eta) - convertEtaToMinutes(b.eta));
    }

    // Economy Sort if no selectedSortOption
    if (selectedCategories.includes("Economy") && !selectedSortOption) {
      filteredRides = filteredRides.sort((a, b) => {
        return economySortDirection === "asc"
          ? Price(a.price) - Price(b.price)
          : Price(b.price) - Price(a.price);
      });
    }

    // Auto sort by price for other categories if no manual sort
    if (
      !selectedSortOption &&
      !selectedCategories.includes("Economy") &&
      (
        selectedCategories.includes("Comfort") ||
        selectedCategories.includes("Electric") ||
        selectedCategories.includes("Premium") ||
        selectedCategories.includes("Delivery") ||
        selectedCategories.includes("PET") ||
        selectedCategories.includes("XL") ||
        selectedCategories.includes("Assist") ||
        selectedCategories.includes("Women")
      )
    ) {
      filteredRides = filteredRides.sort((a, b) => Price(a.price) - Price(b.price)); // ascending
    }

    if (
      !selectedSortOption &&
      selectedCategories.includes("Fastest") &&
      selectedCategories.some(cat =>
        ["Comfort", "Electric", "Premium", "Delivery", "PET", "XL", "Assist", "Women"].includes(cat)
      )
    ) {
      const etaSortCategories = ["COMFORT", "ELECTRIC", "PREMIUM", "DELIVERY", "PET", "XL", "ASSIST", "WOMEN"];
      const normalize = str => str?.toLowerCase()?.trim().toUpperCase();

      // Include all filteredRides that match ETA + selected category
      const matchedRides = filteredRides.filter(
        ride =>
          ride.eta &&
          (
            etaSortCategories.includes(normalize(ride.category)) ||
            etaSortCategories.includes(normalize(ride.name))
          )
      );

      // Sort non-busy by ETA DESC
      const nonBusy = matchedRides
        .filter(ride => !ride.eta.toLowerCase().includes("busy"))
        .sort((a, b) => convertEtaToMinutes(a.eta) - convertEtaToMinutes(b.eta));

      const busy = matchedRides.filter(ride =>
        ride.eta?.trim().toUpperCase().includes("busy")
      );

      // Add them back together
      const sortedMatchedRides = [...nonBusy, ...busy];

      // Inject only sorted matched rides back into main filteredRides
      const unmatchedRides = filteredRides.filter(
        ride => !matchedRides.includes(ride)
      );

      filteredRides = [...sortedMatchedRides, ...unmatchedRides];
    }

    setRidesData(filteredRides);
    // setOriginalData(filteredRides);
  };


  // Normalizing Functions for Sorting
  const normalizePrice = (price) => {
    if (price === "Select Time" || price === "Busy") {
      return Number.MAX_VALUE;
    }
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ""));
    return isNaN(numericPrice) ? Number.MAX_VALUE : numericPrice;
  };

  const normalizeEta = (eta) => {
    const etaNumber = parseInt(eta.match(/\d+/));
    return isNaN(etaNumber) ? Number.MAX_VALUE : etaNumber;
  };

  const handleSortChange = (selectedValue) => {
    setSelectedSortOption(selectedValue); // Just update the state
  };

  const handleProviderFilterChange = (selectedValue) => {
    setSelectedProviderFilter(selectedValue); // Just update the state
  };
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedProviderFilter, selectedSortOption]);


  const fetchSuggestions = async (input, setSuggestions, location) => {
    if (input.length < 1) return;

    try {
      setLoading(true)
      let userLocation = location;

      // Check if location is unavailable, and request it dynamically
      if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
        const hasPermission = await requestLocationPermission();

        if (hasPermission) {
          // Fetch user's current location
          userLocation = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              (position) => resolve(position.coords),
              (error) => {
                console.error("Error fetching location:", error);
                resolve(null);
              },
              { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            );
          });
        }
      }

      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${ENDPOINTS.GOOGLE_API_KEY}&language=en`;

      // Append location and radius if location data is available
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        const { latitude, longitude } = userLocation;
        url += `&location=${latitude},${longitude}&radius=5000`;
      } else {
        console.log("Location is unavailable. Falling back to global suggestions.");
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.predictions) {
        setSuggestions(data.predictions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false)
    }
  };


  const handleSelectSuggestion = async (
    placeId,
    setLocation,
    clearSuggestions,
    isOrigin,
    setInputValue
  ) => {

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${ENDPOINTS.GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.result) {
        const { lat, lng } = data.result.geometry.location;
        const coords = { latitude: lat, longitude: lng };
        const formattedAddress = data.result.formatted_address;
        const addressComponents = data.result.address_components;

        const getAddressPart = (type) => {
          const component = addressComponents.find((comp) => comp.types.includes(type));
          return component ? component.long_name : "";
        };

        // **Extract Address Components with Global Support**
        let streetName = getAddressPart("route"); // Primary street name
        let streetNumber = getAddressPart("street_number"); // House number
        let city =
          getAddressPart("locality") ||
          getAddressPart("administrative_area_level_2") || // Some countries use this instead of locality
          getAddressPart("administrative_area_level_3"); // Backup for city
        let country = getAddressPart("country"); // Country

        // **Fallback for Street Name**
        if (!streetName) {
          streetName =
            getAddressPart("sublocality_level_1") ||
            getAddressPart("sublocality_level_2") ||
            getAddressPart("sublocality"); // Some countries use sublocality instead of a named street
        }

        // **Ignore Plus Codes**
        if (streetName.includes("+")) {
          streetName = ""; // Remove Plus Codes if mistakenly assigned
        }

        // **Final Address Formatting**
        let ApiFormatted = `${streetName} ${streetNumber}, ${city}, ${country}`.trim();
        ApiFormatted = ApiFormatted.replace(/^,|,$/g, ""); // Remove extra commas if any value is missing

        // setLocation(coords);
        clearSuggestions([]);
        setInputValue(formattedAddress);

        saveToHistory({
          place_id: placeId,
          description: formattedAddress,
          coords: coords,
          apiFormatted: ApiFormatted
        });

        if (isOrigin) {
          setOrigin(coords);
          // setPickupLocation(ApiFormatted);
          console.log("Origin formatted address:", ApiFormatted);
        } else {
          setDestination(coords);
          // setDropoffLocation(ApiFormatted);
          console.log("Destination formatted address:", ApiFormatted);
        }
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const saveToHistory = async (place) => {
    try {
      const existing = await AsyncStorage.getItem('locationHistory');
      const parsed = existing ? JSON.parse(existing) : [];

      const updated = [place, ...parsed.filter(p => p.place_id !== place.place_id)].slice(0, 5);
      await AsyncStorage.setItem('locationHistory', JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving location history:", error);
    }
  };

  const loadHistory = async () => {
    const history = await AsyncStorage.getItem('locationHistory');
    if (history) {
      setLocationHistory(JSON.parse(history));
    }
  };

  //prevent edit account open issue
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setModalVisible(false);
      };
    }, [])
  );

  const navigateToNextScreen = () => {
    setModalVisible(false);
    navigation.navigate('editaccount');
  };

  const handleFocus = (inputType) => {
    setShowSuggestions(true);
    if (inputType === 'origin') {
      setIsOriginFocused(true);
      setIsDestinationFocused(false);
    } else {
      setIsDestinationFocused(true);
      setIsOriginFocused(false);
    }
  };

  const handleTouchOutside = () => {
    setShowSuggestions(false);
    setIsOriginFocused(false);
    setIsDestinationFocused(false);
    Keyboard.dismiss();
  };

  const [showExitNotice, setShowExitNotice] = useState(false);
  const backPressTimeout = useRef(null);
  const backPressCount = useRef(0);

  // Function to reset the exit logic
  const resetExitLogic = () => {
    if (backPressTimeout.current) {
      clearTimeout(backPressTimeout.current);
      backPressTimeout.current = null;
    }
    setShowExitNotice(false);
    backPressCount.current = 0;
  };

  useEffect(() => {
    if (route.params?.from === 'payment') {

      // Reset required states
      setRidesData([]);
      setOriginalData([]);
      setIsOriginFocused(false);
      setIsDestinationFocused(false);
      setSidebarVisible(false);
      setShowSuggestions(false);
      setRaidermodal(false);
      setSelectedCategories([]);
      handleClearOrigin(false);
      handleClearDestination(false);

      // Optional: remove param after handling
      route.params.from = null;
    }
  }, [route.params?.from]);

  // BackHandler logic scoped to Mapsearch only
  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        
        if (selectedRide && Object.keys(selectedRide).length > 0) {
          setcancelnmodel(true); 
          return true;
        }

        if (Keyboard.isVisible()) {
          Keyboard.dismiss();
          return true;
        }

        if (isOriginFocused || isDestinationFocused) {
          // setRidesData([]);
          // setOriginalData([]);
          setIsOriginFocused(false);
          setIsDestinationFocused(false);
          setSelectedCategories([]);
          setShowDriverIcon(false)
          return true;
        }

        if (originInput || destinationInput || isSidebarVisible) {
          setRidesData([]);
          setOriginalData([]);
          setIsOriginFocused(false);
          setSidebarVisible(false);
          setIsDestinationFocused(false);
          setShowSuggestions(false);
          handleClearOrigin(false);
          handleClearDestination(false);
          setRaidermodal(false);
          setShowDriverIcon(false)
          setSelectedCategories([]);
          Keyboard.dismiss();
          return true;
        }

        if (backPressCount.current === 2) {
          BackHandler.exitApp();
          return true;
        }

        backPressCount.current += 1;
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);

        backPressTimeout.current = setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        backHandler.remove();
        if (backPressTimeout.current) {
          clearTimeout(backPressTimeout.current);
        }
      };
    }, [
      originInput,
      destinationInput,
      isOriginFocused,
      isDestinationFocused,
      isSidebarVisible,
      handleClearOrigin,
      handleClearDestination,
      selectedRide,
    ])
  );

  const onHome = () => {
    setSidebarVisible(false);
    setIsOriginFocused(false);
    setIsDestinationFocused(false);
    // setOriginInput('');
    // setDestinationInput('');
    setShowSuggestions(false);
    Keyboard.dismiss();
    navigation.navigate("Mapsearch");
  };

  // const fetchAllData = async () => {
  // try {
  //   setLoading(true);
  //   await Promise.all([fetchBoltandUber()]);
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  // } finally {
  //   // Minimum 1 second delay for spinner
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   setLoading(false);
  // }
  // };


  const handleRefresh = async () => {
    setRefreshing(true);

    setRidesData([]);
    setOriginalData([]);
    setLoading(true);
    setBoltLoading(true);
    setRefreshing(true);
    setRefreshsidebar(false);
    fetchBoltandUber();

    try {
      setSelectedCategories([]);
      setSelectedRide([]);

      if (!origin || !destination) {
        setRidesData([]);
        setOriginalData([]);
        await new Promise(resolve => setTimeout(resolve, 60000));
        return;
      }

      setRefreshKey(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, 60000));
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setUberLoading(false);
      setBoltLoading(false);
      setRefreshing(false); 
    }
  };

  // useEffect(() => {
  //   if (!origin || !destination) return;

  //   // Only zoom when both fields are filled manually
  //   if (mapRef.current) {
  //     const coordinates = [origin, destination];

  //     mapRef.current.fitToCoordinates(coordinates, {
  //       edgePadding: { top: 100, right: 40, bottom: 300, left: 40 },
  //       animated: true,
  //     });

  //     const midLat = (origin.latitude + destination.latitude) / 2;
  //     const midLng = (origin.longitude + destination.longitude) / 2;

  //     mapRef.current.animateToRegion(
  //       {
  //         latitude: midLat,
  //         longitude: midLng,
  //         latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 1.5,
  //         longitudeDelta: Math.abs(origin.longitude - destination.longitude) * 1.5,
  //       },
  //       1000
  //     );
  //   }
  // }, [origin, destination]);



  const toggleSidebar = () => {

    if (isOriginFocused || isDestinationFocused) {
      setIsOriginFocused(false);
      setIsDestinationFocused(false);
      setRidesData([]);
      setOriginalData([]);
    }
    // Clear origin and destination input fields if populated
    if (originInput || destinationInput) {
      setIsOriginFocused(false);
      setIsDestinationFocused(false);
      setShowSuggestions(false);
      handleClearOrigin(false);
      handleClearDestination(false);
      Keyboard.dismiss();
    }
    setSidebarVisible((prev) => !prev);
    // Toggle sidebar visibility
  };

  const CustomHandle = () => {
    return (
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      if (routeParams.params?.selectedAddress && routeParams.params?.choosingFor) {
        const { selectedAddress, choosingFor, selectedLocation } = routeParams.params;

        if (choosingFor === 'origin') {
          setOriginInput(selectedAddress);
          setOrigin(selectedLocation)
        } else {
          setDestinationInput(selectedAddress);
          setDestination(selectedLocation)
        }

        // Optionally reset route params to prevent re-triggering
        navigation.setParams({
          selectedAddress: undefined,
          choosingFor: undefined,
        });
      }
    }, [routeParams.params])
  );


  const CategoryGrid = ({ categories, selectedCategories, handleCategoryChange }) => {
    return (
      <>
        {categories.map(({ key, label, subLabel }) => (
          <View key={key} style={styles.categoryItem}>
            {selectedCategories.includes(key) ? (
              <View style={styles.shadowWrapper}>
                <LinearGradient
                  colors={['#FF6200', '#4800AC']}
                  locations={[0, 0.5]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.outerBorder}
                >
                  <View style={styles.innerContentshowdow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.categoryOverlay}
                      onPress={() => handleCategoryChange(key)}
                    >
                      <SvgComponent width={35} height={35} />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.shadowWrapper}>
                <View style={styles.innerContent}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.categoryOverlay}
                    onPress={() => handleCategoryChange(key)}
                  >
                    <SvgComponent width={35} height={35} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={styles.categoryText}>{label}</Text>
            {subLabel && <Text style={styles.categorySubText}>{subLabel}</Text>}
          </View>
        ))}
      </>
    );
  };

  useEffect(() => {
    Orientation.lockToPortrait(); 

    return () => {
      Orientation.unlockAllOrientations(); 
    };
  }, []);

  useEffect(() => {
    if (ridesData.length > 0 && sheetIndex !== 1) {
      setSheetIndex(1);
    }
  }, [ridesData]);

  // useEffect(() => {
  //   if (origin) {
  //     // Call the function here or based on some condition
  //     getCurrentLocation();
  //   }
  // }, [origin]);

//   const PhoneInputModal = ({ visible, onCancel, onSubmit }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   // const [visible, setvisible] = useState(null);


//   return (
//     <Modal transparent={true} visible={visible} animationType="fade">
//       <View style={styles.modalContainer}>
//         <View style={styles.modalBox}>
//           <Text style={styles.title}>Enter Contact Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             keyboardType="phone-pad"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             maxLength={10}
//           />

//           <View style={styles.buttonRow}>
//             <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
//               <Text style={styles.btnText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.okBtn}
//               onPress={() => onSubmit(phoneNumber.trim())}
//             >
//               <Text style={styles.btnText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

const [showPhoneModal, setShowPhoneModal] = useState(false);
const [phoneNumber, setPhoneNumber] = useState('');
const [phonePromiseResolve, setPhonePromiseResolve] = useState(null)
const [ridefinishedbutton, setRidefinishedbutton] = useState(false)

const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const fakeDB = ["9991112222", "8887776666"];
const checkUserInDatabase = async (phoneNumber) => fakeDB.includes(phoneNumber);

// --- Helpers ---
const askRideForUser = () => {
  return new Promise((resolve) => {
    Alert.alert(
      "Ride Confirmation",
      "Is this ride for you?",
      [
        { text: "NO", onPress: () => resolve(false) },
        { text: "YES", onPress: () => resolve(true) },
      ],
      { cancelable: false }
    );
  });
};

const getPhoneFromUser = () => {
  return new Promise((resolve) => {
    setPhonePromiseResolve(() => resolve);
    setShowPhoneModal(true);
    setPhoneNumber(''); // clear previous
  });
};

  const handlePhoneSubmit = () => {
  setShowPhoneModal(false);
  const trimmed = phoneNumber.trim();
  if (trimmed.length === 0) {
    phonePromiseResolve(null);
  } else {
    phonePromiseResolve(trimmed);
  }
};

 const handlePhoneCancel = () => {
  setShowPhoneModal(false);
  // phonePromiseResolve(null);
  setPhoneNumber("");
};


const showRideFinishedScreen = (phone) => {
  Alert.alert(
    "Ride Finished",
    `Ride finished for ${phone || "main user"}`,
    [
      {
        text: "OK",
        onPress: () => {
          setRidefinishedbutton(true);
          setdrivermodal(true);

          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        },
      },
    ],
    { cancelable: false }
  );
};

const startRide = () => {
  Alert.alert("Ride Started", "🚗 Pickup nearby. Starting normal ride flow...");
};

// --- Track Ride in Real-Time ---
const trackRideToDestination = async (phoneNumber, destination) => {
  Alert.alert("📍 Tracking Started", "Monitoring movement to destination...");

  const watchId = Geolocation.watchPosition(
    ({ coords }) => {
      const distanceToDestination = getDistanceMeters(
        coords.latitude,
        coords.longitude,
        destination.latitude,
        destination.longitude
      );

      console.log(`📍 Distance to destination: ${distanceToDestination.toFixed(2)}m`);

      if (distanceToDestination <= 15) {
        showRideFinishedScreen(phoneNumber);
        Geolocation.clearWatch(watchId);
      }
    },
    (err) => console.warn("Geolocation Error:", err),
    { enableHighAccuracy: true, distanceFilter: 5 }
  );

  // auto-stop after 20 minutes
  setTimeout(() => {
    Geolocation.clearWatch(watchId);
    showRideFinishedScreen(phoneNumber);
  }, 20 * 10 * 1000);
};

// --- Ride Validation ---
const handleRideValidation = async ({
  userLocation,
  pickupLocation,
  destination,
  rideETA,
  carPlate,
}) => {
  const isForUser = await askRideForUser();

  const distance = getDistanceMeters(
    userLocation.latitude,
    userLocation.longitude,
    pickupLocation.latitude,
    pickupLocation.longitude
  );

  console.log(` Distance to pickup = ${distance.toFixed(2)}m`);

  // CASE 1: User says ride is NOT for them
  if (!isForUser) {
    const phoneNumber = await getPhoneFromUser();
    if (!phoneNumber) return;

    const exists = await checkUserInDatabase(phoneNumber);
      await trackRideToDestination(phoneNumber, destination);
    if (exists) {
      Alert.alert("✅ Ride Transfer", "User exists in DB. Tracking new user...");
    } else {
      Alert.alert(
        "Ride Pending",
        `User not in DB. After ETA (${rideETA / 1000}s) + 6min, finish ride automatically.`
      );
      
      setTimeout(() => showRideFinishedScreen(phoneNumber), rideETA + 6 * 10 * 1000);
    }
    return;
  }

  // CASE 2: Ride is for user → check distance to pickup
  if (distance > 100) {
    Alert.alert(
      "Ride Confirmed",
      "You are far from pickup. After ETA + 6min, we’ll check again."
    );

    setTimeout(async () => {
      Alert.alert("⚠️ Not Moving", `You are not traveling in the car ${carPlate}.`);

      // Ask again: is the ride still for the user?
      const stillForUser = await askRideForUser();

      if (stillForUser) {
        // If user still claims it's their ride → track movement
        await trackRideToDestination(undefined, destination);
      } else {
        // Otherwise, ask for phone or contact
        const phoneNumber = await getPhoneFromUser();
        if (!phoneNumber) return;

        const exists = await checkUserInDatabase(phoneNumber);
        if (exists) {
          Alert.alert("✅ Ride Transferred", "Tracking new user...");
          await trackRideToDestination(phoneNumber, destination);
        } else {
          Alert.alert("User Not Found", "Ride will finish automatically soon.");
          
          setTimeout(() => showRideFinishedScreen(phoneNumber), rideETA + 6 * 10 * 1000);
         
        }
      }
    }, rideETA + 6 * 10 * 1000);
  }

  // CASE 3: User near pickup (≤100m)
  else {
  startRide();

  setTimeout(async () => {
    // 🚫 Removed the "🚶 Movement Check" alert completely
    Alert.alert(
      "⚠️ Not Traveling",
      `You are not traveling in the car ${carPlate}. Please let us know who is in the car.`,
      [
        {
          text: "OK",
          onPress: async () => {
            const phoneNumber = await getPhoneFromUser();
            if (!phoneNumber) return;

            const exists = await checkUserInDatabase(phoneNumber);

            if (exists) {
              Alert.alert("✅ Ride Transferred", "Tracking new user...");
              await trackRideToDestination(phoneNumber, destination);
            } else {
              Alert.alert(
                "🚘 Ride Finished",
                "User not found in our app. Ride will be marked as finished."
              );
              
              showRideFinishedScreen(phoneNumber); // instantly show finished screen
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, rideETA + 6 * 10 * 1000);
}
}

const handleFinishedRide = () => {
  setRidefinishedbutton(false); 
  setdrivermodal(false); 
  setShowDriverIcon(false);
  setSelectedRide([]);
};

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={resetExitLogic} accessible={false}>
        <GestureHandlerRootView style={styles.container1}>
          <View style={StyleSheet.absoluteFill}>
            <MapView
              key={isLocationEnabled}
              ref={mapRef}
              provider='google'
              style={[StyleSheet.absoluteFill, styles.mapView]}
              initialRegion={defaultLocation}
              region={location || undefined}
              showsUserLocation={isLocationEnabled}
              showsMyLocationButton={false}
              showsCompass={false}
              // onPress={handleMapPress}
              customMapStyle={mapStyle}
              minZoomLevel={5}
              maxZoomLevel={30}
            >
              {/* {location && isLocationEnabled && (
                <Marker
                  coordinate={location}
                  anchor={{ x: 0.5, y: 0.5 }}
                  flat={true}
                >
                  <View>
                  <Octicons name="dot-fill" size={12} color="blue" />
                </View>
                  <View style={styles.customBlueDot}>
                    
                    <View style={styles.outerCircle} />
                    
                    <View style={styles.innerCircle} />
                  </View>
                </Marker>
              )} */}

              {((isLocationEnabled || origin ||currentLocation ) && destination) && (
                // <Marker coordinate={origin} title="Your Location" pinColor="#4CE5B1" />
                <Marker coordinate={origin || location || currentLocation }>
                  <View>
                    {/* <Text style={styles.markerText}>O</Text> */}
                    <FontAwesome6 name="circle-dot" size={23} color="white" style={styles.originLocationIcon} />
                  </View>
                </Marker>
              )}
              {(origin && destination) && (
                // <Marker coordinate={destination} title="Destination" pinColor="#EB963F" />
                <Marker coordinate={destination}>
                  <View>
                    {/* <FontAwesome6 name="location-dot" size={30} color="#FF6200" style={styles.destinationLocationIcon} /> */}
                    <View style={{ position: 'relative' }}><LocationOvalIcon /></View>
                    <View style={{ position: 'absolute', left: 10.5, top: 6 }}><LocationOvalDotIcon /></View>

                  </View>
                </Marker>
              )}

              {/* show nearby taxi */}
              {/* {(location || origin) && nearbyTaxis.length > 0 && nearbyTaxis.map((taxi) => {
                // Determine the image source and size based on taxi type
                let taxiImage, imageStyle;

                switch (taxi.type) {
                  case 'economy':
                    taxiImage = economy;
                    imageStyle = { width: 46, height: 30 };
                    break;
                  case 'premium':
                    taxiImage = premium;
                    imageStyle = { width: 46, height: 40 };
                    break;
                  case 'comfort':
                    taxiImage = comfort;
                    imageStyle = { width: 45, height: 38 };
                    break; 
                  case 'luxury':
                    taxiImage = luxury;
                    imageStyle = { width: 55, height: 45 };
                    break;
                  case 'ceden':
                    taxiImage = ceden;
                    imageStyle = { width: 50, height: 45 };
                    break;
                  default:
                    taxiImage = economy;
                    imageStyle = { width: 40, height: 40 };
                }

                return (
                  <Marker
                    key={taxi.id}
                    coordinate={{
                      latitude: taxi.latitude,
                      longitude: taxi.longitude,
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                    flat={true}
                  >
                    <Image
                      source={taxiImage}
                      style={{
                        ...imageStyle,
                        resizeMode: 'contain',
                      }}
                    />
                  </Marker>
                );
              })} */}

              {routeParamdata.length > 0 && (
                <Polyline
                  coordinates={routeParamdata}
                  strokeWidth={5}
                  strokeColor="#F9731FE5"
                />
              )}
            </MapView>
            {LocationIndex <= 0 && (
              <TouchableOpacity
                style={isTablet ? styles.tabletcustomLocationButton : styles.customLocationButton}
                onPress={() => {
                  if (location) {
                    getCurrentLocation()
                    mapRef.current.animateToRegion(location, 1000);
                  } else {
                    // requestLocationPermission()
                    alertShownRef.current = false;
                    locationRef.current = false;
                    getCurrentLocation()
                  }
                }}
              >
                <MaterialIcons name="my-location" size={isTablet ? 32 : 28} color="#D3770C" style={styles.customIcon} />
              </TouchableOpacity>
            )}

            <View style={styles.toggleButtonContainer}>
              {/* <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: isSettingOrigin ? "#4CE5B1" : "#EB963F" },
              ]}
              onPress={() => setIsSettingOrigin(!isSettingOrigin)}
            >
              <Text style={styles.toggleButtonText}>
                {isSettingOrigin ? "Set Origin" : "Set Destination"}
              </Text>
            </TouchableOpacity> */}
            </View>

            {/* <View style={styles.clearButtonContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View> */}
          </View>

          {/* Full-Screen Overlay */}
          {(isOriginFocused || isDestinationFocused) ? (
            <>
              <View style={[
                styles.fullScreenOverlay,

                {
                  zIndex: (isOriginFocused || isDestinationFocused) ? 100 : 0, // Dynamic zIndex
                },
              ]}
              >

                <View
                  style={[
                    styles.inputWrapper,
                  ]}
                >
                  <View style={styles.originInputBox}>
                    {/* Origin Input */}
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={[styles.gradientContainer, { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                    >
                      <View style={[styles.textInputContainer, { width: wp(85) }]}>
                        <LocationIcon />
                        <TextInput
                          ref={inputRef}
                          style={styles.input}
                          placeholder="Your Location"
                          placeholderTextColor="rgba(252, 255, 255, 1)"
                          value={originInput}
                          selection={!isOriginFocused && { start: 0, end: 0 }}
                          onFocus={() => {
                            setIsOriginFocused(true);
                            setIsDestinationFocused(false);
                            setShowSuggestions(true);
                          }}
                          // editable={!isOriginFocused}
                          onChangeText={(text) => {
                            setOriginInput(text);
                            if (text.length > 0) {
                              fetchSuggestions(text, setOriginSuggestions, location);
                              setShowSuggestions(true);
                            } else {
                              setOriginSuggestions([]);
                            }
                          }}
                          onSubmitEditing={() => {
                            // When the "Enter" key is pressed, automatically select the first suggestion
                            if (originSuggestions.length > 0) {
                              const firstSuggestion = originSuggestions[0]; // Select the first suggestion for now
                              handleSelectSuggestion(
                                firstSuggestion.place_id,
                                setOriginInput,
                                setOriginSuggestions,
                                true,
                                setOriginInput
                              );
                              setShowSuggestions(false); // Hide the suggestions after selection
                              setIsOriginFocused(false);
                              setIsDestinationFocused(false);
                              Keyboard.dismiss()
                            }
                          }}
                          returnKeyType="done"
                        />
                        {originInput ? (
                          <TouchableOpacity onPress={handleClearOrigin}>
                            <Icon name="close-circle" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </LinearGradient>
                  </View>

                  <View style={styles.destinationInputBox}>
                    {/* Destination Input */}
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={[styles.gradientContainer, { borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                    >
                      <View
                        style={[
                          styles.textInputContainer, { width: wp(85) }
                          // originInput.length === 0 && { backgroundColor: '#172733' }, // Disabled style
                        ]}
                      >
                        <DestinationIcon />
                        <TextInput
                          ref={destinationRef}
                          style={styles.input}
                          placeholder="Destination"
                          // placeholderTextColor={originInput.length === 0 ? "#877878" : "#EB963F"}
                          placeholderTextColor="rgba(252, 255, 255, 1)"
                          value={destinationInput}
                          // selection={isDestinationFocused ?
                          //   { start: destinationInput.length, end: destinationInput.length } :
                          //   { start: 0, end: 0 }}
                          selection={!isDestinationFocused && { start: 0, end: 0 }}
                          onFocus={() => {
                            // if (originInput) { // Only allow focus if originInput is valid
                            setIsDestinationFocused(true);
                            setIsOriginFocused(false);
                            setShowSuggestions(true);
                            if (destinationSuggestions.length === 0) {
                              loadHistory();
                            }
                            // }
                          }}
                          onChangeText={(text) => {
                            setDestinationInput(text);
                            if (text.length > 0) {
                              fetchSuggestions(text, setDestinationSuggestions, location);
                            } else {
                              setDestinationSuggestions([]);
                            }
                          }}
                          onSubmitEditing={() => {
                            // When the "Enter" key is pressed, automatically select the first suggestion for destination
                            if (destinationSuggestions.length > 0) {
                              const firstSuggestion = destinationSuggestions[0]; // Select the first suggestion for now
                              handleSelectSuggestion(
                                firstSuggestion.place_id,
                                setDestinationInput,
                                setDestinationSuggestions,
                                false,
                                setDestinationInput
                              );
                              if (originInput.length > 0 && destinationInput.length > 0) {
                                handleTouchOutside();  // Optional: Hide the suggestions after selecting
                              }
                            }
                          }}
                          returnKeyType="done"
                        // editable={originInput.length > 0}
                        />
                        {destinationInput ? (
                          <TouchableOpacity onPress={handleClearDestination}>
                            <Icon name="close-circle" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </LinearGradient>


                  </View>
                </View>
                <View>
                  <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: '#FCFFFF', fontSize: 18, marginTop: hp(2) }}>{isOriginFocused ? "Choose your origin!" : "Choose your destination!"}</Text>
                  {/* Current Location and Choose on map */}
                  {/* <View style={{ width: wp(100), alignItems: 'center', justifyContent: 'center', marginTop: hp(2) }}>
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={{ borderRadius: 50 }}
                    >
                      <TouchableOpacity
                        style={[styles.suggestionItem, styles.currentLocationSuggestion]}
                        // onPress={handleUseCurrentLocation}
                        onPress={() => {
                          // handleUseCurrentLocation();
                          alertShownRef.current = false;
                          addressSetRef.current = false;
                          getCurrentLocation();
                          setShowSuggestions(false); // Hide the suggestions
                        }}
                      >
                        <FontAwesome6
                          name="location-dot"
                          size={20}
                          color="#FFFFFF"
                          style={styles.currentLocationIcon}
                        />
                        <Text style={[styles.suggestionText, styles.currentLocationText]}>
                          Current Location
                        </Text>
                      </TouchableOpacity>

                    </LinearGradient>
                  </View> */}

                  {/* Choose on Map  */}
                  <View style={{ width: wp(100), alignItems: 'center', justifyContent: 'center', marginTop: hp(2) }}>
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={{ borderRadius: 50 }}
                    >
                      <TouchableOpacity
                        style={[styles.suggestionItem, styles.currentLocationSuggestion]}
                        onPress={() => {
                          navigation.navigate('ChooseOnMap', {
                            onFetchLocation: getCurrentLocation,
                            choosingFor: isOriginFocused ? "origin" : "destination",
                            setSidebarVisible: { setSidebarVisible },
                            initialRegion: {
                              latitude: location?.latitude || 45.9432,
                              longitude: location?.longitude || 24.9668,
                              latitudeDelta: 0.01,
                              longitudeDelta: 0.01,
                            },

                          });
                        }}
                      >
                        <ChooseOnMapIcon />
                        <Text style={[styles.suggestionText, styles.currentLocationText]}>
                          Choose on map
                        </Text>
                      </TouchableOpacity>

                    </LinearGradient>
                  </View>

                </View>
                {(originSuggestions.length > 0 || destinationSuggestions.length > 0 || locationHistory.length > 0) && (
                  <LinearGradient
                    colors={['#FF6200', '#4800AC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.separatorline} />
                )}

                <View>

                  {/* Search History */}
                  {((isOriginFocused && showSuggestions && originSuggestions.length === 0) ||
                    (isDestinationFocused && showSuggestions && destinationSuggestions.length === 0)) &&
                    locationHistory.length > 0 && (
                      <View>
                        <FlatList
                          data={locationHistory}
                          keyExtractor={(item, index) => item.place_id || `history-${index}`}
                          renderItem={({ item }) => {
                            const [heading, ...rest] = item.description.split(", ");
                            const subtext = rest.join(", ");

                            return (
                              <>
                                <TouchableOpacity
                                  style={styles.suggestionItem}
                                  onPress={() => {
                                    handleSelectSuggestion(
                                      item.place_id,
                                      isOriginFocused ? setOriginInput : setDestinationInput,
                                      isOriginFocused ? setOriginSuggestions : setDestinationSuggestions,
                                      isOriginFocused,
                                      isOriginFocused ? setOriginInput : setDestinationInput
                                    );
                                    setShowSuggestions(false);
                                  }}
                                >
                                  <View style={styles.suggestionRow}>
                                    <View style={styles.searchLocationIcon}>
                                      <SearchHistoryIcon />
                                    </View>
                                    <View style={styles.textContainer}>
                                      <Text numberOfLines={0} style={styles.headingText}>{heading}</Text>
                                      {subtext && (
                                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.subtext}>
                                          {subtext}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                </TouchableOpacity>
                                <LinearGradient
                                  colors={['#FF6200', '#4800AC']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  style={styles.separator} />
                              </>
                            );
                          }}
                          style={styles.originListView}
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={true}
                          scrollEnabled={true}
                        />
                      </View>
                    )}


                  {/* Origin Suggestions */}
                  {isOriginFocused && showSuggestions && (
                    <FlatList
                      data={originSuggestions}
                      refreshing={refreshing}
                      key={refreshKey}
                      keyExtractor={(item, index) => item.place_id || `current-location-${index}`}
                      renderItem={({ item }) => {

                        const [heading, ...rest] = item.description.split(", ");
                        const subtext = rest.join(", ");
                        return (
                          <>
                            <TouchableOpacity
                              style={styles.suggestionItem}
                              onPress={() => {
                                handleSelectSuggestion(
                                  item.place_id,
                                  setOriginInput,
                                  setOriginSuggestions,
                                  true,
                                  setOriginInput
                                );
                                setShowSuggestions(false);
                              }}
                            >
                              <View style={styles.suggestionRow}>
                                <View style={styles.searchLocationIcon}>
                                  <SearchLocationIcon />
                                </View>
                                <View style={styles.textContainer}>
                                  <Text numberOfLines={0} style={styles.headingText}>{heading}</Text>
                                  {subtext && (
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.subtext}>
                                      {subtext}
                                    </Text>
                                  )}

                                </View>
                              </View>
                            </TouchableOpacity>
                            <LinearGradient
                              colors={['#FF6200', '#4800AC']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.separator} />
                          </>
                        );
                      }}
                      style={styles.originListView}
                      keyboardShouldPersistTaps="handled"
                    />
                  )}

                  {/* Destination Suggestions */}
                  {isDestinationFocused && showSuggestions && (
                    <FlatList
                      data={destinationSuggestions}
                      keyExtractor={(item) => item.place_id}
                      renderItem={({ item }) => {
                        // Process description to split into heading and subtext
                        const [heading, ...rest] = item.description.split(", ");
                        const subtext = rest.join(", ");

                        return (
                          <>
                            <TouchableOpacity
                              style={styles.suggestionItem}
                              onPress={() => {
                                handleSelectSuggestion(
                                  item.place_id,
                                  setDestinationInput,
                                  setDestinationSuggestions,
                                  false,
                                  setDestinationInput
                                );
                                if (originInput.length > 0 && destinationInput.length > 0) {
                                  handleTouchOutside(); // Optional: Hide the suggestions after selecting
                                }
                              }}
                            >
                              <View style={styles.suggestionRow}>
                                <View style={styles.searchLocationIcon}>
                                  <SearchLocationIcon />
                                </View>
                                <View style={styles.textContainer}>
                                  <Text style={styles.headingText}>{heading}</Text>
                                  {subtext && (
                                    <Text numberOfLines={0} ellipsizeMode="tail" style={styles.subtext}>
                                      {subtext}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </TouchableOpacity>
                            <LinearGradient
                              colors={['#FF6200', '#4800AC']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.separator} />
                          </>
                        );
                      }}
                      style={styles.originListView}
                      keyboardShouldPersistTaps="handled"
                    />
                  )}
                </View>
              </View>


            </>
          ) : (
            <>
              <MySidebar isMenuVisible={isSidebarVisible} setMenuVisible={setSidebarVisible} onMyAccountPress={toggleModal} />
              
              <Image source={klassride} style={styles.TopLogo} />
              <View style={[styles.inputHead, {
                zIndex: (isOriginFocused || isDestinationFocused) ? 100 : 95, // Dynamic zIndex
              },]}>
                {/* Origin Input */}
                <LinearGradient
                  colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                  start={{ x: 0.28, y: 0 }}
                  end={{ x: 0.94, y: 1 }}
                  style={styles.gradientContainer}
                >
                  <View style={styles.textInputContainer}>
                    {/* <MaterialCommunityIcons name="map-marker-radius-outline" size={25} color="rgba(252, 255, 255, 1)" /> */}
                    <LocationIcon />
                    {!isOriginFocused ? (
                      <TouchableOpacity
                        onPress={() => {
                          setIsOriginFocused(true);
                          // getCurrentLocation();
                          // setTimeout(() => inputRef.current?.focus(), 100);
                        }}
                        style={styles.input}
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.textEllipsis}
                        >
                          {originInput || "Your Location"}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TextInput
                          ref={inputRef}
                          style={styles.input}
                          placeholder="Your Location"
                          placeholderTextColor="rgba(252, 255, 255, 1)"
                          value={originInput}
                          selection={!isOriginFocused && { start: 0, end: 0 }}
                          onFocus={() => {
                            setIsOriginFocused(true);
                            setIsDestinationFocused(false);
                            setShowSuggestions(true);
                            setTimeout(() => inputRef.current?.focus(), 100);
                            if (originSuggestions.length === 0) {
                              loadHistory();
                            }
                          }}
                          onChangeText={(text) => {
                            setOriginInput(text);
                            getCurrentLocation();
                            if (text.length > 0) {
                              fetchSuggestions(text, setOriginSuggestions, location);
                              setShowSuggestions(true);
                            } else {
                              setOriginSuggestions([]);
                            }
                          }}
                          onSubmitEditing={() => {
                            // When the "Enter" key is pressed, automatically select the first suggestion
                            if (originSuggestions.length > 0) {
                              const firstSuggestion = originSuggestions[0]; // Select the first suggestion for now
                              handleSelectSuggestion(
                                firstSuggestion.place_id,
                                setOriginInput,
                                setOriginSuggestions,
                                true,
                                setOriginInput
                              );
                              setShowSuggestions(false);
                              setIsOriginFocused(false);
                              setIsDestinationFocused(false);
                            }
                          }}
                          returnKeyType="done"
                        />
                        {originInput ? (
                          <TouchableOpacity onPress={handleClearOrigin}>
                            <Icon name="close-circle" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        ) : null}
                      </>
                    )}


                  </View>
                </LinearGradient>

              </View>
              <BottomSheet
                ref={bottomSheetRef}
                index={sheetIndex}
                snapPoints={snapPoints}
                handleComponent={CustomHandle}
                // enablePanDownToClose={true}
                enableDynamicSizing={false}
                enableContentPanningGesture={true}
                enableHandlePanningGesture={true}
                backgroundStyle={{ backgroundColor: 'transparent' }}
                onChange={(index) => setLocationIndex(index)}
                backgroundComponent={({ style }) => (
                  <View style={[style, styles.blurWrapper]}>
                    {/* <BlurView
                      style={StyleSheet.absoluteFill}
                      // blurType="dark"
                      // blurAmount={10}
                      intensity={10}
                      tint="dark"
                    // reducedTransparencyFallbackColor="black"
                    /> */}
                  </View>
                )}
              // style={styles.bottomSheetContainer}
              >
                <View style={styles.bottomSheetContainer}>
                  {/* Destination Input */}
                  <View style={{ width: wp(100), alignItems: 'center' }}>
                    <LinearGradient
                      colors={["rgb(233, 108, 31)", "rgba(31, 0, 167, 1)"]}
                      start={{ x: 0.28, y: 0 }}
                      end={{ x: 0.94, y: 1 }}
                      style={styles.gradientContainer}
                    >
                      <View
                        style={[
                          styles.textInputContainer
                          // originInput.length === 0 && { backgroundColor: '#172733' }, // Disabled style
                        ]}
                      >
                        <DestinationIcon />
                        {!isDestinationFocused ? (
                          <TouchableOpacity
                            onPress={() => {
                              setIsDestinationFocused(true);
                              setTimeout(() => destinationRef.current?.focus(), 100);
                            }}
                            style={styles.input}
                          >
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={styles.textEllipsis}
                            >
                              {destinationInput || "Destination"}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <>
                            <TextInput
                              ref={destinationRef}
                              style={styles.input}
                              placeholder="Destination"
                              // placeholderTextColor={originInput.length === 0 ? "#877878" : "#EB963F"}
                              placeholderTextColor="rgba(252, 255, 255, 1)"
                              value={destinationInput}
                              // selection={isDestinationFocused ?
                              //   { start: destinationInput.length, end: destinationInput.length } :
                              //   { start: 0, end: 0 }}
                              selection={!isDestinationFocused && { start: 0, end: 0 }}
                              onFocus={() => {
                                // if (originInput) { // Only allow focus if originInput is valid
                                setIsDestinationFocused(true);
                                setIsOriginFocused(false);
                                setShowSuggestions(true);
                                setTimeout(() => destinationRef.current?.focus(), 100);
                                if (destinationSuggestions.length === 0) {
                                  loadHistory();
                                }
                                // }
                              }}
                              onChangeText={(text) => {
                                setDestinationInput(text);
                                if (text.length > 0) {
                                  fetchSuggestions(text, setDestinationSuggestions, location);
                                } else {
                                  setDestinationSuggestions([]);
                                }
                              }}
                              onSubmitEditing={() => {
                                // When the "Enter" key is pressed, automatically select the first suggestion for destination
                                if (destinationSuggestions.length > 0) {
                                  const firstSuggestion = destinationSuggestions[0]; // Select the first suggestion for now
                                  handleSelectSuggestion(
                                    firstSuggestion.place_id,
                                    setDestinationInput,
                                    setDestinationSuggestions,
                                    false,
                                    setDestinationInput
                                  );
                                  if (originInput.length > 0 && destinationInput.length > 0) {
                                    handleTouchOutside();  // Optional: Hide the suggestions after selecting
                                  }
                                }
                              }}
                              returnKeyType="done"
                            // editable={originInput.length > 0}
                            />
                            {destinationInput ? (
                              <TouchableOpacity onPress={handleClearDestination}>
                                <Icon name="close-circle" size={20} color="#FFFFFF" />
                              </TouchableOpacity>
                            ) : null}</>
                        )}


                      </View>
                    </LinearGradient>

                    {/* category section */}
                    <NativeViewGestureHandler disallowInterruption={true} waitFor={bottomSheetRef}>
                      <ScrollView style={{ height: 'auto', marginTop: hp(1.3) }}
                        key={refreshKey}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        removeClippedSubviews={false}
                        decelerationRate="fast"
                        snapToAlignment="center"
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.categoryTab}
                        keyboardShouldPersistTaps="handled"

                      >
                        {categories.map(({ label, SvgComponent, key, subLabel }) => {
  const isDisabled = !((ridesData && ridesData.length > 0) || (originalData && originalData.length > 0));

  return (
    <View key={`${key}-${refreshKey}`} style={styles.categoryItem}>
      <View style={styles.shadowWrapper}>
        {selectedCategories.includes(key) ? (
          <LinearGradient
            colors={['#FF6200', '#4800AC']}
            locations={[0, 0.5]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.outerBorder}
          >
            <View style={styles.innerContentshowdow}>
              <TouchableOpacity
                activeOpacity={isDisabled ? 1 : 0.8}
                style={[
                  styles.categoryOverlay,
                  isDisabled && { opacity: 0.5 },
                ]}
                onPress={() => {
                  if (!isDisabled) {
                    handleCategoryChange(key);
                  }
                }}
              >
                <SvgComponent width={35} height={35} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.innerContent}>
            <TouchableOpacity
              activeOpacity={isDisabled ? 1 : 0.8}
              style={[
                styles.categoryOverlay,
                isDisabled && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (!isDisabled) {
                  handleCategoryChange(key);
                }
              }}
            >
              <SvgComponent width={35} height={35} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.categoryText}>{label}</Text>
      {subLabel && <Text style={styles.categorySubText}>{subLabel}</Text>}
    </View>
  );
})}
 
                      </ScrollView >
                    </NativeViewGestureHandler>

                  </View>

                  {/* Riders data */}
                  <BottomSheetScrollView
                    style={[{ padding: 0 }, rideOptionsContainerStyle]}
                    key={refreshKey}
                    showsVerticalScrollIndicator={false}
                  >
                    {loading ? (
                      <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                      </View>
                    ) : originInput.trim() && destinationInput.trim() ? (
                      ridesData.length > 0 ? (
                        ridesData.map((ride, index) => {
                          const isSelected = selectedRide?.name === ride.name;

                          return (
                            <View key={`${ride.name}-${ride.category}-${index}`} style={{ width: wp(95) }}>
                              <LinearGradient
                                colors={['#FF6200', '#4800AC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[
                                  styles.gradientBorder,
                                  isSelected && styles.selectedGradientBorder,
                                ]}
                              >
                                <View
                                  style={[
                                    styles.innerRideContainer,
                                    isSelected && styles.selectedCard,
                                  ]}
                                >
                                  <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.rideOption}
                                    onPress={() => {
                                      setSelectedRide(ride);
                                      setConformationmodel(ride);
                                    }}
                                  >
                                    {ride.imageUrl && (
                                      <Image
                                        source={{ uri: ride.imageUrl }}
                                        style={styles.rideImage1}
                                      />
                                    )}

                                    <View style={styles.rideParent}>
                                      <View style={styles.nameContainer}>
                                        <Text style={styles.rideDrop}>{ride.name}</Text>
                                        <Text style={styles.capacityText}>
                                          {ride.category ? `(${ride.category})` : ''}
                                        </Text>
                                        <View style={styles.capacitycontainer}>
                                          <Text style={styles.capacityText}>{ride.eta}</Text>
                                          {ride.dropoffTime && (
                                            <Text style={styles.capacityText}>
                                              Drop by {ride.dropoffTime}
                                            </Text>
                                          )}
                                        </View>
                                      </View>

                                      <View style={styles.rideInfo}>
                                        <View style={styles.ridePriceContainer}>
                                          <Text style={styles.rideCurrency}>
                                            {ride.price ? ride.price.split(' ')[0] : 'NA'}
                                          </Text>
                                          <Text style={styles.rideAmount}>
                                            {ride.price ? ride.price.split(' ')[1] : 'NA'}
                                          </Text>
                                        </View>

                                        {ride.provider === 'Uber' ? <UberIcon /> : <BoltIcon />}
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              </LinearGradient>
                            </View>
                          );
                        })
                      ) : (
                        <View style={styles.noDataContainer}>
                          <Text style={styles.noDataText}>No rides available</Text>
                        </View>
                      )
                    ) : null}
                  </BottomSheetScrollView>
                </View>

              </BottomSheet>
            </>
          )}
          {/* <MySidebar isMenuVisible={isSidebarVisible} setMenuVisible={setSidebarVisible} /> */}

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {isSidebarVisible && <MyAccount onAccountPress={toggleModal} />}
                <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>
                    Back
                  </Text>
                </TouchableOpacity>
                <LinearGradient
                  colors={['#FF6200', '#4800AC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.separatorbottom} />
                <View style={styles.Imagelay}>
                  <Image source={klassride} style={styles.logo} />
                </View>

              </View>
            </View>
          </Modal>
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
      {/* <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.categoryOverlay}
        onPress={handlerider}
      >
        <Text style={styles.buttonText}>Show Rider Modal</Text>
      </TouchableOpacity> */}

      {/* Pass modal visibility state to RiderScreen */}
      {conformationmodel && (
        <Modal
          transparent={true}
          visible={!!conformationmodel}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['rgba(255, 98, 0, 0.78)', 'rgba(72, 0, 172, 0.75)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>
                Are you sure you want to Booking this vehicle {conformationmodel?.name}?
              </Text>

              {conformationmodel.imageUrl && (
                <Image
                  source={{ uri: conformationmodel.imageUrl }}
                  style={styles.rideImage2}
                />
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.noButton}
                  onPress={() => {
                    setConformationmodel(null)
                    setSelectedRide([]);
                    setShowDriverIcon(false)
                  }}
                >
                  <Text style={styles.noButtonText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.yesButton}
                  onPress={() => {
                    fetchcombined(conformationmodel);
                    setConformationmodel(null);
                  }}
                >
                  <Text style={styles.yesButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      )}

      {cancelnmodel && (
        <Modal
          transparent={true}
          visible={!!cancelnmodel}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['rgba(255, 98, 0, 0.78)', 'rgba(72, 0, 172, 0.75)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>
                Are you sure you want to Cancel this Ride?
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.noButton}
                  onPress={() => {
                    setcancelnmodel(null)
                    // setSelectedRide([]);
                  }}
                >
                  <Text style={styles.noButtonText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.yesButton}
                  onPress={() => {
                    handleCancelRide(cancelRide);
                    setcancelnmodel(null);
                  }}
                >
                  <Text style={styles.yesButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      )}
      {/* <View>

        <TouchableOpacity onPress={() => setRaidermodal(true)}>
          <Icon name="person" size={30} color="#000" />
        </TouchableOpacity> */}

      {raidermodal && requestRide && (
        <GestureHandlerRootView style={styles.fullScreen}>
          <TapGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === 5) { // Tap detected
                closeRiderScreen();
              }
            }}
          >
            <View style={styles.overlay} />
          </TapGestureHandler>

          <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: slideAnim }] }]}>
            <Riderscreen closeRiderScreen={() => { setcancelnmodel(true) }} SelectedRide={selectedRide} Requestdata={requestRide} setSelectedRide={setSelectedRide} cancelmodel={cancelnmodel} startSpinloading={startSpin} setRaidermodal={setRaidermodal}/>
          </Animated.View>
        </GestureHandlerRootView>
      )}
      

      {Loading && (
        <View style={styles.loaderOverlay}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: spinValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            <Feather name="loader" size={40} color="#ff7d00" />
          </Animated.View>
        </View>
      )}

      {KlassRideloader && (
        <View style={styles.loaderOverlay}>
          <FastImage
            source={klassRideGif}
            style={{ width: wp(70), height: hp(11) }}
            resizeMode="contain"
          />
          <View>
           {/* <TypingText text="Connecting you to your rider" /> */}
           <Text style={styles.loaderText}>Connecting you to your rider....</Text>
          </View>
        </View>
      )}


      <Modal
        transparent={true}
        visible={!!ADSnmodel}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['rgba(255, 98, 0, 0.78)', 'rgba(72, 0, 172, 0.75)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>
              {title}
            </Text>
            <Text style={styles.modalTitle}>{body}</Text>

          </LinearGradient>
        </View>
      </Modal>

      {showNoCardPopup && (
        <Modal
          transparent
          animationType="fade"
          visible={showNoCardPopup}
          onRequestClose={() => setShowNoCardPopup(false)}
        >
          <View
            style={styles.modalContainer}
          >
            <LinearGradient
                  colors={['rgba(255, 98, 0, 0.78)', 'rgba(72, 0, 172, 0.75)']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalContent}
                >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 }}>
                No Card Found
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                You have to add a card first.   
              </Text>
              <View style={{marginBottom: wp(4),marginTop:wp(2)}}>
                <Image source={addcard}  style={styles.addcardLogo} />
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
                onPress={() => {
                  setShowNoCardPopup(false); // close popup
                  RBbottomSheetRef.current?.open(); // open bottomsheet
                }}
              >
                <Text style={{ color: '#4800AC', fontSize: 16, fontWeight: 'bold' }}>OK</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
      )}



      {selectedRide && showDriverIcon && !raidermodal && (
      <TouchableOpacity
        style={styles.driverIconButton}
        onPress={() => {
          setdrivermodal(true);       
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }}
      >
        <Image 
          source={{ uri: selectedRide.imageUrl }} 
          style={styles.driverIconImage} 
        />
      </TouchableOpacity>
    )}

      {drivermodal && (
      <GestureHandlerRootView style={styles.fullScreen}>
        <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === 5) {
          closeRiderScreen();
        }
      }}
    >
      <View style={styles.overlay} />
    </TapGestureHandler>
  <Animated.View
    style={[
      styles.animatedContainer,
      {
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
{selectedRide && requestRide ? (
  <View style={styles.driverInfo}>
    <View style={styles.drivername}>
      <Image source={profile} style={styles.profile} />
      <View>
        <View>
      <Text style={styles.driverText}>
       {requestRide?.driverName || "NA"} 
      </Text>
      </View>
      <View style={styles.Rating} pointerEvents='none'>
        <StarRating
          rating={rating}
          onChange={setRating}
        />
      </View>
    </View>
    </View>

    <View style={styles.carDetails}>
      <View style={styles.leftAlign}>
        <Text style={styles.cartext}>{selectedRide?.companyId} ({selectedRide?.name})</Text>
        <Text style={styles.carnum}>
          
          {requestRide?.carDetailsBlock || "NA"} 
        </Text>
      </View>
      <View style={styles.rightAlign}>
        <Text style={styles.cartime}>Arriving in</Text>
        <Text style={styles.carestimation}>
         {selectedRide?.eta || "NA"} 
        </Text>
      </View>
    </View>

    <View style={styles.buttonalign}>
          {selectedRide?.companyId === "Bolt" ? (
            // Bolt → Cancel button
            <View style={styles.space1}>
              <LinearGradient
                colors={["#FF6200", "#4800AC"]}  
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBorderbutton}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.button}
                  onPress={() => { setcancelnmodel(true); }}
                >
                  <View style={styles.buttoncotainer}>
                    <EvilIcons
                      name="close"
                      size={18}
                      color="#FFFFFF"
                      style={styles.cancelicon}
                    />
                    <Text style={styles.cancelbutton}>Cancel Order</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ) : selectedRide?.companyId === "Uber" ? (
            // Uber → More Info button
            <View style={styles.space1}>
              <LinearGradient
                colors={["#FF6200", "#4800AC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBorderbutton}
              >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={async () => {
                  try {
                    const uberAppUrl = "uber://";
                    const uberPlayStoreUrl ="https://play.google.com/store/apps/details?id=com.ubercab";
                    const uberAppStoreUrl ="https://apps.apple.com/app/uber-request-a-ride/id368677368";

                    const supported = await Linking.canOpenURL(uberAppUrl);

                    if (supported) {
                      await Linking.openURL(uberAppUrl);
                    } else {
                      const storeUrl =
                        Platform.OS === "ios" ? uberAppStoreUrl : uberPlayStoreUrl;
                      await Linking.openURL(storeUrl);
                    }
                  } catch (error) {
                    console.error("Error opening Uber:", error);
                  }
                }}
              >
      <View style={styles.buttoncotainer}>
        <Feather
          name="info"
          size={16}
          color="#FFFFFF"
          style={styles.cancelicon}
        />
        <Text style={styles.cancelbutton}>More Info</Text>
      </View>
    </TouchableOpacity>
              </LinearGradient>
            </View>
          ) : null}

          {/* Call button (common for both) */}
          <View style={styles.space}>
            <LinearGradient
              colors={["#FF6200", "#4800AC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.callgradientBorderbutton}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.callbutton}
                onPress={() => {
                  setIsRouteViewed(false);
                }}
              >
                <Feather
                  name="phone-call"
                  size={30}
                  color="#FFFFFF"
                  style={styles.phoneicon}
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
          
        </View>
        {ridefinishedbutton &&
        <View  style={styles.Ridebutton}>
            <LinearGradient
                colors={['#FF6200', '#4800AC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBorderbutton}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={handleFinishedRide}
                >
                    <View style={styles.buttoncotainer}>
                        <Ionicons
                            name="bag-check-outline"
                            size={17}
                            color="#FFFFFF"
                            style={styles.cancelicon}
                        />
                        <Text style={styles.cancelbutton}>Ride Finished</Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </View>
        }
  </View>
) : null}


  </Animated.View>
  </GestureHandlerRootView>
      )}


      <RBSheet
        ref={RBbottomSheetRef}
        height={650}
        openDuration={250}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          container: {
            backgroundColor: '#0D0D2B',
            borderTopLeftRadius: wp(10),
            borderTopRightRadius: wp(10),
          },
          draggableIcon: {
            backgroundColor: "white",
          },
        }}
      >
        <View key={refreshKey} style={styles.RBbottomSheetContainer}>
          <TouchableOpacity style={styles.bottomSheetHandle} onPress={() => bottomSheetRef.current.close()} />
          <ScrollView>
            <Payment setLoading={setIsLoading} startSpin={startSpin} shouldFetchCards={shouldFetchCards} />
          </ScrollView>
          <View style={styles.footer}>
            <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.backTopLine} />
            <TouchableOpacity onPress={() => RBbottomSheetRef.current.close()}>
              <Text style={styles.bottomSheetClose}>Back</Text>
            </TouchableOpacity>

            <LinearGradient colors={['#FF6200', '#1F00A7']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.backBottomLine} />
            <View style={styles.footerContainer}>
              <Image source={klassride} style={styles.footerLogo} />
            </View>
          </View>
        </View>
        {isLoading && (
          <View style={styles.loaderOverlay}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: spinValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            >
              <Feather name="loader" size={40} color="#ff7d00" />
            </Animated.View>
          </View>
        )}

      </RBSheet>

     <Modal transparent={true} visible={showPhoneModal} animationType="fade">
  <View style={styles.modalContainer}>
     <LinearGradient
              colors={['rgba(255, 98, 0, 0.78)', 'rgba(72, 0, 172, 0.75)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalContent}
            >
    {/* <View style={styles.modalBox}> */}
      <Text style={styles.modalTitle}>Enter Contact Number</Text>
      <TextInput
        style={{color:"white"}}
        placeholderTextColor="#fff" 
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        maxLength={13}
      />
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.noButton} onPress={handlePhoneCancel}>
          <Text style={styles.noButtonText}>Cancel</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.yesButton} onPress={handlePhoneSubmit}>
          <Text style={styles.yesButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    {/* </View> */}
    </LinearGradient>
  </View>
    </Modal>


      {/* </View> */}
      {!isKeyboardVisible && !isSidebarVisible && !raidermodal && !drivermodal &&(
        <FooterMenu
          onAccountPress={toggleSidebar}
          onHome={onHome}
          onRefreshPress={handleRefresh}
          isRefreshing={refreshing}
        />
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  portrait: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddeeff',
  },
  landscape: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffeedd',
  },
  container: {
    flex: 1,
    // backgroundColor: "#121212",
    alignItems: 'center',
    width: wp(100),
  },
  separatorbottom: {
    height: 1,
    width: '70%',
    alignSelf: 'center',
    marginVertical: 5,
    // marginTop:hp(5)
  },
  mapView: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    // display: 'none'
  },
  fullscreenMapContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    ...StyleSheet.absoluteFillObject,
    width: wp(100),
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    width: wp(100),
    borderTopStartRadius: 15,
    borderTopRightRadius: 15,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    width: wp(100),
    backgroundColor: "rgba(8, 18, 45, 0.7)",
    // backgroundColor: 'red',
    // zIndex: 95,
  },
  inputWrapper: {
    marginTop: hp(3),
    gap: 10,
  },
  originInputBox: {
    width: wp(100),
    alignItems: 'flex-start'
  },

  destinationInputBox: {
    width: wp(100),
    alignItems: 'flex-end'
  },

  backButton: {
    position: 'absolute',
    top: hp(3),
    left: wp(5),
    // padding: 10
    // zIndex: 1000
  },
  backButtonText: {
    fontSize: 18,
    color: '#EB963F',
    fontWeight: 'bold',
    zIndex: 100,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: '#22272B',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: hp(1),
    shadowColor: '#000',
    elevation: 8,
    width: wp(70),
    height: hp(5),
    paddingHorizontal: wp(2),
    marginTop: hp(2.5),
    marginLeft: wp(10),
    backgroundColor: "blue",

  },
  inputContainer1: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#22272B',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: hp(1),
    shadowColor: '#000',
    elevation: 8,
    width: wp(70),
    height: hp(5),
    paddingHorizontal: wp(2),
    marginLeft: wp(10)
  },
  inputsearch: {
    flex: 1,
    paddingVertical: hp(1),
    fontSize: wp(3.5),
    color: "white",
  },
  blurWrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(25, 25, 58, 0.6)'
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    width: wp(100),
    overflow: 'hidden'
  },
  handle: {
    width: wp(30),
    height: 3,
    backgroundColor: "#E2E7FF",
    borderRadius: 10,
  },
  categoryTab: {
    paddingHorizontal: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 5, // space between each item
    justifyContent: 'flex-start',
    height: 100
  },

  shadowWrapper: {
    shadowColor: "rgba(255, 98, 0, 1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    // elevation: 10,

  },

  outerBorder: {
    borderRadius: 50,
    padding: 1,
    // shadowColor: "rgba(255, 98, 0, 1)",
    // shadowOffset: { width: 10, height: 0 },
    // shadowOpacity: 0.9,
    // shadowRadius: 15,
    // elevation: 10,
  },

  innerContentshowdow: {
    backgroundColor: '#000', // or any background
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "rgba(255, 98, 0, 1)",
    shadowOffset: { width: -10, height: -16 },
    shadowOpacity: 0.9,
    shadowRadius: 50,
    elevation: 20,
  },

  innerContent: {
    backgroundColor: '#000', // or any background
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryOverlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(17, 50, 132, 0.7)",
    borderRadius: 50,
    // elevation: 3,
    width: 60,
    height: 60,
  },

  activeCategory: {
    borderLeftColor: "#FF6200",
    borderLeftWidth: 1,
    borderTopColor: "#FF6200",
    borderTopWidth: 1.5,
    borderRightWidth: 1,
    borderRightColor: "#4800AC",  // Corrected: added #
    borderBottomColor: "#4800AC", // Corrected: added #
    //  borderBottomWidth: 1,
    shadowColor: '#FF6200',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 15,
  },


  categoryImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },

  categoryText: {
    fontSize: 13,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Montserrat-Medium"
  },
  categorySubText: {
    fontSize: 9,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Montserrat-Medium"
  },
  loadingOverlay: {
    position: "absolute",
    top: hp(10),
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  gradientBorder: {
    padding: 1, // thickness of border
    paddingLeft: 0,
    borderTopRightRadius: 38,
    borderBottomRightRadius: 38,
    marginBottom: wp(5),
    zIndex: 99,
    // width: wp(95.1)
  },
  selectedGradientBorder: {
    transform: [{ translateX: 20 }],
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    paddingLeft: 1,
    // width: wp(100)
  },
  rideOptionsContainer1: {
    marginTop: hp(1),
    width: wp(100),
    // paddingRight: wp(5),
    // alignItems:'center',
    flexDirection: 'column',
    marginBottom: hp(7)

  },
  innerRideContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopRightRadius: 38,
    borderBottomRightRadius: 38,
    overflow: 'hidden',
    zIndex: 99,
    // width: wp(95)
  },
  rideOption: {
    flexDirection: "row",
  },
  selectedCard: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  rideImage1: {
    width: wp(16),
    height: hp(7),
    borderRadius: 5,
    resizeMode: "contain",
  },
  rideImage2: {
    width: wp(18),
    height: hp(8),
    borderRadius: 5,
    resizeMode: "contain",
  },
  rideParent: {
    flex: 1,
    flexDirection: 'row',
    // paddingHorizontal: 10,
    justifyContent: 'space-between',
    // width: wp(50),
    // backgroundColor:'yellow'
    padding: 8,
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: 'center',
    gap: wp(1),
    maxWidth: 150,
    flexWrap: 'wrap',

  },
  capacitycontainer: {
    flexDirection: "row",
    maxWidth: 150,
    justifyContent: 'space-between',
    gap: wp(1),
  },
  capacityText: {
    fontSize: 13,
    fontWeight: "bold",
    color: '#ffffff',
    flexShrink: 0,
  },
  rideInBy: {
    flex: 1,
    flexDirection: 'row',
    gap: wp(3)
    // justifyContent: 'space-evenly',
  },
  rideDrop: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
    flexShrink: 1,
  },

  ridetime: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },

  rideInfo: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    // justifyContent: "flex-end",
    // backgroundColor:'red',
    // width: wp(50),
    paddingHorizontal: wp(6),
    gap: 3,
    maxWidth: 100,
    marginRight: wp(2)
  },

  ridePriceContainer: {
    alignItems: 'center',
  },

  rideCurrency: {
    fontFamily: "Montserrat-Medium",
    color: '#FFFFFF',
    fontSize: 13,
  },

  rideAmount: {
    fontFamily: "Montserrat-Medium",
    color: '#FFFFFF',
  },

  rideType: {
    color: "#FFFFFF",
    fontSize: 12,
    marginBottom: 4,
  },

  // ridePrice: {
  //   color: "#FFFFFF",
  //   // fontSize: 18,
  //   fontFamily: "Montserrat-Medium",
  // },

  cedenrideImage: {
    width: wp(17),
    height: hp(5)
  },
  cedenridetime: {
    color: "#ffff",
    fontSize: 12,
    // fontWeight:"bold",
    marginBottom: hp(-1),
    marginLeft: wp(-11),
    // justifyContent: "flex-end"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(90),
    height: hp(64),
    marginLeft: wp(1),
    marginTop: hp(-25),
  },
  closeButtonText: {
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  closeButton: {
    color: "white",
    alignItems: "center",
    alignSelf: "center"
  },
  icon: {
    marginLeft: 5,
    color: "white",
    backgroundColor: "#ff991f"
  },
  searchBackIcon: {
    // marginLeft: wp(1),
    color: "#CBC0C0",
    backgroundColor: "#D3770C",
    padding: 3,
    borderRadius: 8,
    // top: hp(1),
    // right: 3,
  },
  Imagelay: {
    // marginBottom: hp(20),
    alignItems: "center",
    resizeMode: "contain",
  },
  TopLogo: {
    marginTop: hp(1.5),
    width: wp(30),
    height: hp(10),
    resizeMode: "contain",
    // zIndex: 99
  },
  logo: {
    width: wp(30),
    height: hp(10),
    resizeMode: "contain",
  },
  rideLogo: {
    width: wp(10),
    // height: hp(10),
    resizeMode: "contain",
    borderRadius: 50
  },
  customLocationButton: {
    position: 'absolute',
    bottom: hp(40),
    right: wp(3),
    // marginBottom:wp(20),
    // marginRight:wp(30),
    backgroundColor: '#2E333A',
    padding: 10,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabletcustomLocationButton: {
    position: 'absolute',
    bottom: 500,
    right: 30,
    // marginBottom:wp(20),
    // marginRight:wp(30),
    backgroundColor: '#2E333A',
    padding: 10,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  customIcon: {
    // width: wp(7),
    // height: wp(8),
    backgroundColor: '#2E333A',
    tintColor: '#007AFF',

  },
  originLocationIcon: {
    backgroundColor: '#4800AC',
    // overflow: 'hidden',
    borderRadius: 50,
    border: 50
    // tintColor: 'white', // Optional: Adjust the color of the icon
  },
  destinationLocationIcon: {
    position: 'relative'
  },
  toggleButtonContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  toggleButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -75 }], // Center the button
  },
  clearButton: {
    backgroundColor: '#D32F2F', // Red color for clear
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  inputHead: {
    // flex: 1,
    // width: wp(75),
    zIndex: 95,
    // marginLeft: wp(10),
    marginTop: hp(1.5),
  },
  gradientContainer: {
    border: 10,
    marginBottom: hp(1),
    // padding: 3, 
    borderRadius: 30,
    shadowColor: "rgba(255, 98, 0, 1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 46.5,
    paddingHorizontal: wp(2),
    alignSelf: "center",
    justifyContent: 'center',
    marginLeft: wp(2),
    width: wp(74),
  },
  textEllipsis: {
    fontSize: 17,
    fontFamily: "Montserrat-SemiBold",
    color: '#FCFFFF'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Montserrat-SemiBold",
    // fontWeight: 'bold',
    paddingLeft: 8,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: "transparent",
    color: '#FCFFFF'
  },
  bottomSheetContainer: {
    width: wp(100),
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'flex-start',
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  originListView: {

    borderRadius: 5,
    width: wp(100),
    alignSelf: "center",
    position: "absolute",
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 3,
    paddingLeft: wp(5)
  },
  separator: {
    height: 1,
    width: wp(90),
    alignSelf: 'center',
    marginVertical: 5,
  },
  separatorline: {
    height: 1,
    width: wp(70),
    alignSelf: 'center',
    marginVertical: 5,
    marginTop: hp(3)
  },
  currentLocationSuggestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    padding: 8,
    width: wp(60),
    // display: 'none'
  },
  currentLocationText: {
    // fontSize: 18,
    // fontWeight: "bold", // Make the text bold
    color: "#FCFFFF", // White text for contrast
    marginLeft: 10,
    // color: "#D3770C",
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold"
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'blue'
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
    // backgroundColor: 'red'
  },
  headingText: {
    fontSize: 15,
    // fontWeight: "bold",
    color: "#FCFFFF",
    fontFamily: "Montserrat-Medium"
  },
  subtext: {
    fontSize: 14,
    color: "#FCFFFF",
    fontFamily: "Montserrat-Light"
  },
  searchLocationIcon: {
    // width: 30,
    // height: 30,
    // backgroundColor: '#22272B',
    tintColor: '#007AFF',
    // padding: 2,
    borderRadius: 15,
    marginRight: 10
    // alignItems: 'center'
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: "#CBC0C0",
  },
  noDataContainer: {
    alignItems: "center",
  },
  noDataText: {
    // backgroundColor: 'red',
    fontSize: wp(4.5),
    fontFamily: "Montserrat-SemiBold",
    textAlign: 'center',
    color: "white"
  },
  fullScreen: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    flex: 1,
    width: '100%',
  },
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '45%',
    backgroundColor: '#1E1E2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // padding:wp(1)
  },
  modalContent: {
    padding: 20,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    // height: 150,
  },
  modalTitle: {
    fontSize: wp(4),
    // fontWeight: 'bold',
    color: '#fff',
    marginBottom: wp(4),
    fontFamily: fonts.montseratExtraBold,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignSelf: "center",
    // width: '100%',
    // padding:hp(1),
    // marginTop:wp(-5)
  },
  noButton: {
    // backgroundColor: 'gray',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignSelf: "center"
    // marginRight: 5,
  },
  noButtonText: {
    color: '#fff',
    // fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: "center",
    fontFamily: fonts.montseratBold
  },
  yesButton: {
    // backgroundColor: 'red',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignSelf: "center",
    justifyContent: "center"
    // marginLeft: 5,

  },
  yesButtonText: {
    color: '#fff',
    // fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
    alignSelf: "center",
    fontFamily: fonts.montseratBold
  },
  RBbottomSheetContainer: {
    // padding: 30,
    height: 50,
    flex: 1,
    backgroundColor: '#0D0D2B',
  },
  bottomSheetHandle: {
    width: 95,
    height: 5.5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  bottomSheetClose: {
    // marginBottom: 100,
    color: 'white',
    // fontWeight: 'bold',
    textAlign: 'center',
    fontSize: wp(4.7),
    padding: wp(2),
    fontFamily: fonts.montseratSemiBold,
  },
  backTopLine: {
    width: '85%',
    height: 1,
    // marginTop:wp(34),
    // marginTop: height * 0.1,
    alignSelf: "center"
    // marginTop:9,
  },
  backBottomLine: {
    width: '70%',
    height: 1,
    // marginTop: 120,
    marginEnd: 100,
    marginStart: 100,
    alignSelf: "center",
    marginBottom: wp(4)
  },
  footerContainer: {
    marginBottom: hp(10),
    padding: wp(1),
    backgroundColor: '#0D0D2B',
  },
  footerLogo: {
    width: wp(50),
    height: hp(7),
    resizeMode: 'contain',
    // marginBottom: wp(40),
    alignSelf: "center",
    // marginTop:wp(90),
  },
  addcardLogo: {
    width: wp(50),
    height: hp(13),
    resizeMode: 'contain',
    // marginBottom: wp(40),
    alignSelf: "center",
    // marginTop:wp(90),
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderText: {
    // marginTop: 10,
    fontSize: wp(3.5),
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    marginBottom:wp(20),
    color: '#fff',
    fontFamily:fonts.montseratSemiBold
  },
  driverIconButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#b86ed8ff',
    padding: 8,
    width:wp(19),
    borderRadius: 20,
    alignSelf:"center",
    justifyContent:"center",
  },
  driverIconImage:{
    width: wp(15),
    height: wp(10),
    // borderRadius: 35,
    resizeMode: 'cover',
  },

  driverIconText: {
    color: '#fff',
    fontSize: 16,
  },
  profile: {
    width: wp(18),
    height: hp(9),
    flexDirection: 'row',
    borderRadius: 20,
    alignSelf: "center",
    resizeMode: "contain"
  },
  rowContainer: {
    justifyContent: "space-around",
    width: '100%',
  },
  driverInfo: {
    // alignItems: 'center',
    // flexDirection:"row",
    justifyContent: "space-around",
    // marginBottom: hp(2),
    padding: wp(5),
    marginTop: hp(2),
  },
  drivername: {
    marginBottom: hp(3),
    alignSelf: "flex-start",
    flexDirection: 'row',
  },
  profile: {
    width: wp(18),
    height: hp(9),
    flexDirection: 'row',
    borderRadius: 20,
    alignSelf: "center",
    resizeMode: "contain"
  },
  driverText: {
    fontSize: wp(5),
    color: "white",
    // fontWeight: 'bold',
    // marginBottom: hp(2),
    alignSelf: "flex-start",
    paddingHorizontal: wp(5),
    fontFamily: fonts.montseratBold,
  },
  carDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftAlign: {
    alignItems: 'flex-start',
  },
  cartext: {
    fontSize: wp(4.5),
    color: "white",
    alignSelf: "flex-start",
    fontFamily: fonts.montseratSemiBold,
  },
  carnum: {
    fontSize: wp(4),
    color: 'white',
    marginTop: hp(1),
    fontFamily: fonts.montseratSemiBold,

  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  cartime: {
    fontSize: wp(4),
    color: "white",
    // alignContent:"flex-end",
    alignSelf: "flex-end",
    fontWeight: "bold",
    fontFamily: fonts.montseratSemiBold,
  },
  carestimation: {
    fontSize: wp(4),
    color: "white",
    // alignContent:"flex-end",
    alignSelf: "flex-end",
    marginTop: hp(1),
    fontFamily: fonts.montseratSemiBold,
  },
  buttonalign: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  space1: {
    marginTop: hp(4),
  },
  button: {
    backgroundColor: "#000000",
    borderRadius: 20,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttoncotainer: {
    flexDirection: 'row', // This arranges children in a row
    alignItems: 'center', // Vertically center items
    justifyContent: 'center',
    padding: wp(3),
    marginTop: wp(-0.5)
  },
  cancelbutton: {
    color: '#ffffff',
    fontSize: wp(3.5),
    letterSpacing: 1,
    textAlign: "center",
    fontFamily: fonts.montseratBold,
    // marginBottom:wp(1)
  },
  phoneicon: {
    alignSelf: "center",

  },
  callbutton: {
    backgroundColor: "#000000",
    borderRadius: 80,
    width: wp(17.5),
    height: hp(7.7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  callgradientBorderbutton: {
    borderRadius: 80,
    padding: 1,
    width: wp(18),
    height: hp(8),
    alignSelf: 'center',
  },
  space: {
    marginTop: hp(2),
  },
  gradientBorderbutton: {
    borderRadius: 20,
    padding: 1,
    width: wp(50),
    height: hp(5),
    alignSelf: 'center',
  },
   Rating:{
    marginTop:wp(1),
    // fontSize:wp(2)
  },
  Ridebutton:{
    marginTop:hp(2),
  },
});

