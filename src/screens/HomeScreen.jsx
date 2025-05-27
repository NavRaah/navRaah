import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Text style={styles.containerText}>Hello Yaswant !! </Text>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText} onPress={()=>navigation.navigate('details')}>Go to details page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1 ,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerText : {
    fontSize: 24
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

export default HomeScreen