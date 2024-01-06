/* eslint-disable jsx-a11y/alt-text */

import './App.css';
import { React } from "react"
import Main from './pages/Main';
import Repository from './pages/Repository';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return(

      <Router>

        <Routes>

          <Route path='/' Component={Main}/>
          <Route path='/repository/:rep' Component={Repository}/>

        </Routes>

      </Router>
    
  )
}

export default App;
