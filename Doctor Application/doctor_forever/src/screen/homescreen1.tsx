// src/screens/HomeScreen.tsx
import React, { useState,useCallback,useMemo,useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../screen/navigation/AppNavigator";
import { wp, hp } from "./constants/responsive";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen1: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

   const handleOpenBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
    bottomSheetRef.current?.close();
  }, []);


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#947cf7ff", "#ffffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.searchcontainer}
      >
      {/* <View style={styles.searchcontainer}> */}
        <View style={styles.header}>
        <View style={styles.headername}>
        <MaterialCommunityIcons name="account-heart" size={25} color="black" />
        <Text>user name</Text>
        </View>
        <View style={styles.location}> 
        <View style={styles.headername}>
        <MaterialIcons name="location-on" size={18} color="black" />
        <Text>chennai</Text>
        <AntDesign name="right" size={15} color="#5D3FD3" />
        </View>
        </View>
      </View>
        <View style={styles.searchbox}>
          <Ionicons name="search" size={25} color="#bfbfbf" />
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.categorycontainer}>
          <TouchableOpacity style={styles.category} onPress={handleOpenBottomSheet}>
            <Image source={require('../../asset/image/human.png')} style={styles.categoryimage} />
            <Text>Human</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category} onPress={handleOpenBottomSheet}>
            <Image source={require('../../asset/image/sidha.png')} style={styles.categoryimage} />
            <Text>sidha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category} onPress={handleOpenBottomSheet}>
            <Image source={require('../../asset/image/vetnary.png')} style={styles.categoryimage} />
            <Text>vetnary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category} onPress={handleOpenBottomSheet}>
            <Image source={require('../../asset/image/vetnary.png')} style={styles.categoryimage} />
            <Text>car</Text>
          </TouchableOpacity>
        </View>
      {/* </View> */}
      </LinearGradient>
       <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleCloseBottomSheet}
        backgroundStyle={{ backgroundColor: "#fff" }}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Choose an Option</Text>
          <TouchableOpacity
            style={styles.optionButton}
            // onPress={() => {
            //   handleCloseBottomSheet();
            //   navigation.navigate(""); // example navigation
            // }}
          >
            <Text style={styles.optionText}>Go to Next Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            // onPress={() => {
            //   handleCloseBottomSheet();
            //   navigation.navigate(""); // example navigation
            // }}
          >
            <Text style={styles.optionText}>Go to Next Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            // onPress={() => {
            //   handleCloseBottomSheet();
            //   navigation.navigate(""); // example navigation
            // }}
          >
            <Text style={styles.optionText}>Go to Next Page</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleCloseBottomSheet}>
            <Text style={styles.optionText}>Close</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  //   title: {
  //     fontSize: 30,
  //     color: "#fff",
  //     fontWeight: "bold",
  //     marginBottom: 20,
  //   },
  //   button: {
  //     backgroundColor: "#1DB954",
  //     paddingVertical: 14,
  //     paddingHorizontal: 40,
  //     borderRadius: 30,
  //   },
  //   buttonText: {
  //     color: "#fff",
  //     fontSize: 18,
  //     fontWeight: "600",
  //   },
  searchcontainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    padding: wp(3),

  },
  searchbox: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#8c8c8c",
    borderWidth: 1.5,
    width: wp(95),
    backgroundColor: "#e6e6e6",
    paddingHorizontal: wp(5),
    borderRadius: 8,
  },
  categorycontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // width: wp(100),
    padding: wp(1),
    alignSelf: "center",
    gap: wp(2),
  },
  category: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: wp(4),
    borderRadius: 20,
    boxShadow: '10px 4px 16px #00000029',
    width: wp(30),
    // height:hp(7),
  },
  categoryimage: {
    width: wp(15),
    height: hp(7),
    resizeMode: "contain"
  },
  header:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    width:wp(95),
    marginBottom:hp(2)
  },
  headername:{
    flexDirection:"row",
    alignItems:"center",
    gap:wp(1)
  },
  location:{
    padding:wp(1),
    backgroundColor:"#e6e6e6",
    borderRadius:wp(5),
  },
   bottomSheetContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
   optionButton: {
    backgroundColor: "#5D3FD3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
});
