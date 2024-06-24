// // Camera.js
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import React, { useState } from 'react';
// import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// function Camera() {
//   const [facing, setFacing] = useState('back');
//   const [permission, requestPermission] = useCameraPermissions();

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} facing={facing}>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//             <Text style={styles.text}>Flip Camera</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems:'center'
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,

//     backgroundColor: 'transparent',
//     margin: 115,
//   },
//   button: {
//     flex: 1,
//     justifyContent:'flex-end',
//     alignSelf: 'flex-start',
//     alignItems: 'end',
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// });
// export default Camera;





// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, SafeAreaView, Button, Image, Platform, TouchableOpacity } from 'react-native';
// import { useEffect, useRef, useState } from 'react';

// import { Camera, CameraView } from 'expo-camera';
// import { shareAsync } from 'expo-sharing';
// import * as MediaLibrary from 'expo-media-library';

// export default function CameraS({ goBack }) {
//   let cameraRef = useRef();
//   const [hasCameraPermission, setHasCameraPermission] = useState();
//   const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
//   const [photo, setPhoto] = useState();

//   useEffect(() => {
//     (async () => {
//       const cameraPermission = await Camera.requestCameraPermissionsAsync();
//       const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
//       setHasCameraPermission(cameraPermission.status === "granted");
//       setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
//     })();
//   }, []);

//   if (hasCameraPermission === undefined) {
//     return <Text>Requesting permissions...</Text>;
//   } else if (!hasCameraPermission) {
//     return <Text>Permission for camera not granted. Please change this in settings.</Text>;
//   }

//   let takePic = async () => {
//     let options = {
//       quality: 1,
//       base64: true,
//       exif: false
//     };

//     let newPhoto = await cameraRef.current.takePictureAsync(options);
//     setPhoto(newPhoto);
//   };



//   if (photo) {
//     let sharePic = () => {
//       shareAsync(photo.uri).then(() => {
//         setPhoto(undefined);
//       });
//     };

//     let savePhoto = () => {
//       MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
//         setPhoto(undefined);
//       });
//     };

//     return (
//       <SafeAreaView style={styles.container}>
//         <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
//         <Button title="Share" onPress={sharePic} />
//         {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
//         <Button title="Discard" onPress={() => setPhoto(undefined)} />
//         <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
//           <Text style={styles.buttonText}>Go Back</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   return (

//       <CameraView style={styles.camera} ref={cameraRef}>
//         <View style={styles.buttonContainer}>
//           <Button title="Take Pic" onPress={takePic} />

//         </View>
//         <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
//         <Text style={styles.buttonText}>Go Back</Text>
//       </TouchableOpacity>
//         <StatusBar style="auto" />
//       </CameraView>


//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,

//     //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//   },
//   buttonContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     padding: 20, // optional: to add some padding at the bottom
//   },
//   preview: {
//     alignSelf: 'stretch',
//     flex: 1,
//   },
//   goBackButton: {
//     position: 'absolute',
//     top: 20,
//     left: 10,

//     padding: 5,
//     color: '#fff',

//   },
//   buttonText: {
//     fontSize: 15,
//     color: '#fff',
//   },
// });





// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, SafeAreaView, Button, Image, Platform, TouchableOpacity, StatusBar as RNStatusBar } from 'react-native';
// import { useEffect, useRef, useState } from 'react';
// import { CameraView, Camera } from 'expo-camera';
// import { shareAsync } from 'expo-sharing';
// import * as MediaLibrary from 'expo-media-library';
// import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// export default function CameraS({ goBack }) {
//   let cameraRef = useRef();
//   const [hasCameraPermission, setHasCameraPermission] = useState();
//   const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
//   const [photo, setPhoto] = useState();

//   useEffect(() => {
//     (async () => {
//       const cameraPermission = await Camera.requestCameraPermissionsAsync();
//       const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
//       setHasCameraPermission(cameraPermission.status === "granted");
//       setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
//     })();
//   }, []);

//   if (hasCameraPermission === undefined) {
//     return <Text>Requesting permissions...</Text>;
//   } else if (!hasCameraPermission) {
//     return <Text>Permission for camera not granted. Please change this in settings.</Text>;
//   }

