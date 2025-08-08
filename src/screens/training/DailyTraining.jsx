
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Toolbar } from "../../components/nrf_app/Toolbar"; // Import Header component
import { useNavigate } from "react-router-dom";
import { ToolbarSummarize, CustomAlert } from '../../components/nrf_app/Toolbar';

const DailyTraining = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });

  // Questions Array
  const questions = [
    {
      title: "Daily Training",
      question: "What is the purpose of cycle counting in inventory management?",
      points: 2,
      options: [
        "To verify the accuracy of inventory records.",
        "To determine the reorder point for products.",
        "To calculate the inventory turnover rate.",
        "To prevent theft and loss.",
      ],
      correctAnswer: "To verify the accuracy of inventory records.",
      explanation:
        "Cycle counting is a method used to verify the accuracy of inventory records. It involves physically counting a portion of inventory items on a regular basis, rather than counting all items at once.",
      pageNumber: 1,
      totalPages: 5,
    },
    {
      title: "Daily Training",
      question: "What is the primary goal of supply chain management?",
      points: 3,
      options: [
        "To maximize profit.",
        "To streamline production.",
        "To deliver the right product to the right place at the right time.",
        "To minimize employee costs.",
      ],
      correctAnswer: "To deliver the product to the right place.",
      explanation:
        "The primary goal of supply chain management is to deliver the right product to the right place at the right time, balancing efficiency with customer satisfaction.",
      pageNumber: 2,
      totalPages: 5,
    },
    {
      title: "Daily Training",
      question: "What is the purpose of a purchase order in procurement?",
      points: 1,
      options: [
        "To track payments made to suppliers.",
        "To request goods or services from a supplier.",
        "To calculate production costs.",
        "To maintain supplier contact information.",
      ],
      correctAnswer: "To request goods or services from a supplier.",
      explanation:
        "A purchase order is a document issued by a buyer to a supplier to request goods or services. It specifies the details of the order, including quantity, price, and delivery date.",
      pageNumber: 3,
      totalPages: 5,
    },
    {
      title: "Daily Training",
      question: "What is the focus of lean management?",
      points: 4,
      options: [
        "Reducing waste and increasing value for the customer.",
        "Expanding production capacity.",
        "Minimizing employee turnover.",
        "Improving marketing strategies.",
      ],
      correctAnswer: "Reducing waste and increasing value for the customer.",
      explanation:
        "Lean management focuses on reducing waste in processes and increasing value for the customer by optimizing efficiency and effectiveness.",
      pageNumber: 4,
      totalPages: 5,
    },
    {
      title: "Daily Training",
      question: "What is a common function of a warehouse management system (WMS)?",
      points: 2,
      options: [
        "Tracking inventory levels and locations.",
        "Managing customer relationships.",
        "Processing employee payroll.",
        "Creating marketing campaigns.",
      ],
      correctAnswer: "Tracking inventory levels and locations.",
      explanation:
        "A warehouse management system (WMS) is designed to optimize and track the movement, storage, and tracking of inventory within a warehouse.",
      pageNumber: 5,
      totalPages: 5,
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  // Function to handle option selection
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  // Function to submit the answer
  const handleSubmit = () => {
    if (selectedOption) {
      const isAnswerCorrect = selectedOption === currentQuestion.correctAnswer;
      setIsCorrect(isAnswerCorrect);
      setShowExplanation(true);
    } else {
      console.log('No option selected');

      Alert.alert("Please select an option before submitting.");
    }
    if (currentQuestionIndex === 4) {
     // navigate("/home")
      setAlert({ visible: true, message: 'Congratulations Training Completed Successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/home'); // Navigate to the home screen
      }, 4000);
    }
  };

  // Handlers for navigation buttons
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetSelection();
    } else {
      navigate("/");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetSelection();
    } else {
      Alert.alert("You've reached the last question!");
    }
  };

  const resetSelection = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  return (
    <View style={styles.container}>
      {/* Reusable Header */}
      <Toolbar title="Daily Training" />

   {alert.visible && (
                <CustomAlert
                  message={alert.message}
                  type={alert.type}
                  onClose={() => setAlert({ visible: false, message: '', type: '' })}
                />
              )}

      <Text style={styles.subheader}>Inventory Management</Text>
      {/* Question */}
      <Text style={styles.question}>{currentQuestion.question}</Text>
      <Text style={styles.points}>{currentQuestion.points} points</Text>

      {/* Options */}
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => handleSelectOption(option)}
        >
          <View style={styles.radioCircle}>
            {selectedOption === option && <View style={styles.selectedRb} />}
          </View>
          <Text
            style={[
              styles.optionText,
              selectedOption === option && isCorrect !== null
                ? isCorrect
                  ? styles.correctOptionText
                  : styles.wrongOptionText
                : {},
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Submit Button */}
      {/* <Button
        style={styles.submitButton}
        title="Submit"
        onPress={handleSubmit}
      /> */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Explanation */}
      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>Explanation:</Text>
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.navButton}>&lt; Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>
          {currentQuestion.pageNumber}/{currentQuestion.totalPages}
        </Text>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.navButton}>Next &gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DailyTraining;

// Modify the styles for the container of the header in the DailyTraining screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0, // Removed any padding around the container
    justifyContent: "flex-start",
    flexDirection: "column", // Ensures vertical stacking of items
    backgroundColor: "transparent",
    width: "100%", // Ensures the container uses full screen width
    overflowX: "hidden", // Prevent horizontal scrolling by hiding overflow
    alignItems: "stretch", // Ensures children take full width of the container
  },
  question: {
    fontSize: 18,
    marginBottom: 14,
    width: "94%",
    color: "#555",
    left: 16,
    right: 20,
    fontWeight: "semibold",
  },
  subheader: {
    fontSize: 24,
    left: 16,
    right: 16,
   // width: "96%",
    marginBottom: 20,
    marginTop: 20,
    color: "#000",
    fontWeight: "bold",
  },
  points: {
    fontSize: 14,
    left: 16,
    color: "#888",
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    left: 24,
    right: 24,
    width: "88%",

  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,

  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4f46e5",
  },
  submitButton: {
    paddingVertical: 15, // Adds vertical padding
    paddingHorizontal: 20, // Adds horizontal padding
    backgroundColor: '#fff', // Set background color
    borderRadius: 4, // Rounded corners
    borderColor: "#4f46e5",
    borderWidth: 1,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center', // Centers the text vertically
    marginVertical: 20, // Space above and below the button
    width: '96%', // Controls the button's width, adjust as needed
    alignSelf: 'center', // Centers the button horizontally on the screen
  },
  submitButtonText: {
    fontSize: 18, // Adjust font size
    color: '#4f46e5', // White text color
    fontWeight: 'bold', // Bold text
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    left: 10,

  },
  correctOptionText: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
  wrongOptionText: {
    color: "#e63946",
    fontWeight: "bold",
  },
  explanationContainer: {
    backgroundColor: "#eef6fc",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  explanationText: {
    fontSize: 16,
    color: "#555",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
    padding: 8,
  },
  navButton: {
    fontSize: 16,
    color: "#4f46e5",
    fontWeight: "Semibold",
  },
  pageNumber: {
    fontSize: 16,
    color: "#555",
  },
  headerContainer: {
    width: '100%',  // Ensures the header takes up the full width
    marginLeft: 0,  // Removes any left margin
    marginRight: 0,  // Removes any right margin
    padding: 0,  // No padding around the header container
  },
});

