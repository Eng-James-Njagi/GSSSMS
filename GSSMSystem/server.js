import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {createClient} from '@supabase/supabase-js'

dotenv.config()
const app = express()
app.use(cors())

app.use(express.json())

//This is for creating accounts 
const supabase = createClient(
   process.env.supabase_url,
   process.env.supabase_anon_key
)

//this is for creating and modifying data and tables 
const supabaseAdmin = createClient(
   process.env.supabase_url,
   process.env.supabase_service_key
)

const PORT = process.env.PORT// this is for local development 
//to communicate with the backend 


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


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: data.user,
  });
});

app.post('/api/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/monthly-sales', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('monthly_sales_summary')
    .select('date, profit') // Only include what you need
    .order('date', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json(
    data.map(r => ({
      date: r.date.split('T')[0],
      profit: Number(r.profit)
    }))
  );
});

app.get('/api/top-juices', async (req, res) => {

  const { data, error } = await supabaseAdmin
    .from('Product Table')  // replace with your actual table name
    .select('prod_Name, QM') 
    .order('prod_Name', { ascending: true }); 

  if (error) return res.status(500).json({ error: error.message });

  
  const aggregated = data.reduce((acc, item) => {
    const existing = acc.find(x => x.prod_Name === item.prod_Name);
    if (existing) {
      existing.totalQM += Number(item.QM);
    } else {
      acc.push({ prod_Name: item.prod_Name, totalQM: Number(item.QM) });
    }
    return acc;
  }, []);

 
  aggregated.sort((a, b) => b.totalQM - a.totalQM);

  res.json(aggregated);
});

app.get("/api/monthly-sales-products", async (req, res) => {
  const { month, year } = req.query;
  
  // Start building the query
  let query = supabaseAdmin
    .from('Product Table')
    .select('"prod_Id","prod_Name","QM","Amount","Date"');
  
  // Apply filters if month and year are provided
  if (month && year) {
    // Convert month name to number (January = 1, February = 2, etc.)
    const monthMap = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4,
      'May': 5, 'June': 6, 'July': 7, 'August': 8,
      'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    
    const monthNum = monthMap[month];
    
    if (monthNum) {
      // Filter by year and month
      const startDate = `${year}-${String(monthNum).padStart(2, '0')}-01`;
      
      // Calculate last day of month - FIX: monthNum should be used directly
      const lastDay = new Date(parseInt(year), monthNum, 0).getDate();
      const endDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
      query = query
        .gte('Date', startDate)
        .lte('Date', endDate);
    }
  }
  
  // Apply ordering
  query = query.order('prod_Name', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(
    data.map(row => ({
      id: row.prod_Id,
      product: row.prod_Name,
      quantity: row.QM,
      total: row.Amount,
      date: row.Date
    }))
  );
});


app.get("/api/stocks-table",async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('Stocks Table') 
    .select('item_Id, Item, Category, PQ, IQ, Metrics')
    .order('Item', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json(
    data.map(row => ({
      id: row.item_Id,
      item: row.Item,
      category: row.Category,
      pq: row.PQ,
      iq: row.IQ,
      metrics: row.Metrics
    }))
  );
});

app.get("/api/expenses-table",  async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('Expenses Table')
    .select('expense_id, item, category, quantity, unit, amount, expense_date, expense_type')
    .order('expense_date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(
    data.map(row => ({
      id: row.expense_id,
      item: row.item,
      category: row.category,
      quantity: row.quantity,
      unit: row.unit,
      amount: row.amount,
      date: row.expense_date,
      type: row.expense_type
    }))
  );
});

app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
})

