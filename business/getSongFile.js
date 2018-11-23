const URL = 'http://dl.stream.qqmusic.qq.com/C400004DXFlC0nsTCZ.m4a?guid=1305987845&vkey=3A6F97EAC07BF52E8BFF1D4BBF560601CDB3A5978D2E86248EA06CFBB7B0D813F35EE11AEC5860C3F78CB9654D5AD90D03EC105123581CC6&uin=2172&fromtag=66';


/**
 * [getFileVkey 根据song_mid获取对应音乐文件的vkey & purl]
 * @return [String]
 * */
function getFileVkey(songMid) {
    return `https://u.y.qq.com/cgi-bin/musicu.fcg?callback=getplaysongvkey5514316906727865&g_tk=347344524&jsonpCallback=getplaysongvkey5514316906727865&loginUin=943253628&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%221305987845%22%2C%22songmid%22%3A%5B%22${songMid}%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%22943253628%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A943253628%2C%22format%22%3A%22json%22%2C%22ct%22%3A20%2C%22cv%22%3A0%7D%7D`
}

/**
 * [downloadUrl 更具上面获取的vkey & purl获取音乐文件的下载地址]
 * @return [String]
 * */
function downloadUrl(purl) {
    return `http://dl.stream.qqmusic.qq.com/${purl}`;
}