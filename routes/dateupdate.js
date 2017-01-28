var express = require("express");
var router = express.Router();
var pg = require("pg");
var config = { database: "upsilon" };

// initialize connection Pool
// think of as 'how I connect to DB'
var pool = new pg.Pool(config);


router.put("/:id",function(req,res){
  console.log(req.body.date);
  pool.connect(function(err,client,done){
      if (err){
        console.log('error connecting to DB',err);
        res.sendStatus(500);
        done();
      }else{
        client.query('UPDATE todo SET date=$2 WHERE id=$1 RETURNING *',
                      [req.params.id,req.body.date],
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
module.exports = router;
