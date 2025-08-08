import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// Import the icon from your assets
//const icon = require('./assets/icon.png');

const Card = ({ children, style }) => {
  return (
    <View style={[styles.cardDefault, style]}>
      {children}
    </View>
  );
};

const AnnouncementCard = ({ title, countValue, onClosePress, onPreviousClick, onNextClick,
  isPreviousDisabled, isNextDisabled }) => {
  return (
    <View >
      <View style={styles.cardAnnouncement}>
        <Image
          style={styles.icon}
          source={require('../../assets/images/home/icon_announment.png')}
        />
        <Text style={[styles.title, { flex: 1, color: '#3D3E78', marginStart: 16 }]}>{title}</Text>
        <TouchableOpacity
          onPress={onClosePress}
        >
          <Image
            style={[styles.iconSmallest, { marginStart: 16 }]}
            source={require('../../assets/images/home/icon_cross.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.cardAnnouncement, { marginTop: 2 }]}>
        <TouchableOpacity
          onPress={onPreviousClick}
          disabled={isPreviousDisabled}
          style={[styles.button, isPreviousDisabled ? { borderColor: '#BDBDBD' } : { borderColor: '#5B57C7' }]} >
          <Text style={[styles.buttonText, isPreviousDisabled ? { color: '#BDBDBD' } : { color: '#5B57C7' }]}>
            Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNextClick}
          disabled={isNextDisabled}
          style={[styles.button, isNextDisabled ? { borderColor: '#BDBDBD', marginLeft: 16 } : { borderColor: '#5B57C7', marginLeft: 16 }]} >
          <Text style={[styles.buttonText, isNextDisabled ? { color: '#BDBDBD' } : { color: '#5B57C7' }]}>
            Next
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'flex-end' }} >
          <Text style={styles.title}>
            {countValue}
          </Text>
        </View>
      </View>
    </View>
  );
};

const WorkdayCard = ({ icon, title, subtitle, onPress, buttonTitle = 'View' }) => {
  return (
    <Card style={styles.cardWorkday}>
      <View style={{ flex: 1, padding: 12 }}>
        <View style={styles.rowContainer}>
          <Image
            source={icon}
            style={styles.icon}
          />
          <Text style={[styles.title, { marginStart: 10 }]}>{title}</Text>
        </View>
        <Text style={[styles.subtitle, { flex: 1 }]}>{subtitle}</Text>
        <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const StoreLayoutCard = ({ image, title = 'Store Layout', onPress, buttonTitle = 'Map' }) => {
  return (
    <Card style={styles.cardWorkday}>
      <Image
        source={image}
        style={{ width: '100%', height: 90, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
      />
      <Text style={[styles.title, { flex: 1, marginStart: 12, marginTop: 12 }]}>{title}</Text>
      <TouchableOpacity style={[styles.button, { marginTop: 16, marginStart: 12, marginBottom: 12 }]} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardDefault: {
    //padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    // elevation: 2, // Android shadow
    // shadowColor: '#000', // iOS shadow
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 1,
    // Box shadow for Web (also works on iOS & Android)
    //boxShadow: '0 4px 6px rgba(0.1, 0, 0, 0.1)', // Web shadow
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px -0.1px 2px rgba(0, 0, 0, 0.1)',
  },
  cardAnnouncement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 16,
    backgroundColor: '#F1F4FC',
  },
  cardWorkday: {
    flex: 1,
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    backgroundColor: '#007BFF', // Set your desired background color
    borderRadius: 1, // Rounded corners for the background
    padding: 16, // Padding around the icon
    marginRight: 8, // Space between the icon and text
  },
  icon: {
    width: 40, // Adjust icon size as needed
    height: 40
  },
  icon2: {
    width: 32, // Adjust icon size as needed
    height: 32,
    marginEnd: 8
  },
  iconSmallest: {
    width: 20, // Adjust icon size as needed
    height: 20
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242'
  },
  subtitle: {
    fontSize: 14,
    color: '#424242',
    marginTop: 8
  },
  button: {
    //backgroundColor: '#007BFF', // Button background color
    borderWidth: 1.5, // Sets border thickness
    borderColor: '#5B57C7', // Border color
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4, // Adjust this value for more or less rounding
    alignSelf: 'flex-start', // Align to the start of the card
  },
  buttonText: {
    color: '#5B57C7', // Text color
    fontSize: 14,
    fontWeight: '500'
  }
});

export { Card, AnnouncementCard, WorkdayCard, StoreLayoutCard };