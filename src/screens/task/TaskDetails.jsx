import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  View, Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useMsal } from "@azure/msal-react";
import { getTodoTaskById } from "../../graph";

// Import assets
import AnalyticsIcon from "../../assets/images/task/icon_ai_new.png";
import CheckBoxSelectedIcon from "../../assets/images/task/icon_checkbox.png";
import CheckboxUnselected from "../../assets/images/task/icon_uncheck.png";
import { Toolbar, CustomAlert } from "../../components/nrf_app/Toolbar";

const TitleIcon = require("../../assets/images/task/icon_task_title.png");
const ViewMoreIcon = require("../../assets/images/task/icon_viewmore.png");
const ViewLessIcon = require("../../assets/images/task/icon_viewless.png");

// --- Static Data for Checklist and AI Insights ---
const staticChecklistData = [
    { id: 'static-1', displayName: 'Check stock levels for new arrivals.', isChecked: false },
    { id: 'static-2', displayName: 'Update promotional displays.', isChecked: false },
    { id: 'static-3', displayName: 'Clear out old signage.', isChecked: false },
];

const TaskDetail = () => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const { taskId } = useParams();

  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the static checklist
  const [checklist, setChecklist] = useState(staticChecklistData);
  const [currentChecklistIndex, setCurrentChecklistIndex] = useState(0);
  
  const [showMore, setShowMore] = useState(false);
  const [isChecklistVisible, setChecklistVisible] = useState(false);

  const TODO_LIST_ID = "AQMkADAwATM0MDAAMi04YWQ5LTdiMzUtMDACLTAwCgAuAAADw8ADLWR1jEyjK-zRiJ5a4QEAfbDmQaC5xUSOA0nLtSH2LQAAAgESAAAA";

  useEffect(() => {
    const loadTaskDetails = async () => {
      if (!taskId || accounts.length === 0) {
        setError("Task ID is missing or user is not authenticated.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const request = {
          scopes: ["Tasks.Read"],
          account: accounts[0],
        };
        const response = await instance.acquireTokenSilent(request);
        const fetchedTaskDetails = await getTodoTaskById(response.accessToken, TODO_LIST_ID, taskId);
        
        if (fetchedTaskDetails && !fetchedTaskDetails.error) {
          setTaskDetails(fetchedTaskDetails);
        } else {
          setError(fetchedTaskDetails.error?.message || "Failed to fetch task details.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTaskDetails();
  }, [taskId, accounts, instance]);

  const closeModal = () => setChecklistVisible(false);

  // --- Helper Functions for Display ---
  const getPriorityText = (importance) => {
    switch (importance) {
      case "low": return "Low";
      case "normal": return "Medium";
      case "high": return "High";
      default: return "Medium";
    }
  };

  const getPriorityColor = (importance) => {
    if (importance === "high") return styles.highPriority;
    if (importance === "normal") return styles.mediumPriority;
    return styles.lowPriority;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "notStarted": return "Not Started";
      case "inProgress": return "In Progress";
      case "completed": return "Completed";
      default: return "Not Started";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#0E700E";
      case "inProgress": return "#BC4B09";
      default: return "#616161";
    }
  };
  
  const formatDueDate = (dueDateTime) => {
    if (!dueDateTime || !dueDateTime.dateTime) return "No due date";
    return new Date(dueDateTime.dateTime).toLocaleDateString();
  };

  // --- Event Handlers ---
  const handleToggleMore = () => setShowMore(!showMore);
  const handleViewAllPress = () => setChecklistVisible(true);

  const handleNextOrComplete = () => {
    if (currentChecklistIndex < (checklist.length - 1)) {
      setCurrentChecklistIndex(prev => prev + 1);
    } else {
      setAlert({ visible: true, message: 'Task Completed!', type: 'success' });
    }
  };
  
  const handlePrevious = () => {
    setCurrentChecklistIndex((prev) => Math.max(0, prev - 1));
  };

  const toggleCheckbox = (checklistItemId) => {
    const updatedChecklist = checklist.map(item => 
      item.id === checklistItemId ? { ...item, isChecked: !item.isChecked } : item
    );
    setChecklist(updatedChecklist);
  };

  // --- Render Logic ---
  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  if (error) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>Error: {error}</Text></View>;
  }

  if (!taskDetails) {
    return <View style={styles.noDataContainer}><Text style={styles.noDataText}>No task details available.</Text></View>;
  }

  const currentChecklist = checklist[currentChecklistIndex] || {};
  const isCompleteDisabled = !checklist.every(item => item.isChecked);

  return (
    <ScrollView style={styles.container} bounces={false} overScrollMode="never">
      <View style={styles.content}>
        <Toolbar title={'Task Details'} />

        {alert.visible && (
          <CustomAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ visible: false, message: '', type: '' })}
          />
        )}

        <View style={styles.taskDetailscard}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{taskDetails.title}</Text>
              <Image source={TitleIcon} style={styles.titleIcon} />
            </View>
            <View style={styles.statusPriorityRow}>
              <Text style={[styles.status, { color: getStatusColor(taskDetails.status) }]}>
                {getStatusText(taskDetails.status)}
              </Text>
              <View style={styles.priorityChip}>
                <Text style={[styles.priorityText, getPriorityColor(taskDetails.importance)]}>
                  {getPriorityText(taskDetails.importance)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {showMore && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Assigned By:</Text>
                <Text style={styles.value}>{accounts[0]?.name || 'Current User'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Category:</Text>
                <Text style={styles.value}>{taskDetails.categories?.join(', ') || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Due By:</Text>
                <Text style={styles.value}>{formatDueDate(taskDetails.dueDateTime)}</Text>
              </View>
            </>
          )}

          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={handleToggleMore} style={styles.toggleInnerContainer}>
              <Image source={showMore ? ViewLessIcon : ViewMoreIcon} style={styles.toggleIcon} />
              <Text style={styles.toggleText}>{showMore ? "View Less" : "View More"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Static Checklist and AI Insights Section --- */}
        <View style={styles.checklistContainer}>
          <View style={styles.checkListHeader}>
            <Text style={styles.checklistTopTitle}>Task Checklist</Text>
            <TouchableOpacity style={styles.viewAllContainer} onPress={handleViewAllPress}>
              <Text style={styles.viewAllText}>View All</Text>
              <Image source={require("../../assets/images/task/icon_right_arrow.png")} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>

          <Modal visible={isChecklistVisible} animationType="fade" transparent={true} onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Task Checklist</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}><Text style={styles.closeButtonText}>✕</Text></TouchableOpacity>
                </View>
                <FlatList
                  data={checklist}
                  renderItem={({ item }) => <Text style={styles.modalItemText}>{item.displayName}</Text>}
                  keyExtractor={(item) => item.id}
                />
              </View>
            </View>
          </Modal>

          <View style={styles.checklistItem}>
            <View style={styles.checklistItemContainer}>
              <TouchableOpacity onPress={() => toggleCheckbox(currentChecklist.id)} style={styles.checkbox}>
                <Image source={currentChecklist.isChecked ? CheckBoxSelectedIcon : CheckboxUnselected} style={styles.checkboxImage} />
              </TouchableOpacity>
              <Text style={styles.checklistItemTitle}>{currentChecklist.displayName}</Text>
            </View>
            <Text style={styles.checklistProgress}>{currentChecklistIndex + 1}/{checklist.length}</Text>
          </View>
          
          <View style={styles.aiAnalyticsContainer}>
            <View style={styles.rowContainer}>
              <Image source={AnalyticsIcon} style={styles.analyticsIcon} />
              <Text style={styles.aiText}>AI Insights</Text>
            </View>
            <View style={styles.aiDiscriptionContainer}>
              <Text style={styles.aiTitle}>Always place older stock in front of newer stock to ensure freshness.</Text>
              <Text style={styles.aiDescription}>Data collected on inventory management resource repository.</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.navigationButtonContainer}>
        <TouchableOpacity
          style={[styles.previousButton, currentChecklistIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentChecklistIndex === 0}
        >
          <Text style={[styles.previousbuttonText, currentChecklistIndex === 0 && styles.disabledButtonText]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, (currentChecklistIndex === checklist.length - 1 && isCompleteDisabled) && styles.disabledCompleteButton]}
          disabled={currentChecklistIndex === checklist.length - 1 && isCompleteDisabled}
          onPress={handleNextOrComplete}
        >
          <Text style={styles.navbuttonText}>{currentChecklistIndex === checklist.length - 1 ? 'Complete' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 0,

    width: "100%", // Ensures the container uses full screen width
    height: "100%",
    overflowX: "hidden", // Prevent horizontal scrolling by hiding overflow
    paddingBottom: 0,
  },
  content: {
    width: "100%", // Ensure the content spans the full width of the screen
    //justifyContent: "",
    padding: 0,
    height: "100%",
    backgroundColor: "#fff"
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    fontSize: 16,
    color: "#C50F1F",
    textAlign: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  noDataText: {
    fontSize: 16,
    color: "#616161",
  },

  detail: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
    paddingBottom: 8, // Adds spacing between content and the bottom border
    borderBottomWidth: 1, // Adds the bottom line
    borderBottomColor: "#ccc", // Light grey color for the line
    height: 70,      // Explicit height for a taller header
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    width: 20,
    height: 15,
    left: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    left: 60,
    flex: 1, // Allow title to take up remaining space
    textAlign: "left",
  },
  robotIcon: { width: 30, height: 30, right: 20, },
  taskDetailscard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  titleIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginLeft: 6,
  },
  statusPriorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12, // Spacing below title row
  },
  status: {
    fontSize: 14,
    fontWeight: 400,
    // color: "#757575", // Gray for status text
  },

  priorityChip: {

    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FDF3F4",
    alignItems: "center",
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  highPriority: {
    color: "#960B18",
  },
  mediumPriority: {
    color: "#8A3707",
  },
  lowPriority: {
    color: "#0C5E0C",
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: "column", // Stack items vertically
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#757575",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#212121",
    marginTop: 4, // Add spacing between label and value
  },
  toggleContainer: {
    justifyContent: "center", // Centers the entire view horizontally
    alignItems: "center", // Centers the content vertically
    marginTop: 16, // Adds spacing above the toggle
  },
  toggleInnerContainer: {
    flexDirection: "row", // Aligns the icon and text horizontally
    alignItems: "center", // Ensures the icon and text are vertically aligned
  },
  toggleIcon: {
    width: 16, // Width of the toggle icon
    height: 16, // Height of the toggle icon
    marginRight: 8, // Space between the icon and text
    marginTop: 4,
  },
  toggleText: {
    fontSize: 14, // Text size
    fontWeight: "500", // Semi-bold text
    color: "#5B57D4", // Purple text color for the toggle
  },

  statusContainer: { marginBottom: 16, marginTop: 20, },
  statusTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  statusButtonContainer: { flexDirection: "row", flexWrap: "wrap" },
  statusButtonText: { fontSize: 14, color: "#fff", fontWeight: "bold" },
  checklistContainer: {
    // backgroundColor: "#ffffff",
    borderRadius: 8,
    // shadowColor: "#000",
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.1,
    // shadowRadius: 4,
    padding: 16,
    margin: 16,
    elevation: 2,
    paddingBottom: 80,
    //  marginBottom: 40,
  },

  checkListHeader: {
    flexDirection: "row", // Align elements horizontally
    justifyContent: "space-between", // Space between title and "View All"
    alignItems: "center", // Vertically align title and button
    marginBottom: 16, // Space below the header
  },
  checklistTopTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#242424",
  },
  checklistItem: {
    padding: 0,
    //borderBottomWidth: 1,
    //borderColor: '#ddd',
  },
  viewAllContainer: {
    flexDirection: "row", // Align "View All" text and arrow horizontally
    alignItems: "center", // Vertically align text and arrow
  },
  viewAllText: {
    fontSize: 14,
    color: "#5B57C7", // Matches the checklist item text color
    fontWeight: "500",
    marginRight: 2, // Space between text and arrow
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain", // Ensure the arrow icon scales properly
  },

  checklistItemContainer: {
    flexDirection: "row", // Align checkbox and title horizontally
    alignItems: "center",
    marginBottom: 10,
    // flex: 1, // Allow left side to take available space
    // marginVertical: 16, // Spacing between checklist items
    //  height: 20,
    //justifyContent: "center", // Space out elements
  },
  checkbox: {
    marginRight: 8, // Exact 8px space between checkbox and title
  },
  checkboxImage: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#888",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },

  checklistTitle: { fontSize: 16, fontWeight: "bold", color: "#424242" },
  checklistProgress: {
    fontSize: 14, right: 2, textAlign: "right", color: "#616161", position: "absolute",
    top: 0, marginBottom: 8
  },
  checklistItemTitle: { fontSize: 16, fontWeight: "bold", color: "#242424" },
  checklistDescription: { fontSize: 16, marginBottom: 16, color: "#424242" },
  estimatedTime: { fontSize: 13, marginBottom: 8, color: "#616161" },
  uploadButton: {
    flexDirection: "row",
    width: 120,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 16,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  uploadIcon: { width: 14, height: 18, marginRight: 8 },
  uploadText: { fontSize: 14, fontWeight: "bold", color: "#5B57C7" },
  scanButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#5B57C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 16,
  },
  scanButtonText: { color: "#5B57C7", fontSize: 14, },
  uploadedImageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  uploadedImage: { width: 100, height: 100, marginRight: 12, marginBottom: 4 },
  imageButtons: { flexDirection: "row", justifyContent: "space-between" },
  icon: { width: 20, height: 20, marginRight: 10 },
  aiAnalyticsContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    elevation: 2,
    marginBottom: 20,
    paddingBottom: 20,
  },
  aiDiscriptionContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    margin: 10,
    elevation: 2,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Vertically center items
    marginVertical: 8, // Optional vertical spacing
  },
  aiText: { fontSize: 14, fontWeight: "bold", marginLeft: 8, color: "#242424", },
  aiTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#323130" },
  analyticsIcon: {
    width: 30, // Adjust size as needed
    height: 30,
    borderRadius: 4,
    marginRight: 8,
    marginLeft: 16,
  },
  aiDescription: { fontSize: 16, color: "#616161", marginBottom: 8 },
  aiButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 40,
  },
  aiButtonsText: {
    fontSize: 16, color: "#616161", marginBottom: 8
  },
  customButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
    //  gap: 8, // Spacing between elements inside the button
    width: 220,
    height: 22,
    backgroundColor: "#E8EBFA", // Light blue background
    borderRadius: 4, // Rounded corners
    borderWidth: 1, // Border width
    borderColor: "#5B57C7", // Border color
    boxSizing: "border-box",
    marginLeft: 16,
  },
  customButtonText: {
    fontStyle: "normal", // Normal font style
    fontWeight: "400", // Regular weight
    fontSize: 14, // Font size
    lineHeight: 18, // Line height
    display: "flex", // Ensures proper text alignment
    alignItems: "center",
    textAlign: "justify",
    color: "#444791", // Text color
  },
  navigationButtonContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // padding: 20,
    // backgroundColor: '#FFFFFF',
    // shadowColor: '#000', // Shadow color
    // shadowOffset: { width: 0, height: -2 }, // Shadow offset for upper shadow
    // shadowOpacity: 0.05, // Shadow transparency
    // elevation: 2, // Elevation for Android shadow
    // position: 'absolute', // Ensures it's fixed at the bottom
    // bottom: 0, // Align to the bottom of the parent
    // left: 0,
    // right: 0,
    // marginBottom: 0,
    // marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  previousButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  previousbuttonText: {
    fontSize: 16,
    color: '#5B57C7',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#5B57C7",
  },
  navbuttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#5B57C7",
    // backgroundColor: '#5B57C7',
    // padding: 10,
    // borderRadius: 5,
    // alignItems: 'center',
  },
  navbuttonText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    paddingVertical: 10,
    borderColor: '#ccc',
  },
  disabledCompleteButton: {
    // opacity: 0.8,  // Make it semi-transparent
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#ccc',
  },
});

export default TaskDetail;
