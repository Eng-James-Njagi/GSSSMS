import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {createClient} from '@supabase/supabase-js'

dotenv.config()
const app = express()
app.use(cors())

app.use(express.json())

const supabase = createClient(
   process.env.supabase_url,
   process.env.supabase_anon_key
)
app.post('/api/signup', async(req, res) => {
   const {email, password} = req.body

   const {data, error} = await supabase.auth.signUp({
      email,
      password
   })
   if(error){
      res.status(400).json({error:error.message})
      
   }
   res.status(200).json({message:"User created successfully"})
})

app.post("/api/login", async(req, res) => {
   const {email, password} = req.body

   if(!email || !password){
      return res.status(400).json({error: "Email and password required"});
   }

   const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password
   })

   if(error){
      return res.status(400).json({error: error.message})
   }

   res.status(200).json({message: "user logged in successfully"})

})

const PORT = process.env.PORT

app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
})

