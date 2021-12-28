import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles.css';
import DemoContainer from './components/demo-components/DemoContainer';
import LandingContainer from './components/LandingContainer';
import DocsContainer from './components/DocsContainer';
import Team from './components/Team';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingContainer />} />
      <Route path='/Demo' element={<DemoContainer />} />
      <Route path='/Docs' element={<DocsContainer />} />
      <Route path='/Team' element={<Team />} />
    </Routes>
  );
}

export default App;
