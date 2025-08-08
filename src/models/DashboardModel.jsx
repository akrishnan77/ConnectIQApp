const dashboardModelData = require("../../assets/json/DashboardJson.json"); // Import the JSON file

class DashboardModel {
    // constructor(userEmail, userRole, tasks = [], learning) {
    //     this.userEmail = userEmail;
    //     this.userRole = userRole;
    //     this.tasks = tasks;
    //     this.learning = learning;
    // }

    // Static method to create an Object from JSON
    static fromJSON() {
        //const tasks = json.tasks.map(user => UserModel.fromJSON(user));
        const json = dashboardModelData
        return new DashboardModel(json.userEmail, json.userRole, json.tasks, json.learning);
    }

    // Method to get task metadata
    getDashboardMetadata() {
        const data = this.fromJSON();
        if (data) {
            return {
                id: data.id,                           // 1. Task ID
                dueDate: data.dueDate,                 // 2. Due Date
                title: data.title,                     // 3. Title
                taskDescription: data.taskDescription, // 4. Task Description
                status: data.status,                   // 5. Status
                priority: data.priority,               // 6. Priority
                assignee: data.assignee,               // 7. Assignee
                taskCategory: data.taskCategory,       // 8. Task Category
                checklist: data.checklist,             // 9. Checklist (Array)
            };
        } else {
            return null; // Return null if the task wasn't found
        }
    }

    // Convert the object back into a JSON object
    toJSON() {
        return {
            userEmail: this.userEmail,
            userRole: this.userRole,
            tasks: this.tasks,
            learning: this.learning
        };
    }
}