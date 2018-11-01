const mysql = require('./sql/index')
const http = require('./http/index')
const {dataProcessing} = require('./common/common')
const BASE_URL = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?';

getSong();

/**
 * [getSong 请求构建URL获取数据]
 * @return {[type]} [description]
 */
async function getSong() {
	let list = await getSingerMid();
	while(list.length) {
		let curr_mid = list.shift();
		let url = getUrl(curr_mid);
		let res = await http(url);
		res = dataProcessing(res);
		console.log(res);
	}
}

/**
 * [getSingerMid 从数据库获取singer_mid]
 * @return {[Array]} [singer_mid数组]
 */
async function getSingerMid() {
	let singer_mid_list = [];
	let sql = "SELECT singer_mid FROM singer WHERE singer_id < 100";
	let res = await mysql.select(sql);
	for(let item of res) {
		singer_mid_list.push(item.singer_mid);
	}
	return singer_mid_list;
}

/**
 * [getUrl 拼接爬虫url]
 * @param  {[String]} mid [singer_mid]
 * @return {[String]}     [description]
 */
function getUrl(mid) {
	return `${BASE_URL}g_tk=347344524&jsonpCallback=MusicJsonCallbacksinger_track&loginUin=943253628&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0platform=yqq&needNewCode=0&singermid=${mid}&order=listen&begin=0&num=10&songstatus=1`;
}