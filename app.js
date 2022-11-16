const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
let db = null;
const dbPath = path.join(__dirname, "moviesData.db");

const connectDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server is running at http://localhost:3002");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};
connectDbAndServer();

//API 1
app.get("/movies/", async (request, response) => {
  const getAllMovieNames = `
    select movie_name as movieName from movie;`;

  const movieArray = await db.all(getAllMovieNames);

  response.send(movieArray);
});

//API 2

app.post("/movies/", async (request, response) => {
  //const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postNewMovieQuery = `
  INSERT INTO movie (director_id,movie_name,lead_actor) 
  VALUES (${directorId},'${movieName}','${leadActor}');`;
  await db.run(postNewMovieQuery);
  // const movieId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});

//API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `select * from movie where movie_id=${movieId}`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});

//API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `update movie set director_id = ${directorId},movie_name='${movieName}', lead_actor = '${leadActor}' where movie_id = ${movieId};`;
  await db.run(postMovieQuery);
  response.send("Movie Details Updated");
});

//API 5

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    delete from movie where movie_id = ${movieId}`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//API 6

app.get("/directors/", async (request, response) => {
  const getAllDirectors = `
    select * from director;`;

  const directorsArray = await db.all(getAllDirectors);

  response.send(directorsArray);
});

//API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
    select movie_name from movie inner join director on movie.director_id=director.director_id where director_id=${directorId};`;

  const movieArray = await db.all(getDirectorMoviesQuery);
  response.send(movieArray);
});
