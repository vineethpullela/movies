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
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postNewMovieQuery = `
  insert into movie (director_id,movie_name,lead_actor) 
  Values(${directorId},${movieName},${leadActor};`;
  await db.run(postNewMovieQuery);
  response.send("Movie Successfully Added");
});

//API 3

app.get("/movies/:movieId/", async () => {
  const { movieId } = request.params;
  const getMovieQuery = `select * from movie where movie_id=${movieId};`;

  const movieDb = db.get(getMovieQuery);
  response.send(movieDb);
});
