import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TextInput, Button, Picker, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import Tesseract from 'tesseract.js';

const DisplayResult = ({ image }) => {
  const [recognizedText, setRecognizedText] = useState('');
  const [inputText, setInputText] = useState('');
  const [meanings, setMeanings] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const fetchMeanings = useCallback(async (text) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/dictionary/meaning/${text.toLowerCase()}?language=${selectedLanguage}`);
      setMeanings(response.data.meanings);
    } catch (error) {
      console.error('Error fetching meanings:', error);
    }
  }, [selectedLanguage]);

  const recognizeText = async (image) => {
    try {
      const { data: { text } } = await Tesseract.recognize(image, 'eng', {
        logger: (m) => m,
      });
      return text;
    } catch (error) {
      console.error('Error recognizing text:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (image) {
      recognizeText(image).then((text) => {
        setRecognizedText(text);
        fetchMeanings(text);
      }).catch((err) => {
        console.error('Error recognizing text:', err);
      });
    }
  }, [image, fetchMeanings]);

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleFormSubmit = () => {
    setRecognizedText(inputText);
    fetchMeanings(inputText);
  };

  const handleLanguageChange = (itemValue) => {
    setSelectedLanguage(itemValue);
    if (recognizedText) {
      fetchMeanings(recognizedText);
    } else if (inputText) {
      fetchMeanings(inputText);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Recognized Text</Text>
        <Text>{recognizedText}</Text>
      </View>
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
      <Button title="Get Meaning" onPress={handleFormSubmit} />
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  meaningsContainer: {
    marginTop: 16,
  },
});

export default DisplayResult;
