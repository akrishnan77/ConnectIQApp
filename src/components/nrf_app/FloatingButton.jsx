import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';

const FloatingButtonAdd = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
            <Image
                source={require('../../assets/images/home/icon_add.png')}
                style={{ width: 24, height: 24 }}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    floatingButton: {
        position: 'fixed', // Position the button absolutely
        bottom: 20,           // Distance from bottom of screen
        right: 20,            // Distance from the right of screen
        backgroundColor: '#0255DC', // Background color
        borderRadius: 100,     // Make it circular
        padding: 16,          // Size of the button
        justifyContent: 'center',
        alignItems: 'center',
        // shadowColor: '#000',  // Shadow for Android
        // shadowOffset: { width: 0, height: 2 }, // Shadow offset
        // shadowOpacity: 0.5,   // Shadow opacity
        // shadowRadius: 2,      // Shadow radius
        // elevation: 5,         // Shadow for iOS and Android
        zIndex: 100,        // Ensures the button stays on top of other content
    },
});

export { FloatingButtonAdd };
