import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar, TouchableOpacity, Text, TextInput, View, Image, SafeAreaView, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData,
  BackHandler, Modal, ToastAndroid, Animated, Easing, Dimensions,
  ImageBackground, ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import klassride from '../../assets/images/klassride1.png';
import netaImage from "../../assets/images/neto.png";
import { useNavigation } from "@react-navigation/native";
import { ENDPOINTS } from "../../environments/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { fonts } from "../../components/customfont";
import { wp, hp } from "../common/responsive"
// Importing fonts
// import { fonts } from "../../components/customfont";
import { useRoute } from '@react-navigation/native';
import Blue from "../../assets/images/blue.png"

const { width, height } = Dimensions.get('window'); // Getting screen dimensions

export default function VerificationScreen() {
  const [value, setValue] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const route = useRoute();
  // const phonenumber = "+918248415805"
  const { handleRegister } = route.params || {};

  const lastBackPressed = useRef(0)

  const navigation = useNavigation();
  const email = route.params?.EmailId;
  const phonenumber = route.params?.phonenumber;
  const Linked = route.params?.Linked;
  const RegisterNumber = route.params?.RegisterNumber;
  const isEmailVerification = !!email;
  const LinkingVerification = !!Linked;
  const phoneValidation = !!phonenumber;
  let Data = email || phonenumber || Linked || RegisterNumber;
  let formattedContact = "";


  if (Data) {
    if (email) {
      formattedContact = `${email.slice(0, 4)}*****${email.slice(email.indexOf("@"))}`;
    } if (Linked) {
      formattedContact = `${Linked.slice(0, 3)}*****${Linked.slice(-2)}`;
    } if (phonenumber) {
      formattedContact = `${phonenumber.slice(0, 3)}*****${phonenumber.slice(-2)}`;
    }
    else if (RegisterNumber) {
      formattedContact = `${RegisterNumber.slice(0, 3)}*****${RegisterNumber.slice(-2)}`;
    }
  } else {
    formattedContact = ""
  }

  const [showModal, setShowModal] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;

  const startSpin = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleChange = (text, index) => {
    const newValue = [...value];
    newValue[index] = text;
    setValue(newValue);

    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackSpace = (event, index) => {
    if (event.nativeEvent.key === 'Backspace') {
      if (value[index] === "") {
        // If current is empty, move to previous
        if (index > 0) {
          handleChange('', index - 1);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // If current is not empty, just clear it
        handleChange('', index);
      }
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsDisabled(false);
    }
  }, [timer]);

  const handlephoneResend = async () => {
    console.log("handlephoneResend")
    startSpin()
    setLoading(true)
    const cleared = Array(value.length).fill("");
    setValue(cleared);
    inputRefs.current[0]?.focus();
    setTimer(45);
    setIsDisabled(true);
    try {
      const response = await fetch(ENDPOINTS.phoneValidationSignIn, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phonenumber }),
      });
      let responseData = await response.json();
      if (response.ok) {
        ToastAndroid.show(responseData?.message || "Code resent succesfully to your phone number", ToastAndroid.SHORT);
      }
      else {
        const errorMessage = responseData?.message || 'Something went wrong. Please try again.';
        ToastAndroid.show(errorMessage || "failed to send verification code", ToastAndroid.SHORT);
      }
    } catch (error) {
      const errorMessage = error?.message || 'Unable to Resend OTP, Please try again.';
      // setError(errorMessage);
    } finally {
      setLoading(false)
    }

  };

  const handleResend = async () => {
    console.log("handleResend")
    startSpin()
    setLoading(true)
    const cleared = Array(value.length).fill("");
    setValue(cleared);
    inputRefs.current[0]?.focus();
    setTimer(45);
    setIsDisabled(true);
    try {
      const response = await fetch(ENDPOINTS.whatsappValidation, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: RegisterNumber }),
      });
      let responseData = await response.json();
      if (response.ok) {
        ToastAndroid.show(responseData?.message || "Code resent succesfully to your phone number", ToastAndroid.SHORT);
      }
      else {
        const errorMessage = responseData?.message || 'Something went wrong. Please try again.';
        ToastAndroid.show(errorMessage || "failed to send verification code", ToastAndroid.SHORT);

      }
    } catch (error) {
      const errorMessage = error?.message || 'Unable to Resend OTP, Please try again.';
      // setError(errorMessage);
    } finally {
      setLoading(false)
    }

  };

  const handleEmailResend = async () => {
    console.log("handleEmailResend")
    setLoading(true)
    const cleared = Array(value.length).fill("");
    setValue(cleared);
    inputRefs.current[0]?.focus();
    setTimer(45);
    setIsDisabled(true);
    try {
      startSpin()
      setLoading(true)
      const response = await fetch(ENDPOINTS.forgotPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const responseData = await response.json();
      if (response.status === 200) {
        // setTimer(30);
        setIsDisabled(true);
        ToastAndroid.show(responseData.message || "Code resent succesfully to your email!", ToastAndroid.SHORT);
      } else {
        const errorMessage = responseData?.message || 'Something went wrong. Please try again.';
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        // setError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to send verification email.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }

  };

  const handleLinkeingResend = async () => {
    setLoading(true);
    console.log("handleLinkeingResend");

    const cleared = Array(value.length).fill("");
    setValue(cleared);
    inputRefs.current[0]?.focus();
    setTimer(45);
    setIsDisabled(true);

    try {
      const phoneNumber = await AsyncStorage.getItem("phoneNumber")
      const Email = await AsyncStorage.getItem("email");

      const response = await fetch(ENDPOINTS.linkedRequest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhoneNo: phoneNumber || Email,
        }),
      });

      const data = await response.json();
      console.log("Linked response:", data);
    } catch (error) {
      console.error('Error fetching API:', error);
    } finally {
      setLoading(false);
    }
  };

 const handleVerification = async () => {
  console.log("handleVerification");
  setLoading(true);
 
  const code = value.join("").trim();
 
  if (code.length !== 6) {
    setLoading(false);
    setError("Please enter a valid 6-digit code");
    return;
  }
 
  try {
    startSpin();
 
    const phone = phonenumber || RegisterNumber;
 
    const response = await fetch(ENDPOINTS.verifyValidation(phone, code), {
      method: "POST",
    });
 
    let responseData = {};
    const text = await response.text();
    try {
      responseData = text ? JSON.parse(text) : {};
    } catch {
      responseData = { message: text };
    }
 
    console.log(responseData, "responseData-verification");
 
    if (response.ok) {
      // If RegisterNumber exists, run handleRegister()
      if (RegisterNumber) {
        const { success, message } = await handleRegister();
 
        if (success) {
          ToastAndroid.show("Sign-in successful", ToastAndroid.SHORT);
          navigation.navigate("Mapsearch");
        } else {
          console.log("Registration failed:", message);
          ToastAndroid.show(message || "Registration failed", ToastAndroid.SHORT);
          setError(message || "Registration failed");
        }
      } else {
        // Only verification when phonenumber is used
        ToastAndroid.show("Sign-in successful", ToastAndroid.SHORT);
        navigation.navigate("Mapsearch");
      }
    } else {
      const errorMessage = responseData?.error || "Verification failed.";
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      setError(errorMessage);
    }
  } catch (error) {
    console.error("Verification error:", error);
    const errorMessage = error?.message || "Unable to verify OTP!";
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};



  const handleLinkeing = async () => {
    console.log("handlekinking")
    const code = value.join('');

    if (code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    if (value.every((digit) => digit.trim() === '')) {
      setError("Code cannot be empty");
      return;
    }

    startSpin();
    setLoading(true);

    try {
      const response = await fetch(ENDPOINTS.linkedSendOTP(phonenumber, value), {
        method: 'POST',
      });

      const responseData = await response.json();

      if (response.ok) {
        // You can navigate or show a success message here if needed
        ToastAndroid.show(responseData?.message || "Verification to Link.", ToastAndroid.SHORT);
        navigation.navigate('Mapsearch');
      } else {
        const errorMessage = responseData?.message || 'Verification failed.';
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.message || 'Unable to verify OTP!';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleExit = () => {
    setShowModal(false);
    navigation.goBack();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const backAction = () => {
      const now = Date.now();

      if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
        navigation.goBack(); // or BackHandler.exitApp() to exit app
        return true;
      }

      lastBackPressed.current = now;
      ToastAndroid.show("Press back again to go back", ToastAndroid.SHORT);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);


  const handleEmailverfication = async () => {
    console.log("emailverfication")
    if (value.join('').length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }
    if (value.length >= 6 && value !== "") {
      startSpin()
      setLoading(true)
      try {
        // Get the dynamic URL from ENDPOINTS.verifyToken
        const url = ENDPOINTS.verifyToken(value.join("")); // Pass the token as 'value'

        // Send GET request with token in the URL
        const response = await fetch(url, {
          method: "GET",
        });

        const responseData = await response.json();

        if (response.status === 200) {
          navigation.navigate("Resetpassword", { token: value.join("") });
          ToastAndroid.show("Code verified succesfully", ToastAndroid.SHORT);
        } else {
          const errorMessage = responseData?.message || "Something went wrong. Please try again.";
          ToastAndroid.show(responseData?.message || "Something went wrong. Please try again.", ToastAndroid.SHORT);
        }
      } catch (error) {
        const errorMessage = error?.message || "Failed to send verification email.";

        setError(errorMessage); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <SafeAreaView style={flex = 1}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, padding: wp(1) }}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Image source={klassride} style={styles.logo} />

          <Text style={styles.text}>VERIFICATION CODE</Text>
          <Text style={styles.text3}>
            We sent a 6-digit code to{" "}
            <Text style={{ color: "white", fontFamily: fonts.montseratBold, }}>
              <Text style={styles.codenumber}>{formattedContact}</Text>
            </Text>

          </Text>

          {/* OTP Input Boxes */}
          <ImageBackground source={Blue} style={styles.ImageBackground}>
            <View style={styles.inputContainer}>
              {value.map((digit, index) => (
                <LinearGradient
                  key={index}
                  colors={["#FF6200", "#4800AC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0.3 }}
                  style={styles.inputGradient}
                >
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.input}
                    value={digit}
                    maxLength={1}
                    keyboardType="number-pad"
                    onChangeText={(text) => {
                      handleChange(text, index);
                      setError("");
                    }}
                    onKeyPress={(event) => handleBackSpace(event, index)}
                  />
                </LinearGradient>
              ))}
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={phoneValidation ? handlephoneResend : isEmailVerification ? handleEmailResend : LinkingVerification ? handleLinkeingResend : handleResend}
              disabled={isDisabled}>
              <Text style={styles.text4}>
                <Text style={{ color: "white", fontFamily: fonts.montseratRegular, }}>Didn't get the code?</Text>{" "}
                <Text style={[styles.code, { color: isDisabled ? "grey" : "#FF8336" }]} >
                  Resend
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Timer */}
            <Text style={styles.timer}>
              {isDisabled ? `00:${String(timer).padStart(2, '0')}` : ""}
            </Text>
            <View >
              {error && (
                <View >
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={isEmailVerification ? handleEmailverfication : LinkingVerification ? handleLinkeing : handleVerification}>
              <LinearGradient
                colors={["#FF6200", "#4800AC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.OTPbutton}>Verify now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ImageBackground>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Add Card via</Text>
            <LinearGradient
              colors={["#FF6200", "#4800AC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.imageBorder}
            >
              <View style={styles.imageBorderInner}>
                <Image source={netaImage} style={styles.netaImage} />
              </View>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: wp(20),
  },
  logo: {
    width: width * 0.8,
    height: height * 0.10,
    // marginBottom: 0,
    resizeMode: "contain",
    position: 'fixed',
  },
  // ImageBackground:{
  //   width:wp(100),
  //   // height:hp(30),
  //   position:"relative",
  //   // marginTop:wp(20),
  //   resizeMode: "contain",
  //   borderRadius:30,
  // },
  text: {
    color: "white",
    textAlign: "center",
    marginBottom: 1,
    marginVertical: 50,
    fontSize: wp(6),
    fontFamily: fonts.montseratBold,
  },
  text3: {
    color: "#d1d1d1",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: fonts.montseratRegular,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: wp(4),
  },
  // ImageBackground:{
  //   width:wp(100),
  //   height:hp(30)
  // },
  inputGradient: {
    borderRadius: 10,
    marginHorizontal: wp(1.5),
    height: height * 0.07,
    width: width * 0.12,
    textAlign: 'center',
  },
  input: {
    // width: "100%",
    // height: "100%",
    textAlign: "center",
    fontSize: wp(7.5),
    color: "#ffffff",
    backgroundColor: "transparent",
    fontWeight: 'bold',
    fontFamily: fonts.montseratBold,
  },
  button: {
    borderRadius: 25,
    width: width * 0.6,
    height: height * 0.06,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: wp(7)
  },



  OTPbutton: {
    color: "#ffffff",
    fontSize: width * 0.05,
    fontWeight: "bold",
    fontFamily: fonts.montseratBold,
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    marginTop: 40,
  },
  footerText: {
    color: "white",
    fontSize: width * 0.04,

    // fontFamily: "Montserrat-Regular",
  },
  imageBorder: {
    borderRadius: 28,
    padding: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6200",
    width: width * 0.55,
    height: height * 0.12,
    marginTop: 6
  },
  imageBorderInner: {
    borderRadius: 28,
    backgroundColor: "#000",
    padding: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  netaImage: {
    width: width * 0.35,
    height: width * 0.35,
    // borderRadius: 60,
    resizeMode: "contain",
  },
  text4: {
    color: "white",
    fontSize: width * 0.04,
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },
  code: {
    textDecorationLine: "underline",
  },
  timer: {
    color: "white",
    fontSize: width * 0.04,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },
  // errorContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",




  // },
  errorContainer: {
    position: "absolute",  // Absolute positioning for the container
    top: height * 0.5,     // Adjust the top position for where you want the error to appear
    left: 0,               // Align it to the left
    right: 0,              // Stretch it across the screen width
    justifyContent: "center",  // Center the error text horizontally
    alignItems: "center",
    // marginBottom:10,     // Center the error text vertically
  },

  errorText: {
    color: "red",
    fontSize: width * 0.04,
    fontFamily: fonts.montseratRegular,
    // padding: 10,           // Padding around the error text for spacing
    textAlign: "center",   // Ensure the text is centered
    // marginTop: 40,
    // position: "absolute", 
  },

  // errorText: {
  //   color: "red",
  //   fontSize: width * 0.04,
  //   fontFamily: "Montserrat-Regular",
  //   position: "absolute",
  //   padding: 10,  // Add padding for space around the error text
  //   marginTop: 80,  // Optionally, add margin-top to adjust vertical positioning
  // },

  // errorText: {
  //   color: "red",
  //   fontSize: width * 0.04,
  //   // marginRight: 10,

  //   fontFamily: "Montserrat-Regular",
  //   position:"absolute",

  // },
});
