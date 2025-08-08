import { React, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Toolbar } from '../../components/nrf_app/Toolbar';
import { getData, KEY } from '../../utils/LocalStorage';
import { UserRole } from '../../utils/AppConstants';

const ChatBot = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Example video URL
    //const chatBotLink = 'https://copilotstudio.microsoft.com/environments/Default-f66b6bd3-ebc2-4f54-8769-d22858de97c5/bots/crf1b_agentFkG-nK/webchat?__version__=2'
    //const chatBotLink = 'https://copilotstudio.microsoft.com/environments/Default-f66b6bd3-ebc2-4f54-8769-d22858de97c5/bots/crf1b_agent9YnZPS/webchat?__version__=2'
    const chatBotLinkMan = 'https://copilotstudio.microsoft.com/environments/Default-f66b6bd3-ebc2-4f54-8769-d22858de97c5/bots/crf1b_agent9YnZPS/webchat?__version__=2'
    const chatBotLinkAsso = 'https://copilotstudio.microsoft.com/environments/Default-f66b6bd3-ebc2-4f54-8769-d22858de97c5/bots/crf1b_agentPIUOv0/webchat?__version__=2'

    const [chatBotLink, setChatBotLink] = useState('');
    useEffect(() => {
        const fetchStoredData = async () => {
            try {
                //const value = await AsyncStorage.getItem('@storage_Key');
                const role = await getData(KEY.USER_ROLE)
                if (role === UserRole.MANAGER) {
                    setChatBotLink(chatBotLinkMan)
                } else {
                    setChatBotLink(chatBotLinkAsso)
                }
                console.log('chatBotLink: ', chatBotLink)
            } catch (e) {
                console.error('Failed to fetch the data from AsyncStorage:', e);
            }
        };
        fetchStoredData();
    }, []);

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
                title={'Chat Bot'}
                showBot={false}
            />
            {/* <Text>{resourceData.resLink}</Text> */}
            <View style={styles.container}>
                {Platform.OS === 'web' ? (
                    <iframe
                        title='ChatBot'
                        src={`${chatBotLink}&embedded=true`}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={styles.iframe}
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

export default ChatBot;
