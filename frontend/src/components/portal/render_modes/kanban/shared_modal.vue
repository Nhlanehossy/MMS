<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-button" @click="$emit('close')">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['title']
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    transform: translateY(-30px);
    animation: slideIn 0.3s ease forwards;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  h2 {
    margin: 0;
    color: #111827;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #6b7280;
    font-size: 1.25rem;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .close-button:hover {
    color: #111827;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(-30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  </style>