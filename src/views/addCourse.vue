<script setup>
// Plain HTML version of the Add Course form (no Vuetify needed)
import { ref, computed } from 'vue'
import CourseServices from '../services/courseServices'

const status = ref('Enter course data and click save')
const saving = ref(false)
const course = ref({
  dept: '',
  courseNumber: '',
  level: '',
  hours: '',
  name: '',
  description: ''
})

// simple validation rules
const errors = ref({})
const validate = () => {
  const e = {}
  if (!course.value.dept) e.dept = 'Department is required'
  if (course.value.dept.length > 25) e.dept = 'Max 25 chars'
  if (!course.value.courseNumber) e.courseNumber = 'Course number is required'
  if (course.value.courseNumber.length > 45) e.courseNumber = 'Max 45 chars'
  if (course.value.level === '') e.level = 'Level required'
  else if (isNaN(Number(course.value.level))) e.level = 'Level must be a number'
  if (course.value.hours === '') e.hours = 'Hours required'
  else if (isNaN(Number(course.value.hours))) e.hours = 'Hours must be a number'
  if (!course.value.name) e.name = 'Name required'
  if (course.value.name.length > 45) e.name = 'Max 45 chars'
  if (course.value.description.length > 255) e.description = 'Max 255 chars'
  errors.value = e
  return Object.keys(e).length === 0
}

const canSave = computed(() => !saving.value && Object.keys(errors.value).length === 0)

const reset = () => {
  course.value = { dept: '', courseNumber: '', level: '', hours: '', name: '', description: '' }
  errors.value = {}
}

const submit = async () => {
  if (!validate()) {
    status.value = 'Please fix the validation errors.'
    return
  }
  saving.value = true
  status.value = 'Saving...'
  try {
    const payload = {
      Dept: course.value.dept,
      Course_Number: course.value.courseNumber,
      Level: course.value.level ? parseInt(course.value.level) : null,
      Hours: course.value.hours ? parseInt(course.value.hours) : null,
      Name: course.value.name,
      Description: course.value.description
    }
    await CourseServices.createCourse(payload)
    status.value = 'Course saved successfully!'
    reset()
    setTimeout(() => status.value = 'Enter course data and click save', 3000)
  } catch (err) {
    console.error('Error creating course', err)
    status.value = err?.response?.data?.message || 'Failed to save course.'
    setTimeout(() => status.value = 'Enter course data and click save', 5000)
  } finally {
    saving.value = false
  }
}

const cancel = () => {
  reset()
  status.value = 'Cancelled. You can re-enter data.'
  setTimeout(() => status.value = 'Enter course data and click save', 2000)
}
</script>

<template>
  <div class="add-course">
    <h1>Add New Course</h1>
    <p class="status" :class="{ error: Object.keys(errors).length }">{{ status }}</p>
    <form @submit.prevent="submit" novalidate>
      <div class="grid">
        <label>
          <span>Department *</span>
          <input v-model.trim="course.dept" @blur="validate" maxlength="25" placeholder="ACCT, CS" />
          <small v-if="errors.dept" class="err">{{ errors.dept }}</small>
        </label>
        <label>
          <span>Course Number *</span>
            <input v-model.trim="course.courseNumber" @blur="validate" maxlength="45" placeholder="CS-1234" />
          <small v-if="errors.courseNumber" class="err">{{ errors.courseNumber }}</small>
        </label>
        <label>
          <span>Level *</span>
          <input v-model.trim="course.level" @blur="validate" type="number" placeholder="0-9" />
          <small v-if="errors.level" class="err">{{ errors.level }}</small>
        </label>
        <label>
          <span>Hours *</span>
          <input v-model.trim="course.hours" @blur="validate" type="number" placeholder="0-9" />
          <small v-if="errors.hours" class="err">{{ errors.hours }}</small>
        </label>
        <label class="full">
          <span>Name *</span>
          <input v-model.trim="course.name" @blur="validate" maxlength="45" placeholder="Intro to Accounting" />
          <small v-if="errors.name" class="err">{{ errors.name }}</small>
        </label>
        <label class="full">
          <span>Description</span>
          <textarea v-model.trim="course.description" @blur="validate" maxlength="255" rows="4" placeholder="Optional course description"></textarea>
          <small v-if="errors.description" class="err">{{ errors.description }}</small>
        </label>
      </div>
      <div class="actions">
        <button type="submit" :disabled="!canSave">{{ saving ? 'Saving...' : 'Save Course' }}</button>
        <button type="button" class="secondary" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-course { padding:1.5rem; max-width:860px; }
h1 { margin:0 0 .75rem; font-size:1.6rem; }
form { background:#fff; border:1px solid #ddd; padding:1.25rem 1.25rem 1.75rem; border-radius:6px; }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem 1.25rem; }
label { display:flex; flex-direction:column; font-size:.85rem; font-weight:500; letter-spacing:.5px; }
label span { margin-bottom:.35rem; }
input, textarea { font:inherit; padding:.55rem .65rem; border:1px solid #bbb; border-radius:4px; background:#fafafa; }
input:focus, textarea:focus { outline:2px solid #1976d2; background:#fff; }
.full { grid-column:1/-1; }
.actions { margin-top:1.2rem; display:flex; gap:.75rem; }
button { cursor:pointer; padding:.6rem 1.1rem; background:#1976d2; color:#fff; border:1px solid #0d5ea9; border-radius:4px; font-weight:600; }
button[disabled] { opacity:.45; cursor:not-allowed; }
button.secondary { background:#666; border-color:#555; }
.status { margin:.25rem 0 1rem; font-size:.9rem; }
.status.error { color:#c62828; }
.err { color:#c62828; font-size:.7rem; margin-top:.25rem; font-weight:600; }
@media (max-width:600px){ .grid { grid-template-columns:1fr; } }
</style>