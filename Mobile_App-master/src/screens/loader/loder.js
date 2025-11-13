import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { wp, hp } from "../common/responsive";

// Make sure to place your JSON file in assets, e.g. /assets/animations/klassRideloader.json
import klassRideloader from '../../assets/videos/klassRideloader.json';

const RiderLoader = ({ message = "Connecting you to your rider..." }) => {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <View style={styles.loaderOverlay}>
      <LottieView
        ref={animation}
        source={klassRideloader}
        autoPlay
        loop
        style={{ width: wp(70), height: hp(11) }}
      />
      <View>
        <Text style={styles.loaderText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent overlay
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default RiderLoader;
