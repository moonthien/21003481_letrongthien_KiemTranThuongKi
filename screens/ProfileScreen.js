import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user;
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://192.168.100.170:3001/delete-account', {
        data: { username: user.username }
      });

      if (response.status === 200) {
        setModalMessage(response.data.message);
        setModalVisible(true);
      }
    } catch (error) {
      setModalMessage(error.response ? error.response.data.message : 'An error occurred');
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate("LoginScreen");
  };
  const handleLogout = () => {
    // Nếu có xử lý logout khác, thêm vào đây
    navigation.navigate("SignUpScreen");
  };

  return (
    <View style={styles.container}>
      <Ionicons name="arrow-back" size={24} color="black" style={styles.backIcon} onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileImageContainer}>
        <Image
          source={user && user.avatar ? { uri: `http://192.168.100.170:3001/uploads/${user.avatar}` } : require('../assets/3gach.png')}
          style={styles.profileImage}
        />
      </View>
      <Text style={styles.name}>{user.username}</Text>

      {/* <View style={styles.infoContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={user.username} editable={false} />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput style={styles.input} value={user.password} secureTextEntry editable={false} />
          <Ionicons name="eye-off-outline" size={20} color="black" />
        </View>
      </View> */}

      <TouchableOpacity style={styles.changePasswordButton} onPress={() => navigation.navigate("ChangePassScreen")}>
        <Text style={styles.changePasswordText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Account</Text>
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
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3F3',
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center',
  },
  profileImageContainer: {
    marginTop: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#007AFF', // Viền màu cho ảnh đại diện
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {
    width: '90%',
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: 'gray',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 5,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 5,
  },
  changePasswordButton: {
    marginTop: 20,
    width: '90%',
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  changePasswordText: {
    color: 'white',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    width: '90%',
    padding: 15,
    backgroundColor: '#FF5A5F',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    width: '90%',
    padding: 15,
    backgroundColor: 'transparent',
    borderColor: '#FF5A5F',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#FF5A5F',
    fontSize: 16,
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
});

export default ProfileScreen;
