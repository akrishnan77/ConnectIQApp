import { React, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Toolbar } from '../../components/nrf_app/Toolbar';
import { getData, KEY } from '../../utils/LocalStorage';
import { UserRole } from '../../utils/AppConstants';
import { useLocation } from 'react-router-dom';

const OpenWebview = () => {

    // Use useLocation to access the passed data
    const location = useLocation();
    const webLink = 'https://www.google.com'//location.state || '';  // Access state passed


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [webLink1, setWebLink1] = useState(webLink);

    console.log('webLink: ', webLink1)

    if (loading) {
        return (
            <View style={{
                width: '100%', height: '100%',
                justifyContent: "center", alignItems: "center"
            }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{
                width: '100%', height: '100%',
                justifyContent: "center", alignItems: "center"
            }}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
            <Toolbar
                title={''}
                showBot={false}
            />
            {/* <Text>{resourceData.resLink}</Text> */}
            <View style={styles.container}>
                {Platform.OS === 'web' ? (
                    // <iframe
                    //     title='OpenWebview'
                    //     src={`${webLink1}&embedded=true`}
                    //     allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    //     allowFullScreen
                    //     style={styles.iframe}
                    // />

                    <iframe
                        src={webLink1}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Web Page"
                    />
                ) : (
                    // For React Native mobile devices, use react-native-video (as previously explained)
                    <Text>Something went wrong, please try again</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    video: {
        width: '100%',
        height: 'auto',
    },
    iframe: {
        border: 'none',
        width: '100%',
        height: '100%',
    },
});

export default OpenWebview;
