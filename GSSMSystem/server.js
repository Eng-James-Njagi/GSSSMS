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
    .from('monthly_sales_view')  
    .select('month_date, profit') 
    .order('month_date', { ascending: true });  

  if (error) return res.status(500).json({ error: error.message });

  res.json(
    data.map(r => ({
      date: r.month_date.split('T')[0], 
      profit: Number(r.profit)
    }))
  );
});

app.get('/api/top-juices', async (req, res) => {
  const { month, year } = req.query;

  let query = supabaseAdmin
    .from('Product Table')
    .select('"prod_Name", "QM"');

  // If month and year are provided, filter by them
  if (month && year) {
    const monthMap = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4,
      'May': 5, 'June': 6, 'July': 7, 'August': 8,
      'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    
    const monthNum = monthMap[month];
    if (monthNum) {
      const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
      const nextYear = monthNum === 12 ? parseInt(year) + 1 : year;
      
      query = query
        .gte('transaction_Date', `${year}-${String(monthNum).padStart(2, '0')}-01`)
        .lt('transaction_Date', `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Top juices error:', error);
    return res.status(500).json({ error: error.message });
  }

  // Aggregate quantities by product name
  const aggregated = data.reduce((acc, item) => {
    const existing = acc.find(x => x.prod_Name === item.prod_Name);
    if (existing) {
      existing.totalQM += Number(item.QM);
    } else {
      acc.push({ prod_Name: item.prod_Name, totalQM: Number(item.QM) });
    }
    return acc;
  }, []);

  // Sort by totalQM descending
  aggregated.sort((a, b) => b.totalQM - a.totalQM);

  res.json(aggregated);
});

app.get('/api/top-juice', async (req, res) => {
  const { month, year } = req.query;

  let query = supabaseAdmin
    .from('Product Table')
    .select('"prod_Name", "QM"');

  // If month and year are provided, filter by them
  if (month && year) {
    const monthMap = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4,
      'May': 5, 'June': 6, 'July': 7, 'August': 8,
      'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    
    const monthNum = monthMap[month];
    if (monthNum) {
      const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
      const nextYear = monthNum === 12 ? parseInt(year) + 1 : year;
      
      query = query
        .gte('transaction_Date', `${year}-${String(monthNum).padStart(2, '0')}-01`)
        .lt('transaction_Date', `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Top juice error:', error);
    return res.status(500).json({ error: error.message });
  }

  // Aggregate quantities by product name
  const juiceTotals = {};
  data.forEach(item => {
    const name = item.prod_Name;
    const qty = item.QM || 0;
    juiceTotals[name] = (juiceTotals[name] || 0) + qty;
  });

  // Find the top juice
  let topJuice = null;
  let maxQty = 0;
  
  for (const [name, qty] of Object.entries(juiceTotals)) {
    if (qty > maxQty) {
      maxQty = qty;
      topJuice = name;
    }
  }

  res.json({
    name: topJuice || 'N/A',
    quantity: maxQty
  });
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

