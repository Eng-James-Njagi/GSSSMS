import {toast} from 'sonner'
import {useNavigate} from 'react-router-dom'
export default function LogIn(){
   const navigate = useNavigate()
   function HandleSubmit(){
      toast.success("It worked")
   }
   const Alternate = () => {
      navigate('/Sign')
   }
   return(
     <div className="window">
      <div className="signs">
         <div className="text-fields">
            <h1>Welcome Back 😊</h1>
            <h3>Enter your details to continue</h3>
            <button>
               Log In
            </button>
          <div className="Option">
              <div className="divider"/>
                  <p>Or</p>
               <div className="divider"/>
          </div>
          <div className="texts">
           <form action={HandleSubmit}>
            <input type="email" placeholder="Email"/>
            <input type="password" placeholder="Enter Password"/>
            <button type="submit">Log  In</button>
           </form>
          </div>
          <div className="otherwise">
            <p>Don't  have an Account</p>
            <small
            onClick={Alternate}
            >Sign In</small>
          </div>
         </div>
         <div className="wallpaper"/>
      </div>
   </div>
   )
}