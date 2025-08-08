import React from "react";
// import { getTaskDetails } from "../models/ApiService"; // API Service to fetch task details
const taskDetailsJson = require("../assets/json/TaskDetailsJson.json"); // Fallback data

class TaskModel {
  constructor(taskId) {
    this.taskId = taskId; // Store the taskId
  }

  async fetchTaskDetails() {
    try {
      // Fetch task details from the API
      // const responseData = await getTaskDetails(this.taskId);
      // console.log("API task details called successfully:", responseData);
      // return responseData; // Return the API response
      throw new Error("API call commented out"); // Simulate API failure
    } catch (error) {
      console.error("API fetch failed, falling back to JSON data:", error);
  
      // Fallback to JSON if the API fails
      const fallbackTask = taskDetailsJson.find((task) => task.id === this.taskId);
      if (!fallbackTask) {
        throw new Error(`Task with ID ${this.taskId} not found in fallback JSON.`);
      }
      return fallbackTask; // Return the fallback task
    }
  }
  

  // Synchronous metadata retrieval (Requires fetched task details)
  async getTaskMetadata() {
    try {
      const task = await this.fetchTaskDetails(); // Fetch task details asynchronously

      // Return the structured metadata
      return {
        id: task.id,                           // Task ID
        dueDate: task.dueDate,                 // Due Date
        title: task.title,                     // Title
        taskDescription: task.taskDescription, // Task Description
        status: task.status,                   // Status
        priority: task.priority,               // Priority
        assignee: task.assignee,               // Assignee
        taskCategory: task.taskCategory,       // Task Category
        checklist: task.checklist,   
        role: "Associate" ,         // Checklist (Array)
      };
    } catch (error) {
      console.error("Failed to get task metadata:", error);
      return null; // Return null if something goes wrong
    }
  }
}

export default TaskModel;

