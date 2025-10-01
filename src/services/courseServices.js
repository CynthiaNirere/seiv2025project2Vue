import apiClient from "./services.js";

export default {
  // Get all courses
  getAllCourses() {
    return apiClient.get("/courses").catch((error) => {
      console.error("Error fetching courses:", error);
      throw error;
    });
  },
  
  // Get a single course by Course Number
  getCourse(courseNumber) {
    return apiClient.get(`/courses/${courseNumber}`).catch((error) => {
      console.error(`Error fetching course ${courseNumber}:`, error);
      throw error;
    });
  },
  
  // Create a new course
  createCourse(data) {
    return apiClient.post("/courses", data).catch((error) => {
      console.error("Error creating course:", error);
      console.error("Error details:", error.response?.data);
      throw error;
    });
  },
  
  // Update an existing course
  updateCourse(courseNumber, data) {
    return apiClient.put(`/courses/${courseNumber}`, data).catch((error) => {
      console.error(`Error updating course ${courseNumber}:`, error);
      throw error;
    });
  },
  
  // Delete a course
  deleteCourse(courseNumber) {
    return apiClient.delete(`/courses/${courseNumber}`).catch((error) => {
      console.error(`Error deleting course ${courseNumber}:`, error);
      throw error;
    });
  },
};
