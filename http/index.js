/**
 * [request http请求模块]
 * @type {[type]}
 */
var request = require('request');
var option = {		//设置请求头，模拟浏览器请求，否则会被腾讯云拦截掉
	url: '',
	headers: {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'Accept-Encoding': 'deflate,br',
		'Accept-Language': 'zh-CN,zh;q=0.9',
		'Connection': 'keep-alive',
		'accept': '*/*',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36',
		'Upgrade-Insecure-Requests': '1',
		'referer': 'https://y.qq.com/portal/singer_list.html',
		'cookie': 'pgv_pvi=901112832; pgv_pvid=1305987845; pt2gguin=o0943253628; RK=rAB8dS5waY; ptcz=7232117b5eab528722a1e1e9ee8ea1e6c95d49013fd88a2f0ae9f55801227a3a; o_cookie=943253628; pac_uid=1_943253628; eas_sid=h185K2s9C6p417u478p1w8W8j3; qm_authimgs_id=1; qm_verifyimagesession=h011b11ba23689981c733e19177c03561b3b70fbc73299961a6c50c8771c747db5cb1fc1b3194d1d549; pgv_si=s4989646848; dm_login_weixin_scan=; pgv_info=ssid=s4913316196; ts_refer=www.baidu.com/link; ts_uid=2631467945; yqq_stat=0; ts_last=y.qq.com/portal/singer_list.html'
	}
}

module.exports = function http(url) {
	option.url = url;
	console.log('http请求中...');
	return new Promise((reslove, reject) => {
		request(option,function(err, res, body) {
			err ? reject(err) : reslove(body);
		})
	})
}