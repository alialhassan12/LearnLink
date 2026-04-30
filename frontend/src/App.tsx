import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import Aos from "aos"
import "aos/dist/aos.css"


function App() {

  Aos.init({
    duration: 1000,
  });

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
      </Routes>
    </>
  )
}

export default App
