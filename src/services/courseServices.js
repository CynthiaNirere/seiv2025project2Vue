import apiClient from "./services.js";

export default {
<<<<<<< HEAD
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
=======
  getAll() {
    return apiClient.get("/courses");
  },
  getAllForUser(userId) {
    return apiClient.get("/courses/userCourse/" + userId);
  },
  getCourse(id) {
    return apiClient.get(`/courses/${id}`);
  },
  create(data) {
    return apiClient.post("/courses", data);
  },
  updateCourse(id, data) {
    return apiClient.put(`/courses/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/courses/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/courses`);
  },
  findByName(name) {
    return apiClient.get(`/courses?name=${name}`);
  },
  findByEntryLevel(entryLevel) {
    return apiClient.get(`/courses?entryLevel=${entryLevel}`);
  },
};
>>>>>>> 569c5b8 (added edit page)
