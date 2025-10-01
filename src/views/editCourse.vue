<script setup>
import CourseServices from "../services/courseServices";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const course = ref({});
const message = ref("Enter data and click save");

// Entry level options for dropdown
const entryLevels = ref([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
]);

const props = defineProps({
  id: {
    required: true,
  },
});

const retrieveCourse = () => {
  CourseServices.getCourse(props.id)
    .then((response) => {
      course.value = response.data;
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error retrieving course";
    });
};

const saveCourse = () => {
  const data = {
    name: course.value.name,
    description: course.value.description,
    entryLevel: course.value.entryLevel,
    duration: course.value.duration,
    instructor: course.value.instructor,
    credits: course.value.credits,
  };
  
  CourseServices.updateCourse(props.id, data)
    .then((response) => {
      course.value.id = response.data.id;
      message.value = "Course updated successfully!";
      
      // Redirect to course view or courses list
      router.push({
        name: "courses", // or "viewCourse" with params: { id: course.value.id }
      });
    })
    .catch((e) => {
      message.value = e.response?.data?.message || "Error updating course";
    });
};

const cancel = () => {
  router.push({
    name: "courses", // Redirect to courses list
  });
};

onMounted(() => {
  retrieveCourse();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Edit Course</v-toolbar-title>
      </v-toolbar>
      <br />
      <v-alert
        v-if="message"
        :type="message.includes('success') ? 'success' : 'info'"
        dismissible
      >
        {{ message }}
      </v-alert>
      <br />
      <h4>Course ID: {{ id }}</h4>
      <br />
      
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="course.name"
          id="name"
          :counter="100"
          label="Course Name"
          :rules="[(v) => !!v || 'Course name is required']"
          required
        ></v-text-field>

        <v-textarea
          v-model="course.description"
          id="description"
          :counter="500"
          label="Description"
          rows="4"
          :rules="[(v) => !!v || 'Description is required']"
          required
        ></v-textarea>

        <v-select
          v-model="course.entryLevel"
          :items="entryLevels"
          label="Entry Level"
          :rules="[(v) => !!v || 'Entry level is required']"
          required
        ></v-select>

        <v-text-field
          v-model="course.duration"
          id="duration"
          label="Duration (e.g., 8 weeks, 3 months)"
          :counter="50"
        ></v-text-field>

        <v-text-field
          v-model="course.instructor"
          id="instructor"
          label="Instructor Name"
          :counter="100"
        ></v-text-field>

        <v-text-field
          v-model.number="course.credits"
          id="credits"
          label="Credits"
          type="number"
          min="0"
        ></v-text-field>

        <v-divider class="my-4"></v-divider>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveCourse"
        >
          <v-icon left>mdi-content-save</v-icon>
          Save Changes
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel">
          <v-icon left>mdi-cancel</v-icon>
          Cancel
        </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<style scoped>
.v-container {
  max-width: 800px;
}
</style>
