var express = require("express");
var router = express.Router();
var pg = require("pg");
var config = { database: "upsilon" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);



router.get("/", function(req, res) {
  // err - an error object, will be non-null if there was some error
  //       connecting to the DB. ex. DB not running, config is incorrect
  // client - used to make actual queries against DB
  // done - function to call when we are finished
  //        returns the connection back to the pool
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      // no error occurred, time to query
      // 1. sql string - the actual SQL query we want to running
      // 2. callback - function to run after the database gives us our result
      //               takes an error object and the result object as it's args
      client.query("SELECT * FROM todo ORDER BY complete", function(err, result) {
        done();
        if (err) {
          console.log("Error querying DB", err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

router.post("/", function(req, res) {
  // err - an error object, will be non-null if there was some error
  //       connecting to the DB. ex. DB not running, config is incorrect
  // client - used to make actual queries against DB
  // done - function to call when we are finished
  //        returns the connection back to the pool
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      // no error occurred, time to query
      // 1. sql string - the actual SQL query we want to running
      // 2. array of data - any data we want to pass to a parameterized statement
      // 3. callback - function to run after the database gives us our result
      //               takes an error object and the result object as it's args
      client.query(
        "INSERT INTO todo (task,complete) VALUES ($1,$2) RETURNING *;",
        [ req.body.todo,0],
        function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }
      );
    }
  });
});

//localhost:3000/books/4
//req.params.id ==='4'
router.put("/:id",function(req,res){
  pool.connect(function(err,client,done){
      if (err){
        console.log('error connecting to DB',err);
        res.sendStatus(500);
        done();
      }else{
        client.query('UPDATE todo SET complete=$2 WHERE id=$1 RETURNING *',
                      [req.params.id,req.body.complete],
                      function(err,result){
                        if (err){
                          console.log('error updating todo');
                          res.sendStatus(500);

                        }else {

                          res.send(result.rows);
                        }
                        done();
                      }
                    )
      }

  });

});

router.delete("/:id",function(req,res){
  pool.connect(function(err,client,done){
      if (err){
        console.log('error connecting to DB',err);
        res.sendStatus(500);
        done();
      }else{

        client.query('DELETE FROM todo WHERE id=$1;',
                      [req.params.id],
                      function(err,result){
                        if (err){
                          console.log('error deleting pet');
                          res.sendStatus(500);

                        }else {
                          res.sendStatus(204);
                        }
                        done();
                      }
                    )
      }

  });
});


module.exports = router;
