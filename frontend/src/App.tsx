import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'

import Creator from './pages/Creator'
import { CreatorAfterLogin } from './pages/CreatorAfterLogin'




function App() {
  
  
  return (
    
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing></Landing>} ></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='/creator/:creatorId' element={<Creator></Creator>}></Route>
        <Route path='/creatorLogedin/:creatorId' element={<CreatorAfterLogin></CreatorAfterLogin>}></Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App;
