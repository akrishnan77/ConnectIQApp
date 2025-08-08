import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  View, Text, TouchableOpacity, Image, StyleSheet, ScrollView,
} from "react-native";
import { Toolbar } from "../../components/nrf_app/Toolbar"; // Import the common header component

const InventoryManagementScreen = () => {
  const [expandedSection, setExpandedSection] = useState("");
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? "" : section));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Toolbar title="Daily Training" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Inventory Management</Text>
          <Text style={styles.subtitle}>
            "The Art of Balancing Supply and Demand"
          </Text>
          <Text style={styles.description}>
            Good inventory management is the secret sauce to a successful
            business. It's like having a reliable backstage crew that ensures
            the show goes on smoothly.
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={require("../../assets/images/training/trainingVideo.png")} // Use your placeholder image
            style={styles.trainingImage}
          />
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Techniques Section */}
        <View style={styles.techniquesSection}>
          <Text style={styles.techniquesTitle}>
            Key Techniques of Inventory Management:
          </Text>
          <Text style={styles.description}>
            Just like a magician has tricks up their sleeve, inventory managers
            have a toolbox of techniques to keep their inventory in check:
          </Text>

          {/* Economic Order Quantity (EOQ) */}
          <TouchableOpacity
            style={styles.dropdownContainer}
            onPress={() => toggleSection("EOQ")}
          >
            <Text style={styles.dropdownTitle}>
              {expandedSection === "EOQ" ? "▼" : "▶"} Economic Order Quantity
              (EOQ)
            </Text>
            {expandedSection === "EOQ" && (
              <View style={styles.dropdownContent}>
                <Image
                  source={require("../../assets/images/training/eoq.png")} // Use your EOQ image
                  style={styles.eoqImage}
                />
                <Text style={styles.description}>
                  EOQ helps businesses find the right balance between the costs
                  of holding inventory and the costs of ordering. This helps
                  businesses avoid overstocking or understocking.
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Just-in-Time (JIT) Inventory */}
          <TouchableOpacity
            style={styles.dropdownContainer}
            onPress={() => toggleSection("JIT")}
          >
            <Text style={styles.dropdownTitle}>
              {expandedSection === "JIT" ? "▼" : "▶"} Just-in-Time (JIT)
              Inventory
            </Text>
            {expandedSection === "JIT" && (
              <View style={styles.dropdownContent}>
                <Text style={styles.description}>
                  JIT focuses on reducing waste by receiving goods only as they
                  are needed in the production process, reducing inventory costs
                  and improving efficiency.
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* ABC Analysis */}
          <TouchableOpacity
            style={styles.dropdownContainer}
            onPress={() => toggleSection("ABC")}
          >
            <Text style={styles.dropdownTitle}>
              {expandedSection === "ABC" ? "▼" : "▶"} ABC Analysis
            </Text>
            {expandedSection === "ABC" && (
              <View style={styles.dropdownContent}>
                <Text style={styles.description}>
                  ABC analysis categorizes inventory into three groups: A
                  (high-value), B (moderate-value), and C (low-value) to help
                  prioritize inventory management efforts.
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Start Training Button */}
        {/* <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("/dailytraining")}
        >
          <Text style={styles.startButtonText}>Start Training</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigate("/dailytraining")}
        >
          <Text style={styles.startButtonText}>Start Training</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default InventoryManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0, // Removed any padding around the container
    backgroundColor: "transparent",
    width: "100%", // Ensures the container uses full screen width
    overflow: "hidden", // Prevents both horizontal and vertical scrolling overflow
    alignItems: "stretch", // Ensures children take full width of the container
    justifyContent: "flex-start", // Ensure children are aligned at the start (top)
  },
  content: {
    padding: 16,
    width: "100%", // Ensure content does not cause horizontal overflow
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginVertical: 8,
  },
  imageSection: {
    marginVertical: 16,
    position: "relative",
  },
  trainingImage: {
    width: "100%", // Ensures image does not overflow horizontally
    height: 200,
    borderRadius: 8,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  playButtonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  techniquesSection: {
    marginBottom: 16,
  },
  techniquesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  dropdownContainer: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dropdownContent: {
    marginTop: 8,
    paddingLeft: 16,
  },
  eoqImage: {
    width: "100%", // Ensures the image spans the full width of its container
    height: undefined, // Let the image take its natural height
    aspectRatio: 16 / 9, // Adjust the aspect ratio (width:height) to fit your image
    borderRadius: 8,
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: "#6b4eff",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    width: "100%", // Ensures button fits within the screen width
  },
  startButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
});


// const styles = StyleSheet.create({
//   // container: {
//   //   flex: 1,
//   //   backgroundColor: "#f8f8f8",
//   //   width: "100%",
//   // },
//   container: {
//     flex: 1,
//     padding: 0, // Removed any padding around the container
//     backgroundColor: "transparent",
//     width: "100%", // Ensures the container uses full screen width
//     overflowX: "hidden", // Prevent horizontal scrolling by hiding overflow
//     alignItems: "stretch", // Ensures children take full width of the container
//   },
//   content: {
//     padding: 16,
//   },
//   titleSection: {
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   subtitle: {
//     fontSize: 18,
//     fontStyle: "italic",
//     color: "#666",
//   },
//   description: {
//     fontSize: 16,
//     color: "#666",
//     marginVertical: 8,
//   },
//   imageSection: {
//     marginVertical: 16,
//     position: "relative",
//   },
//   trainingImage: {
//     width: "100%",
//     height: 200,
//     borderRadius: 8,
//   },
//   playButton: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: [{ translateX: -20 }, { translateY: -20 }],
//     backgroundColor: "#ffffff",
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 3,
//   },
//   playButtonText: {
//     fontSize: 18,
//     color: "#333",
//     fontWeight: "bold",
//   },
//   techniquesSection: {
//     marginBottom: 16,
//   },
//   techniquesTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//   },
//   dropdownContainer: {
//     marginVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//     paddingBottom: 10,
//   },
//   dropdownTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   dropdownContent: {
//     marginTop: 8,
//     paddingLeft: 16,
//   },
//   eoqImage: {
//     width: "100%",
//     height: 150,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   startButton: {
//     backgroundColor: "#6b4eff",
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   startButtonText: {
//     fontSize: 16,
//     color: "#ffffff",
//     fontWeight: "bold",
//   },
// });

