// src/screens/WelcomeScreen.tsx
import React ,{useRef,useEffect,useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity,Animated,FlatList,Image,Dimensions,PanResponder } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../screen/navigation/AppNavigator";
import {wp,hp} from "./constants/responsive";
import { PanGestureHandler } from "react-native-gesture-handler";
import Ionicons from 'react-native-vector-icons/Ionicons';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Welcome">;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
    const messages = [
    "Welcome to HealthyCare",
    "Your journey to better health starts here.",
    "Stay active, eat well, and live happy!",
    ];
    const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const welcomeimage = require('../../asset/image/doc.png');
    useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % messages.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

const translateX = useRef(new Animated.Value(0)).current;
const SCREEN_WIDTH = Dimensions.get("window").width;

 const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: translateX }
      ], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState:any) => {
        if (gestureState.dx > SCREEN_WIDTH * 0.4) {
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH - 100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            navigation.navigate("Home");
            translateX.setValue(0);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
    <Image source={welcomeimage} style={{width:wp(90),height:hp(50),resizeMode:"contain",position:"absolute",top:hp(10)}} />
    <View style={styles.welcomeContainer}> 
      <Text style={styles.title}> Hello Care </Text>
       <FlatList
        ref={flatListRef}
        data={messages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, { width: wp(90) }]}>
            <Text style={styles.subtitle}>{item}</Text>
          </View>
        )}
      />
      <View style={styles.dotsContainer}>
        {messages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { opacity: i === index ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
         <View style={styles.button}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.iconWrapper, { transform: [{ translateX }] }]}
        >
          <Ionicons name="arrow-forward-circle" size={40} color="white" />
        </Animated.View>
        <Text style={styles.buttonText}>Swipe to Start</Text>
      </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: wp(4),
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop:hp(70),
    backgroundColor:"#fff",
    padding:wp(4),
    borderRadius:20,
    boxShadow: '10px 4px 16px #00000029',
  },
  messageContainer:{
    justifyContent: "center", 
    alignItems: "center" 
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
    margin: wp(3),
  },
  title: {
    fontSize: 32,
    color: "#004c65ff",
    fontWeight: "bold",
    // marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    // marginBottom: 40,
  },
  button: {
    backgroundColor: "#5D3FD3",
    paddingVertical: 14,
    // paddingHorizontal: 40,
    borderRadius: 10,
    width:wp(90),
    
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
    textAlign:"center"
  },
  buttoncontainer:{
    // flex: 1,
justifyContent: "center",
alignItems: "center",
  },
  iconWrapper: {
position: "absolute",
left: 10,
zIndex: 2,
},
  
});
