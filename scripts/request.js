const https = require('https');
const db = require('./db');
const config = require('./config.json')

function trendRequest(offsetDays, per_page = 30, page = 1){
    var reqDate = new Date();
    reqDate.setDate(reqDate.getDate()-offsetDays);
    reqDate = reqDate.toISOString().slice(0, 10);
    const token = config.api_key;
    // Вспомогательная фича для добавления результатов в бд
    function postToPG(result){
        try{
            result.items.forEach(item => {
                console.log(`item name ${item.name}. inserting..\n`);
                db.connection.query(`INSERT INTO Repositories (id, name, description, stars, url) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?,description=?,stars=?,url=?;`,
                [
                    item.id,item.full_name,item.description,item.stargazers_count,item.html_url,
                    item.full_name,item.description,item.stargazers_count,item.html_url
                ]
                )
            });
            console.log("\nComplete..\n")
        } catch (e){
            throw e;
        }
        
    }   

    let reqURL = `https://api.github.com/search/repositories?q=created:>${reqDate}&s=stars&o=desc&per_page=${per_page}&page=${page}`
    let options = {
        headers: {
            'User-Agent': 'Taidaa',
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${token}`
        }
    }
    https.get(reqURL, options, (res) => {
        let data = "";

        res.on("data", (chunk)=> {
            data += chunk;
        });

        res.on("end", () => {
            console.log("\nInserting new data into DB...");
            let output = postToPG(JSON.parse(data));
            return ({"type": 'response', 'data': data});
        });
        
    }).on("error", (e) => {
        return ({"type": "error", "msg": e.message})
    })
}

module.exports = {
    trendRequest
}

