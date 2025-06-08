import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const UserHome = () => {
    const navigation = useNavigation();
    const {logout} = useContext(AuthContext);
    const logoutHandler = () => {
        try {
            logout();
            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Logout Success',
                    text2: 'Logout successfully',
                  });
            }, 1000);
            navigation.navigate('home');
        } catch (error) {
            setTimeout(() => {
                Toast.show({
                    type: 'error',
                    text1: 'Something went wrong',
                    text2: error?.message || 'PLease check...',
                  });
            }, 1000);
        }
    };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>UserHome</Text>
      <TouchableOpacity style={styles.btn} onPress={logoutHandler}>
        <Text style={styles.btnTxt}>Logout</Text>
      </TouchableOpacity>
      <Toast/>
    </View>
  );
};

export default UserHome;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        fontSize: 32,
        fontWeight:'bold',
    },
    btn:{
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'red',
        borderRadius: 10,
    },
    btnTxt:{
        fontSize:20,
        color:'white',
        fontWeight:'semibold',
    },
});
