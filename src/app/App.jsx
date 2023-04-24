import React, { useState } from 'react';
import logo from './logo.svg';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';
import axios from 'axios';

const API_URL = 'http:localhost:3001'
function App() {
  const [count, setCount] = useState(0);

  axios.post(`${API_URL}/api/hello`, {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }).then(function (response) {
    console.log(response, 'response');
  })

  return (
    <Router>
      <div className={styles.App}>
        <header className={styles['App-header']}>
          <img src={logo} className={styles['App-logo']} alt="logo" />
          <Welcome />
          <p>
            <button onClick={() => setCount((count) => count + 1)}>
              count is: {count}
            </button>
          </p>
          <p>
            Edit <code>App.jsx</code> and save to test HMR updates.
          </p>
          <p>
            <a
              className={styles['App-link']}
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            {' | '}
            <a
              className={styles['App-link']}
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vite Docs
            </a>
          </p>
          <Switch>
            <Route path="/about">
              <main>About</main>
            </Route>
            <Route path="/">
              <main>Home</main>
            </Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
