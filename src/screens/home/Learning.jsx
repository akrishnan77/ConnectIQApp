import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMsal } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';
import { getOneDriveTrainingFiles } from '../../graph';
import { Toolbar } from '../../components/nrf_app/Toolbar';

// --- Icon Imports ---
const fileIcons = {
  'application/pdf': require('../../assets/images/home/icon_pdf.png'),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': require('../../assets/images/home/icon_resources.png'),
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': require('../../assets/images/home/icon_resources.png'),
  'video/mp4': require('../../assets/images/home/icon_media.png'),
  'default': require('../../assets/images/home/icon_book.png'),
};

const getFileIcon = (mimeType) => {
  return fileIcons[mimeType] || fileIcons['default'];
};

const Learning = () => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [trainingFiles, setTrainingFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainingFiles = async () => {
      if (accounts.length > 0) {
        try {
          const request = {
            scopes: ["Files.ReadWrite"],
            account: accounts[0],
          };
          const response = await instance.acquireTokenSilent(request);
          const filesData = await getOneDriveTrainingFiles(response.accessToken);
          
          if (filesData && !filesData.error) {
            setTrainingFiles(filesData);
          } else {
            setError(filesData.error?.message || "Failed to fetch training files.");
          }
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchTrainingFiles();
  }, [instance, accounts]);

  const handleViewAll = () => {
    navigate('/training'); // Navigate to the main Training screen
  };

  const openFile = (fileUrl) => {
    console.log("Attempting to open file:", fileUrl);
    alert(`Opening file: ${fileUrl}`);
  };

  const renderResource = ({ item }) => (
    <TouchableOpacity style={styles.resourceItem} onPress={() => openFile(item.webUrl)}>
      <Image source={getFileIcon(item.file.mimeType)} style={styles.resourceIcon} />
      <Text style={styles.resourceTitle} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Toolbar title="Learning" />
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Training</Text>
          <TouchableOpacity onPress={handleViewAll}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dailyTrainingContent}>
          <Image source={require('../../assets/images/training/trainingVideo.png')} style={styles.trainingVideo} />
          <Text style={styles.trainingTitle}>Store Safety Protocols</Text>
          <Text style={styles.trainingDescription}>A quick video guide on new safety measures.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resources</Text>
           <TouchableOpacity onPress={handleViewAll}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }}/>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={trainingFiles.slice(0, 4)} // Show only the first 4 resources
            renderItem={renderResource}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.resourceList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    color: '#0078d4',
  },
  dailyTrainingContent: {
    alignItems: 'center',
  },
  trainingVideo: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  trainingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  trainingDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  resourceList: {
    paddingTop: 10,
  },
  resourceItem: {
    width: 120,
    alignItems: 'center',
    marginRight: 10,
  },
  resourceIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default Learning;
