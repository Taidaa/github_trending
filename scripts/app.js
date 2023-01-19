const request = require("./request").trendRequest;
const express = require("express");
const cors = require('cors');
const db = require("./db");

const app = new express();
app.use(cors({origin: "*"}))



// Timer for refreshing the db with new data
const RefreshTimer = {
    _timestamp: null,
    _interval: null, 
    time: 1200000,         
    startInterval: function () {
        this._timestamp = (new Date).getTime();
        request(7,30,1);
        this._interval = setInterval(()=>{
            request(7,30,1);
        }, this.time)},
    // Start sync
    clear: function () {
        clearInterval(this._interval);
        this.startInterval();
    }
}

app.get("/api/repositories",(req, res)=>{
    if (req.query.id != undefined) {
        db.connection.query(`SELECT * FROM repositories WHERE id = ?`, [req.query.id], (err, result)=>{
            if (err !== null){
                console.log(err)
                res.status(404).send();
            } else {
                res.status(200).send(result);
            }
        });
    } else if (req.query.name != undefined){
        let name = `%${req.query.name}%`;
        db.connection.query(`SELECT * FROM repositories WHERE name LIKE ?`, [name],(err, result)=>{
            if (err !== null){
                console.log(err)
                res.status(404).send();
            } else {
                res.status(200).send(result);
            }
        })
    } else {
        db.connection.query("SELECT * FROM repositories", (err, result)=>{
            if (err !== null){
                console.log(err)
                res.status(404).send();
            } else {
                res.status(200).send(result);
            }
        })
    }
    
});

app.get("/api/resync", (req, res)=>{
    RefreshTimer.clear();
    res.status(200).send()
});

app.get("/api/lastsynctime", (req,res)=>{
    let response = {
        time: RefreshTimer._timestamp
    }
    res.status(200).send(JSON.stringify(response));
})
    




RefreshTimer.startInterval();
app.listen(3000, "127.0.0.1");
console.log("Server started.")


