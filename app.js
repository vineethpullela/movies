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
    /* module.exports = */ app.listen(3002, () => {
      console.log("Server is running at http://localhost:3002");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
    process.exit(1);
  }
};
//module.exports = app;
connectDbAndServer();

//API 1
app.get("/movies/", async (request, response) => {
  const getAllMovieNames = `
    select movie_name as movieName from movie;`;

  const movieArray = await db.all(getAllMovieNames);
  const movieDatabase = movieArray.map((movie) => {
    return {
      movieName: movie.movieName,
    };
  });

  response.send(movieDatabase);
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
  const getMovieQuery = `
    SELECT
        movie_id,director_id,movie_name,lead_actor
    FROM
        movie
    WHERE
        movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  /*const responseMovieObj = (movie) => {
      movieId: movie.movie_id,
      directorId : movie.director_id,
      movieName : movie.movie_name,
      leadActor : movie.lead_actor,
  };*/

  response.send(movie);
});

//API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `UPDATE movie SET director_id = ${directorId},movie_name='${movieName}', lead_actor = '${leadActor}' WHERE movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
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
  const responseArray = directorsArray.map((director) => {
    return {
      directorId: director.director_id,
      directorName: director.director_name,
    };
  });

  response.send(responseArray);
});

//API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
    SELECT movie_name FROM movie WHERE director_id = ${directorId};`;

  const movieArray = await db.all(getDirectorMoviesQuery);
  const directorMoviesArray = movieArray.map((movie) => {
    return {
      movieName: movie.movie_name,
    };
  });
  response.send(directorMoviesArray);
});
