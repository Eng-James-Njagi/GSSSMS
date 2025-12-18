import {useNavigate} from 'react-router-dom'
import '../App.css'
export default function Home(){
   const logs = "Log In →"
   const signs = "Sign In"
   const navigate = useNavigate()

  const handleNav = () => {
   navigate('/Sign')
  }
  const handleLog = () => {
   navigate('/LogIn')
  }
   return(
      <div className="Display">
         <nav>
            <h1>Gean Sales</h1>
            <button
            onClick={handleNav}
            >{signs}</button>
         </nav>
         <div className="Message">
            <h1>Gean Sugarcane Sales and Stock 
               Management System
            </h1>
            <h3>A smart Assistant for half the price</h3>
            <button
            onClick={handleLog}
            >{logs}</button>
         </div>
      </div>
   )
}