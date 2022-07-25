const express = require('express');
const { response } = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

morgan.token('req-data', (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'));

const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method);
  console.log('Path: ', request.path);
  console.log('Body: ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "type": "unknown",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "type": "programmer",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "type": "programmer",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "type": "unknown",
    "number": "39-23-6423122"
  }
];

app.get('/info', (request, response) => {
  const personsCount = persons.length;

  response.send(`Phonebook has info for ${personsCount} people`);
});

app.get('/api/persons/', (request, response) => {
  return response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({
      "error": "id doesn't exist"
    });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons/', (request, response) => {
  const body = request.body;

  if (!body) {
    response.status(400).json({
      error: "request body missing"
    });
    return;
  }
  if (!body.name) {
    response.status(400).json({
      error: "name missing"
    });
    return;
  }
  if (!body.number) {
    response.status(400).json({
      error: "number missing"
    });
    return;
  }
  if (persons.find(person => person.name === body.name)) {
    response.status(400).json({
      error: "name must be unique"
    });
    return;
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);

  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const generateId = () => {
  return Math.floor(Math.random() * 10000000);
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
