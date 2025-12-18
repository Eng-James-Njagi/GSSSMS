import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {createClient} from '@supabase/supabase-js'

dotenv.config()
const app = express()
app.use(cors())

const PORT = process.env.port || 5000

const supabase = createClient(
   process.env.supabase_url,
   process.env.supabase_anon_key
)
if(!process.env.VERCEL){
   app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
   })
}

export default app