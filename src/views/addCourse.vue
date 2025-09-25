<script setup>
import CourseServices from "../services/courseServices";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
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

const saveCourse = () => {
  const data = {
    dept: course.value.dept,
    courseNumber: course.value.courseNumber,
    level: course.value.level,
    hours: course.value.hours,
    name: course.value.name,
    description: course.value.description,
  };
  
  CourseServices.createCourse(data)
    .then((response) => {
      course.value.id = response.data.id;
      router.push({ name: "courses-list" }); // Adjust route name as needed when Fabiola finishes her page
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error creating course";
    });
};

const cancel = () => {
  router.push({ name: "courses-list" }); // Adjust route name as needed when Fabiola finishes her page
};

// Validation rules
const deptRules = [
  (v) => !!v || "Department is required",
  (v) => (v && v.length <= 10) || "Department must be less than 10 characters",
];

const courseNumberRules = [
  (v) => !!v || "Course number is required",
  (v) => (v && v.length <= 20) || "Course number must be less than 20 characters",
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
  (v) => (v && v.length <= 100) || "Course name must be less than 100 characters",
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
              :counter="10"
              label="Department"
              placeholder="e.g., ACCT, BIBL"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="course.courseNumber"
              id="courseNumber"
              :rules="courseNumberRules"
              :counter="20"
              label="Course Number"
              placeholder="e.g., ACCT-0010"
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
              placeholder="e.g., 0, 3"
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
              placeholder="e.g., 0, 1, 2"
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
              :counter="100"
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
              label="Description"
              placeholder="Enter course description (optional)"
              rows="4"
              :counter="500"
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