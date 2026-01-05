require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const products = require('./data/products.json');



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
