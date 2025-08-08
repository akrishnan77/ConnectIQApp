import React from 'react';
import { View, Text, ActivityIndicator, Modal } from 'react-native';

// Spinner Loader (default)
export const SpinnerLoader = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    </Modal>
  );
};

// Full Screen Loader (with custom message)
export const FullScreenLoader = ({ visible, message = "Please wait..." }) => {
  if (!visible) return null;

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.fullScreenText}>{message}</Text>
      </View>
    </Modal>
  );
};

// Custom Loader (You can replace the activity indicator with your own custom loader)
export const CustomLoader = ({ visible }) => {
  if (!visible) return null;

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.loaderContainer}>
        {/* Replace this with your custom loader (image, animation, etc.) */}
        <Text style={styles.loaderText}>Custom Loading...</Text>
      </View>
    </Modal>
  );
};

// Common styles for loaders
const styles = {
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loaderText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  fullScreenText: {
    marginTop: 10,
    color: 'white',
    fontSize: 20,
  },
};
