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

// Import assets
import RobotIcon from "../../assets/images/task/icon_robot_blue.png";
import UploadIcon from "../../assets/images/task/icon_upload.png";
import DeleteIcon from "../../assets/images/task/icon_delete.png";
import CheckIcon from "../../assets/images/task/icon_check.png";
import AnalyticsIcon from "../../assets/images/task/icon_ai_new.png";
import CheckBoxSelectedIcon from "../../assets/images/task/icon_checkbox.png";
import CheckboxUnselected from "../../assets/images/task/icon_uncheck.png";

import TaskModel from '../../models/TaskModel';
import Utils from "../../utils/Utils";
import { ToolbarSummarize } from "../../components/nrf_app/Toolbar";


const TitleIcon = require("../../assets/images/task/icon_edit.png"); // Replace with actual path
const ViewMoreIcon = require("../../assets/images/task/icon_viewmore.png"); // Replace with actual path
const ViewLessIcon = require("../../assets/images/task/icon_viewless.png"); // Replace with actual path


const TaskSummaryEx = () => {
  const navigate = useNavigate();
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { taskIdnew } = useParams(); // Get taskId from the URL

  const [currentChecklistIndex, setCurrentChecklistIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecklistVisible, setChecklistVisible] = useState(false);
  const [error, setError] = useState(null);
  const [checkListDataArray, setCheckListDataArray] = useState([]);
  let uploadedCheckListDataArray = [];



  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    currentChecklist.status = !currentChecklist.status
  };
  const closeModal = () => {
    setChecklistVisible(false); // Close the modal
  };

  const taskId = parseInt(taskIdnew, 10);

  console.log("Task ID is :", taskId);


  useEffect(() => {
    const loadTaskDetails = async () => {
      try {
        setLoading(true); // Start loading
        const taskModel = new TaskModel(taskId); // Initialize the TaskModel
        const fetchedTaskDetails = await taskModel.fetchTaskDetails(); // Await API or fallback JSON data
        setTaskDetails(fetchedTaskDetails); // Set the task details
      } catch (err) {
        setError(err.message); // Capture and store errors
      } finally {
        setLoading(false); // End loading
      }
    };

    loadTaskDetails(); // Call the async function
  }, [taskId]); // Re-fetch data if the taskIdnew changes


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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  // Ensure taskDetails is available before rendering the rest of the UI
  if (!taskDetails) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No task details available.</Text>
      </View>
    );
  }

  console.log(taskDetails)
  const checklist = taskDetails.checklist || [];
  const currentChecklist = checklist[currentChecklistIndex] || {};


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const uploadedImageData = {
        id: Date.now(),
        imageName: file.name,               // The name of the image file
        imageBase64: reader.result,         // The base64 encoded image data
        ImageUri: URL.createObjectURL(file) // URL to access the image
      };
      setUploadedImages((prev) => [...prev, uploadedImageData]);
    };


    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Convert priority number to text
  const getPriorityText = (priority) => {
    switch (priority) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      case 4:
        return "Urgent";
      default:
        return "Medium";
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 4) return styles.highPriority;
    if (priority === 3) return styles.highPriority;
    if (priority === 2) return styles.mediumPriority;
    return styles.lowPriority;
  };


  const STATUS_MAPPING = {
    1: { text: "Yet to Start", color: "#616161" }, // Gray
    2: { text: "In Progress", color: "#BC4B09" }, // Brown
    3: { text: "Completed", color: "#0E700E" },   // Green
    4: { text: "Over Due", color: "#C50F1F" },    // Red
  };

  const getStatusDetails = (status) => {
    const statusNumber = Number(status);

    return STATUS_MAPPING[statusNumber] || { text: "Yet To Start", color: "#616161" }; // Default fallback
  };
