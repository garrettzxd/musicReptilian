let http = require('../http/index')
let mysql = require('../sql/index')
let {dataProcessing} = require('../common/common')
let index = 1;				//当前页码
const TOTAL_PAGE = 297;
const BASE_URL = 'https://u.y.qq.com/cgi-bin/musicu.fcg?';
const BASE_DATA = {
	callback: '',
	g_tk: 5381,
	jsonpCallback: '',
	loginUin: 0,
	hostUin: 0,
	format: 'jsonp',
	inCharset: 'utf8',
	outCharset: 'utf-8',
	notice: 0,
	platform: 'yqq',
	needNewCode: 0,
	data: ''
}

getAll();

/**
 * [getAll 获取全部数据并把数据插入到数据库里]
 * @return {[none]} [description]
 */
async function getAll() {
	let ins = "INSERT INTO singer(`country`, `singer_id`, `singer_mid`, `singer_name`, `singer_pic`) VALUES ?";
	while(index <= TOTAL_PAGE) {
		let url = getUrl(index);		//拼接爬取数据的URL
		let res = await http(url);		//获取数据
		console.log('已获取数据');
		res = dataProcessing(res);		//数据格式化
		let ins_data = insertData(res.singerList.data.singerlist);
		if (!ins_data.length) {			//如果数据为空则重新尝试该数据
			console.log('正在重试...');
			getAll();
			break;
		}
		let ins_res = await mysql.insert(ins, ins_data);
		console.log('插入结果：',ins_res);
		console.log('爬虫进度：',(i/TOTAL_PAGE).toFiexd(2)*100 + '%');
		console.log('');
		index++;
	}
}

/**
 * [dataCheck 数据校验]
 * @return {[type]} [description]
 */
function dataCheck(data) {
	if (data.singerList 
		&& data.singerList.data 
		&& data.singerList.data.singerlist 
		&& data.singerList.data.singerlist.length) {
		return true;
	}else {
		return false;
	}
}

/**
 * [insertData 将数据处理成批量插入数据库的格式]
 * @param  {[Array]} list [爬过来的歌手列表]
 * @return {[Array]}      [数据格式变更后的结果,(结构如下：[[],[],[],...]) ]
 */
function insertData(list) {
	let result = [];
	console.log('数据处理中....');
	for(let item of list) {
		result.push(Object.values(item));
	}
	return result;
}

/**
 * [dataProcessing 数据格式化，变成json更易处理]
 * @param  {[String]} data [原始数据]
 * @return {[Object]}      [处理后的json对象]
 */
// function dataProcessing(data) {
// 	let fir_index = data.indexOf('(')+1;
// 	let last_index = data.lastIndexOf(')');
// 	return JSON.parse(data.slice(fir_index,last_index));
// }

/**
 * [getUrl 根据页码生成可获取数据的正确URL]
 * @param  {[Number]} pageNumber [页码]
 * @return {[String]}            [生成的URL]
 */
function getUrl(pageNumber) {
	let result_url = BASE_URL;
	let son_data = {
		"comm":{
			"ct":24,
			"cv":10000
		},
		"singerList":{
			"module":"Music.SingerListServer",
			"method":"get_singer_list",
			"param":{
				"area": -100,
				"sex": -100,
				"genre": -100,
				"index": -100,
				"sin": (pageNumber - 1)*80,
				"cur_page": pageNumber
			}
		}
	}
	let name = "getUCGI" + (Math.random() + "").replace("0.", "");
	BASE_DATA.callback = name;
	BASE_DATA.jsonpCallback = name;
	BASE_DATA.data = encodeURIComponent(JSON.stringify(son_data));

	for(let key in BASE_DATA) {
		result_url = result_url + `${key}=${BASE_DATA[key]}&`;
	}
	return result_url
}
