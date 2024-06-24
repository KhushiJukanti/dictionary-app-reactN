

// // App.js
// import React, { useState } from 'react';
// import { StyleSheet, Text, View, ImageBackground, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
// // import Camera from './components/Camera'; // Import the Camera component without braces
// import CameraS from './components/Camera';
// import Display from './components/Display';

// function App() {
//   const [cameraVisible, setCameraVisible] = useState(false);


//   const toggleCamera = () => {
//     setCameraVisible(!cameraVisible);
//   };

//   const goBack = () => {
//     setCameraVisible(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ImageBackground
//         source={require('./assets/Back.jpg')}
//         style={styles.backgroundImage}
//       >

//           {cameraVisible ? (
//             <View style={styles.cameraContainer}>
//             <CameraS goBack = {goBack}/>
//           </View>
//           ) : (
//             <TouchableOpacity onPress={toggleCamera} style={styles.button}>
//               <Text style={styles.buttonText}>Open Camera</Text>
//             </TouchableOpacity> 
//           )}
//           {!cameraVisible && (
//           <View style={styles.displayContainer}>
//             <Display />
//           </View>
//         )}

//       </ImageBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     marginTop:0,
//     justifyContent: 'top',
//     alignItems: 'center',
//   },
//   // overlay: {
//   //   backgroundColor: 'rgba(255, 255, 255, 0.5)',
//   //   padding: 5,
//   //   borderRadius: 30,
//   // },
//   cameraContainer: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   button: {
//     marginTop:50,
//     backgroundColor: '#33ccff',
//     padding: 10,
//     position: 'absolute',
//     borderRadius: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   displayContainer: {
//     marginTop: 200, // Ensure there's space between the button and the display

//     alignItems: 'center',
//   },
// });
// export default App;



// App.js file 

import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  ImageBackground,
  View,
  Button,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Display from "./components/Display";


export default function App() {

  // State to hold the selected image 
  const [image, setImage] = useState(null);

  // State to hold extracted text 
  const [extractedText, setExtractedText] = useState("");


  // Function to pick an image from the  
  // device's gallery 
  const pickImageGallery = async () => {
    let result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        allowsMultipleSelection: false,
      });
    if (!result.canceled) {

      // Perform OCR on the selected image 
      performOCR(result.assets[0]);

      // Set the selected image in state 
      setImage(result.assets[0].uri);
    }
  };



  // Function to capture an image using the 
  // device's camera 
  const pickImageCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {

      // Perform OCR on the captured image 
      // Set the captured image in state 
      performOCR(result.assets[0]);
      setImage(result.assets[0].uri);
    }
  };


  const performOCR = (file) => {
    let myHeaders = new Headers();
    myHeaders.append(
      // ADDD YOUR API KEY HERE 
      "apikey", "FEmvQr5uj99ZUvk3essuYb6P5lLLBS20"
    );
    myHeaders.append(
      "Content-Type",
      "multipart/form-data"
    );

    let raw = file;
    let requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: myHeaders,
      body: raw,
    };

    // Send a POST request to the OCR API 
    fetch(
      "https://api.apilayer.com/image_to_text/upload",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {

        // Set the extracted text in state 
        setExtractedText(result["all_text"]);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          source={require('./assets/Back.jpg')}
          style={styles.backgroundImage}
          imageStyle={{ resizeMode: 'cover' }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.heading2}>ALIF</Text>
            <TouchableOpacity onPress={pickImageGallery} style={styles.button}>
              <Text style={styles.buttonText}>Pick an image from gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImageCamera} style={styles.button}>
              <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  width: 350,
                  height: 300,
                  resizeMode: 'contain',
                  marginBottom: 20,
                }}
              />
            )}
            <Text style={styles.text1}>Extracted text:</Text>
            <Text style={styles.text1}>{extractedText}</Text>
            {/* Add Display component */}
            <View style={styles.displayContainer}>
              <Display extractedText={extractedText} />
              {/* Replace with your Display component */}
            </View>
          </View>
          <StatusBar style="auto" />
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    marginTop: 550
  },
  heading2: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text1: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  displayContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});