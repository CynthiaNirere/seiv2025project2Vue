<script setup>
import CourseServices from "../services/courseServices";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref(null);
const valid = ref(true);
const course = ref({
  id: null,
  dept: "",
  courseNumber: "",
  level: "",
  hours: "",
  name: "",
  description: "",
});
const message = ref("Enter course data and click save");

const saveCourse = async () => {
  if (form.value && !form.value.validate()) {
    message.value = "Please fix the validation errors.";
    return;
  }

  // Map frontend field names to backend field names
  const data = {
    Dept: course.value.dept,
    Course_Number: course.value.courseNumber,
    Level: course.value.level ? parseInt(course.value.level) : null,
    Hours: course.value.hours ? parseInt(course.value.hours) : null,
    Name: course.value.name,
    Description: course.value.description,
  };
  
  try {
    const response = await CourseServices.createCourse(data);
    course.value.id = response.data.Course_Number;
    message.value = "Course saved successfully!";
    
    // Reset form after success
    course.value = { 
      id: null, 
      dept: "", 
      courseNumber: "", 
      level: "", 
      hours: "", 
      name: "", 
      description: "" 
    };
    
    if (form.value) {
      form.value.resetValidation();
    }
    
    // Optional: Show success message for a few seconds then reset
    setTimeout(() => {
      message.value = "Enter course data and click save";
    }, 3000);
    
  } catch (e) {
    console.error("Error creating course:", e);
    message.value = e.response?.data?.message || "Error creating course. Please check console for details.";
    
    // Clear error message after delay
    setTimeout(() => {
      message.value = "Enter course data and click save";
    }, 5000);
  }
};

const cancel = () => {
  message.value = "Cancelled. Please re-enter data if needed.";
  course.value = { 
    id: null, 
    dept: "", 
    courseNumber: "", 
    level: "", 
    hours: "", 
    name: "", 
    description: "" 
  };
  
  if (form.value) {
    form.value.resetValidation();
  }
  
  // Reset message after delay
  setTimeout(() => {
    message.value = "Enter course data and click save";
  }, 2000);
};

// Validation rules
const deptRules = [
  (v) => !!v || "Department is required",
  (v) => (v && v.length <= 25) || "Department must be less than 25 characters",
];

const courseNumberRules = [
  (v) => !!v || "Course number is required",
  (v) => (v && v.length <= 45) || "Course number must be less than 45 characters",
];

const levelRules = [
  (v) => !!v || "Level is required",
  (v) => !isNaN(v) || "Level must be a number",
];

const hoursRules = [
  (v) => !!v || "Hours is required",
  (v) => !isNaN(v) || "Hours must be a number",
];

const nameRules = [
  (v) => !!v || "Course name is required",
  (v) => (v && v.length <= 45) || "Course name must be less than 45 characters",
];

const descriptionRules = [
  (v) => !v || v.length <= 255 || "Description must be less than 255 characters",
];
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Add New Course</v-toolbar-title>
      </v-toolbar>
      <br />
      <h4>{{ message }}</h4>
      <br />
      
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="course.dept"
              id="dept"
              :rules="deptRules"
              :counter="25"
              label="Department"
              placeholder="e.g., ACCT, BIBL, CS"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="course.courseNumber"
              id="courseNumber"
              :rules="courseNumberRules"
              :counter="45"
              label="Course Number"
              placeholder="e.g., ACCT-0010, CS-1234"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="course.level"
              id="level"
              :rules="levelRules"
              type="number"
              label="Level"
              placeholder="e.g., 0, 1, 2, 3"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="course.hours"
              id="hours"
              :rules="hoursRules"
              type="number"
              label="Hours"
              placeholder="e.g., 0, 1, 2, 3"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="course.name"
              id="name"
              :rules="nameRules"
              :counter="45"
              label="Course Name"
              placeholder="e.g., Accounting Lower Division"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="course.description"
              id="description"
              :rules="descriptionRules"
              label="Description"
              placeholder="Enter course description (optional)"
              rows="4"
              :counter="255"
            ></v-textarea>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="saveCourse"
            >
              Save Course
            </v-btn>
            <v-btn 
              color="error" 
              class="mr-4" 
              @click="cancel"
            > 
              Cancel 
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<style scoped>
h4 {
  color: #1976d2;
  font-weight: 500;
}
</style>