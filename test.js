let mysql = require('./sql/index')

let sql = "SELECT * FROM singer WHERE singer_id < 10";

mysql.select(sql).then((data) => {
	// console.log('select data is；',Object.prototype.toString.call(data[0].RowDataPacket));
	console.log('select data is；',data);
	for(let item of data) {
		console.log(item.singer_mid);
	}
}).catch((err) => {
	console.log(err);
})