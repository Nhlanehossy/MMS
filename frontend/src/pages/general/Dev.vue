<template>
    <span></span>
    <div class="container">
      <div >
          <h1 class="title">Setting up Your AKUKA lodge management system development instance</h1>
          <p>by <a href="https://github.com/g1ftmkyelu">Gift Mkyelu</a> A.K.A The Code Maestro🔥</p>
      </div>

      <div class="card">
        <h2 class="subtitle">👨🏻‍💻Development Mode</h2>
        <ol class="instructions">
          <li>
            <h3>Clone the Repository</h3>
            <p>First, clone the project repository from github <br> <a href="https://github.com/g1ftmkyelu/akuka">https://github.com/g1ftmkyelu/akuka</a></p>
          </li>
          <li>
            <h3>Install Dependencies</h3>
            <p>In the root directory of the project, run the following command to install all the required dependencies for both the backend and frontend:</p>
            <pre><code>npm run setup</code></pre>
            <p>This command is defined in the <code>package.json</code> file in the root directory:</p>
            <pre><code>"setup": "concurrently \\"cd backend && npm i\\" \\"cd frontend && npm i\\"",</code></pre>
            <p>It uses the <code>concurrently</code> package to run two commands simultaneously: <code>npm install</code> in the <code>backend</code> directory and <code>npm install</code> in the <code>frontend</code> directory.</p>
          </li>

          <li>
            <h3>Start the Development Server</h3>
            <p>In the root directory, run the following command to start the development server for both the backend and frontend:</p>
            <pre><code>npm start</code></pre>
            <p>This command is defined in the <code>package.json</code> file in the root directory:</p>
            <pre><code>"start": "concurrently \\"npm run backend\\" \\"npm run frontend\\"",</code></pre>
            <p>It uses the <code>concurrently</code> package to run two commands simultaneously:</p>
            <pre><code>"backend": "cd backend && npm run dev",</code></pre>
            <p>This command starts the backend server in development mode using <code>npm run dev</code> (defined in the <code>backend/package.json</code> file).</p>
            <pre><code>"frontend": "cd frontend && npm run dev",</code></pre>
            <p>This command starts the frontend development server using <code>npm run dev</code> (defined in the <code>frontend/package.json</code> file).</p>
          </li>
        </ol>
      </div>
      <div class="card">
        <h2 class="subtitle">🚀Production Mode</h2>
        <ol class="instructions">
          <li>
            <h3>Just Commit to github</h3>
            <p>make sure you have created and published your own branch.</p>
            <p>after making any changes push to your branch and create a pull request.</p>
            <p>if the pull request is approved the changes are the merged with the master branch which is deployed on vercel</p>
            <p>if deployes successfully your changes will refelect in the Production build at <br> <a href="https://akuka.vercel.app/">https://akuka.vercel.app/</a></p>
          </li>
          
        </ol>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SetupGuide',
  }
  </script>
  
  <style scoped>
  span{
    margin-top: 32vh;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    color: #282c34;
  }
  
  .title {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .card {
    background-color: #f8f8f8;
    border-radius: 0.5rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: black;
  }
  
  .subtitle {
    margin-bottom: 1rem;
  }
  
  .instructions {
    margin-left: 2rem;
  }
  
  .instructions li {
    margin-bottom: 1.5rem;
  }
  
  pre {
    background-color: #282c34;
    color: grey;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }
  
  code {
    font-family: 'Courier New', Courier, monospace;
  }
  </style>