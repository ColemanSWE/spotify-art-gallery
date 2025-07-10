import React from 'react';
import './App.css';
import UnderConstruction from './components/UnderConstruction';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <UnderConstruction />
      </div>
    </AuthProvider>
  );
}

export default App;
