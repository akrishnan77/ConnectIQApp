import { React, useEffect, useState } from 'react';
import { FlatList, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigate } from "react-router-dom";
import { Card } from '../../components/nrf_app/Card';
import Utils from '../../utils/Utils';
import { getData, KEY } from '../../utils/LocalStorage';

const Learning = ({ learning }) => {
  const navigate = useNavigate();
  const utils = new Utils();

  const [weeklyTrainingTitle, setWeeklyTrainingTitle] = useState('');
  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        //const value = await AsyncStorage.getItem('@storage_Key');
        const data = await getData(KEY.USER_NAME)
        console.log('data: ', data)
        setWeeklyTrainingTitle(`Hi ${data}, please select the topic you want to train in today`)
        // if (value !== null) {
        //   setStoredValue(value); // Set the stored value if exists
        // }
      } catch (e) {
        console.error('Failed to fetch the data from AsyncStorage:', e);
      }
    };
    fetchStoredData();
  }, []);

  // Handle Learning click
  const handleLearningClick = (item, index) => {
    if (item.title === 'Inventory Management') {
      navigate("/training")
    }
  };

  // Handle Resource click
  const handleResourceClick = (item, index) => {
    //Alert.alert(`You clicked on ${item} at index ${index}`);
    //console.log(item.link)
    //if(item.url.)
    //navigate(`/viewResource/${item.link}`)

    navigate("/viewResource", { state: item.id })
  };

  // Handle View All Resource click
  const handleViewAllResourceClick = () => {
    navigate("/resourceList", { state: learning.resources })
  };

  const renderResourceItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => handleResourceClick(item, index)}
        style={[styles.rowContainer, { paddingStart: 16, paddingEnd: 16 }]}>
        {utils.isVideoResource(item.url) ?
          (<Image
            source={require('../../assets/images/home/icon_media.png')}
            style={styles.iconSmall}
          />) :
          (<Image
            source={require('../../assets/images/home/icon_pdf.png')}
            style={styles.iconSmall}
          />)
        }
        <Text style={[styles.title, { flex: 1, marginStart: 8 }]}>{item.title}</Text>
        <Image
          source={require('../../assets/images/home/icon_arrow.png')}
          style={styles.iconSmallest}
        />
      </TouchableOpacity>
    </View>
  );

  const renderTrainingItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => handleLearningClick(item, index)}
        style={[styles.rowContainer, { paddingStart: 16, paddingEnd: 16 }]}>
        <Text style={[styles.title, { flex: 1 }]}>{item.title}</Text>
        <Image
          source={require('../../assets/images/home/icon_arrow.png')}
          style={styles.iconSmallest}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ margin: 8 }}>
      <Card>
        <View style={[styles.rowContainer, {
          padding: 16, borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
        }]}>
          <Image
            source={require('../../assets/images/home/icon_book.png')}
            style={styles.iconSmall}
          />
          <Text style={[styles.titleSmall, { flex: 1, color: '#616161' }]}>
            Weekly Training
          </Text>
          <View style={styles.itemContainerWithBg} >
            <Text style={[styles.titleSmall, { color: '#0F548C' }]}>
              Reward Points - {learning.rewardPoints}
            </Text>
          </View>
        </View>
        <Text style={[styles.title, { padding: 16 }]}>
          {weeklyTrainingTitle}
        </Text>
        <FlatList
          data={learning.weeklyTraining}
          renderItem={renderTrainingItem}
          keyExtractor={(item) => item.id}
        />
      </Card>

      <Card style={{ marginTop: 8 }}>
        <View style={[styles.rowContainer, {
          padding: 16, borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
        }]}>
          <Image
            source={require('../../assets/images/home/icon_resources.png')}
            style={styles.iconSmall}
          />
          <Text style={[styles.titleSmall, { color: '#616161' }]}>
            Resources
          </Text>
        </View>
        <FlatList
          data={learning.resources}
          renderItem={renderResourceItem}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity
          onPress={handleViewAllResourceClick}
          style={[styles.buttonWithMargin, { marginStart: 16, marginBottom: 16 }]}>
          <Text style={styles.buttonText}>View All</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    marginStart: 16,
    marginEnd: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  itemContainerWithBg: {
    backgroundColor: '#CFE4FA', // Background color applied to the wrapper
    paddingTop: 4,
    paddingBottom: 4,
    paddingStart: 8,
    paddingEnd: 8,
    borderRadius: 5, // Optional: Add rounded corners to the background
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: '#242424'
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '500'
  },
  titleSmall600: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right'
  },
  titleSmallStatus: {
    color: '#616161',
    fontSize: 14,
    fontWeight: '400',
  },
  iconMedium: {
    width: 40, // Adjust icon size as needed
    height: 40,
    marginEnd: 8,
  },
  iconSmall: {
    width: 32, // Adjust icon size as needed
    height: 32,
    marginEnd: 8
  },
  iconSmallest: {
    width: 24, // Adjust icon size as needed
    height: 24
  },
  buttonWithMargin: {
    //backgroundColor: '#007BFF', // Button background color
    borderWidth: 1.5, // Sets border thickness
    borderColor: '#5B57C7', // Border color
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4, // Adjust this value for more or less rounding
    alignSelf: 'flex-start', // Align to the start of the card
    marginTop: 16, // Add some space above the button
  },
  buttonText: {
    color: '#5B57C7', // Text color
    fontSize: 14,
    fontWeight: '500'
  }
});

export default Learning;
