const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const Item = require('./models/Item');

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/node-crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser());

// Routes
router.get('/items', async (ctx) => {
  const items = await Item.find();
  ctx.body = items;
});

router.post('/items', async (ctx) => {
  const itemData = ctx.request.body;
  const newItem = new Item(itemData);
  const savedItem = await newItem.save();
  ctx.body = savedItem;
});

router.put('/items/:id', async (ctx) => {
  const itemId = ctx.params.id;
  const itemData = ctx.request.body;
  const updatedItem = await Item.findByIdAndUpdate(itemId, itemData, {
    new: true,
  });
  ctx.body = updatedItem;
});

router.delete('/items/:id', async (ctx) => {
  const itemId = ctx.params.id;
  await Item.findByIdAndDelete(itemId);
  ctx.status = 204;
});

app.use(router.routes());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});