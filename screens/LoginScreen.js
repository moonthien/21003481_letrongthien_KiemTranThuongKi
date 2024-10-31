import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  

  const toggleRememberMe = () => {
    setIsRememberMe(!isRememberMe);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.100.170:3001/login', {
        username,
        password,
      });
      if (response.status === 200) {
        navigation.navigate("Screen_01", { user: response.data.user });
      } else {
        setModalMessage(response.data.message);
        setModalVisible(true);
      }
    } catch (error) {
      if (error.response) {
        setModalMessage(error.response.data.message);
        setModalVisible(true);
      } else {
        setModalVisible(true);
      }
    }
  };

  const handleSignUpNavigation = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <LinearGradient
      colors={["#6A11CB", "#ADD8E6"]}
      style={styles.container}
    >
      <View style={styles.curvedHeader}>
        <Text style={styles.title}>Welcome! Login</Text>
      </View>

      <TextInput
        style={[styles.input, { marginTop: 40 }]}
        placeholder="Username"
        placeholderTextColor="#ffffff"
        value={username}
        onChangeText={setUsername}
       
      />

<View style={styles.passwordContainer}>
      <TextInput
          style={styles.inputpassword}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          placeholderTextColor="#ffffff"
          value={password}
          onChangeText={setPassword}
        />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.showPasswordIcon}>
          <MaterialIcons
            name={isPasswordVisible ? "visibility-off" : "visibility"}
            size={24}
            color="#ACB5BB"
          />
        </TouchableOpacity>  
      </View>      
       <View style={styles.rememberForgotContainer}>
        <TouchableOpacity
          onPress={toggleRememberMe}
          style={styles.checkboxContainer}
        >
          <View style={[styles.checkbox, isRememberMe && styles.checkboxChecked]}>
            {isRememberMe && (
              <MaterialIcons
                name="check"
                size={10}
                color="#FFFFFF"
                style={styles.checkIcon}
              />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </TouchableOpacity>

      </View> 

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Modal 
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={handleSignUpNavigation}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{ uri: "https://companieslogo.com/img/orig/GOOG-0ed88f7c.png" }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{ uri: "https://companieslogo.com/img/orig/FB-2d2223ad.png" }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 140,
    alignItems: "center",
  },
  curvedHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 150,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1
  },
  title: {
    fontSize: 30,
    color: "#6A11CB",
    fontWeight: "bold",
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#ffffff",
    marginVertical: 10,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  inputpassword: {
    //width: "100%",
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#ffffff",
    marginVertical: 10,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  showPasswordIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#B4B4B4',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#494948',
  },
  checkIcon: {
    marginTop: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#fff',
  },
  forgotPassword: {
    alignItems: "flex-end",
  },
  linkText: {
    color: "#ffffff",
    fontSize: 14,
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6A11CB",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signUpText: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  socialContainer: {
    width: "100%",
    marginTop: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialText: {
    fontSize: 16,
    color: "#6A11CB",
  },

});
