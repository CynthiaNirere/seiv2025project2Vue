<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import CourseServices from "../services/courseServices";

const router = useRouter();
const courses = ref([]);
const message = ref("");  // Empty message by default
const loading = ref(false);

const retrieveCourses = async () => {
  loading.value = true;
  try {
    const res = await CourseServices.getAllCourses();
    // Expect backend to return array in res.data
    courses.value = res.data || [];
  } catch (e) {
    console.error("Failed to load courses:", e);
    message.value = e.response?.data?.message || "Failed to load courses";
  } finally {
    loading.value = false;
  }
};

const goToAddCourse = () => {
  // Router in this project registers the add route with name 'add'
  router.push({ name: "add" });
};

const editCourse = (course) => {
  // If you later add an edit route, update this to the correct name/params
  // For now navigate to add page and consider implementing edit mode there
  router.push({ name: "add", params: { courseNumber: course.Course_Number || course.CourseNumber || course.id } });
};

const deleteCourse = async (course) => {
  const courseNumber = course.Course_Number || course.CourseNumber || course.id;
  if (!courseNumber) {
    message.value = "Unable to delete: missing course identifier.";
    return;
  }

  try {
    await CourseServices.deleteCourse(courseNumber);
    message.value = "Course deleted";
    // Refresh list
    await retrieveCourses();
  } catch (e) {
    console.error("Delete failed:", e);
    message.value = e.response?.data?.message || "Delete failed";
  }
};

onMounted(() => retrieveCourses());
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
          <v-btn class="mx-2" color="success" @click="goToAddCourse">
            Add Course
          </v-btn>
        </v-card-title>

        <v-data-table :items="courses" :loading="loading" class="elevation-1">
          <template #item.Dept="{ item }">
            {{ item.Dept }}
          </template>
          <template #item.Course_Number="{ item }">
            {{ item.Course_Number }}
          </template>
          <template #item.Name="{ item }">
            {{ item.Name }}
          </template>
          <template #item.Description="{ item }">
            {{ item.Description }}
          </template>

          <template #item.actions="{ item }">
            <v-icon small class="mx-2" @click="editCourse(item)">mdi-pencil</v-icon>
            <v-icon small class="mx-2" @click="deleteCourse(item)">mdi-trash-can</v-icon>
          </template>

          <template #no-data>
            No courses available.
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>