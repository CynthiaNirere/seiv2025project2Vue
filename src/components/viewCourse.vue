<script setup>
// TODO: Replace with your actual CourseServices import
// import CourseServices from "../services/courseServices";
// TODO: Replace with your actual CourseServices import path

import CourseServices from "../services/courseServices"; 
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const courses = ref([]);
const message = ref("Add, Edit or Delete Courses");

const retrieveCourses = () => {
  // TODO: Replace with your actual API call to get all courses
  // CourseServices.getAll()
  //   .then((response) => {
  //     courses.value = response.data;
  //   })
  //   .catch((e) => {
  //     message.value = e.response.data.message;
  //   });
};

const editCourse = (course) => {
  // TODO: Update route name and params as needed
  router.push({ name: "editCourse", params: { courseId: course.id } });
};

const addCourse = () => {
  // TODO: Update route name as needed
  router.push({ name: "addCourse" });
};

const deleteCourse = (course) => {
  // TODO: Replace with your actual API call to delete a course
  // CourseServices.delete(course.id)
  //   .then(() => {
  //     retrieveCourses();
  //   })
  //   .catch((e) => {
  //     message.value = e.response.data.message;
  //   });
};

onMounted(() => {
  retrieveCourses();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Courses</v-toolbar-title>
      </v-toolbar>
      <br />
      <v-card>
        <v-card-title>
          <v-btn class="mx-2" color="success" @click="addCourse">
            Add Course
          </v-btn>
        </v-card-title>
        <v-card-text>
          <b>{{ message }}</b>
        </v-card-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Title</th>
              <th class="text-left">Description</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.title">
              <td>{{ course.title }}</td>
              <td>{{ course.description }}</td>
              <td>
                <v-icon small class="mx-4" @click="editCourse(course)">
                  mdi-pencil
                </v-icon>
                <v-icon small class="mx-4" @click="deleteCourse(course)">
                  mdi-trash-can
                </v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </div>
</template>