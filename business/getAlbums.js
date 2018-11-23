const http = require('../http/index');
const mysql = require('../sql/index');
const {dataProcessing} = require('../common/common')
const BASE_URL = 'https://u.y.qq.com/cgi-bin/musicu.fcg?';
const ALBUM_IMG_BASE_URL = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000';
const SINGLE_REQUEST_COUNT = 200;   //单次请求数据量
const TOTAL_NUM = 3000*20;          //大陆总页数乘以单页个数（原网页计算总专辑数量）
const HK_TOTAL_NUM = 640*20;        //港台
const UA_TOTAL_NUM = 21600*20;      //欧美
const KOREA_TOTAL_NUM = 2700*20;    //韩国
const JAPAN_TOTAL_NUM = 800*20;     //日本
const OTHER_TOTAL_NUM = 160*20;     //其他
const LOGIN_ACCOUNT = 977563190;    //登录的QQ
let index = 0;                      //当前请求的次数
let error_times = 0;

getAll(UA_TOTAL_NUM, 3).then((data) => {
    console.log(data)
}).catch((err) => {
    console.log(err);
});

/**
* [getAll 执行函数]
* @param [total] [爬取总数]
* @param [area_type] [爬取地区类型]
*/
async function getAll(total, area_type) {
    let sql = `INSERT INTO album (
        album_id, 
        album_mid, 
        album_name, 
        public_time,
        singer_id, 
        singer_mid, 
        singer_name,
        week,
        year,
        area_type,
        area_name
    ) VALUES ?`;
    while (SINGLE_REQUEST_COUNT * index++ < total) {
        try {
            let url = setReptilianUrl(index, area_type);
            let res = await http(url);
            res = setSqlData(res, area_type);
            if (res.length) {
                let insert_res = await mysql.insert(sql, res);
                console.log('数据库插入结果：', insert_res);
                console.log('爬取进度：', (index*SINGLE_REQUEST_COUNT/total).toFixed(2)*100+'%');
            } else {
                error_times++;
                console.log('未爬取到数据，跳过该请求！')
            }
        } catch (err) {
            error_times++;
            console.log('出现异常！', err);
        }
        console.log('异常次数：', error_times);
        console.log('');
    }
    return 'END';
}

/**
 *[setReptilianUrl 拼接爬虫URL]
 * @return {[String]} [description]
 * */
function setReptilianUrl(index, area) {
    let start = SINGLE_REQUEST_COUNT * index;
    return `${BASE_URL}callback=getUCGI5950166997774664&g_tk=347344524&jsonpCallback=getUCGI5950166997774664&loginUin=${LOGIN_ACCOUNT}&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22albumlib%22%3A%7B%22method%22%3A%22get_album_by_tags%22%2C%22param%22%3A%7B%22area%22%3A${area}%2C%22company%22%3A-1%2C%22genre%22%3A-1%2C%22type%22%3A-1%2C%22year%22%3A-1%2C%22sort%22%3A2%2C%22get_tags%22%3A1%2C%22sin%22%3A${start}%2C%22num%22%3A${SINGLE_REQUEST_COUNT}%2C%22click_albumid%22%3A0%7D%2C%22module%22%3A%22music.web_album_library%22%7D%7D`
}

/**
 * [setSqlData  设置批量插入数据库数据格式]
 * @return [String]
 * */
function setSqlData(data, area_type) {
    data = dataProcessing(data).albumlib.data.list;
    let result = [];
    for (let item of data) {
        let curr = [];
        let area_name = '';
        curr.push(item.album_id);
        curr.push(item.album_mid);
        curr.push(item.album_name);
        curr.push(item.public_time);
        curr.push(...Object.values(item.singers[0]));
        curr.push(item.week);
        curr.push(item.year);
        curr.push(area_type);
        switch(area_type) {
            case 1: area_name = '内地'; break;
            case 0: area_name = '港台'; break;
            case 3: area_name = '欧美'; break;
            case 15: area_name = '韩国'; break;
            case 14: area_name = '日本'; break;
            case 4: area_name = '其他'; break;
        }
        curr.push(area_name);
        result.push(curr);
    }
    return result;
}