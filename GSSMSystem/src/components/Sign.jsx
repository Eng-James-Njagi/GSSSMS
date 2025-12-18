import {toast} from 'sonner'
import {useNavigate} from 'react-router-dom'
export default function SignIn(){
   const navigate = useNavigate()
   function HandleSubmit(){
      toast.success("Button worked")
   }
   const Alternate = () => {
      navigate('/LogIn')
   }
   return(
   <div className="window">
      <div className="signs">
         <div className="text-fields">
            <h1>How Are you👋</h1>
            <h3>Enter your details to continue</h3>
            <button>
               Sign In
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
            <input type="password" placeholder="Confirm Password"/>
            <button type="submit">Sign In</button>
           </form>
          </div>
          <div className="otherwise">
            <p>Already have an Account</p>
            <small
            onClick={Alternate}
            >Log In</small>
          </div>
         </div>
         <div className="wallpaper"/>
      </div>
   </div>
   )
}