import AsyncStorage from '@react-native-async-storage/async-storage';

let currentTabIndex = ''
let reloadDashboardData = false
let reloadTrainingData = false

// Public Keys (Constants)
export const KEY = {
  USER_NAME: 'user_name',
  USER_TOKEN: 'user_token',
  USER_EMAIL: 'user_email',
  USER_ROLE: 'user_role',
  API_DASHBOARD: 'api_dashboard_data',
  API_TRAINING:'api_training_data'
};

// Save data in AsyncStorage
export const saveData = async (key, value) => {
  try {
    //const stringValue = typeof value === 'string' ? value : JSON.stringify(value); // Ensure the value is a string
    await AsyncStorage.setItem(key, value);
    //console.log(`Data saved with key: ${key}`);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

// Retrieve data from AsyncStorage
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
      //return JSON.parse(value); // Parse to return the original object if it was stringified
    }
    return null; // Return null if no value exists for the key
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return null;
  }
};

// Save data in AsyncStorage
export const saveJsonData = async (key, value) => {
  try {
    //const stringValue = typeof value === 'string' ? value : JSON.stringify(value); // Ensure the value is a string
    await AsyncStorage.setItem(key, JSON.stringify(value));
    //console.log(`Data saved with key: ${key}`);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

// Retrieve data from AsyncStorage
export const getJsonData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value); // Parse to return the original object if it was stringified
    }
    return null; // Return null if no value exists for the key
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return null;
  }
};

// To save multiple data
export const saveMultipleData = async (arrayData) => {
  // Create an array of key-value pairs
  // const arrayData = [
  //   ['name', 'John Doe'],
  //   ['email', 'john.doe@example.com'],
  //   ['age', '30'],
  //   ['city', 'New York'],
  // ];
  try {
    //const stringValue = typeof value === 'string' ? value : JSON.stringify(value); // Ensure the value is a string
    await AsyncStorage.multiSet(arrayData);
    console.log(`Data saved with key: ${arrayData}`);
  } catch (error) {
    console.error(`Error saving data for key ${arrayData}:`, error);
  }
};

// To get multiple data
const getMultipleData = async () => {
  try {
    const keys = ['name', 'email', 'age', 'city']; // The keys you want to retrieve
    const result = await AsyncStorage.multiGet(keys);

    result.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } catch (error) {
    console.error('Error retrieving data: ', error);
  }
};

// Remove data from AsyncStorage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data removed for key: ${key}`);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
};

// Clear all data from AsyncStorage
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared from AsyncStorage');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

// Check if a key exists in AsyncStorage
export const keyExists = async (key) => {
  const value = await AsyncStorage.getItem(key);
  return value !== null;
};

// Other Functions to handle static variables

export const getCurrentTabIndex = () => {
  return currentTabIndex;
};

export const setCurrentTabIndex = (newValue) => {
  currentTabIndex = newValue;
};

export const getReloadDashboardData = () => {
  return reloadDashboardData;
};

export const setReloadDashboardData = (newValue) => {
  reloadDashboardData = newValue;
};

export const getReloadTrainingData = () => {
  return reloadTrainingData;
};

export const setReloadTrainingData = (newValue) => {
  reloadTrainingData = newValue;
};
