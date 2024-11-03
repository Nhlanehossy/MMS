<template>
    <footer class="bg-background text-text py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">About Us</h3>
            <p class="text-gray-400">A brief description of your company and its mission.</p>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li v-for="item in quickLinks" :key="item.label">
                <a :href="item.link" class="text-gray-400 hover:text-white">{{ item.label }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Contact Us</h3>
            <ul class="space-y-2 text-gray-400">
              <li>123 Main St, Anytown, USA</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@mycompany.com</li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Follow Us</h3>
            <div class="flex space-x-4">
              <a v-for="item in socialLinks" :key="item.platform" :href="item.link" class="text-gray-400 hover:text-white text-2xl">
                <i :class="`fab fa-${item.platform}`"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} My Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  const quickLinks = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Services', link: '/services' },
    { label: 'Contact', link: '/contact' },
  ];
  
  const socialLinks = [
    { platform: 'facebook', link: 'https://facebook.com' },
    { platform: 'twitter', link: 'https://twitter.com' },
    { platform: 'instagram', link: 'https://instagram.com' },
    { platform: 'linkedin', link: 'https://linkedin.com' },
  ];
  </script>