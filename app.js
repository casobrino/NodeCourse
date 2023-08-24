import express from "express";
import crypto from "node:crypto";
import cors from "cors";
import movies from "./movies.json" assert { type: "json" };
import { validateMovie, validatePartialMovie } from "./schemas/movies.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:1234",
        "http://localhost:8080",
      ];
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      if (!origin) {
        return callback(null, true);
      }
      return callback(new Error("Nor alloed by CORS"));
    },
  })
);

app.get("/movies", (req, res) => {
  //recuperar por genero
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLocaleLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) {
    res.status(404).json({ error: "No se ha encontrado la pelicula" });
  }
  res.json(movie);
});

//Crear una plicua con POST
app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

//Actualizar una pelicula
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  if (result.error) {
    res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  // console.log(movies.findIndex((movie) => movie.id === id));

  if (movieIndex === -1) {
    return res.status(404).json({ error: "Pelicula no encontrada" });
  }
  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  };
  movies[movieIndex] = updatedMovie;
  res.json(updatedMovie);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
