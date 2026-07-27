const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");

const app = express();
const Contact = require("./models/person");
const PORT = process.env.PORT || 3001;

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/persons", (req, res, next) => {
  Contact.find({})
    .then((entries) => res.json(entries))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((entry) => (entry ? res.json(entry) : res.status(404).end()))
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Contact.find({})
    .then((entries) => {
      res.send(`Phonebook has info for ${entries.length} people.\n ${Date()}`);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "name missing" });
  }

  const entry = new Contact({ name: body.name, number: body.number });

  entry
    .save()
    .then((savedEntry) => res.json(savedEntry))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Contact.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedEntry) =>
      updatedEntry ? res.json(updatedEntry) : res.status(404).end(),
    )
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
