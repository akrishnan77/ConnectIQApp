import { React, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";
import { useNavigate } from "react-router-dom";

const Toolbar = ({ title, onBack, showBot = true, showBottomLine = true }) => {
  const navigate = useNavigate();

  const handleChatBotPress = () => {
    navigate('/chatBot')
  };

  return (
    <View style={showBottomLine ? toolbarStyle.containerWithBottomLine : toolbarStyle.containerWithoutBottomLine}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBack || (() => navigate(-1))}
      >
        <Image
          source={require("../../assets/images/home/icon_back.png")}
          style={toolbarStyle.iconBack}
        />
      </TouchableOpacity>

      <Text style={toolbarStyle.title}>{title}</Text>

      {showBot &&
        <TouchableOpacity
          onPress={handleChatBotPress}
        >
          <Image
            source={require("../../assets/images/home/icon_bot_dark.png")} // Replace with the correct path to your local image
            style={toolbarStyle.iconSmallest}
          />
        </TouchableOpacity>
      }
    </View>
  );
};

const ToolbarWith2Img = ({ title, onBack }) => {
  const navigate = useNavigate();

  const handleChatBotPress = () => {
    navigate('/chatBot')
  };
  return (
    <View style={toolbarStyle.container}>
      <TouchableOpacity
        onPress={onBack || (() => navigate(-1))}>
        <Image
          source={require("../../assets/images/home/icon_back.png")} // Replace with the correct path to your local image
          style={toolbarStyle.iconBack}
        />
      </TouchableOpacity>

      <Text style={toolbarStyle.title}>{title}</Text>

      {/* Right Side Icons */}
      {/* <TouchableOpacity>
        <Image
          source={require("../../assets/images/home/icon_search.png")} // Replace with the correct path to your local image
          style={[toolbarStyle.iconSmallest, { marginEnd: 16 }]}
        />
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={handleChatBotPress}
      >
        <Image
          source={require("../../assets/images/home/icon_bot_dark.png")} // Replace with the correct path to your local image
          style={toolbarStyle.iconSmallest}
        />
      </TouchableOpacity>
    </View>
  );
}

const ToolbarHome = ({ title, onBack }) => {
  const navigate = useNavigate();
  return (
    <View style={toolbarStyle.containerBlue}>
      <TouchableOpacity
        onPress={onBack || (() => navigate(-1))}>
        <Image
          source={require("../../assets/images/home/icon_back_white.png")} // Replace with the correct path to your local image
          style={toolbarStyle.iconSmallest}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
          marginStart: 16
        }}
      >
        <Text style={toolbarStyle.titleWhite}>{title}</Text>
        {/* <Text style={{ fontSize: 13, fontWeight: "400", color: "#fff" }}>
                    General Store, Cincinnati
                </Text> */}
      </View>

      {/* Right Side: Home Icon */}
      <TouchableOpacity
        onPress={() => { navigate('/chatBot') }}>
        <Image
          source={require("../../assets/images/home/icon_bot.png")} // Replace with the correct path to your local image
          style={[toolbarStyle.iconSmallest, { marginEnd: 16 }]}
        />
      </TouchableOpacity >
      <TouchableOpacity
        onPress={() => { navigate('/notifications') }}>
        <Image
          source={require("../../assets/images/home/icon_notification.png")} // Replace with the correct path to your local image
          style={toolbarStyle.iconSmallest}
        />
      </TouchableOpacity>
    </View>
  );
}