const base64Image = "YVZaQ1QxSjNNRXRIWjI5QlFVRkJUbE5WYUVWVlowRkJRVVZuUVVGQlFrbERRVmxCUVVGQ1ZqZGlUa2hCUVVGQlExaENTVmRZVFVGQlEwVTBRVUZCYUU5QlJrWnNha1puUVVGQlFVRllUbE5TTUVsQmNuTTBZelpSUVVGQlFWSnVVVlV4UWtGQlEzaHFkM1k0V1ZGVlFVRkJVMnhUVlZKQ1ZraG5RamRhZUhSVWFITjRSVWxhWmtGb1NXZEpXbGRsUVVoTlEydHVLMEZDVGpKamIwaEJRelpCYlVGRk5VTmpaMUJSUlRCQ1QxVnVhVU5NUlVGR0swRlRaVzlsTkV4VFVETjNTVUZ3TUZKcWExUlVNazkwWkdVM0sybG1VMUZ5UVdVdlF6ZHdkbmh5UjJNNFJHeENVbFZXUmxKVlZrWlhTbkJCZUZZeFpGZzRMMll6T1RoSVRIazBkVmx1U25oamJYQnBXWEZNS3l0MmN6VlViSGhuTmxaSVMycDJiSFJ4VGpOU09FOUVZek5rT1RGdlRrYzJVa2xhYTBsNFMwazRVRVI2Y3pCT2RFRk9VbVpEWm5JdkwyYzRVVGxZYkd4YWExVnBXbFpCVlRaUVZEQk9jSEZoYlRsMVJYVnBiemQzSzJadE5YWmlZVEpHYVVsc1ZXaEZiMEV5UjBkclZUbFFWRE4yY2pZcmRrZzRTWGhZWjJNM1VIcDNWemxJUTBrM1dWbFpOVzkwWWpKUFpsSnhPRVZUZGpFNWMyeGFNM0ZHTDAxU2FIUnhiREY2T0RkUGRIVkZTbHAzZEdsQ0wzbzBLMHhvVURSMWVXbFJUa1F4WkVaYVdGWXZabWRwU2s1QlUzQjNkVmhWZDJSQ1dWTnRSVTVrTUdKYWMzVlJlVFo0VVUxeVptUlFTQzh2UzFadlUwZHlUbkJEU1d3NGEwVnNSVzlqVWpGTWNITTNWV2hCU1c5SVNXUk1LMnBJVDBsTlJVOTNTMnR2WjFWWE5rTk1hVFIxUkc5MmIyTkZNM3BPUms5TWMzaDZkM1J1Wnk5cGVESmxkRlpxZEVWcFUwZG9PWFZxY0RGeVJUa3piSEZuYTNaclpFeFNlamhyYjNSdk1rUndkRFo1UmtkbU4ybEdhMjkyUkd0RWFuTm9ObmhJWjFwVlJqQlRlRFZSZW01dGMxbEhRek5MV2s1clIzUnNVVk5VVDBGaldVMUdWWGhJUldsclVTdGFORUZaZWtNd1VtaENkekZwU0hGSlFuTk1hWFl4YjB4QmN6SldiVlF3VVdWeVNqbFNUbXA2VFhwTmVrVmtWRWQwWkc5UlpsUnJNbXRCZURSV2R6RlNLM0JPWlhZd1IwSXJOM1UzYjNoYWFVTnNWRXA2Ym01NmVXZGxhMnh4VkVwdWRGTXZVbmxUY0ZNNFoxbFNOa3RLY2pabWFsQXlOa1JvVnpOQ1EyZFhSV2xOYVdNeGNuaFBSVVo1UVd4UFRYQm9WMGxXYVVkTFJtMDVTbUZPU1ZkVlZsbFJRbE01UkRabWNUQkJkRWR1UlhGQk5GTkhha1YxWW5rNE9VeEZORWxJVVdSWGIwWTBVVkV2UmxGTlNXZEViakpSVEZSb1F6azNjV3MyZWsxS09VRklOVWsxUjNsUFNYZHdabFpOZW01TVVVbFFPWHBuTjFWaWFrbHdSMEpQU1hkTFdVVmthWE54UVVaMVEwZHdUR1JKVGpGeGJYZ3lUekpaTlRKWmFXcHJURzlQY25sMGFUUXdaMlpJSzBRNVREUkdUelZJTkc1RGVrWk5Xa3RoVVVSU1JTOTNlaTk2YTBscmFWRkxTbmMyVW5CUlZuTnhiSFp6U0djd1oxTkNVazlJVFZSdWNGZ3pRa0ZQWWpaMWNGVm5VeXRaYjJwa1VqRmhaMWRvTWl0b2RuVkRSVk5NU2twSGVqVmFhVTEzVkZOVWRtOUZaa0pCZDJsVlluRm9hMlpsZHpSclV5dHljeTlyWnpZM2FFUjNSMDVUUzA1NVRWUnVORWhQTWpsdFoxTlRPRWwxUVZKeFZETTFUMGRSZFdZMVVqRTJZMVpoU0ZveVRtOVNMMEpCZDJrMVpsY3dOSFZLVVZoYU9WZEpSMWcyU1daM2FrMUZTMnQyVFZGb0x6Tk9hVk55YTJGTk5HOUZTalpKUXl0RlptZHlVa3R6VkdSTlFuWnlaMDVGYldOTUsxZERjMkY2VVcwM1ZsZzFjbTh2U0daYVJscE9RekZFUnpKbVUwdFJObnBSYzBSRVN6SnhUak5wWWxWcFFrOUdiRFJ3SzNZNUswdFBjMXB4WWxvMFkwdHNaREZDUW1kMmNFVnlSRWRNUlU1V2MyWlBhWFJUTmxkcFVsZEJjRWhUU1dOaVRFWjRNMUoxY0hCV1ZsZzJZMlJOWTFoVk9IaFRTV2xTYVdwQmFISm5aR3BpVlRSUkwwUnJUWFF4YkdGR1YwRnRlalZsV0d4RWJHNVNWalZSVlhadVdWTTFlV3BQVDJKRmVtbG9VMnAwWW1sRFNGTlhSSEkxYmpoVWRYcDBSWEpGUmpSemJtbzVVRkl3UlM4MmFpOVVWR2hoY0VKT1NrTkNVbFJzY2s1elRYTnBhMjlVUkZablUyNTZVM2RqYTFoT2VGbzFSVE56TjBNeGRTdDRlamxpUzJoeWRHWnlaR1ZvYVdSc1FXY3lRMGQ2ZGpOVVpFSlBlSFI0ZVVaYU1IcGlaVFpvYTBaamExUk9NV1J3ZUhGMWJFNWxUaXRUZVZGWWJscEZNalUxU0ZrMFQzRm1MM1psTVhwVE5scFlaMUZoYjNkdVQzVnlVbUpKUVVOV1RWTTBWa1ZZYTJ4R2IwRkdZMWsyTUhONWNXdERWRVZsWVhkbmVFbFdZVUZDWVhWb2VIaGxlVWR4TVdoTGJFcEVWekI2Y0ZwbVFYUkVTbWRMT1ZJMlZuZzJObkpGY2pZMlYzRk5WbmQxVVRKMlpHNUxLMjFzTlRVeGN6Vk9PR3R3VERGc09VNVZWa1pTVlZaR1VsVldOeXRCY2pZeVdHMWxPRXN2WkRWQlFVRkJRVVZzUmxSclUzVlJiVU5E"
  const handleImageUploadButton = () => {
    document.getElementById("imageInput").click(); // Simulate file input click
  };

  // Handle delete image
  const handleDeleteImage = (id) => {
    setUploadedImages((prev) => prev.filter((image) => image.id !== id));
  };

  // Handle scan button click
  const handleScanClick = () => {
    const url =
      "https://websdk.demos.scandit.com/?_gl=1*1o3c3lj*_gcl_au*MTg5OTE4MzU4LjE3MzE1ODI5NzY.*_ga*NjUxMzIwNDY2LjE3MzE1ODI5NzA.*_ga_TXJZRPJJ0T*MTczMTU4Mjk3MC4xLjEuMTczMTU4MzMzOS41Ni4wLjA.";
    window.open(url, "_blank");
  };

  const handleToggleMore = () => {
    setShowMore(!showMore);
  };

  const handleViewAllPress = () => {
    // Add your logic for the "View All" button here
    console.log("View All pressed");
    setChecklistVisible(true); // Open the modal
  };


  const handleBack = () => {
   navigate(-1);
  };

  const handleEdit = () => {
    navigate("/editTask", { state: { taskDetails } }); // Pass the object via state
   };

  const actions = [
    {
      label: "Autofill",
      onPress: () => console.log("Autofill Pressed"),
      image: require("../../assets/images/task/icon_autofill.png"),
    },
    {
      label: "Ask a question",
      onPress: () => console.log("Ask a Question Pressed"),
      image: require("../../assets/images/task/icon_ask_question.png"),
    },
  ];

 
