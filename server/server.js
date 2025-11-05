import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production for now
    }
  },
  credentials: true
}));
app.use(express.json());

// Database helper functions
const db = new sqlite3.Database(join(__dirname, 'database.db'));

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY,
      number INTEGER UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      orderId INTEGER,
      reservedBy TEXT
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      tableId INTEGER NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      createdAt TEXT NOT NULL,
      completedAt TEXT,
      FOREIGN KEY (tableId) REFERENCES tables(id)
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      minStock INTEGER NOT NULL DEFAULT 0
    );
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS combos (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      items TEXT NOT NULL
    );
  `);
});

// Initialize default data
const checkAndInitData = async () => {
  try {
    // Check if tables exist
    const tableCount = await dbGet('SELECT COUNT(*) as count FROM tables');
    if (tableCount.count === 0) {
      const insertTable = db.prepare('INSERT INTO tables (number, status, orderId, reservedBy) VALUES (?, ?, ?, ?)');
      for (let i = 1; i <= 20; i++) {
        await dbRun('INSERT INTO tables (number, status, orderId, reservedBy) VALUES (?, ?, ?, ?)', [i, 'available', null, null]);
      }
    }

    // Check if products exist
    const productCount = await dbGet('SELECT COUNT(*) as count FROM products');
    if (productCount.count === 0) {
      const defaultProducts = [
        [1, 'เบียร์ช้าง', 90, 'beer', 500, 50],
        [2, 'เบียร์สิงห์', 85, 'beer', 500, 50],
        [3, 'เบียร์ลีโอ', 85, 'beer', 500, 50],
        [4, 'เบียร์ไฮเนเก้น', 120, 'beer', 300, 30],
        [5, 'แสงโสม 285', 285, 'alcohol', 200, 20],
        [6, 'เหล้าหงส์', 250, 'alcohol', 200, 20],
        [7, 'รีเจ้นท์', 300, 'alcohol', 150, 15],
        [8, 'น้ำแข็ง', 20, 'general', 1000, 200],
        [9, 'โซดา', 25, 'general', 500, 100],
        [10, 'ของทอดทั่วไป', 150, 'food', 300, 50],
      ];
      for (const p of defaultProducts) {
        await dbRun('INSERT INTO products (id, name, price, category, stock, minStock) VALUES (?, ?, ?, ?, ?, ?)', p);
      }
    }

    // Check if combos exist
    const comboCount = await dbGet('SELECT COUNT(*) as count FROM combos');
    if (comboCount.count === 0) {
      await dbRun('INSERT INTO combos (id, name, price, items) VALUES (?, ?, ?, ?)', [
        1, 
        'คอมโบเบียร์ 3 ขวด + น้ำแข็ง', 
        199, 
        JSON.stringify([
          { productId: 1, quantity: 3 },
          { productId: 8, quantity: 1 }
        ])
      ]);
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

checkAndInitData();

// ============ TABLES API ============
app.get('/api/tables', async (req, res) => {
  try {
    const tables = await dbAll('SELECT * FROM tables ORDER BY number');
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tables/:id', async (req, res) => {
  try {
    const { status, orderId, reservedBy } = req.body;
    await dbRun('UPDATE tables SET status = ?, orderId = ?, reservedBy = ? WHERE id = ?', 
      [status, orderId, reservedBy, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ORDERS API ============
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await dbAll('SELECT * FROM orders ORDER BY createdAt DESC');
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items),
    }));
    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { tableId, items, total } = req.body;
    const orderId = Date.now();
    const createdAt = new Date().toISOString();
    
    await dbRun('INSERT INTO orders (id, tableId, items, total, status, createdAt, completedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orderId, tableId, JSON.stringify(items), total, 'active', createdAt, null]);
    
    // Update table status
    await dbRun('UPDATE tables SET status = ?, orderId = ? WHERE id = ?', 
      ['occupied', orderId, tableId]);
    
    res.json({ id: orderId, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/add-items', async (req, res) => {
  try {
    const { newItems, additionalTotal } = req.body;
    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const existingItems = JSON.parse(order.items);
    const updatedItems = [...existingItems];
    
    newItems.forEach(newItem => {
      const existingIndex = updatedItems.findIndex(
        item => item.id === newItem.id && item.type === newItem.type
      );
      if (existingIndex >= 0) {
        updatedItems[existingIndex].quantity += newItem.quantity;
      } else {
        updatedItems.push(newItem);
      }
    });
    
    const newTotal = order.total + additionalTotal;
    await dbRun('UPDATE orders SET items = ?, total = ? WHERE id = ?',
      [JSON.stringify(updatedItems), newTotal, req.params.id]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/complete', async (req, res) => {
  try {
    const completedAt = new Date().toISOString();
    await dbRun('UPDATE orders SET status = ?, completedAt = ? WHERE id = ?',
      ['completed', completedAt, req.params.id]);
    
    // Get order to update table
    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (order) {
      await dbRun('UPDATE tables SET status = ?, orderId = ? WHERE id = ?',
        ['available', null, order.tableId]);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PRODUCTS API ============
app.get('/api/products', async (req, res) => {
  try {
    const products = await dbAll('SELECT * FROM products ORDER BY id');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, category, stock, minStock } = req.body;
    const id = Date.now();
    await dbRun('INSERT INTO products (id, name, price, category, stock, minStock) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, price, category, stock || 0, minStock || 0]);
    res.json({ id, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, price, category, stock, minStock } = req.body;
    await dbRun('UPDATE products SET name = ?, price = ?, category = ?, stock = ?, minStock = ? WHERE id = ?',
      [name, price, category, stock, minStock, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id/reduce-stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (product) {
      const newStock = Math.max(0, product.stock - quantity);
      await dbRun('UPDATE products SET stock = ? WHERE id = ?', [newStock, req.params.id]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ COMBOS API ============
app.get('/api/combos', async (req, res) => {
  try {
    const combos = await dbAll('SELECT * FROM combos ORDER BY id');
    const combosWithItems = combos.map(combo => ({
      ...combo,
      items: JSON.parse(combo.items),
    }));
    res.json(combosWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/combos', async (req, res) => {
  try {
    const { name, price, items } = req.body;
    const id = Date.now();
    await dbRun('INSERT INTO combos (id, name, price, items) VALUES (?, ?, ?, ?)',
      [id, name, price, JSON.stringify(items)]);
    res.json({ id, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/combos/:id', async (req, res) => {
  try {
    const { name, price, items } = req.body;
    await dbRun('UPDATE combos SET name = ?, price = ?, items = ? WHERE id = ?',
      [name, price, JSON.stringify(items), req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/combos/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM combos WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ AUTH API ============
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
      res.json({ success: true, token: 'admin-token' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
