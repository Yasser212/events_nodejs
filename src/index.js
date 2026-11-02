require('dotenv').config();
const path = require('node:path');

const express = require('express');
const db = require('./db');
const app = express()


app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
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

app.get('/events', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, title, description, location, starts_at FROM events ORDER BY starts_at'
    );

    res.render('events', { events: rows });
  } catch (error) {
    console.error('Failed to load events:', error);
    res.status(500).json({ error: 'Could not load events' });
  }
});


app.get('/events/new', (req, res) => {
  res.render('new-event');
});


app.post('/events', async (req, res) => {
  const body = req.body || {};

  const title =
    typeof body.title === 'string' ? body.title.trim() : '';
  const description =
    typeof body.description === 'string' ? body.description.trim() : '';
  const location =
    typeof body.location === 'string' ? body.location.trim() : '';
  const startsAt =
    typeof body.starts_at === 'string' ? body.starts_at : '';

  if (!title || title.length > 200 || location.length > 255) {
    return res.status(400).send(
      'Enter a title of up to 200 characters and a location of up to 255 characters.'
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(startsAt)) {
    return res.status(400).send('Enter a valid date and time.');
  }

  const sqlDateTime = startsAt.replace('T', ' ') + ':00';

  try {
    await db.execute(
      `INSERT INTO events (title, description, location, starts_at)
       VALUES (?, ?, ?, ?)`,
      [title, description, location, sqlDateTime]
    );

    res.redirect(303, '/events');
  } catch (error) {
    console.error('Failed to create event:', error);
    res.status(500).send('Could not create the event.');
  }
});


app.listen(port, () => {
  console.log(`Events is running on port ${port}`)
})