// const renderChecklistItem = ({ item }: { item: ChecklistItem }) => {
//   return (
//     <View style={styles.checklistItem}>
//       {/* Status Icon */}
//       <Image
//         source={
//           item.status
//             ? require("../../assets/images/task/icon_green_check.png")
//             : require("../../assets/images/task/icon_grey_check.png")
//         }
//         style={styles.statusIcon}
//       />

//       {/* Title and Description */}
//       <View style={styles.checklistContent}>
//         <Text style={styles.checklistTitle}>{item.title}</Text>
//         <Text style={styles.checklistDescription}>{item.description}</Text>
//         {item.checklistType === 0 && (
//           <>
//           <View style={styles.checklistContent}>
//          <Text style={styles.attachmentText}>No Validation</Text>
//          </View>
//           </>
//         )}
//         {/* ChecklistType == 1: Show Attachments */}
//         {item.checklistType === 1 && item.attachements?.length > 0 && (
//           <>
//             {item.attachements.map((attachment) => (
//               <View key={attachment.id} style={styles.attachment}>
//                 {attachment.imageBase64 ? (
//                   <Image
//                     source={{
//                       uri: `data:image/png;base64,${attachment.imageBase64}`,
//                     }}
//                     style={styles.attachmentImage}
//                     resizeMode="contain"
//                   />
//                 ) : null}
//                 <Text style={styles.attachmentText}>{attachment.id}</Text>
//               </View>
//             ))}
//           </>
//         )}
//       </View>

