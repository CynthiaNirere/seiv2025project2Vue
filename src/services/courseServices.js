// src/services/courseServices.js
import apiClient from './services.js';

// With Vite proxy, baseURL is just /api
const api = apiClient;

export default {
  // GET /api/courses
  getAllCourses: () => api.get('/courses'),

  
  getCourse: (courseNumber) => api.get(`/courses/${encodeURIComponent(courseNumber)}`),

  // POST /api/courses
  createCourse: (payload) => api.post('/courses', payload),

  // PUT /api/courses/:courseNumber
  updateCourse: (courseNumber, payload) =>
    api.put(`/courses/${encodeURIComponent(courseNumber)}`, payload),

  // DELETE /api/courses/:courseNumber
  deleteCourse: (courseNumber) =>
    api.delete(`/courses/${encodeURIComponent(courseNumber)}`),
};
