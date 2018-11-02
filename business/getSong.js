const mysql = require('../sql/index')
const http = require('../http/index')
const {dataProcessing} = require('../common/common')
const BASE_URL = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?';
const RELOAD_TIMES = 3;

let current_reload_times = 0;					//当前重启任务次数
let singer_mid_list = null;			//所有的singer_mid数组
let singer_mid_total = 0;	//总任务数
let curr_mid = '';			//当前任务singer_mid

getSingerMid().then((data) => {
	singer_mid_list = data;
	singer_mid_total = singer_mid_list.length;
	curr_mid = singer_mid_list.shift();
	getSong();
}).catch((err) => {
	console.log('获取singer_mid异常：',err);
})

/**
 * [getSong 请求构建URL获取数据]
 * @return {[type]} [description]
 */
async function getSong() {
	let sql = "INSERT INTO song(`song_id`,`song_mid`,`song_name`, `song_orig`, `song_type`, `vid`, `album_id`, `album_mid`, `album_name`, `belong_cd`, `singer_mid`) VALUES ?";
	while(singer_mid_list.length) {
		try {
			let url = getUrl(curr_mid);
			let res = await http(url);
			console.log('爬取结果：',res.slice(0,100));
			res = setSqlData(dataProcessing(res));
			if (res.length) {
				let insert_result = await mysql.insert(sql, res);
				console.log('插入结果：',insert_result);
				console.log('爬取进度：',((singer_mid_total-singer_mid_list.length)*100/singer_mid_total).toFixed(2)+'%');
			}else {
				console.log('数据为空！跳过该请求！');
			}
			console.log('');
			curr_mid = singer_mid_list.shift();
		}catch(err) {
			console.log('任务出现异常：', err);
			if (current_reload_times++ < RELOAD_TIMES) {
				console.log('尝试重启爬虫中...',)
				getSong();
			}
		}
	}
}

/**
 * [getSingerMid 从数据库获取singer_mid]
 * @return {[Array]} [singer_mid数组]
 */
async function getSingerMid() {
	let singer_mid_list = [];
	let sql = "SELECT singer_mid FROM singer";
	let res = await mysql.select(sql);
	for(let item of res) {
		singer_mid_list.push(item.singer_mid);
	}
	return singer_mid_list;
}

/**
 * [setSqlData 把数据转为批量插入数据库的格式]
 * @param {[Object]} data [原始对象数据]
 * @return {[Array]} [[],[],[],...]格式的数据
 */
function setSqlData(data) {
	let result = [];
	let list = data.data.list;
	for(let item of list) {
		let curr_array = [];
		let music_data = item.musicData;
		curr_array.push(music_data.songid);
		curr_array.push(music_data.songmid);
		curr_array.push(music_data.songname);
		curr_array.push(music_data.songorig);
		curr_array.push(music_data.songtype);
		curr_array.push(music_data.vid);
		curr_array.push(music_data.albumid);
		curr_array.push(music_data.albummid);
		curr_array.push(music_data.albumname);
		curr_array.push(music_data.belongCD);
		curr_array.push(music_data.singer[0].mid);
		result.push(curr_array);
	}
	return result;
}

/**
 * [getUrl 拼接爬虫url,每个歌手的歌单列表]
 * @param  {[String]} mid [singer_mid]
 * @return {[String]}     [description]
 */
function getUrl(mid) {
	const BEGIN = 0;		//开始位置
	const NUMBER = 50;		//单次数量
	const QQ_NUMBER = 977563190;
	return `${BASE_URL}g_tk=347344524&jsonpCallback=MusicJsonCallbacksinger_track&loginUin=${QQ_NUMBER}&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0platform=yqq&needNewCode=0&singermid=${mid}&order=listen&begin=${BEGIN}&num=${NUMBER}&songstatus=1`;
}