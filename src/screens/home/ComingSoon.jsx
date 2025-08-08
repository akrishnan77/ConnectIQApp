import { React, useEffect, useState } from 'react';
import {
    View, Text, ActivityIndicator, StyleSheet, TouchableOpacity,
    FlatList, Image, ScrollView
} from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';
import {  ToolbarHome } from '../../components/nrf_app/Toolbar';

const ComingSoon = () => {
    const location = useLocation();
    const title = location.state || [];
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <ToolbarHome
                title={title}
            />
            <View style={styles.mainContainer}>
                <Image
                    source={require('../../assets/images/home/img_comming_soon.png')}
                    style={{ width: '150', height: '150' }}
                />
                <Text style={styles.titleBig}>
                    Coming Soon!
                </Text>
                <Text style={styles.titleSmall}>
                    Something exciting is on the way!
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleBig: {
        fontSize: 32,
        fontWeight: '500',
        color: '#242424',
        marginTop: 24,
        marginBottom: 12
    },
    titleSmall: {
        fontSize: 14,
        fontWeight: '400',
        color: '#242424',
    },
});

export default ComingSoon;
