import React, { useState, useRef } from "react";
import { Share, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, ToastAndroid, Animated, Easing } from "react-native";
import { WebView } from "react-native-webview";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { wp, hp } from "../common/responsive";
import { fonts } from "../../components/customfont";
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ENDPOINTS } from "../../environments/environment";

export default function Boltview({ route }) {
    // const url ="https://ridebooker.bolt.eu/details/today/11190281"
    const { url, cancelRide } = route.params;
    const [loading, setLoading] = useState(true);
    const [Loading, setgobalLoading] = useState(false);

    const [webKey, setWebKey] = useState(0);
    const navigation = useNavigation();
    const spinValue = useRef(new Animated.Value(800)).current;
    //  const handleCancelRide = () => {
    //     setIsLoading(true); 
    //     setWebKey(prev => prev + 1);
    //     cancelRide?.();
    // };
    const renderLoader = () => (
        <View style={styles.webViewLoader}>
            <ActivityIndicator size="large" color="#4800AC" />
            <Text style={styles.loaderText}>Loading...</Text>
        </View>
    );

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
        // Start the spinner
        startSpin?.();
        setgobalLoading(true);
        await cancelRide?.();
        setTimeout(() => {
        setgobalLoading(false);
        }, 6000);
    } catch (error) {
        console.error("Error during ride cancellation:", error);
        setgobalLoading(false);
    }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <WebView
                    key={webKey}
                    source={{ uri: url }}
                    style={{ flex: 1 }}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    startInLoadingState={true}
                // renderLoading={renderLoader}
                />
            </View>
            
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
                        <Feather name="loader" size={40} color="#8cf469ff" />
                    </Animated.View>
                </View>
            )}
            <View style={styles.buttonalign}>
                <LinearGradient
                    colors={["#00ff04ff", "#4800AC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorderbutton}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        onPress={() => {
                            handleCancelRide();
                        }}
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
                <LinearGradient
                    colors={["#00ff04ff", "#4800AC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorderbutton}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                    >
                        <View style={styles.buttoncotainer}>
                            <Ionicons
                                name="bag-check-outline"
                                size={17}
                                color="#FFFFFF"
                                style={styles.cancelicon}
                            />
                            <Text style={styles.cancelbutton}>Finished Ride</Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                    colors={["#00ff04ff", "#4800AC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorderbutton}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        onPress={async () => {
                            try {
                                const result = await Share.share({
                                    message: `Here’s my ride link: ${url}`,
                                });

                                if (result.action === Share.sharedAction) {
                                    if (result.activityType) {
                                        console.log("Shared with activity type:", result.activityType);
                                    } else {
                                        console.log("Shared successfully");
                                    }
                                } else if (result.action === Share.dismissedAction) {
                                    console.log("Share dismissed");
                                }
                            } catch (error) {
                                console.error("Error sharing:", error.message);
                            }
                        }}
                    >
                        <View style={styles.buttoncotainer}>
                            <MaterialIcons
                                name="mobile-screen-share"
                                size={18}
                                color="#FFFFFF"
                                style={styles.cancelicon}
                            />
                            <Text style={styles.cancelbutton}>Share Ride</Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttoncotainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(3),
        marginTop: wp(-1)
    },
    cancelbutton: {
        color: '#ffffff',
        fontSize: wp(3),
        letterSpacing: 1,
        textAlign: "center",
        fontFamily: fonts.montseratBold,
        marginTop:wp(0.5)
    },
    gradientBorderbutton: {
        borderRadius: 15,
        padding: 1,
        width: wp(30),
        height: hp(5),
        alignSelf: 'center',
        marginRight: wp(1)
    },
    button: {
        backgroundColor: "#000000",
        borderRadius: 15,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
   buttonalign: {
        flexDirection: "row",
        justifyContent: "space-around",  
        alignItems: "center",
        paddingVertical: hp(3.5),
        position: "absolute",
        bottom: hp(0), 
        left: 0,
        right: 0,
        backgroundColor:"#fff"
        },
    webViewLoader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff", // background inside WebView while loading
    },
    loaderText: {
        marginTop: 10,
        color: "#4800AC",
        fontSize: wp(3.5),
        fontFamily: fonts.montseratBold,
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
});
