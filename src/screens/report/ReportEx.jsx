import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Toolbar } from "../../components/nrf_app/Toolbar";
import { CustomAlert } from '../../components/nrf_app/Toolbar';

import { useNavigate } from "react-router-dom";
import { Pie, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import Chart from 'chart.js/auto';
import { Card } from '../../components/nrf_app/Card';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement,);
Chart.register(ChartDataLabels);

const ReportEx = () => {
  const [activeTab, setActiveTab] = useState('Inventory');
  const [isModalVisible, setModalVisible] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const navigate = useNavigate();
  const [graphType, setgraphType] = useState('Stock Levels');

  // const [hideToolbar, setHideToolbar] = useState(false);
  // const lastScrollY = useRef(0);  // Keeps track of the last scroll position 
  // const handleScroll = (event) => {
  //   const currentScrollY = event.nativeEvent.contentOffset.y;
  //   if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
  //     setHideToolbar(true);
  //   } else {
  //     setHideToolbar(false);  // Show toolbar when scrolling up
  //   }
  // };

  const data = {
    labels: ['Overstocked (SKU 1122, 1133)', 'Running Low (SKU 1234, 1235, 1236, 1237)'],
    datasets: [
      {
        data: [33, 67],
        backgroundColor: ["#4F52B2", "#DFDEDE",], // Blue and Pink colors // 1cba31 green , e3a14b orange
        borderWidth: 1,
        borderColor: '#fff',
        hoverOffset: 10,
      },
    ],
  };


  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          // boxWidth: 20,
          padding: 20, // Adds top margin between labels and chart
          color: '#242424',
          font: {
            size: 12,
            fontWeight: "400",
            textAlign: "left",
          },
          textAlign: "right", // Align text within legend to the left
        },
      },
      datalabels: {
        formatter: (value, context) => `${value}%`,
        color: '#242424',
        font: {
          weight: '500',
          size: 14,
        },
        align: 'end',
        anchor: 'end',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: 0, // This keeps it as a pie (not a donut)
  };


  const dataGraph2 = {
    labels: [
      ['Seasonal Items', '(SKU 2200, 2211, 2233)'], // First label broken into two lines
      ['Non-Seasonal Items', '(SKU 3300, 3311)'],   // Second label broken into two lines
    ],
    datasets: [
      {
        label: 'Number of SKUs',
        data: [3.0, 2.0],
        backgroundColor: ['#4F52B2', '#DFDEDE'],
      },
    ],
  };

  const optionsGraph2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Categories',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of SKUs',
        },
        beginAtZero: true,
      },
    },
  };

  const dataGraph3 = {
    labels: ['Vmart', 'Xmart'],
    datasets: [
      {
        label: 'Late Deliveries',
        data: [1.0, 1.0], // Match the bar heights from the image
        backgroundColor: ['#4F52B2', '#DFDEDE'], // Red and Blue colors
      },
    ],
  };

  const optionsGraph3 = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Suppliers', // Match x-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: 'Late Deliveries', // Match y-axis title
        },
        beginAtZero: true, // Start y-axis at zero
      },
    },
  };

  const pieDataAssociate = {
    labels: ["Clocked In", "Leave", "Unassigned"],
    datasets: [
      {
        data: [78, 18, 4],
        backgroundColor: ["#4F52B2", "#C4314B", "#DFDEDE"],
        hoverBackgroundColor: ["#4A41C7", "#E74343", "#CCCCCC"],
      },
    ],
  };

  const pieOptionAssociate = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 20, // Adds top margin between labels and chart
          color: '#242424',
          font: {
            size: 12,
            fontWeight: "400",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}%`, // Show percentage in tooltip
        },
      },
      datalabels: {
        color: "#FFF", // White color for labels
        font: {
          weight: "400", // Make labels bold
          size: 12, // Adjust size as needed
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
    layout: {
      padding: {
        bottom: 20, // Adds padding between chart and other content above
      },
    },
    maintainAspectRatio: false,
  };


  const [modalData, setModalData] = useState({
    title: "Hey Emily, below is the summary of the forecasting report",
    description: "Summary: Stock Levels: Certain high-demand items (SKU 1234, 1235, 1236, 1237) are running low, while some low-demand items (SKU 1122, 1133) are overstocked.",
    recommendations: [
      "Low Stock (High-Demand Items): /n SKU 1234, 1235, 1236, 1237",
      "Generate purchase orders (POs) immediately to restock these high-demand items and avoid potential stockouts. This will help maintain optimal inventory levels and ensure customer satisfaction. Overstock (Low-Demand Items):SKU 1122, 1133 Recommended Action: Implement promotional strategies or discounts to reduce excess inventory. Additionally, consider options for returning or reallocating these items to other stores where they may be in higher demand. so how to design this page? "
    ],
    actionText: "Create a PO with Zmart Supplier?",
  });

  const closeModal = () => {
    setModalVisible(false);
  };

  const handelCreatePO = () => {
    setModalVisible(false);

    if (graphType === "Stock Levels") {

      setAlert({ visible: true, message: 'PO is created successfully – Ref# 20241211', type: 'success' });
    }
    else if (graphType === "Running Low") {
      navigate(`/createTask/${1}`);

    }
    else if (graphType === "Overstocked") {
      navigate("/createTask");
    }
  };

  const handleGraphClick = (graphTypeStr) => {
    if (graphTypeStr === "Stock Levels") {
      setgraphType("Stock Levels");
      setModalData({
        title: "Hey Emily, below is the summary of the forecasting report",
        description: "Summary: Stock Levels: Certain high-demand items (SKU 1234, 1235, 1236, 1237) are running low, while some low-demand items (SKU 1122, 1133) are overstocked.",
        recommendations: [
          "Low Stock (High-Demand Items):\nSKU 1234, 1235, 1236, 1237",
          "Recommended Action: Generate purchase orders (POs) immediately to restock these high-demand items and avoid potential stockouts.",
          "Overstock (Low-Demand Items):\nSKU 1122, 1133",
          "Recommended Action: Implement promotional strategies or discounts to reduce excess inventory. Additionally, consider options for returning or reallocating these items to other stores where they may be in higher demand.",
        ],
        actionText: "Create a PO with Zmart Supplier?",
      });
    } else if (graphTypeStr === "Running Low") {
      setgraphType("Running Low");

      setModalData({
        title: "Hey Emily, below is the summary of the forecasting report",
        description: "Summary: Increase orders of the Seasonal Items (SKU 2200, 2211, 2233) to match sales spike. Continue to monitor inventory of the Non-Seasonal Items (SKU 3300, 3311).",
        recommendations: [
          "Spike in Sales (Seasonal Items):\nSKU 2200, 2211, 2233",
          "Recommended Action: Increase orders for these seasonal items to match the current sales trends. This will help capitalize on the increased demand and maximize sales opportunities.",
          "Steady but Lower Sales (Non-Seasonal Items):\nSKU 3300, 3311",
          "Recommended Action: Monitor inventory levels to ensure they remain aligned with the steady sales pace. No immediate action required, but continue to review sales data regularly.",
        ],
        actionText: "Create a task and assign to John?",
      });
    } else if (graphTypeStr === "Overstocked") {
      setgraphType("Overstocked");

      setModalData({
        title: "Hey Emily, below is the summary of the forecasting report",
        description: "Summary: Supplier Performance: Some suppliers (Vmart, Xmart) are consistently late with deliveries, affecting stock availability.",
        recommendations: [
          "Consistently Late Deliveries:\nSuppliers: Vmart, Xmart\nImpact: These delays are affecting our stock availability and overall store performance.",
          "Review Supplier Contracts: Evaluate the performance of Vmart and Xmart. Consider the impact of their late deliveries on our operations.Consider Alternative Suppliers: If these suppliers continue to be unreliable, explore alternative suppliers who can meet our delivery requirements more consistently.\nAddressing this issue promptly will help ensure we maintain optimal stock levels and improve our supply chain efficiency. "
        ],
        actionText: "Create a task and assign to John?",
      });
    }

    setModalVisible(true);
  };

  const renderAssociate = () => (
    <ScrollView contentContainerStyle={styles.associateContainer}>
      <View style={reportHeaderstyles.container}>
        {/* Monthly Report Label */}
        <Text style={reportHeaderstyles.reportText}>Monthly report</Text>

        {/* Right Side: Date and Icons */}
        <View style={reportHeaderstyles.rightSection}>
          <Text style={reportHeaderstyles.dateText}>Jan 2025</Text>

          {/* Calendar Icon */}
          <TouchableOpacity>
            <Image
              source={require('../../assets/images/task/calender.png')} // Replace with your calendar icon path
              style={reportHeaderstyles.icon}
            />
          </TouchableOpacity>

          {/* Download Icon */}
          <TouchableOpacity>
            <Image
              source={require('../../assets/images/task/calender.png')} // Replace with your calendar icon path            style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.associateCardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clocked In</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.cardValue}>78%</Text>
            <Image
              source={require('../../assets/images/task/icon_up_trending.png')} // Replace with your trending-up image path
              style={styles.trendingIcon}
            />
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.cardValue}>18%</Text>
            <Image
              source={require('../../assets/images/task/icon_up_trending.png')} // Replace with your trending-up image path
              style={styles.trendingIcon}
            />
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Training Completion</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.cardValue}>0.84%</Text>
            <Image
              source={require('../../assets/images/task/icon_down_trending.png')} // Replace with your trending-up image path
              style={styles.trendingIcon}
            />
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Labor Budget</Text>
          <Text style={styles.cardValue}>$1,762</Text>
        </View>
      </View>

      <Card
        style={{ marginHorizontal: 16, padding: 16, marginBottom: 16 }}
      >
        <Text style={taskStyle.sectionTitle}>Absence %</Text>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 280,
          }}
        >
          <Pie data={pieDataAssociate} options={pieOptionAssociate} />
        </View>
      </Card>
    </ScrollView>
  );

  const renderTask = () => {
    // Data for Pie Chart
    const pieData = {
      labels: ["Completed", "Overdue", "Unassigned"],
      datasets: [
        {
          data: [60, 20, 20],
          backgroundColor: ["#4F52B2", "#C4314B", "#DFDEDE"],
          hoverBackgroundColor: ["#4A41C7", "#E74343", "#CCCCCC"],
        },
      ],
    };

    const pieOptions = {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 20,
            padding: 20, // Adds top margin between labels and chart
            color: '#242424',
            font: {
              size: 12,
              fontWeight: "400",
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.raw}%`, // Show percentage in tooltip
          },
        },
        datalabels: {
          color: "#FFF", // White color for labels
          font: {
            weight: "400", // Make labels bold
            size: 12, // Adjust size as needed
          },
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          },
        },
      },
      layout: {
        padding: {
          bottom: 20, // Adds padding between chart and other content above
        },
      },
      maintainAspectRatio: false,
    };

    const barData = {
      labels: ["Inventory Management", "Stock Display", "Staff Management", "Store Cleanliness"],
      datasets: [
        {
          label: "Percentage",
          data: [94, 80, 85, 62, 76],
          backgroundColor: "#4F52B2",
          hoverBackgroundColor: "#4A41C7",
        },
      ],
    };

    const barOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.raw}%`, // Display percentage in the tooltip
          },
        },
        datalabels: {
          color: "#FFFF", // Black color for labels
          font: {
            weight: "bold", // Make labels bold
          },
          anchor: "end",
          align: "start",
          formatter: (value) => `${value}%`, // Append % symbol
        },
      },
      indexAxis: "y", // Change axis to horizontal
      scales: {
        x: {
          title: {
            display: true,
            text: "Percentage",
          },
          ticks: {
            beginAtZero: true,
            stepSize: 20,
          },
        },
        y: {
          title: {
            display: true,
            text: "Tasks",
          },
        },
      },
    };

    return (
      <ScrollView contentContainerStyle={styles.inventoryContainer}>
        <View style={reportHeaderstyles.container}>
          {/* Monthly Report Label */}
          <Text style={reportHeaderstyles.reportText}>Monthly report</Text>

          {/* Right Side: Date and Icons */}
          <View style={reportHeaderstyles.rightSection}>
            <Text style={reportHeaderstyles.dateText}>Jan 2025</Text>

            {/* Calendar Icon */}
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/task/calender.png')} // Replace with your calendar icon path
                style={reportHeaderstyles.icon}
              />
            </TouchableOpacity>

            {/* Download Icon */}
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/task/calender.png')} // Replace with your calendar icon path            style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={taskStyle.container}>
          {/* Header Section */}
          {/* Task Completion and Overdue Tasks */}
          <View style={taskStyle.statsContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Task Completion</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.cardValue}>60%</Text>
                <Image
                  source={require('../../assets/images/task/icon_up_trending.png')} // Replace with your trending-up image path
                  style={styles.trendingIcon}
                />
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Overdue tasks</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.cardValue}>20%</Text>
                <Image
                  source={require('../../assets/images/task/icon_up_trending.png')} // Replace with your trending-up image path
                  style={styles.trendingIcon}
                />
              </View>
            </View>
          </View>

          {/* Pie Chart for Task Assigned */}
          <Card
            style={{ marginHorizontal: 0, padding: '16', }}
          >
            <Text style={taskStyle.graphLabel}>Task Assigned</Text>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0px',
                width: '100%',
                height: 340,
              }}
            >
              <Pie data={pieData} options={pieOptions} />
            </View>
          </Card>
          {/* Bar Chart for Top 5 Products */}
          <Card
            style={{ marginHorizontal: 0, padding: '16', }}
          >
            <Text style={taskStyle.graphLabel}>Top Task Categories</Text>
            <Bar data={barData} options={barOptions} />
          </Card>
        </View>
      </ScrollView>
    );
  };

  const renderInventory = () => {
    return (
      <ScrollView contentContainerStyle={styles.inventoryContainer}
      // onScroll={handleScroll} scrollEventThrottle={16}
      >
        <View style={reportHeaderstyles.container}>
          {/* Monthly Report Label */}
          <Text style={reportHeaderstyles.reportText}>Monthly report</Text>

          {/* Right Side: Date and Icons */}
          <View style={reportHeaderstyles.rightSection}>
            <Text style={reportHeaderstyles.dateText}>Jan 2025</Text>

            {/* Calendar Icon */}
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/task/calender.png')} // Replace with your calendar icon path
                style={reportHeaderstyles.icon}
              />
            </TouchableOpacity>

            {/* Download Icon */}
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/task/calender.png')} // Replace with your calendar icon path            style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.graphContainer}>
          <TouchableOpacity onPress={() => handleGraphClick("Stock Levels")}>
            <Card
              style={{ marginHorizontal: 0, padding: '16', }}
            >
              <Text style={styles.graphLabel}>Stock levels</Text>
              <View style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // Align items to the left
                width: '100%',
                height: "280",
              }}>
                <Pie data={data} options={options} />
              </View>
            </Card>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => handleGraphClick("Running Low")}>
            <Card
              style={{ marginHorizontal: 0, padding: '16', }}
            >
              <Text style={styles.graphLabel}>Sales trends</Text>
              <View style={{ marginTop: '20', width: '100%', height: '300' }}>
                <Bar data={dataGraph2} options={optionsGraph2} />
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleGraphClick("Overstocked")}>
            <Card
              style={{ marginHorizontal: 0, padding: '16', }}
            >
              <Text style={styles.graphLabel}>Supplier Performance</Text>
              <View style={{ marginTop: '20px', width: '100%', height: '200' }}>
                <Bar data={dataGraph3} options={optionsGraph3} />
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* {!hideToolbar && */}
      <Toolbar
        title={'Reports'}
        showBottomLine={false} />
      {/* } */}

      {alert.visible && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ visible: false, message: '', type: '' })}
        />
      )}

      <View style={styles.tabBar}>
        {['Inventory', 'Associates', 'Task'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Inventory' && renderInventory()}
      {activeTab === 'Associates' && renderAssociate()}
      {activeTab === 'Task' && renderTask()}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.modalTitle}>{modalData.title}</Text>
              <Text style={styles.modalDescription}>{modalData.description}</Text>
              <View style={styles.aiRecommendationContainer}>
                <View style={styles.headlineAndIconContainer}>
                  <Image
                    source={require('../../assets/images/task/icon_task_ai.png')}
                    style={styles.robotIconAI}
                  />
                  <Text style={styles.aiRecommendationTitle}>AI Recommendation</Text>
                </View>
                {modalData.recommendations.map((rec, index) => (
                  <Text
                    key={index}
                    style={
                      index === 0 || index === 2
                        ? [styles.aiRecommendationTitle, styles.highlightedText]
                        : styles.aiRecommendationText
                    }
                  >
                    {rec}
                  </Text>
                ))}
              </View>
              <Text style={styles.aiRecommendationAction}>{modalData.actionText}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.yesButton} onPress={handelCreatePO}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.remindButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Remind me later</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const reportHeaderstyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    marginTop: 16,
    width: "100%",
  },
  reportText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#242424',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#5B57C7',
    fontWeight: '500',
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: '#5B63E6', // Makes the icon match the theme color
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', width: "100%", height: "100%" },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    marginTop: 4,
    marginStart: 16,
    marginEnd: 16
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: '#4F52B2',
  },
  tabText: {
    fontSize: 14,
    color: '#000',
    fontWeight: "400",
    textAlign: 'center'
  },
  activeTabText: {
    color: '#fff',
  },
  graphContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  graph: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 0,
  },
  graphImage: {
    width: "100%",
    marginLeft: 20,
    marginRight: 20,
    height: "200",
  },
  graphLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
    marginBottom: 16,
    textAlign: 'left',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '94%',
    height: '96%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 2,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 20,
    height: 20,
    marginRight: 6,
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#000',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    color: '#242424',
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  aiRecommendationContainer: {
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  aiRecommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#242424",
    //marginBottom: 10,
  },
  aiRecommendationText: {
    fontSize: 14,
    marginBottom: 20,
  },
  aiRecommendationAction: {
    left: 16,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    marginTop: 28,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 16,
    right: 16,
    marginTop: 2,
  },
  yesButton: {
    backgroundColor: '#4F52B2',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  remindButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
    right: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  // Associate

  inventoryContainer: {
    padding: 0,
    backgroundColor: '#fff',
  },

  modelScroll: {
    width: "100%",
    height: "100%",
    backgroundColor: '#f9f9f9',
  },

  associateContainer: {
    paddingHorizontal: 0,
    backgroundColor: '#fff',
  },
  associateCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  card: {
    width: '48%',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 4,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px -0.1px 2px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: 14,
    color: '#242424',
    fontWeight: "500",
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#424242',
  },
  trendingIcon: {
    width: 28,
    height: 28,
    marginLeft: 8,
    marginTop: 4,
    // tintColor: '#28A745', // Adjust color as per your design
  },
  chartImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
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
});

const taskStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  headerDate: {
    fontSize: 14,
    color: "#4F52B2",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  statBox: {
    width: '48%',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 4,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px -0.1px 2px rgba(0, 0, 0, 0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F52B2",
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#242424",
    marginBottom: 16,
    textAlign: 'left'
  },
});

export default ReportEx;
