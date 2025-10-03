<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import CourseServices from '../services/courseServices'

const router = useRouter()
const loading = ref(true)
const error = ref(null)
const courses = ref([])

const q = ref('')
const info = ref('')

// Delete dialog + snackbar
const showDeleteDialog = ref(false)
const deleteTarget = ref(null)
const deleteMessage = ref('Are you sure you want to delete this course? This action cannot be undone.')
const snackbar = ref(false)
const snackbarText = ref('')

// Pagination state
const page = ref(1)
const perPage = ref(10)

// Helpers
const U = (s) => (s ?? '').toString().trim().toUpperCase()
// escape "-" in the class
const collapse = (s) => U(s).replace(/[\s\-_/\\.]+/g, '')

// Load all courses
onMounted(async () => {
  try {
    const { data } = await CourseServices.getAllCourses()
    courses.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error(e)
    error.value = e?.response?.data?.message || 'Failed to load courses.'
  } finally {
    loading.value = false
  }
})

// Filtered list
const filtered = computed(() => {
  const term = U(q.value)
  if (!term) {
    info.value = ''
    return courses.value
  }
  const termCollapsed = collapse(term)
  const list = courses.value.filter(c => {
    const dept = U(c?.Dept)
    const number = U(c?.Course_Number)
    return dept.includes(term) || collapse(number).includes(termCollapsed)
  })
  info.value = `Showing ${list.length} result${list.length === 1 ? '' : 's'}`
  return list
})

// Pagination derived values
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const startIndex = computed(() => (page.value - 1) * perPage.value)
const endIndex = computed(() => startIndex.value + perPage.value)
const paged = computed(() => filtered.value.slice(startIndex.value, endIndex.value))

// Reset page when results or page size change
watch([filtered, perPage], () => { page.value = 1 })

function onSearch() {
  // optional: you already filter as you type; this keeps the button behavior
}

// Row actions
function goToEdit(c) {
  router.push({ name: 'EditCourse', params: { courseNumber: c.Course_Number } })
}
function askDelete(c) {
  deleteTarget.value = c
  showDeleteDialog.value = true
}
async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await CourseServices.deleteCourse(deleteTarget.value.Course_Number)
    courses.value = courses.value.filter(x => x.Course_Number !== deleteTarget.value.Course_Number)
    snackbarText.value = `Deleted: ${deleteTarget.value.Dept} ${deleteTarget.value.Course_Number}`
    snackbar.value = true
  } catch (e) {
    console.error('Error deleting course:', e)
    error.value = e?.response?.data?.message || 'Error deleting course.'
  } finally {
    showDeleteDialog.value = false
    deleteTarget.value = null
  }
}
function cancelDelete() {
  showDeleteDialog.value = false
  deleteTarget.value = null
}
</script>

<template>
  <v-container class="pa-4">
    <!-- Toolbar stays visible -->
    <v-toolbar flat>
      <v-toolbar-title>Courses</v-toolbar-title>
      <v-spacer />

      <!-- Search -->
      <v-text-field
        v-model="q"
        class="mx-2"
        style="max-width: 360px"
        density="comfortable"
        clearable
        hide-details
        placeholder="Search Dept or Course # (e.g., CS or CS-1234)"
        @keyup.enter="onSearch"
      >
        <!-- Vuetify 3 slot -->
        <template #append-inner>
          <v-btn size="small" variant="flat" @click="onSearch">Search</v-btn>
        </template>
      </v-text-field>

      <!-- Add Course -->
      <v-btn color="primary" :to="{ name: 'AddCourse' }">Add Course</v-btn>
    </v-toolbar>

    <!-- Loader under toolbar -->
    <v-progress-linear v-if="loading" indeterminate />

    <div v-else>
      <div v-if="error">{{ error }}</div>

      <div v-else>
        <div class="d-flex align-center justify-space-between mb-2">
          <div v-if="q && filtered.length >= 0" class="text-caption">{{ info }}</div>

          <!-- Items per page -->
          <div class="text-caption">
            Per page:
            <v-select
              v-model="perPage"
              :items="[5, 10, 20, 50]"
              density="compact"
              hide-details
              style="max-width: 92px; display: inline-block;"
            />
          </div>
        </div>

        <div v-if="!filtered.length">
          <p>No matching courses.</p>
        </div>

        <div v-else>
          <v-table>
            <thead>
              <tr>
                <th>Dept</th>
                <th>Course #</th>
                <th>Name</th>
                <th>Hours</th>
                <th>Level</th>
                <th style="width:190px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in paged" :key="c.Course_Number">
                <td>{{ c.Dept }}</td>
                <td>
                  <RouterLink :to="{ name: 'ViewCourse', params: { courseNumber: c.Course_Number } }">
                    {{ c.Course_Number }}
                  </RouterLink>
                </td>
                <td>
                  <RouterLink :to="{ name: 'ViewCourse', params: { courseNumber: c.Course_Number } }">
                    {{ c.Name }}
                  </RouterLink>
                </td>
                <td>{{ c.Hours }}</td>
                <td>{{ c.Level }}</td>
                <td>
                  <v-btn size="small" color="primary" class="mr-2" @click.stop="goToEdit(c)">Edit</v-btn>
                  <v-btn size="small" color="error" variant="tonal" @click.stop="askDelete(c)">Delete</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Pagination -->
          <div class="d-flex align-center justify-space-between mt-3">
            <div class="text-caption">
              Showing {{ Math.min(startIndex + 1, filtered.length) }}–
              {{ Math.min(endIndex, filtered.length) }} of {{ filtered.length }}
            </div>

            <v-pagination
              v-model="page"
              :length="totalPages"
              :total-visible="7"
              rounded="circle"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          {{ deleteMessage }}
          <div v-if="deleteTarget" class="mt-2 text-body-2">
            <strong>{{ deleteTarget.Dept }} {{ deleteTarget.Course_Number }}</strong> — {{ deleteTarget.Name }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="cancelDelete">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Toast -->
    <v-snackbar v-model="snackbar" timeout="2200">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>
