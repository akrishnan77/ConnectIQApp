import { TaskPriority, TaskStatus, ResourceType } from "./AppConstants";

class Utils {
    // Convert priority number to text
    getPriorityText = (priority) => {
        switch (priority) {
            case TaskPriority.LOW:
                return "Low";
            case TaskPriority.MEDIUM:
                return "Medium";
            case TaskPriority.HIGH:
                return "High";
            case TaskPriority.URGENT:
                return "Urgent";
            default:
                return "";
        }
    };

    getPriorityTextColor = (priority) => {
        switch (priority) {
            case TaskPriority.LOW:
                return "#0C5E0C";
            case TaskPriority.MEDIUM:
                return "#8A3707";
            case TaskPriority.HIGH:
                return "#960B18";
            case TaskPriority.URGENT:
                return "#960B18";
            default:
                return "";
        }
    };

    static getPriority = (priorityText) => {
        switch (priorityText.toLowerCase()) {
            case 'low':
                return 1;
            case 'medium':
                return 2;
            case 'high':
                return 3;
            default:
                return 1; // Default to "Low" if no valid match
        }
    };

    // Convert task status number to text
    getTaskStatusText = (taskStatus) => {
        switch (taskStatus) {
            case TaskStatus.YET_TO_START:
                return "Yet To Start";
            case TaskStatus.IN_PROGRESS:
                return "In Progress";
            case TaskStatus.COMPLETED:
                return "Completed";
            case TaskStatus.OVER_DUE:
                return "Over Due";
            default:
                return "Yet To Start";
        }
    };

    // Function to return title color based on item status
    getStatusTextColor = (status) => {
        switch (status) {
            case TaskStatus.IN_PROGRESS:
                return '#BC4B09';  // InProgress
            case TaskStatus.COMPLETED:
                return '#0E700E';  // Completed
            case TaskStatus.OVER_DUE:
                return '#C50F1F';  // Over Due
            default:
                return '#616161';  // Default or Yet to start
        }
    };

    isEmptyOrNull(string) {
        // Check if the string is null, undefined, or empty
        return !string || string.trim() === '';
    }

    isOverdue(dueDate) {
        let isOverDue = false
        try {
            const currentDate = new Date();
            isOverDue = new Date(dueDate) < currentDate;
        } catch (error) {
            console.error(`Error in parsing DueDate: ${dueDate}`, error);
        }
        return isOverDue
    }

    isVideoResource(resourceUrl) {
        let isVideoResource = false
        try {
            const strValue = resourceUrl != null ? JSON.stringify(resourceUrl) : "";
            isVideoResource = strValue.includes(ResourceType.MP4);
        } catch (error) {
            console.error(`Error in parsing VideoResource: ${resourceUrl}`, error);
        }
        return isVideoResource
    }

    filterTrainingList(trainingList) {
        let filteredList = []
        try {
            const grouped = trainingList.reduce((acc, training) => {
                // If the email group doesn't exist, create it
                if (!acc[training.assignedTo.email]) {
                    acc[training.assignedTo.email] = {
                        email: training.assignedTo.email,
                        name: training.assignedTo.name,
                        rewardPoints: training.assignedTo.rewardPoints,
                        trainings: []
                    };
                }
                
                acc[training.assignedTo.email].trainings.push({
                    id: training.id,
                    completionStatus: training.completionStatus,
                    dueDate: training.dueDate,
                    progressPercentage: training.progressPercentage,
                    title: training.title,
                    trainingType: training.trainingType
                });
                return acc;
            }, {});

            // Convert grouped data into an array of objects
            filteredList = Object.values(grouped);
            console.log('groupedArray: ', filteredList)
        } catch (error) {
            console.error(`Error in parsing filterTrainingList: ${trainingList}`, error);
        }
        return filteredList
    }

    static uploadChecklistByType(checklistType) {
        if (checklistType === 0) {
            return {
                id: 5,
                title: "",
                description: "",
                status: false,
                checklistType: 0,
                estimatedTimeInMin: "",
                aiTitle: "",
                aiDescription: "",
                barcodeData: [],
                attachements: [],
            };
        } else if (checklistType === 1) {
            return {
                id: 6,
                title: "",
                description: "",
                status: true,
                checklistType: 1,
                estimatedTimeInMin: "",
                aiTitle: "",
                aiDescription: "",
                barcodeData: [],
                attachements: [],
            };
        } else if (checklistType === 2) {
            return {
                id: 5,
                title: "",
                description: "",
                status: false,
                checklistType: 3,
                estimatedTimeInMin: "",
                aiTitle: "",
                aiDescription: "",
                barcodeData: [],
                // barcodeData: [
                //   {
                //     productId: 3,
                //     productMappingId: 6,
                //     productName: "Speaker",
                //     barcode: 12345678,
                //     price: 200,
                //     productImageContent: "",
                //     productImageUri: "",
                //   },
                // ],
                attachements: [],
            };
        } else {
            return {
                id: 5,
                title: "",
                description: "",
                status: false,
                checklistType: 0,
                estimatedTimeInMin: "",
                aiTitle: "",
                aiDescription: "",
                barcodeData: [],
                attachements: [],
            }; // Return null for unsupported checklist types
        }
    }
}

export default Utils;