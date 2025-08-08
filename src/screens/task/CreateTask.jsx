import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigate, useParams } from "react-router-dom";
import Utils from "../../utils/Utils";
import { ToolbarSummarize, CustomAlert } from '../../components/nrf_app/Toolbar';
import { setReloadDashboardData } from '../../utils/LocalStorage';

const defaultDueDate='2025-1-15'

const CreateTaskScreen = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });

  const [taskName, setTaskName] = useState('');
  const [taskCategory, setTaskCategory] = useState('Select a category');
  // const [assignTo, setAssignTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  //const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('High');
  const [checklists, setChecklists] = useState([]);
  const [updatechecklists, setUpdateChecklists] = useState([]);
  const [loading, setLoading] = useState(false);

  const [focusedField, setFocusedField] = useState(null);

  const [assignees, setAssignees] = useState([]); // Selected assignees
  const [isModalVisible, setModalVisible] = useState(false);

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [selectedChecklistIndex, setSelectedChecklistIndex] = useState(null);

  const openDatePicker = () => setIsDateModalVisible(true);
  const closeDatePicker = () => setIsDateModalVisible(false);
  const [aiRecomandationString, setAiRecomandationString] = useState('');

  const { taskDetailId } = useParams(); // Get taskDetailId from the URL

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    taskData.dueDate = newDate;
    closeDatePicker();
  };

  const handleSelectCategory = (category) => {
    setTaskCategory(category);
    taskData.taskCategory = category;
    setIsCategoryModalVisible(false); // Close modal after selection
  };

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState('');
  const [activeIndex, setActiveIndex] = useState(null); // Track which checklist is being edited for success criteria
  const [isRecommendationVisible, setIsRecommendationVisible] = useState(false); // Toggle state


  const [taskData, setTaskData] = useState({
    title: '',
    dueDate: defaultDueDate,
    taskDescription: "Process and deliver curbside orders to customers vehicles",
    status: 1,
    priority: 3,
    assignee: "John.Smith@htlbeta.onmicrosoft.com",
    createdBy: "",
    taskCategory: "",
    taskCategory: "Delivery",
  });

  useEffect(() => {
    if (taskDetailId === "1") {
      initializeReportTaskData();
    } else if (taskDetailId === "2") {
      handleAutofill();
    }
  }, [taskDetailId]);

  const initializeReportTaskData = () => {
    setTaskData({
      title: taskData.title || "Restock fast moving items",
      description: "Replenishing store shelves with fast moving products to ensure inventory levels are maintained and items are readily available for customers",
      dueDate: taskData.dueDate || "",
      taskDescription: "Replenishing store shelves with fast moving products to ensure inventory levels are maintained and items are readily available for customers",
      status: 1,
      priority: 3,
      assignee: "John.Smith@htlbeta.onmicrosoft.com",
      createdBy: "",
      taskCategory: "Product Display",
    });
    setTaskCategory("Product Display");
    setSelectedDate(defaultDueDate);
    taskData.dueDate = defaultDueDate;
    setAssignees(selectedMockAssignee);
    setIsRecommendationVisible(true);
    setAiRecomandationString('“The task created was assigned to John based on the availability, skill and experience that’s required”');

    // checklists[0].name = "sdsdsd"
    setChecklists([{ name: "Identify items", description: "Fast moving products SKU 2200, 2211, 2233 need restocking.", successCriteria: "None" }, { name: "Retrive and place items in shelf", description: "Retrieve items SKU 2200, 2211, 2233 from the backroom.Place items on shelves in designated areas.", successCriteria: "Image" }, { name: "Rotate stocks", description: "Rotate stock to ensure older items are at the front.", successCriteria: "Barcode scanning" }
    ]);

    //{ name: "Rotate stocks", description:"Rotate stock to ensure older items are at the front.", successCriteria: "Barcode scanning" }
  };


  const handleAutofill = () => {
    setTaskData({
      title: taskData.title || "Curbside Fulfillment",
      description: taskData.taskDescription || "",
      dueDate: taskData.dueDate || "",
      taskDescription: "Process and deliver curbside orders to customers vehicles",
      status: 1,
      priority: 3,
      assignee: "John.Smith@htlbeta.onmicrosoft.com",
      createdBy: "",
      taskCategory: "Delivery",
    });
    setTaskCategory("Delivery");
    setSelectedDate(defaultDueDate);
    taskData.dueDate = defaultDueDate;
    setAssignees(selectedMockAssignee);
    setIsRecommendationVisible(true);
    setAiRecomandationString('“The task created was assigned to John based on the availability, skill and experience that’s required”');
    // checklists[0].name = "sdsdsd"
    setChecklists([{ name: "Receive and review customer order", description: "Pick items from store shelves, Pack items securely in bags or boxes,Notify customer that order is ready.", successCriteria: "Barcode scanning" }]);
  };

  const handleCreateTask = async () => {
    try {
      setLoading(true); // Show loading indicator
      const formattedChecklists = formatChecklistData();

      if (!taskData || !formattedChecklists || formattedChecklists.length === 0) {
        //alert('Validation Error, Please ensure all required fields are filled');
        //  setAlert({ visible: true, message: 'Validation Error, Please ensure all required fields are filled', type: 'error' });
        setLoading(false);

        setAlert({ visible: true, message: 'Validation Error, Please ensure all required fields are filled', type: 'error' });
        return;
      }

      console.log('Formatted Checklists:', formattedChecklists);
      console.log('Task Create Data:', taskData);

      // TODO: Implement create task with Microsoft Graph API
      // Placeholder: Always show error until implemented
      setLoading(false);
      setAlert({ visible: true, message: 'Task creation is not yet implemented.', type: 'error' });
    } catch (error) {
      console.log('Error creating task:', error);

      if (error.response) {
        console.log('Response error:', error.response);
        setAlert({ visible: true, message: 'Failed to create task.', type: 'error' });
        // alert(
        //   'Failed to Create Task',
        //   `Server Error: ${error.response || 'Please try again later.'}`
        // );
      } else if (error.request) {
        console.log('Request error:', error.request);
        setAlert({ visible: true, message: 'Failed to create task.', type: 'error' });
        //alert('Failed to Create Task', 'No response from server. Please check your internet connection.');
      } else {
        console.log('Unexpected error:', error.message);
        setAlert({ visible: true, message: 'Failed to create task.', type: 'error' });
        // alert('Failed to Create Task', `Error: ${error.message}`);
      }
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

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

  const handleCancleTask = () => {
    navigate(-1);
  }

  const handleOpenAssignModal = () => {
    setModalVisible(true);
  };

  const handleCloseAssignModal = () => {
    // setAssignees([]);
    setModalVisible(false);
  };

  const handleAssign = (selectedAssignees) => {
    setAssignees(selectedAssignees);
    if (selectedAssignees.length > 0) {
      taskData.assignee = selectedAssignees[0].email;
    }
    setModalVisible(false);
  };

  const categories = ['Stock Display', 'Cleaning', 'Inventory Management', 'Staff Management'];
  const mockAssignees = [
    { id: '2', name: 'John Smith', image: 'https://via.placeholder.com/24', email: 'John.Smith@htlbeta.onmicrosoft.com' },
    { id: '3', name: 'Robert Williams', image: 'https://via.placeholder.com/24', email: 'Robert.Williams@htlbeta.onmicrosoft.com' },
    // Add more mock data as needed
  ];

  const selectedMockAssignee = [
    { id: '2', name: 'John Smith', image: 'https://via.placeholder.com/24', email: 'John.Smith@htlbeta.onmicrosoft.com' },
  ];
  const addChecklist = () => {
    setChecklists([...checklists, { name: "", description: "", successCriteria: "" }]);
  };
  const deleteChecklist = (index) => {
    setChecklists((prevChecklists) => prevChecklists.filter((_, i) => i !== index));
  };

  const updateChecklist = (index, field, value) => {
    const updatedChecklists = [...checklists];
    updatedChecklists[index][field] = value;
    setChecklists(updatedChecklists);
  };

  const updateTaskData = (field, value) => {
    taskData.taskDescription = value;
    setTaskData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const formatChecklistData = () => {
    return checklists.map((item) => ({
      title: item.name || "Checklist title", // Ensure title is captured correctly
      description: item.description || "checklist description",
      status: false,
      checklistType:
        item.successCriteria?.toLowerCase() === 'none'
          ? 0
          : item.successCriteria?.toLowerCase() === 'image'
            ? 1
            : item.successCriteria?.toLowerCase() === 'barcode scanning'
              ? 2
              : 0,
      estimatedTimeInMin: "45",
      aiTitle: "Follow a checklist",
      aiDescription: "Receive and review the order, pick items, pack securely, notify the customer, and deliver to their vehicle with a friendly confirmation.",
      barcodeData: [],
      attachements: []
    }));
  };

  const updateChecklistData = (uiChecklists) => {
    return uiChecklists.map((item) => {
      let checklistType = 0;
      if (item.successCriteria.toLowerCase() === 'image') checklistType = 1;
      else if (item.successCriteria.toLowerCase() === 'Barcode scanning')
        checklistType = 2;

      return {
        title: item.name,
        description: item.description,
        status: false,
        checklistType: checklistType,
        estimatedTimeInMin: "12",
        aiTitle: '',
        aiDescription: '',
        barcodeData: [],
        attachements: [],
      };
    });
  };


  const handleSuccessCriteriaSelect = (criteria) => {
    if (activeIndex !== null) {
      const updatedChecklists = [...checklists];
      updatedChecklists[activeIndex].successCriteria = criteria;
      setChecklists(updatedChecklists);
    }
    setDropdownVisible(false);
  };


  const handleBack = () => {
    navigate(-1);
  };

  const actions = [
    {
      label: "AI recommendation ",
      onPress: handleAutofill,
      image: require("../../assets/images/home/icon_bot_dark.png"),
    },
    {
      label: "Ask a question",
      onPress: () => console.log("Ask a Question Pressed"),
      image: require("../../assets/images/task/icon_ask_question.png"),
    },
  ];

  // Autofill Function: Populate taskData from taskDetail



  return (
    <SafeAreaView style={styles.container}>
      {/* 
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate(-1)} // Navigate to the previous screen
        >
          <Image
            source={require("../../assets/images/home/icon_back.png")}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Details</Text>
        <Image source={RobotIcon} style={styles.robotIcon} />
      </View> */}

      <ToolbarSummarize title="Create Task" onBack={handleBack} actions={actions} />

      {alert.visible && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ visible: false, message: '', type: '' })}
        />
      )}

      {/* Form */}
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}
        bounces={false} // Disables vertical bounce
        overScrollMode="never" >

        <View style={styles.formField}>
          <Text style={styles.label}>
            Task Name <Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'taskName' && styles.inputFocused,
            ]}
            placeholder="Enter Task Name"
            placeholderTextColor="#BDBDBD"
            value={taskData.title}
            onChangeText={(value) => updateTaskData('title', value)}
            onFocus={() => setFocusedField('taskName')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.label}>
            Task Description <Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'taskDescription' && styles.inputFocused,
            ]}
            placeholder="Task Description"
            placeholderTextColor="#BDBDBD"
            value={taskData.description}
            onChangeText={(value) => updateTaskData('taskDescription', value)}
          />
        </View>

        {/* Task Category Label and Dropdown */}
        <Text style={styles.label}>Task Category <Text style={styles.asterisk}>*</Text></Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsCategoryModalVisible(true)}
        // value={taskData.taskCategory}
        >
          {/* Display placeholder text if taskCategory is 'Select a category', otherwise display the selected category */}
          <View style={styles.emptyAssignee}>
            <Text
              style={
                taskCategory === 'Select a category'
                  ? stylesCategoryDropdown.placeholderTextCategoryDropdown
                  : stylesCategoryDropdown.selectedTextCategoryDropdown
              }
            >
              {taskCategory === 'Select a category' ? 'Select a category' : taskCategory}
            </Text>

            {/* Dropdown Icon */}
            <Image
              source={require('../../assets/images/task/Icon_dropdown.png')} // Ensure this path is correct
              style={styles.dropdownIcon} // Make sure styles are applied correctly
            />
          </View>
        </TouchableOpacity>

        {/* Task Category Modal */}
        <Modal
          visible={isCategoryModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsCategoryModalVisible(false)}
        >
          <View style={stylesCategoryDropdown.modalContainerCategoryDropdown}>
            <View style={stylesCategoryDropdown.modalContentCategoryDropdown}>
              <Text style={stylesCategoryDropdown.modalHeaderCategoryDropdown}>Select Task Category</Text>
              <FlatList
                data={categories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={stylesCategoryDropdown.categoryOptionCategoryDropdown}
                    onPress={() => handleSelectCategory(item)}
                  >
                    <Text style={stylesCategoryDropdown.categoryOptionTextCategoryDropdown}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={stylesCategoryDropdown.cancelButtonCategoryDropdown}
                onPress={() => setIsCategoryModalVisible(false)}
              >
                <Text style={stylesCategoryDropdown.cancelButtonTextCategoryDropdown}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.label}>Assign To</Text>
        <TouchableOpacity style={styles.input} onPress={handleOpenAssignModal}>
          {assignees.length === 0 ? (
            <View style={styles.emptyAssignee}>
              <Text style={styles.placeholder}>Select assignee(s)</Text>
              <Image
                source={require('../../assets/images/task/Icon_dropdown.png')} // Use your dropdown icon path
                style={styles.dropdownIcon}
              />
            </View>
          ) : (
            <View style={styles.assigneeContainer}>
              <FlatList
                horizontal
                data={assignees}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.assigneeChip}>
                    <Image source={{ uri: item.image }} style={styles.avatarSmall} />
                    <Text style={styles.assigneeName}>{item.name}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setAssignees((prev) => prev.filter((assignee) => assignee.id !== item.id))
                      }
                    >
                      <Text style={styles.removeChip}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {isRecommendationVisible && (<Image
                source={require('../../assets/images/task/icon_task_ai.png')} // Use your dropdown icon path
                style={styles.robotIconAI}
              />
              )}
            </View>

          )}
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseAssignModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownModal}>
              <Text style={styles.modalTitle}>Assign Staff</Text>
              <FlatList
                data={mockAssignees}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 200 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.assigneeOption}
                    onPress={() => {
                      if (assignees.find((assignee) => assignee.id === item.id)) {
                        setAssignees((prev) =>
                          prev.filter((assignee) => assignee.id !== item.id)
                        );
                      } else {
                        setAssignees((prev) => [...prev, item]);
                      }
                    }}
                  >
                    <View style={styles.checkbox}>
                      {assignees.find((assignee) => assignee.id === item.id) && (
                        <View style={styles.checked} />
                      )}
                    </View>
                    <Text style={styles.assigneeOptionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />

              {isRecommendationVisible && (
                <View style={styles.recommendationContainer}>
                  {/* Headline and Icon */}
                  <View style={styles.headlineAndIconContainer}>
                    <Image
                      source={require('../../assets/images/task/icon_task_ai.png')}
                      style={styles.robotIconAI}
                    />
                    <Text style={styles.recommendationHeadline}>AI Recommendation</Text>
                  </View>

                  {/* AI Recommendation String */}
                  <Text style={styles.aiRecomandationStringTitle}>{aiRecomandationString}</Text>
                </View>
              )}

            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseAssignModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.assignButton} onPress={() => handleAssign(assignees)}>
                <Text style={styles.assignButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Due Date
        <Text style={styles.label}>Due Date *</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.inputFlex}
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="Select a date"
            placeholderTextColor="#8A8A8A"
          />
          <TouchableOpacity>
            <Image
              source={require('../../assets/images/executives/calender.png')} // Replace with your calendar icon path
              style={styles.icon}
            />
          </TouchableOpacity>
        </View> */}

        <Text style={styles.label}>Due Date <Text style={styles.asterisk}>*</Text></Text>
        <TouchableOpacity
          style={styles.input}
          onPress={openDatePicker}
        >
          <View style={styles.emptyAssignee}>

            <Text style={styles.placeholder}>
              {selectedDate || 'Select a date'}
            </Text>
            <Image
              source={require('../../assets/images/task/calender.png')} // Replace with your calendar icon path
              style={datePickerstyles.calenderIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Custom Modal for Calendar */}
        <Modal
          visible={isDateModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeDatePicker}
        >
          <View style={datePickerstyles.modalContainer}>
            <View style={datePickerstyles.modalContent}>
              <Text style={datePickerstyles.modalHeader}>Select Date</Text>

              {/* Date Input for Web */}
              <input
                type="date"
                onChange={handleDateChange}
                style={datePickerstyles.webDateInput}
                autoFocus
              />

              <TouchableOpacity
                style={datePickerstyles.closeButton}
                onPress={closeDatePicker}
              >
                <Text style={datePickerstyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Location */}
        {/* <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          placeholderTextColor="#8A8A8A"
        /> */}

        {/* Priority */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {['Low', 'Medium', 'High'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.priorityButton,
                priority === level && styles.priorityButtonSelected,
              ]}
              // onPress={() => setPriority(level)
              //   setTaskData((prev) => ({ ...prev, priority: Utils.getPriority(level) }))

              // }
              onPress={() => {
                setPriority(level); // Update the local priority state
                setTaskData((prev) => ({
                  ...prev,
                  priority: Utils.getPriority(level), // Update taskData with the numerical priority
                }));
              }}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === level && styles.priorityButtonTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {checklists.map((checklist, index) => (
          <View key={index} style={styles.checklist}>
            <View style={styles.checklistHeader}>
              <Text style={styles.checklistLabel}>Checklist {index + 1}</Text>
              <TouchableOpacity onPress={() => setChecklists(checklists.filter((_, i) => i !== index))}>
                {/* <Text style={styles.deleteButton}>Delete</Text> */}
                <TouchableOpacity onPress={() => deleteChecklist(index)}>
                  <Image
                    source={require('../../assets/images/task/delete.png')} // Replace with your delete icon path
                    style={styles.checklistDeleteIcon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Checklist Name *"
              value={checklist.name}
              onChangeText={(value) => updateChecklist(index, 'name', value)}
              placeholderTextColor="#8A8A8A"
            />
            <TextInput
              style={styles.input}
              placeholder="Checklist Description *"
              value={checklist.description}
              onChangeText={(value) => updateChecklist(index, 'description', value)}
              placeholderTextColor="#8A8A8A"
            />
            {/* <TextInput
              style={styles.input}
              placeholder="Success Criteria"
              value={checklist.successCriteria}
              onChangeText={(value) => updateChecklist(index, 'successCriteria', value)}
              placeholderTextColor="#8A8A8A"
            /> */}
            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => {
                setActiveIndex(index);
                setDropdownVisible(!isDropdownVisible);
              }}
            >
              <Text style={styles.input} placeholder='Select Success Criteria'
              >
                {checklist.successCriteria || 'Select Success Criteria *'}
              </Text>
            </TouchableOpacity>

            {isDropdownVisible && activeIndex === index && (
              <View style={styles.dropdownList}>
                <TouchableOpacity onPress={() => handleSuccessCriteriaSelect('None')}>
                  <Text style={styles.dropdownOption}>None</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSuccessCriteriaSelect('Image')}>
                  <Text style={styles.dropdownOption}>Image</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSuccessCriteriaSelect('Barcode scanning')}>
                  <Text style={styles.dropdownOption}>Barcode scanning</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addChecklistButton} onPress={addChecklist}>
          <Text style={styles.addChecklistText}>+ Add Checklist</Text>
        </TouchableOpacity>

        {/* <View>
      <FlatList
        data={checklists}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.checklist}>
            <View style={styles.checklistHeader}>
              <Text style={styles.checklistLabel}>Checklist {index + 1}</Text>
              <TouchableOpacity onPress={() => deleteChecklist(index)}>
                <Image
                  source={require('../../assets/images/executives/delete.png')} // Replace with your delete icon path
                  style={styles.checklistDeleteIcon}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Checklist Name"
              value={item.name}
              onChangeText={(value) => updateChecklist(index, 'name', value)}
              placeholderTextColor="#8A8A8A"
            />
            <TextInput
              style={styles.input}
              placeholder="Checklist Description"
              value={item.description}
              onChangeText={(value) => updateChecklist(index, 'description', value)}
              placeholderTextColor="#8A8A8A"
            />
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Success Criteria</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  // Handle dropdown logic here
                }}
              >
                <Text style={styles.dropdownText}>
                  {item.successCriteria || 'Select Criteria'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addChecklistButton} onPress={addChecklist}>
        <Text style={styles.addChecklistText}>+ Add Checklist</Text>
      </TouchableOpacity>
    </View> */}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButtonFooter} onPress={handleCancleTask}>
          <Text style={styles.navbuttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
          <Text style={styles.navbuttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', width: "100%", height: "100%" },

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

    position: "fixed",
    padding: 16,
    bottom: 16,
    backgroundColor: "fff",
    // position: 'absolute', // Ensures it's fixed at the top
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Makes sure it stays above the ScrollView
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
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    left: 50,
    flex: 1, // Allow title to take up remaining space
    textAlign: "left",
  },
  robotIcon: { width: 30, height: 30, right: 20, },
  scrollView: {
    flex: 1,
    //marginTop: 70, // Pushes the ScrollView below the header
    marginBottom: 80,
    width: "100%",
    backgroundColor: "#fff",
    position: "static",
    // top: 70,
    // bottom: 80,

  },
  scrollContent: {
    top: 16,
    padding: 0,
    paddingBottom: 80, // Optional: Leaves space for footer if needed
    marginBottom: 100,
    //  marginTop: 12,
    position: "relative"
  }, labelTaskName: { fontSize: 14, marginVertical: 12, color: '#616161', left: 16, },

  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14, marginVertical: 12, color: '#616161', left: 16
  },
  asterisk: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    color: '#242424',
    fontWeight: 400,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1', // Red bottom border by default
    marginBottom: 8,
    backgroundColor: 'transparent',
    marginLeft: 16,
    marginRight: 16,
  },

  inputSuccess: {
    fontSize: 16,
    color: '#242424',
    fontWeight: 400,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1', // Red bottom border by default
    marginBottom: 8,
    backgroundColor: 'transparent',
    marginLeft: 16,
    marginRight: 16,
    height: 48,
  },
  inputFocused: {
    // borderBottomColor: '#000', // Black bottom border when focused
  },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1, fontSize: 14, color: '#333', padding: 16,
  },

  assigneeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  assigneeImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  assigneeName: {
    fontSize: 14,
    color: '#333',
  },
  removeIcon: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
  },
  icon: { width: 24, height: 24, tintColor: '#6200ee' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, },
  priorityButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    // backgroundColor: "#5B57C7",
    borderColor: '#ccc',
    marginHorizontal: 4,
    borderRadius: 20,
  },
  priorityButtonSelected: { backgroundColor: '#5B57C7', borderColor: '#5B57C7' },
  priorityButtonText: { color: '#333' },
  priorityButtonTextSelected: { color: '#fff' },
  checklist: { marginVertical: 16 },
  checklistLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#242424',
    left: 16,
  },
  checklistHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 48, backgroundColor: "#F5F5F5", marginBottom: 8, },
  addChecklistText: { fontSize: 14, color: '#5B57C7', fontWeight: '500', padding: 16, },
  checklistDeleteIcon: {
    width: 18,
    height: 18,
    tintColor: '#ff3333',
    right: 16,
  },
  addChecklistButton: { alignItems: 'flex-start', marginVertical: 2, left: 16, width: 180, },
  footer: { height: 60, flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 16, bottom: 0, position: "fixed", left: 0, right: 0 },

  //cancelButtonText: { color: '#333' },
  cancelButtonFooter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#5B57C7", height: 40, left: 20
  },

  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#5B57C7", height: 40, right: 20
  },
  navbuttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    verticalAlign: "middle",
  },

  emptyAssignee: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  placeholder: {
    color: '#BDBDBD',
    fontSize: 16,
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    tintColor: '#aaa',
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  removeChip: {
    fontSize: 16,
    color: '#888',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  assignButton: {
    backgroundColor: '#6200ee',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#242424',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  dropdownModal: {
    height: '55%', // Covers 80% of the screen height
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  aiRecomandationStringTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  recommendationContainer: {
    marginTop: -70,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    // marginBottom: 40,
  },
  headlineAndIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Space between the headline/icon and the recommendation string
  },
  robotIconAI: {
    width: 30,
    height: 30,
    marginRight: 10, // Space between the icon and the headline
  },
  recommendationHeadline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  assigneeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: '#6200ee',
  },
  assigneeOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingBottom: 16,
    padding: 16,
    bottom: 0,
    backgroundColor: "#fff"
    // marginTop: 40,
  },
  cancelButton: {
    // backgroundColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  containerCategoryDropdown: {
    marginBottom: 16,
  },
  labelCategoryDropdown: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },

  dropdownTrigger: {
    padding: 0,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownList: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    maxHeight: 150,
    overflow: 'scroll',
    zIndex: 10,
  },
  dropdownOption: {
    padding: 10,
    fontSize: 14,
    color: '#333',
  },

});


const datePickerstyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    marginBottom: 20,
  },
  calenderIcon: { width: 24, height: 24, tintColor: '#6200ee' },

  webDateInput: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
  },
});


const stylesCategoryDropdown = StyleSheet.create({
  containerCategoryDropdown: {
    marginBottom: 16,
  },
  labelCategoryDropdown: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },

  placeholderTextCategoryDropdown: {
    color: '#BDBDBD',
    fontSize: 14,
  },
  selectedTextCategoryDropdown: {
    color: '#242424',
    fontSize: 14,
  },
  dropdownIconCategoryDropdown: {
    width: 20, // Adjust to desired width
    height: 20, // Adjust to desired height
    //  right: 10,
    //resizeMode: 'contain', // Ensures the image scales properly within the space
    // marginRight: 10, // Optional: Adjust for spacing
    // marginTop: 5, // Optional: Adjust for vertical alignment
  },
  modalContainerCategoryDropdown: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContentCategoryDropdown: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeaderCategoryDropdown: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoryOptionCategoryDropdown: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryOptionTextCategoryDropdown: {
    fontSize: 16,
    color: '#333',
  },
  cancelButtonCategoryDropdown: {
    marginTop: 16,
    backgroundColor: '#e6e6e6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonTextCategoryDropdown: {
    fontSize: 16,
    color: '#333',
  },
  categoryInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#000', // Bottom line color
    paddingHorizontal: 16, // Left and right padding
    paddingVertical: 8, // Optional: Adjust vertical padding for better spacing
    fontSize: 16, // Adjust text size
    color: '#000', // Text color
  },
});

export default CreateTaskScreen;
