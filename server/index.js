require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const products = [
  {
    id: '1',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 89.9,
    status: 'active',
    imgUrl: 'https://via.placeholder.com/150',
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: '2024-01-10T09:00:00.000Z',
  },
  {
    id: '2',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 349.0,
    status: 'active',
    imgUrl: 'https://via.placeholder.com/150',
    createdAt: '2024-01-12T12:30:00.000Z',
    updatedAt: '2024-01-15T08:45:00.000Z',
  },
  {
    id: '3',
    name: 'USB-C Hub',
    description: '6-in-1 USB-C hub for laptops',
    price: 159.0,
    status: 'inactive',
    createdAt: '2024-01-18T15:20:00.000Z',
    updatedAt: '2024-01-20T10:10:00.000Z',
  },
];


// Health
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/products', (req, res) => {
    res.json(products);
})

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