//   let takePic = async () => {
//     let options = {
//       quality: 1,
//       base64: true,
//       exif: false
//     };

//     let newPhoto = await cameraRef.current.takePictureAsync(options);
//     const croppedImage = await manipulateAsync(
//       newPhoto.uri,
//       [{ crop: { originX: 0, originY: 0, width: newPhoto.width, height: newPhoto.height * 0.8 } }], // Adjust cropping parameters as needed
//       { compress: 1, format: SaveFormat.PNG }
//     );
//     setPhoto(croppedImage);
//   };



//   if (photo) {
//     let sharePic = () => {
//       shareAsync(photo.uri).then(() => {
//         setPhoto(undefined);
//       });
//     };

//     // let savePhoto = async () => {
//     //   const croppedImage = await manipulateAsync(
//     //     photo.uri,
//     //     [{ crop: { originX: 0, originY: 0, width: photo.width, height: photo.height * 0.8 } }], // Adjust cropping parameters as needed
//     //     { compress: 1, format: SaveFormat.PNG }
//     //   );
//     //   await MediaLibrary.saveToLibraryAsync(croppedImage.uri);
//     //   setPhoto(undefined);
//     // };

//     let savePhoto = async () => {
//       await MediaLibrary.saveToLibraryAsync(photo.uri);
//       setPhoto(undefined);
//     };

//     return (
//       <SafeAreaView style={styles.container}>
//         <Image style={styles.preview} source={{ uri: photo.uri }} />
//         <Button title="Share" onPress={sharePic} />
//         {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
//         <Button title="Discard" onPress={() => setPhoto(undefined)} />
//         <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
//           <Text style={styles.buttonText}>Go Back</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <CameraView style={styles.camera} ref={cameraRef}>
//       <View style={styles.buttonContainer}>
//         <Button title="Take Pic" onPress={takePic} />
//       </View>
//       <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
//         <Text style={styles.buttonText}>Go Back</Text>
//       </TouchableOpacity>
//       <StatusBar style="auto" />
//     </CameraView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//   },
//   buttonContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     padding: 10, // optional: to add some padding at the bottom
//   },
//   preview: {
//     alignSelf: 'stretch',
//     flex: 1,

//   },
//   goBackButton: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     backgroundColor: '#33ccff',
//     padding: 10,
//     borderRadius: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
// });




import React, { useState, useEffect, useRef } from 'react';
import { Button, Image, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Platform, Alert, StatusBar as RNStatusBar } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
// import * as ImageManipulator from 'expo-image-manipulator';
import { StatusBar } from 'expo-status-bar';
import { RNTesseractOcr } from 'react-native-tesseract-ocr';
import NetInfo from "@react-native-community/netinfo";

export default function CameraS({ goBack }) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === null) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>;
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    performOCR(newPhoto.base64);
  };

  const savePhoto = async () => {
    if (photo) {
      try {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        await MediaLibrary.createAlbumAsync('Expo', asset, false);
        Alert.alert('Photo saved!', 'Your photo has been saved to the gallery.');
      } catch (error) {
        console.error('Error saving photo:', error);
        Alert.alert('Error', 'Failed to save photo. Please try again.');
      }
    }
  };

  const sharePic = async () => {
    await shareAsync(photo.uri);
  };

  const discardPhoto = () => {
    setPhoto(null);
    setRecognizedText('');
  };

  const performOCR = async (base64) => {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        Alert.alert('No internet connection', 'Please connect to the internet to use OCR.');
        return;
      }

      const lang = 'eng'; // Language for OCR
      const tesseractOptions = {
        whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // Whitelist characters to improve OCR accuracy
      };

      const recognizedText = await RNTesseractOcr.recognize(base64, lang, tesseractOptions);
      setRecognizedText(recognizedText);
    } catch (error) {
      console.error('Error performing OCR:', error);
      Alert.alert('Error', 'Failed to recognize text. Please try again.');
    }
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        {recognizedText ? <Text style={styles.recognizedText}>{recognizedText}</Text> : null}
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission && <Button title="Save" onPress={savePhoto} />}
        <Button title="Discard" onPress={discardPhoto} />
        <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <CameraView style={styles.camera} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
      <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
  },
  recognizedText: {
    fontSize: 16,
    margin: 10,
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#33ccff',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
