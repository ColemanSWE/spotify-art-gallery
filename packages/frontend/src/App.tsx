import React from 'react';
import './App.css';
import GalleryScene from './components/GalleryScene';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Virtual Art Gallery</h1>
      </header>
      <main>
        <GalleryScene />
      </main>
    </div>
  );
}

export default App;
