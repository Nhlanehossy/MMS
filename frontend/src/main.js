
import { createApp } from 'vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';
import store from './stores';
import router from '@/router/index'
import '@/assets/styles/style.css'
import VueSweetalert2 from 'vue-sweetalert2';
import VueHtmlToPaper from 'vue-html-to-paper';
import HighchartsVue from 'highcharts-vue';
import 'sweetalert2/dist/sweetalert2.min.css';
import JsonCSV from 'vue-json-csv'
import GridLayout from 'vue3-drr-grid-layout'
import 'vue3-drr-grid-layout/dist/style.css'
import Antd from 'ant-design-vue';
import VueApexCharts from 'vue3-apexcharts'
import MasonryWall from '@yeger/vue-masonry-wall'
import LightGallery from 'vue-light-gallery';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'vue3-carousel/dist/carousel.css';
import VCalendar from 'v-calendar'
import '@fortawesome/fontawesome-free/css/all.css'
import VueTelInput from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'


const app = createApp(App)
app.use(store);
app.use(VueSweetalert2);
app.use(VueHtmlToPaper);
app.use(VueApexCharts);
app.use(VueTelInput);
app.use(GridLayout)
app.use(Antd);
app.use(MasonryWall);
app.use(HighchartsVue);
app.use(QuillEditor);
app.use(LightGallery);
app.use(VCalendar, {})
app.component('downloadCsv', JsonCSV)
// Use the VueIcon plugin
app.use(router);

app.mount('#app');
