/**
 * [dataProcessing 数据格式化，变成json更易处理]
 * @param  {[String]} data [原始数据]
 * @return {[Object]}      [处理后的json对象]
 */
function dataProcessing(data) {
	let fir_index = data.indexOf('(')+1;
	let last_index = data.lastIndexOf(')');
	return JSON.parse(data.slice(fir_index,last_index));
}

exports.dataProcessing = dataProcessing;