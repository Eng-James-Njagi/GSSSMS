import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function LogIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    if (!email || !password) {
      toast.warning("Populate the fields to continue")
      return
    }

    setLoading(true)
    toast.info("Logging in...")
    await auth(email, password)
    setLoading(false)
  }

  async function auth(email, password) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (res.ok) {
        toast.success("Welcome Back 😊")
        navigate("/dashboard")
      } else {
        toast.error(data.error || "Invalid email or password")
      }
    } catch (error) {
      toast.error("Network error occurred")
    }
  }

  const Alternate = () => navigate('/Sign')

  return (
    <div className="window">
      <div className="signs">
        <div className="text-fields">
          <h1>Welcome Back 😊</h1>
          <h3>Enter your details to continue</h3>

          <div className="texts">
            <form onSubmit={handleSubmit}>
              <input type="email" name="email" autoComplete="email" placeholder="Email" />
              <input type="password" name="password" autoComplete="current-password" placeholder="Enter Password" />
              <button type="submit">
                {loading ? "Logging In..." : "Log In"}
              </button>
            </form>
          </div>

          <div className="otherwise">
            <p>Don't have an Account</p>
            <small onClick={Alternate}>Sign In</small>
          </div>

          <div className="Option">
            <div className="divider" />
            <p>Or</p>
            <div className="divider" />
          </div>

          <button type="button">Log In with Google</button>
        </div>
        <div className="wallpaper" />
      </div>
    </div>
  )
}
