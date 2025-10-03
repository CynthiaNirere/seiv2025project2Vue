<!-- src/views/AddCourse.vue -->
<script setup>
import CourseServices from "../services/courseServices";
import { ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref(null);
const valid = ref(true);

const saving = ref(false);

// DB-shaped model
const course = ref({
  Dept: "",
  Course_Number: "",
  Level: "",
  Hours: "",
  Name: "",
  Description: "",
});

const message = ref("Enter course data and click save");

// Inline error for Course_Number
const courseNumberError = ref("");
const checkingNumber = ref(false);

// Simple validators
const req = (msg) => (v) => !!v || msg;
const isNum = (msg) => (v) => (v === "" || !isNaN(v)) || msg;

// Normalize helper (so "cs-0010" equals "CS-0010")
const U = (s) => (s ?? "").toString().trim().toUpperCase();

// Check with API if Course_Number already exists
const checkCourseNumberUnique = async () => {
  const n = U(course.value.Course_Number);
  course.value.Course_Number = n; // keep it normalized
  courseNumberError.value = "";
  if (!n) return;

  checkingNumber.value = true;
  try {
    // If your API returns 200 when found and 404 when not found:
    await CourseServices.getCourse(n);
    // Found -> duplicate
    courseNumberError.value = "This course number already exists. Please choose another.";
  } catch (e) {
    // Not found is OK (e.g., 404). Any other error we’ll ignore silently.
    const status = e?.response?.status;
    if (status && status !== 404) {
      // optional: show a subtle message but don't block
      console.warn("Course number check failed:", status);
    }
  } finally {
    checkingNumber.value = false;
  }
};

// Debounce check while user is typing (optional but nice)
let numberCheckTimer;
watch(() => course.value.Course_Number, () => {
  courseNumberError.value = "";
  if (numberCheckTimer) clearTimeout(numberCheckTimer);
  // small delay so we don't spam the API
  numberCheckTimer = setTimeout(checkCourseNumberUnique, 350);
});

const resetForm = () => {
  course.value = {
    Dept: "",
    Course_Number: "",
    Level: "",
    Hours: "",
    Name: "",
    Description: "",
  };
  courseNumberError.value = "";
  form.value?.resetValidation?.();
};

const saveCourse = async () => {
  // Block if duplicate
  if (courseNumberError.value) {
    message.value = "Please fix errors before saving.";
    await nextTick();
    return;
  }

  // Vuetify 3 validate() can be async
  const maybe = form.value?.validate?.();
  if (maybe && typeof maybe.then === "function") {
    const res = await maybe;
    if (!res.valid) return;
  } else if (maybe === false) {
    return;
  }

  const payload = {
    Dept: U(course.value.Dept),
    Course_Number: U(course.value.Course_Number),
    Level: course.value.Level === "" ? null : parseInt(course.value.Level, 10),
    Hours: course.value.Hours === "" ? null : parseInt(course.value.Hours, 10),
    Name: course.value.Name,
    Description: course.value.Description,
  };

  saving.value = true;
  try {
    await CourseServices.createCourse(payload);
    message.value = "Course saved successfully!";
    setTimeout(() => router.push({ name: "CourseList" }), 800);
  } catch (e) {
    console.error("Error creating course:", e);
    const status = e?.response?.status;
    const serverMsg = e?.response?.data?.message;

    // If backend enforces uniqueness and returns 409 or a clear message:
    if (status === 409 || /duplicate|exists/i.test(serverMsg || "")) {
      courseNumberError.value = "This course number already exists. Please choose another.";
      message.value = "Duplicate course number.";
      // focus the field
      await nextTick();
      // If you gave the text-field a ref, you could call .focus() here
    } else {
      message.value = serverMsg || "Error creating course. See console for details.";
    }
  } finally {
    saving.value = false;
  }
};

const cancel = () => {
  resetForm();
  router.push({ name: "CourseList" });
};
</script>

<template>
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
            :error-messages="courseNumberError ? [courseNumberError] : []"
            :counter="45"
            label="Course Number"
            placeholder="e.g., ACCT-0010, CS-1234"
            @blur="checkCourseNumberUnique"
            :loading="checkingNumber"
            clearable
            required
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
            :counter="255"
            label="Description"
            placeholder="Enter course description (optional)"
            rows="4"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn
            :disabled="!valid || !!courseNumberError || saving"
            :loading="saving"
            color="success"
            class="mr-4"
            @click="saveCourse"
          >
            Save Course
          </v-btn>
          <v-btn color="error" class="mr-4" @click="cancel">
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>
h4 { color: #1976d2; font-weight: 500; }
</style>
