import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')
    const conPassword = formData.get('conPassword')

    if (!email || !password || !conPassword) {
      toast.warning("Populate the fields below")
      return
    }
    if (password !== conPassword) {
      toast.warning("Passwords do not match")
      return
    }

    setLoading(true)
    toast.info("Logging you in...") // show info toast immediately
    await auth(email, password)
    setLoading(false)
  }

  async function auth(email, password) {
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (res.ok) {
        toast.success("Account created successfully")
        navigate("/logIn")
      } else {
        toast.error("Something went wrong: Try again")
      }
    } catch (error) {
      toast.error("Network error occurred")
    }
  }

  const Alternate = () => navigate('/LogIn')

  return (
    <div className="window">
      <div className="signs">
        <div className="text-fields">
          <h1>How Are you👋</h1>
          <h3>Enter your details to continue</h3>

          <div className="texts">
            <form onSubmit={handleSubmit}>
              <input type="email" name="email" autoComplete="email" placeholder="Email" />
              <input type="password" name="password" autoComplete="new-password" placeholder="Enter a password" />
              <input type="password" name="conPassword" autoComplete="new-password" placeholder="Confirm Password" />
              <button type="submit">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <div className="Option">
            <div className="divider" />
            <p>Or</p>
            <div className="divider" />
          </div>

          <button type="button">Sign In with Google</button>

          <div className="otherwise">
            <p>Already have an Account</p>
            <small onClick={Alternate}>Log In</small>
          </div>
        </div>
        <div className="wallpaper" />
      </div>
    </div>
  )
}
