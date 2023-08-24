import z, { object } from "zod";

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Movie title must be string",
    required_error: "Movie title is required",
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().positive().min(0).max(10).default(4),
  poster: z.string().url({
    message: "Poster string must be a url",
  }),
  genre: z.array(
    z.enum(
      [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Thriller",
        "Sci-fy",
      ],
      {
        invalid_type_error: " Movie genre must be an arrat of enums Genre",
      }
    )
  ),
});

export const validateMovie = (object) => {
  return movieSchema.safeParse(object);
};

export const validatePartialMovie = (object) => {
  return movieSchema.partial().safeParse(object);
};