const ToolbarSummarize = ({ title, onBack, actions = [] }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <View>
      {/* Header Container */}
      <View style={styles.containerWithBottomLine}>
        {/* Back Button */}
        <TouchableOpacity onPress={onBack}>
          <Image
            source={require("../../assets/images/home/icon_back.png")}
            style={styles.iconBack}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Robot Icon */}
        <TouchableOpacity onPress={toggleModal}>
          <Image
            source={require("../../assets/images/home/icon_bot_dark.png")}
            style={styles.iconSmallest}
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            {/* Modal Dropdown Below Header */}
            <View style={styles.modalContent}>
              {actions.length > 0 ? (
                actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => {
                      toggleModal();
                      action.onPress();
                    }}
                  >
                    {/* Action Image */}
                    {action.image && (
                      <Image
                        source={action.image}
                        style={styles.actionImage}
                      />
                    )}

                    {/* Action Text */}
                    <Text style={styles.optionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noOptionsText}>No actions available</Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const CustomAlert = ({ message, type, onClose }) => {
  const navigate = useNavigate();
  const backgroundColor = type === 'success' ? '#e6f4ea' : '#fdecea';
  const textColor = type === 'success' ? '#2e7d32' : '#c62828';

  const handleClose = () => {
    if (type === 'success') {
      navigate(-1);
    } else {
      onClose(); // Close alert without navigation
    }
  };

  return (
    <View style={[alertStyles.alertContainer, { backgroundColor }]}>
      <Text style={[alertStyles.alertIcon, { color: textColor }]}>
        {type === 'success' ? '✔' : ''}
      </Text>
      <Text style={[alertStyles.alertMessage, { color: textColor }]}>{message}</Text>
      <TouchableOpacity onPress={handleClose}>
        <Text style={[alertStyles.alertClose, { color: textColor }]}>✖</Text>
      </TouchableOpacity>
    </View>
  );
};

const alertStyles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  alertMessage: {
    flex: 1,
    fontSize: 16,
  },
  alertClose: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export { Toolbar, ToolbarWith2Img, ToolbarHome, ToolbarSummarize, CustomAlert };

const toolbarStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "#fff",
    // borderBottomWidth: 0.5, // Bottom border
    // borderBottomColor: "#E0E0E0",
  },
  containerWithoutBottomLine: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "#fff",
  },
  containerWithBottomLine: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5, // Bottom border
    borderBottomColor: "#E0E0E0",
  },
  containerBlue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#5B57C7",
    // transition: 'top 0.3s ease', // Smooth transition
  },
  profilePic: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "500",
    color: '#242424',
    marginStart: 16
  },
  titleWhite: {
    fontSize: 20,
    fontWeight: "500",
    color: '#fff'
  },
  iconSmallest: {
    width: 24, // Adjust icon size as needed
    height: 24
  },
  iconBack: {
    width: 24, // Adjust icon size as needed
    height: 24
  },
});

const styles = StyleSheet.create({
  containerWithBottomLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    height: 56,
  },
  iconBack: {
    width: 24,
    height: 24,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "500",
    color: '#242424',
    marginStart: 16
  },
  iconSmallest: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "fff",
    marginBottom: 70,
  },
  modalContent: {
    position: "absolute",
    top: 70, // Adjust to display just below the header
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 5,
    marginBottom: 50,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionImage: {
    width: 26,
    height: 26,
    marginRight: 20, // Add spacing between image and text
    marginLeft: 8,
    resizeMode: "contain",
  },
  optionText: {
    fontSize: 16,
    color: "#242424",
    fontWeight: "400",
  },
  noOptionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "#999",
  },
});


// import React from "react";
// import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
// import { useNavigate } from "react-router-dom";

// const Header = ({ title, onBack }) => {
//   const navigate = useNavigate();

//   return (
//     <View style={styles.header}>
//       {/* Back Button */}
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={onBack || (() => navigate(-1))}
//       >
//         <Image
//           source={require("../../assets/images/home/back_icon.png")}
//           style={styles.backArrow}
//         />
//       </TouchableOpacity>

//       {/* Title */}
//       <Text style={styles.title}>{title}</Text>
//     </View>
//   );
// };

// export default Header;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 30,
//     marginBottom: 20,
//     paddingBottom: 20, // Space between content and bottom line
//     borderBottomWidth: 1, // Thickness of the bottom line
//     borderBottomColor: "#ccc", // Grey color for the bottom line
//   },
//   backButton: {
//     marginRight: 20,
//     left: 20
//   },
//   backArrow: {
//     width: 30,
//     height: 15,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#000",
//     left: 40,
//     flex: 1, // Allow title to take up remaining space
//     textAlign: "left",
//   },
// });
