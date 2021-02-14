var sqlite3 = require('sqlite3').verbose();
// var md5 = require('md5') don't need this import at the moment to hash inputs in the database
const DBSOURCE = 'db.sqlite';
let db = new sqlite3.Database(DBSOURCE, err => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
    else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE stockpedia_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plan_code text UNIQUE, 
            plan_name text UNIQUE, 
            monthly_cost integer,
            annual_cost integer
                        )`, err => {
            if (err) {
                // Table already created
            }
            else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO stockpedia_plans (plan_code, plan_name, monthly_cost, annual_cost) VALUES (?,?,?,?)';
                db.run(insert, ['gb', 'UK', 10, 50]);
                db.run(insert, ['fr', 'France', 10, 60]);
                db.run(insert, ['de', 'Germany', 15, 75]);
                db.run(insert, ['us', 'USA', 25, 150]);
                db.run(insert, ['jp', 'Japan', 15, 65]);
            }
        });
    }
});
module.exports = db;
//# sourceMappingURL=database.js.map