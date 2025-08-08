import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Toolbar } from "../../components/nrf_app/Toolbar";

const ReportEx = () => {
  const [activeTab, setActiveTab] = useState('Inventory');

  const inventoryData = [
    { id: '1', item: "Mike's Popcorn", current: 150, prediction: 100, required: 50 },
    { id: '2', item: 'Harney & Sons', current: 50, prediction: 100, required: -50 },
    { id: '3', item: 'Froot Loops', current: 150, prediction: 200, required: -50 },
    { id: '4', item: "Welch's", current: 200, prediction: 100, required: 100 },
    { id: '5', item: 'Archway Cookies', current: 120, prediction: 100, required: 20 },
    { id: '6', item: 'Tazo', current: 80, prediction: 100, required: -20 },
    { id: '7', item: 'Stash Tea', current: 120, prediction: 100, required: 20 },
    { id: '8', item: 'Belvita', current: 80, prediction: 150, required: 70 },
    { id: '9', item: 'Lofthouse', current: 80, prediction: 100, required: -20 },
    { id: '10', item: 'Honey Maid', current: 150, prediction: 150, required: 0 },
    { id: '11', item: 'Ghirardelli', current: 100, prediction: 150, required: -50 },
    { id: '12', item: 'Vosges', current: 170, prediction: 150, required: 20 },
    { id: '13', item: 'MARS', current: 80, prediction: 150, required: 70 },
    { id: '14', item: 'B&G Foods', current: 150, prediction: 100, required: 50 },
    { id: '15', item: 'F. Duerr & Sons', current: 150, prediction: 200, required: -50 },
    { id: '16', item: 'ConAgra', current: 100, prediction: 120, required: -20 },
    { id: '17', item: 'Hodo', current: 140, prediction: 150, required: 10 },
    { id: '18', item: 'AuerPak', current: 80, prediction: 150, required: 70 },
  ];

  // const renderInventory = () => (
 
  //   <FlatList
    
  //     data={inventoryData}
  //     keyExtractor={(item) => item.id}
  //     renderItem={({ item }) => (
  //       <View style={styles.inventoryRow}>
  //         <View style={styles.itemDetails}>
  //           <Text style={styles.itemName}>{item.item}</Text>
  //           <Text style={styles.itemId}>#{item.id}</Text>
  //         </View>
  //         <Text style={styles.itemData}>{item.current}</Text>
  //         <Text style={styles.itemData}>{item.prediction}</Text>
  //         <Text
  //           style={[styles.itemData, item.required > 0 ? styles.positive : styles.negative]}
  //         >
  //           {item.required > 0 ? `+${item.required}` : item.required}
  //         </Text>
  //       </View>
  //     )}
  //   />
  // );
  const renderHeader = () => (
    <View style={styles.headerRow}>
    <Text style={styles.headerItem}>Item</Text>
    <Text style={styles.headerData}>Current</Text>
    <Text style={styles.headerData}>Prediction</Text>
    <Text style={styles.headerData}>Required</Text>
  </View>
  );
  const renderInventory = () => (
    <FlatList
      data={inventoryData} // The data array for the list
      keyExtractor={(item) => item.id} // Unique key for each item
      ListHeaderComponent={renderHeader} // Attach the header row here
      renderItem={({ item }) => (
        <View style={styles.inventoryRow}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.item}</Text>
            <Text style={styles.itemId}>#{item.id}</Text>
          </View>
          <Text style={styles.itemData}>{item.current}</Text>
          <Text style={styles.itemData}>{item.prediction}</Text>
          <Text
            style={[
              styles.itemData,
              item.required > 0 ? styles.positive : styles.negative,
            ]}
          >
            {item.required > 0 ? `+${item.required}` : item.required}
          </Text>
        </View>
      )}
    />
  );
  
  const renderAssociate = () => (
    <ScrollView contentContainerStyle={styles.associateContainer}>
      <View style={styles.associateCardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clocked in</Text>
          <Text style={styles.cardValue}>40% <Text style={styles.positive}>&#8593;</Text></Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave</Text>
          <Text style={styles.cardValue}>20% <Text style={styles.positive}>&#8593;</Text></Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Training Completion</Text>
          <Text style={styles.cardValue}>0.84% <Text style={styles.negative}>&#8595;</Text></Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Labor Budget</Text>
          <Text style={styles.cardValue}>$1,762</Text>
        </View>
      </View>
      <Image
        source={require('../../assets/images/report/icon_piechart.png')} // Replace with the path to your static pie chart image
        style={styles.chartImage}
        resizeMode="contain"
      />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
      </View> */}
         <Toolbar
          title={'Reports'}
        />
      <View style={styles.tabBar}>
        {['Inventory', 'Associate', 'Task'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{activeTab === 'Inventory' ? 'Stock Count' : 'Monthly Report'}</Text>
        <Text style={styles.sectionDate}>Dec 2024</Text>
        <Text style={styles.downloadButton}>⬇️</Text>
      </View>

      {activeTab === 'Inventory' ? renderInventory() : renderAssociate()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Light background for header
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#6200ee',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionDate: {
    fontSize: 16,
    color: '#6200ee',
  },
  downloadButton: {
    fontSize: 18,
    color: '#6200ee',
  },
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemId: {
    fontSize: 12,
    color: '#888',
  },
  itemData: {
    fontSize: 16,
    textAlign: 'center',
    width: 50,
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  associateContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  associateCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  chartImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Light background for header
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inventoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerItem: {
    flex: 3, // Same flex value as itemDetails for alignment
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  headerData: {
    flex: 1, // Same flex value as itemData for alignment
    fontWeight: '400',
    fontSize: 13,
    color: '#333',
    textAlign: 'center', // Center-align text
  },
  itemDetails: {
    flex: 3, // Matches headerItem's flex value
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemId: {
    fontSize: 12,
    color: '#666',
  },
  itemData: {
    flex: 1, // Matches headerData's flex value
    fontSize: 14,
    color: '#333',
    textAlign: 'center', // Center-align text
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
});

export default ReportEx;




// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// //import { PieChart } from 'react-native-chart-kit';

// const ReportEx = () => {
//   const [activeTab, setActiveTab] = useState('Inventory');

//   const inventoryData = [
//     { id: '1', item: "Mike's Popcorn", current: 150, prediction: 100, required: 50 },
//     { id: '2', item: 'Harney & Sons', current: 50, prediction: 100, required: -50 },
//     { id: '3', item: 'Froot Loops', current: 150, prediction: 200, required: -50 },
//     { id: '4', item: "Welch's", current: 200, prediction: 100, required: 100 },
//   ];

//   const renderInventory = () => (
//     <FlatList
//       data={inventoryData}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => (
//         <View style={styles.inventoryRow}>
//           <View style={styles.itemDetails}>
//             <Text style={styles.itemName}>{item.item}</Text>
//             <Text style={styles.itemId}>#{item.id}</Text>
//           </View>
//           <Text style={styles.itemData}>{item.current}</Text>
//           <Text style={styles.itemData}>{item.prediction}</Text>
//           <Text
//             style={[styles.itemData, item.required > 0 ? styles.positive : styles.negative]}
//           >
//             {item.required > 0 ? `+${item.required}` : item.required}
//           </Text>
//         </View>
//       )}
//     />
//   );

//   const renderAssociate = () => (
//     <ScrollView contentContainerStyle={styles.associateContainer}>
//       <View style={styles.associateCardsContainer}>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Clocked in</Text>
//           <Text style={styles.cardValue}>40% <Text style={styles.positive}>&#8593;</Text></Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Leave</Text>
//           <Text style={styles.cardValue}>20% <Text style={styles.positive}>&#8593;</Text></Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Training Completion</Text>
//           <Text style={styles.cardValue}>0.84% <Text style={styles.negative}>&#8595;</Text></Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Labor Budget</Text>
//           <Text style={styles.cardValue}>$1,762</Text>
//         </View>
//       </View>
//       {/* <PieChart
//         data={[
//           { name: 'Clocked In', population: 40, color: 'blue', legendFontColor: '#000', legendFontSize: 12 },
//           { name: 'Leave', population: 20, color: 'red', legendFontColor: '#000', legendFontSize: 12 },
//           { name: 'Other', population: 40, color: 'gray', legendFontColor: '#000', legendFontSize: 12 },
//         ]}
//         width={300}
//         height={220}
//         chartConfig={{
//           backgroundColor: '#fff',
//           backgroundGradientFrom: '#fff',
//           backgroundGradientTo: '#fff',
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//         }}
//         accessor={'population'}
//         backgroundColor={'transparent'}
//         paddingLeft={'15'}
//         absolute
//       /> */}
//     </ScrollView>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Reports</Text>
//       </View>
//       <View style={styles.tabBar}>
//         {['Inventory', 'Associate', 'Task'].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={[styles.tab, activeTab === tab && styles.activeTab]}
//             onPress={() => setActiveTab(tab)}
//           >
//             <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
//               {tab}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>{activeTab === 'Inventory' ? 'Stock Count' : 'Monthly Report'}</Text>
//         <Text style={styles.sectionDate}>Nov 2024</Text>
//         <Text style={styles.downloadButton}>⬇️</Text>
//       </View>
//       {activeTab === 'Inventory' ? renderInventory() : renderAssociate()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#f4f4f4',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   tabBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#f4f4f4',
//     paddingVertical: 8,
//   },
//   tab: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#6200ee',
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   activeTabText: {
//     color: '#6200ee',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   sectionDate: {
//     fontSize: 16,
//     color: '#888',
//   },
//   downloadButton: {
//     fontSize: 18,
//   },
//   inventoryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   itemId: {
//     fontSize: 12,
//     color: '#888',
//   },
//   itemData: {
//     fontSize: 16,
//     textAlign: 'center',
//     width: 50,
//   },
//   positive: {
//     color: 'green',
//   },
//   negative: {
//     color: 'red',
//   },
//   associateContainer: {
//     padding: 16,
//   },
//   associateCardsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   card: {
//     width: '48%',
//     padding: 16,
//     backgroundColor: '#f4f4f4',
//     marginBottom: 16,
//     borderRadius: 8,
//   },
//   cardTitle: {
//     fontSize: 14,
//     color: '#888',
//   },
//   cardValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export default ReportEx;
