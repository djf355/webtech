"use strict";
var sql = require("sqlite3");
var db = new sql.Database("data.db");

db.serialize(create);

function create() {
	db.run("create table if not exists projs (id, name)");
	var ps = db.prepare("insert into projs values (?, ?)");
	ps.run(1, 'dictionary');
	ps.run(2, 'prefix');
	ps.run(3, 'ios');
	ps.run(4, 'android');
}


function fetch2() {
	console.log('hi');
	db.each("select * from projs where id=1", show);
	db.all("select * from projs", show);
}

function show(err, rows) {
    if (err) throw err;
    console.log(rows);
}


