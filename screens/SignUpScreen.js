import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState(null);

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const handleImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        if (!username || !password || !imageUri) {
            setErrorMessage("Please fill in all fields.");
            setModalVisible(true);
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('avatar', {
            uri: imageUri,
            type: 'image/png',
            name: 'avatar.png',
        });

        try {
            const response = await axios.post('http://192.168.1.13:3001/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setErrorMessage("");
                setModalVisible(true);
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Registration failed');
            } else {
                setErrorMessage('Network error');
            }
            setModalVisible(true);
        }
    };

    return (
        <LinearGradient
            colors={["#6A11CB", "#ADD8E6"]}
            style={styles.container}
        >
            <Text style={styles.title}>Create Account</Text>

            <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePicker}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                ) : (
                    <MaterialIcons name="account-circle" size={100} color="#fff" />
                )}
            </TouchableOpacity>

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
                

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.footerLink} onPress={() => navigation.navigate("LoginScreen")}>
                    Log in
                </Text>
            </Text>

            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{errorMessage || "Registration Successful"}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 28,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 10,
    },
    avatarContainer: {
        marginVertical: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
    },
   passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
      
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 25,
        paddingHorizontal: 15,
        color: "#fff",
        marginBottom: 15,
    },
    
    inputpassword: {
        //width: "100%",
        flex: 1,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
        color: "#fff",
        marginVertical: 10,
        borderColor: '#fff',
        borderWidth: 1,
      },
    showPasswordIcon: {
        position: 'absolute',
        right: 10,
        padding: 10,
      },

    registerButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
    },
    buttonText: {
        color: "#2575FC",
        fontWeight: "bold",
    },
    footerText: {
        color: "#fff",
        fontSize: 14,
        marginTop: 20,
    },
    footerLink: {
        color: "#FFD700",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        color: '#2575FC',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
    modalButton: {
        padding: 10,
        backgroundColor: '#2575FC',
        borderRadius: 5,
    },
});
