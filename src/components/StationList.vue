<script setup>
import { provide, inject, ref, onMounted } from "vue";
import axios from "axios";

const stations = ref([]);
const loading = ref(true);
const apiUrl = inject("apiUrl");
async function loadStations() {
    return axios.get(apiUrl + "/stations")
}
async function loadLines() {
    return axios.get(apiUrl + "/lines")
}
async function loadTrains() {
    return axios.get(apiUrl + "/trains")
}
onMounted(async () => {
    const [st, li, tr] = await Promise.all([
        loadStations(),
        loadLines(),
        loadTrains()
    ])
    
})

</script>
