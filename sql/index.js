const mysql = require('mysql')

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '12345678',
	database: 'music'
})

function insert(sql, data) {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(data);
				reject(err);
			};
			console.log('数据更新到数据库中....');
			connection.query(sql, [data], (err, res, fields) => {
				if (err) {
					console.log('err data:',data);
					reject(err);
				};
				connection.release();
				resolve('SUCCESS');
			})
		})
	})
}

function select(sql) {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(err);
			connection.query(sql, (err, res, fields) => {
				if (err) reject(err);
				connection.release();
				resolve(res);
			})
		})
	})
}

exports.insert = insert;
exports.select = select;