//       {/* Bottom Line */}
//       <View style={styles.bottomLine} />
//     </View>
//   );
// };


const renderChecklistItem = ({ item }: { item: ChecklistItem }) => {
  const getValidationButton = (type) => {
    switch (type) {
      case 0:
        return (
          <Text style={styles.validationButton}>No Validation</Text>
        );
      case 1:
        return (
          <Text style={styles.validationButton}>Image Validation</Text>
        );
      case 2:
        return (
          <Text style={styles.validationButton}>BarcodeScan Validation</Text>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.checklistItem}>
      {/* Status Icon */}
      <Image
        source={
          item.status
            ? require("../../assets/images/task/icon_green_check.png")
            : require("../../assets/images/task/icon_grey_check.png")
        }
        style={styles.statusIcon}
      />

      {/* Title and Description */}
      <View style={styles.checklistContent}>
        <Text style={styles.checklistTitle}>{item.title}</Text>
        <Text style={styles.checklistDescription}>{item.description}</Text>

        {/* Validation Button */}
        {getValidationButton(item.checklistType)}
      </View>

      {/* Bottom Line */}
      <View style={styles.bottomLine} />
    </View>
  );
};

 

  return (
    <ScrollView style={styles.container}
      bounces={false} // Disable bounce on iOS
      overScrollMode="never"
      horizontal={false}
      showsHorizontalScrollIndicator={false} >
      {/* Header */}
      <View style={styles.content}>
        {/* <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigate(-1)} // Navigate to the previous screen
          >
            <Image
              source={require("../../assets/images/home/icon_back.png")}
              style={styles.backArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Details</Text>
          <Image source={RobotIcon} style={styles.robotIcon} />
        </View> */}
        {/* <Toolbar
          title={'Task Details'}
        /> */}
        <ToolbarSummarize title="Task Detail" onBack={handleBack} actions={actions} />

        <View style={styles.taskDetailscard}>


          <View style={styles.titleContainer}>
            {/* Title Row with Icon */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>{taskDetails.title}</Text>
                <TouchableOpacity
                      onPress={handleEdit}>
                       <Image source={TitleIcon} style={styles.titleIcon} />
                    </TouchableOpacity>
              
              {/* <Image source={TitleIcon} style={styles.titleIcon} /> */}
            </View>

            {/* Status and Priority Row */}
            <View style={styles.statusPriorityRow}>
              {/* Status Text on Left */}
              <Text style={[styles.status, { color: getStatusDetails(taskDetails.status).color }]}>
                {getStatusDetails(taskDetails.status).text}
              </Text>

              {/* Priority Chip on Right */}
              <View style={styles.priorityChip}>
                <Text style={[styles.priorityText, getPriorityColor(taskDetails.priority)]}>
                  {getPriorityText(taskDetails.priority)}
                </Text>
              </View>
            </View>
          </View>


          {/* Divider */}
          <View style={styles.divider} />

          {/* Show More Content */}
          {showMore && (
            <>
              {/* Assigned By */}
              <View style={styles.detailRow}>
                <Text style={styles.label}>Assign To:</Text>
                <Text style={styles.value}>{taskDetails.assignedToName}</Text>
              </View>

              {/* Category */}
              <View style={styles.detailRow}>
                <Text style={styles.label}>Category:</Text>
                <Text style={styles.value}>{taskDetails.taskCategory}</Text>
              </View>

              {/* Due By */}
              <View style={styles.detailRow}>
                <Text style={styles.label}>Due By:</Text>
                <Text style={styles.value}>{taskDetails.dueDate}</Text>
              </View>
            </>
          )}

        </View>
 {/* Checklist Section */}
 <View style={styles.checkListHeaderView}>
        <Text style={styles.sectionTitle}>Checklist</Text>
        </View>
        <FlatList
  data={taskDetails.checklist}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderChecklistItem}
  scrollEnabled={true}
  contentContainerStyle={styles.flatListContentContainer}
  style={styles.flatList}
/>
       
   
     
        
        {/* Next/Complete Button */}
        {/* <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNextOrComplete}>
      
        <Text style={styles.navbuttonText}>
          {currentChecklistIndex === taskDetails.checklist.length - 1 ? 'Complete' : 'Next'}
        </Text>
      </TouchableOpacity> */}

      
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    marginBottom: 100,
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
  checkListHeaderView: {
    height: 44,
    left: 0,
    right: 0,
    backgroundColor: "#F5F5F5",
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
  // checklist

  
  card: {
    backgroundColor: "#FFF",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  taskNumber: { color: "#888", marginBottom: 10 },
  label: { color: "#888", fontSize: 14 },
  value: { fontSize: 14, fontWeight: "500" },
  status: { color: "#F2994A" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 16,
    marginTop: 12,
    color: "#242424",
  },

 
  statusIcon: { width: 24, height: 24, marginRight: 10 },
  checklistContent: { flex: 1 },
  checklistTitle: { fontSize: 16, fontWeight: "500", color: "#242424" },
  checklistDescription: { fontSize: 13, color: "#616161", marginTop: 5, fontWeight: "400" },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  attachmentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  attachmentText: { fontSize: 14, color: "#242424" },
 checklistItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 16,
  backgroundColor: "#fff", // Optional, set a background for contrast
  borderBottomWidth: 1, // Adds a 1-pixel bottom line
  borderBottomColor: "#ccc", // Adjust the color to your preference (e.g., light grey)
},
validationButton: {
  fontSize: 14,
  color: "#242424",
  fontWeight: "500",
  borderWidth: 1,
  borderColor: "#e0e0e0",
  borderRadius: 4,
  paddingHorizontal: 10,
  paddingVertical: 5,
  alignSelf: "flex-start",
  marginBottom: 4,
  marginTop: 14,
},
  bottomLine: {
    height: 0, // 1-pixel height
    backgroundColor: "#fff", // Light gray for the dividing line
    marginTop: 10, // Add spacing before the line, if needed
    alignSelf: "stretch", // Ensure it spans the full width of the cell
  },
  flatList: {
    backgroundColor: "#fff", // Light background for the list
    marginVertical: 10, // Adds spacing above and below the list
    width: "100%",
  },
  flatListContentContainer: {
    paddingHorizontal: 0, // Adds padding to the left and right of the list items
    padding: 0,
    paddingBottom: 20, // Adds padding at the bottom of the list
  },
//checklist
});

export default TaskSummaryEx;




// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// // import { useNavigation } from "@react-navigation/native";

// const TaskSummaryEx = () => {
//   // const navigation = useNavigation();

//   const taskData = {
//     id: 45,
//     title: "Restocking Grungold in aisle c5",
//     taskNumber: "#TK224",
//     assignee: "SM23456 - Francis",
//     category: "Stock Display",
//     status: "In Progress",
//     priority: "High",
//     dueDate: "20/10/2024; 05:00PM",
//     location: "Aisle c5 - Dairy product",
//     checklist: [
//       {
//         id: 1,
//         title: "Identify and Gather",
//         description:
//           "Locate empty or low-stock areas on the shelves. Gather the necessary products from the stockroom.",
//         status: true,
//         attachments: [],
//       },
//       {
//         id: 2,
//         title: "Restock and Organize",
//         description:
//           "Place products on the shelves, ensuring they are neatly arranged and facing forward. Rotate stock to prioritize older products.",
//         status: true,
//         attachments: [
//           {
//             id: 1,
//             name: "Restocking Image",
//             imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." // Example base64 string
//           },
//         ],
//       },
//       {
//         id: 3,
//         title: "Verify and Clean",
//         description:
//           "Double-check pricing and product information. Clean the shelf area to maintain a tidy and inviting display",
//         status: false,
//         attachments: [
//           {
//             id: 2,
//             name: "Cleaning Image",
//             imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." // Example base64 string
//           },
//         ],
//       },
//     ],
//   };

//   // Navigate to Create Task Screen
//   const handleEdit = () => {
//     // navigation.navigate("CreateTask", { taskData });
//   };

//   const renderChecklistItem = ({ item }) => (
//     <View style={styles.checklistItem}>
//       {/* Status Icon */}
//       <Image
//         source={
//           item.status
//             ? require("../../assets/images/task/icon_checkbox.png")
//             : require("../../assets/images/task/icon_uncheck.png")
//         }
//         style={styles.statusIcon}
//       />

//       {/* Title and Description */}
//       <View style={styles.checklistContent}>
//         <Text style={styles.checklistTitle}>{item.title}</Text>
//         <Text style={styles.checklistDescription}>{item.description}</Text>

//         {/* Attachments */}
//         {item.attachments.length > 0 &&
//           item.attachments.map((attachment) => (
//             <View key={attachment.id} style={styles.attachment}>
//               {attachment.imageBase64 ? (
//                 <Image
//                   source={{ uri: attachment.imageBase64 }} // Use base64 string as image source
//                   style={styles.attachmentImage}
//                 />
//               ) : null}
//               <Text style={styles.attachmentText}>
//                 {attachment.name} {"\n"} {/* Here you can also show size if needed */}
//               </Text>
//             </View>
//           ))}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <Image
//             source={require("../../assets/images/home/icon_back.png")}
//             style={styles.backIcon}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Task Detail</Text>
//         <TouchableOpacity onPress={handleEdit}>
//           <Image
//             source={require("../../assets/images/task/icon_right_arrow.png")}
//             style={styles.editIcon}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Task Information */}
//       <View style={styles.card}>
//         <Text style={styles.taskTitle}>{taskData.title}</Text>
//         <Text style={styles.taskNumber}>{taskData.taskNumber}</Text>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Assign To</Text>
//           <Text style={styles.value}>{taskData.assignee}</Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Category</Text>
//           <Text style={styles.value}>{taskData.category}</Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Status</Text>
//           <Text style={[styles.value, styles.status]}>{taskData.status}</Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Due By</Text>
//           <Text style={styles.value}>{taskData.dueDate}</Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Location</Text>
//           <Text style={styles.value}>{taskData.location}</Text>
//         </View>
//       </View>

//       {/* Checklist Section */}
//       <Text style={styles.sectionTitle}>Checklist</Text>
//       <FlatList
//         data={taskData.checklist}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderChecklistItem}
//         scrollEnabled={false}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F8FA",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 15,
//     backgroundColor: "#FFF",
//     elevation: 2,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   backIcon: { width: 24, height: 24 },
//   editIcon: { width: 24, height: 24 },

//   card: {
//     backgroundColor: "#FFF",
//     margin: 10,
//     padding: 15,
//     borderRadius: 10,
//     elevation: 1,
//   },
//   taskTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "#333",
//   },
//   taskNumber: { color: "#888", marginBottom: 10 },
//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 3,
//   },
//   label: { color: "#888", fontSize: 14 },
//   value: { fontSize: 14, fontWeight: "500" },
//   status: { color: "#F2994A" },

//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginHorizontal: 15,
//     marginTop: 10,
//   },

//   checklistItem: {
//     flexDirection: "row",
//     padding: 15,
//     backgroundColor: "#FFF",
//     marginHorizontal: 10,
//     marginTop: 5,
//     borderRadius: 8,
//     elevation: 1,
//   },
//   statusIcon: { width: 24, height: 24, marginRight: 10 },
//   checklistContent: { flex: 1 },
//   checklistTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
//   checklistDescription: { fontSize: 14, color: "#666", marginTop: 3 },
//   attachment: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   attachmentImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   attachmentText: { fontSize: 14, color: "#444" },
// });

// export default TaskSummaryEx;
