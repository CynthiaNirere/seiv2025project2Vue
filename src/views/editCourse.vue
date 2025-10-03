<script setup>
import CourseServices from "../services/courseServices";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const form = ref(null);
const valid = ref(true);
const loading = ref(false);

// Use DB-shaped keys in the form model
const course = ref({
  Dept: "",
  Course_Number: "",
  Level: "",
  Hours: "",
  Name: "",
  Description: "",
});
const message = ref("Loading course data...");

const loadCourse = async () => {
  const courseNumber = route.params.courseNumber;
  if (!courseNumber) {
    router.push({ name: "CourseList" });
    return;
  }
  loading.value = true;
  try {
    const response = await CourseServices.getCourse(courseNumber);
    const data = response.data || {};
    // keep the exact DB keys
    course.value = {
      Dept: data.Dept ?? "",
      Course_Number: data.Course_Number ?? "",
      Level: (data.Level ?? "")?.toString(),
      Hours: (data.Hours ?? "")?.toString(),
      Name: data.Name ?? "",
      Description: data.Description ?? "",
    };
    message.value = "Edit course data and click update";
  } catch (e) {
    console.error("Error loading course:", e);
    message.value = e.response?.data?.message || "Error loading course data";
  } finally {
    loading.value = false;
  }
};

const updateCourse = async () => {
  if (form.value && !form.value.validate()) {
    message.value = "Please fix the validation errors.";
    return;
  }
  // Only updatable fields (do NOT change primary key)
  const payload = {
    Dept: course.value.Dept,
    Level: course.value.Level ? parseInt(course.value.Level) : null,
    Hours: course.value.Hours ? parseInt(course.value.Hours) : null,
    Name: course.value.Name,
    Description: course.value.Description,
  };

  try {
    await CourseServices.updateCourse(course.value.Course_Number, payload);
    message.value = "Course updated successfully!";
    setTimeout(() => router.push({ name: "CourseList" }), 900);
  } catch (e) {
    console.error("Error updating course:", e);
    message.value = e.response?.data?.message || "Error updating course.";
    setTimeout(() => (message.value = "Edit course data and click update"), 3000);
  }
};

const cancel = () => router.push({ name: "CourseList" });

onMounted(loadCourse);

// Simple rules
const req = (msg) => (v) => !!v || msg;
const isNum = (msg) => (v) => (v === "" || !isNaN(v)) || msg;
</script>

<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Edit Course</v-toolbar-title>
    </v-toolbar>

    <br />
    <h4>{{ message }}</h4>
    <br />

    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <v-form ref="form" v-model="valid" lazy-validation v-if="!loading">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="course.Dept"
            :rules="[req('Department is required')]"
            :counter="25"
            label="Department"
            placeholder="e.g., ACCT, BIBL, CS"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="course.Course_Number"
            :rules="[req('Course number is required')]"
            :counter="45"
            label="Course Number"
            disabled
            hint="Course number (primary key) cannot be changed"
            persistent-hint
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="course.Level"
            :rules="[req('Level is required'), isNum('Level must be a number')]"
            type="number"
            label="Level"
            placeholder="e.g., 0, 1, 2, 3"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="course.Hours"
            :rules="[req('Hours is required'), isNum('Hours must be a number')]"
            type="number"
            label="Hours"
            placeholder="e.g., 0, 1, 2, 3"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="course.Name"
            :rules="[req('Course name is required')]"
            :counter="45"
            label="Course Name"
            placeholder="e.g., Accounting Lower Division"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="course.Description"
            label="Description"
            placeholder="Enter course description (optional)"
            rows="4"
            :counter="255"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn :disabled="!valid" color="primary" class="mr-4" @click="updateCourse">
            Update Course
          </v-btn>
          <v-btn color="error" class="mr-4" @click="cancel">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>
h4 { color: #1976d2; font-weight: 500; }
</style>
