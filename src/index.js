const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res) => {
  res.send('about')
})

app.get('/test', (req, res) => {
  res.send('test')
})

app.listen(port, () => {
  console.log(`Events is running on port ${port}`)
})