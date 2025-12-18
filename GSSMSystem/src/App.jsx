import {BrowserRouter, Routes, Route }from 'react-router-dom'
import {Toaster} from 'sonner'
import Home from './components/Home'
import SignIn from './components/Sign'
import LogIn from './components/LogIn'
export default function App(){
  return(
    <>
    <Toaster position='top-center' richColors/>    
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/Sign' element={<SignIn />} />
          <Route path='/LogIn' element={<LogIn />}/>
        </Routes>
    </BrowserRouter>
    </>
  )
}