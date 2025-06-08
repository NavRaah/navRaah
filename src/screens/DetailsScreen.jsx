import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DetailsScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.containerText}>Details Screen</Text>
      <TouchableOpacity style={styles.btn}>
          <Text onPress={()=>navigation.goBack()} style={styles.btnText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1 ,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerText : {
    fontSize: 24,
  },
  btn: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
  },
  btnText: {
    color: 'white'
  },
});