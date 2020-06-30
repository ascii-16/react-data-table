import React, { useState } from 'react';
import './App.scss';
import data from './data/data.json';
import Datatable from './components/Datatable';
import Nav from './components/Nav';

function App() {
  const [mode, setMode] = useState('light');
  
  const switchTheme = (mode) => {
    setMode(mode);
  }

  return (
    <div className={ mode === 'dark'  ? "App dark" : "App light" }>
      <Nav onThemeChange={switchTheme}/>
      <Datatable data={data}/>
    </div>
  );
}

export default App;
