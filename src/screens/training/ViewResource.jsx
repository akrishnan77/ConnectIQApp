import { React, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Toolbar } from '../../components/nrf_app/Toolbar';
import { useLocation } from 'react-router-dom';

const ViewResource = () => {
    // Use useLocation to access the passed data
    const location = useLocation();
    const resId = location.state || '';  // Access state passed
    const [resourceData, setResourceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'; // Example video URL
    //const videoUrl = 'https://htlbeta.sharepoint.com/sites/SuperAppDemoSite/_layouts/15/embed.aspx?uniqueId=3556bbad-8fd1-47fc-8995-bb53e6c63b1b&access_token=v1.eyJzaXRlaWQiOiJkZGIzNmYwNi0xYjhiLTRjYjQtYjNmMi0yYzFhMjM0NzQxMDUiLCJhcHBfZGlzcGxheW5hbWUiOiJBcHAgU2VydmljZSIsImFwcGlkIjoiN2FiNzg2MmMtNGM1Ny00OTFlLThhNDUtZDUyYTdlMDIzOTgzIiwiYXVkIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwL2h0bGJldGEuc2hhcmVwb2ludC5jb21AYzRhM2I5MmItNzRlYi00NzNlLTk5YTEtMzJkMDNlMGU0NjMyIiwiZXhwIjoiMTczMzkwMjA0NiJ9.CgoKBHNuaWQSAjg5EgsImNXZjtPvzD0QBRoPMTA0LjIxMS4xNDYuMjI0Kix2amtzeHZnaHUrUEQ0Q0UvNHJidSttOVcvRWpxNlhOdC9lWEdFK3g1aXVJPTB6OAFCEKFsbF2hcABAPTzgg74ceRtKEGhhc2hlZHByb29mdG9rZW5yKTBoLmZ8bWVtYmVyc2hpcHwxMDAzMjAwMjAxNzViYjMxQGxpdmUuY29tegEyggESCSu5o8TrdD5HEZmhMtA-DkYykgEJUHJhdGhlZXNomgEFRGV2YW6iASdwcmF0aGVlc2guZGV2YW5AaHRsYmV0YS5vbm1pY3Jvc29mdC5jb22qARAxMDAzMjAwMjAxNzVCQjMxsgHWA2FsbGZpbGVzLndyaXRlIGFsbHNpdGVzLmZ1bGxjb250cm9sIGFsbHNpdGVzLnJlYWQgZ3JvdXAud3JpdGUgc2hhcmVwb2ludHRlbmFudHNldHRpbmdzLnJlYWR3cml0ZS5hbGwgY29udGFpbmVyLnNlbGVjdGVkIGRhc2hib2FyZGNhcmQuc2VuZC5hcHAgY29udGFpbmVyLm1hbmFnZS5hbGwgY29udGFpbmVyLm1hbmFnZS5hbGwgQWRtaW5pc3RyYXRpdmUuTWFuYWdlIEFkbWluaXN0cmF0aXZlLlJlYWQgQmFzaWNQcm9qZWN0QWxsLlJlYWQgQmFzaWNQcm9qZWN0QWxsLldyaXRlIEVudGVycHJpc2VSZXNvdXJjZXMuUmVhZCBFbnRlcnByaXNlUmVzb3VyY2VzLldyaXRlIEVudGVycHJpc2VSZXNvdXJjZXMuQnlwYXNzRGVsZWdhdGUgU3RhdHVzaW5nLlN1Ym1pdFN0YXR1cyBSZXBvcnRpbmcuUmVhZCBmYXN0U2VhcmNoLnF1ZXJ5c3AgYWxscHJvZmlsZXMuZnVsbGNvbnRyb2wgYWxscHJvZmlsZXMud3JpdGUgdGVybXN0b3JlLndyaXRlyAEB.Gv_fUbTORZ7hxVizLcSvPCF3SLm7WeHlMu5tuaCF5VM'

    // Function to fetch ResourceUrl
    const fetchResourceUrl = async () => {
        try {
            // const responseData = await getResourceUrl(resId); // Fetch data using the API utility
            // if (responseData) {
            //   setResourceData(responseData);
            // }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchResourceUrl();
    }, []);  // Empty array means this effect runs only once after the first render

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
                title={'Resource'}
            />
            {/* <Text>{resourceData.resLink}</Text> */}
            <View style={styles.container}>
                {Platform.OS === 'web' ? (

                    <iframe
                        title='ViewResource'
                        src={`${resourceData.resLink}&embedded=true`}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={styles.iframe}
                    />

                    // <video
                    //     width="100%"
                    //     height="auto"
                    //     controls
                    //     autoPlay
                    //     style={styles.video}
                    // >
                    //     <source src={videoUrlLink} type="video/mp4" />
                    //     Your browser does not support the video tag.
                    // </video>

                    //<WebView source={{ uri: videoUrl }} style={{ flex: 1 }} />
                    // <webview src='google.com' style={{ width: '100%', height: '100%' }} />

                    // <iframe
                    //     className={videoType} width="100%" height="auto"
                    //     src={`${resourceData.resLink}&embedded=true`}>
                    // </iframe>

                    // <ReactPlayer
                    //     url={videoUrl}
                    //     controls={true}    // Display controls
                    //     width="100%"       // Make the video responsive
                    //     height="100%"      // Adjust height accordingly
                    // />

                    // <WebView
                    //     source={{ uri: resourceData.resLink }}
                    //     style={{flex:1}}
                    //     javaScriptEnabled={true}
                    //     domStorageEnabled={true}
                    // />
                ) : (
                    // For React Native mobile devices, use react-native-video (as previously explained)
                    <Text>Video player will show on mobile devices</Text>
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

export default ViewResource;
