<script setup>
import CourseServices from "../services/courseServices";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const course = ref(null);
const message = ref("Loading course data...");
const showDeleteDialog = ref(false);
const deleteMessage = ref("Are you sure you want to delete this course? This action cannot be undone.");

const loadCourse = async () => {
  const courseNumber = route.params.courseNumber;
  if (!courseNumber) {
    router.push({ name: "CourseList" });
    return;
  }

  loading.value = true;
  try {
    const response = await CourseServices.getCourse(courseNumber);
    course.value = response.data; // already in DB shape
    message.value = "";
  } catch (e) {
    console.error("Error loading course:", e);
    message.value = e.response?.data?.message || "Error loading course data";
  } finally {
    loading.value = false;
  }
};

const backToList = () => {
  router.push({ name: "CourseList" });
};

const goToEdit = () => {
  if (course.value?.Course_Number) {
    router.push({ name: "EditCourse", params: { courseNumber: course.value.Course_Number } });
  }
};

const confirmDelete = async () => {
  if (!course.value?.Course_Number) return;

  try {
    await CourseServices.deleteCourse(course.value.Course_Number);
    // On success, navigate back
    backToList();
  } catch (e) {
    console.error("Error deleting course:", e);
    message.value = e.response?.data?.message || "Error deleting course";
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
};

onMounted(loadCourse);
</script>

<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Course Details</v-toolbar-title>
    </v-toolbar>
    <br />
    <v-progress-linear v-if="loading" indeterminate color="primary" />
    <h4 v-else-if="message">{{ message }}</h4>

    <div v-else>
      <p><strong>Department:</strong> {{ course.Dept }}</p>
      <p><strong>Course Number:</strong> {{ course.Course_Number }}</p>
      <p><strong>Name:</strong> {{ course.Name }}</p>
      <p><strong>Level:</strong> {{ course.Level }}</p>
      <p><strong>Hours:</strong> {{ course.Hours }}</p>
      <p><strong>Description:</strong> {{ course.Description }}</p>

      <v-btn color="primary" class="mr-2" @click="goToEdit">Edit</v-btn>
      <v-btn color="error" class="mr-2" @click="showDeleteDialog = true">Delete</v-btn>
      <v-btn color="secondary" @click="backToList">Back to List</v-btn>
    </div>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>{{ deleteMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="cancelDelete">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
h4 { color: #1976d2; font-weight: 500; }
</style>