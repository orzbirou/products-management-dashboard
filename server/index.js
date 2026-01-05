require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const productsPath = path.join(__dirname, 'data', 'products.json');
let products = require('./data/products.json');

// Helper functions
async function saveProducts() {
  await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
}

function generateId() {
  const maxId = products.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0);
  return String(maxId + 1);
}

// Health
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// CREATE product
app.post('/api/products', async (req, res) => {
  const newProduct = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.push(newProduct);
  await saveProducts();
  res.status(201).json(newProduct);
});

// UPDATE product
app.patch('/api/products/:id', async (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id,
    createdAt: products[index].createdAt,
    updatedAt: new Date().toISOString()
  };

  await saveProducts();
  res.json(products[index]);
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deleted = products.splice(index, 1)[0];
  await saveProducts();
  res.json(deleted);
});

const port = 3000;

async function bootstrap() {
  try {
    app.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

bootstrap();
