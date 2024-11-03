<template>
    <div class="terms-page py-10 px-6 lg:px-24">
      <!-- Page Title -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Terms and Conditions</h1>
        <p class="text-lg text-gray-600">Last updated: September 23, 2024</p>
      </div>
  
      <!-- Terms Section -->
      <a-card class="shadow-lg" bordered={false}>
        <div class="text-gray-800 space-y-8">
          <!-- Section 1 -->
          <div>
            <h2 class="text-2xl font-semibold mb-2">1. Introduction</h2>
            <p class="text-base leading-relaxed">
              Welcome to our website! These terms and conditions outline the rules and regulations for the use of our services.
            </p>
          </div>
  
          <!-- Section 2 -->
          <div>
            <h2 class="text-2xl font-semibold mb-2">2. Intellectual Property Rights</h2>
            <p class="text-base leading-relaxed">
              All content, trademarks, service marks, and logos used in our website are the property of our company. You are prohibited from reproducing, distributing, or using this content in any way without prior permission.
            </p>
          </div>
  
          <!-- Section 3 -->
          <div>
            <h2 class="text-2xl font-semibold mb-2">3. User Responsibilities</h2>
            <p class="text-base leading-relaxed">
              You are responsible for using the website in accordance with all applicable laws and regulations. Any misuse or violation may result in termination of access.
            </p>
          </div>
  
          <!-- Section 4 -->
          <div>
            <h2 class="text-2xl font-semibold mb-2">4. Limitation of Liability</h2>
            <p class="text-base leading-relaxed">
              We are not responsible for any damages or losses arising from the use of our website, including but not limited to direct, indirect, incidental, or consequential damages.
            </p>
          </div>
  
          <!-- Section 5 -->
          <div>
            <h2 class="text-2xl font-semibold mb-2">5. Termination</h2>
            <p class="text-base leading-relaxed">
              We reserve the right to terminate or suspend your access to our website at any time for any reason, including but not limited to violation of these terms.
            </p>
          </div>
  
          <!-- Section 6 -->
          <div>
            <h2 class="text-2xl font-semibold mb-2">6. Amendments</h2>
            <p class="text-base leading-relaxed">
              We may revise these terms at any time by posting an updated version on our website. By continuing to use the website after any changes, you agree to be bound by the new terms.
            </p>
          </div>
        </div>
      </a-card>
  
      <!-- Back to top button -->
      <div class="fixed bottom-8 right-8">
        <a-back-top>
          <div class="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-full shadow-lg">
            <i class="fas fa-arrow-up text-lg"></i>
          </div>
        </a-back-top>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TermsAndConditions",
  };
  </script>
  

  