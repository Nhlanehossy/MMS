<script setup>
import UIButton from "./u_i/sf_button.vue";
import { getCompanyConfig } from "../executables/getCompanyConfig";
import Logo from "./u_i/sf_logo.vue";
</script>

<template>
  <footer class="bg-cardLight py-12 border-t border-textLighter">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Information -->
        <div class="col-span-1 md:col-span-2 lg:col-span-1">
          <Logo class="mb-4" />
          <p class="text-secondary mb-2" v-html="company.companyMotto"></p>
          <p class="text-gray-400" v-html="company.companyAddress"></p>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-secondary font-bold mb-4 text-lg">Resources</h3>
          <ul class="space-y-2 list-none">
            <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">Blog</a></li>
            <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">Guides</a></li>
            <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">Support</a></li>
            <li>
              <UIButton as="router-link" variant="secondary" to="/login" class="inline-flex items-center mt-2">
                <i class="fas fa-user mr-2"></i>
                Login
              </UIButton>
            </li>
          </ul>
        </div>

        <!-- Follow Us -->
        <div>
          <h3 class="text-secondary font-bold mb-4 text-lg">Follow Us</h3>
          <ul class="space-y-2 list-none">
            <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">Twitter</a></li>
            <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">Facebook</a></li>
            <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="mt-12 pt-8 border-t border-gray-700">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 mb-4 md:mb-0">
            &copy; {{ new Date().getFullYear() }} {{ company.companyName }}. All rights reserved.
          </p>
          <ul class="flex space-x-6 list-none">
            <li>
              <a href="#" class="text-gray-400 hover:text-secondary transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-secondary transition-colors">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import UIButton from "./u_i/sf_button.vue";
import { getCompanyConfig } from "../executables/getCompanyConfig";
export default {
  components: {
    UIButton,
  },
  data() {
    return {
      company: {},
    };
  },
  mounted() {
    this.getCompany();
  },
  methods: {
    async getCompany() {
      this.company = await getCompanyConfig();
    },
  },
};
</script>
