import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';


const Display = ({ extractedText }) => {
  // const [extractedText, setExtractedText] = useState('');
  const [inputText, setInputText] = useState('');
  const [meanings, setMeanings] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');




  const fetchMeanings = useCallback(async (text) => {
    try {
      const response = await axios.get(`http://192.168.168.122:7000/api/dictionary/meaning/${text.toLowerCase()}?language=${selectedLanguage}`);
      // const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`);
      setMeanings(response.data.meanings);
    } catch (error) {
      console.error('Error fetching meanings:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (extractedText) {
      fetchMeanings(extractedText);
    }
  }, [extractedText, selectedLanguage, fetchMeanings]);

  // const recognizeText = async (imageUri) => {
  //   try {
  //     const { data: { text } } = await Tesseract.recognize(imageUri, 'eng', {
  //       logger: (m) => console.log(m),
  //     });
  //     return text;
  //   } catch (error) {
  //     console.error('Error recognizing text:', error);
  //     throw error;
  //   }
  // };

  // useEffect(() => {
  //   if (image) {
  //     recognizeText(image).then((text) => {
  //       setRecognizedText(text);
  //       fetchMeanings(text);
  //     }).catch((err) => {
  //       console.error('Error recognizing text:', err);
  //     });
  //   }
  // }, [image, fetchMeanings]);

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleFormSubmit = () => {
    // setRecognizedText(inputText);
    fetchMeanings(inputText);
  };

  const handleLanguageChange = (itemValue) => {
    setSelectedLanguage(itemValue);
    if (extractedText) {
      fetchMeanings(extractedText);
    } else if (inputText) {
      fetchMeanings(inputText);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Recognized Text</Text>
        <Text>{recognizedText}</Text>
      </View> */}
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={handleInputChange}
        placeholder="Enter a word"
      />
      <Picker
        selectedValue={selectedLanguage}
        style={styles.picker}
        onValueChange={handleLanguageChange}
      >
        <Picker.Item label="English" value="English" />
        <Picker.Item label="Telugu" value="Telugu" />
        <Picker.Item label="Hindi" value="Hindi" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
        <Text style={styles.buttonText}>Get Meaning</Text>
      </TouchableOpacity>
      <View style={styles.meaningsContainer}>
        <Text style={styles.title}>Meanings</Text>
        {meanings.length > 0 ? (
          meanings.map((meaning, index) => (
            <Text key={index}>{meaning}</Text>
          ))
        ) : (
          <Text>No meanings found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  textContainer: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  meaningsContainer: {
    marginTop: 16,
  },
});

export default Display;
