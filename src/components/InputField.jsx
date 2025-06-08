import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputField = ({ label, placeholder, secureTextEntry, value, onChangeText }) => (
  <View style={styles.cont}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
      placeholderTextColor="#888"
    />
  </View>
);

const styles = StyleSheet.create({
  cont: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    color: 'black',
  },
  label:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default InputField;
