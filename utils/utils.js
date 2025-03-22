// 如果小数为0或00则省略小数
export function formatNumber(number) {
	let num = Number(number)
	// 判断是否为整数
	if (Number.isInteger(num)) {
	  return num; // 如果是整数，直接返回
	} else {
	  // 处理小数部分是否为 .0 或 .00
	  const decimalPart = num.toString().split('.')[1];
	  if (decimalPart === '0' || decimalPart === '00') {
		return Math.floor(num); // 小数部分为 0 或 00 时，返回去掉小数部分的值
	  }
	  return num; // 否则保留小数
	}
}

// 获取当前年月日时分秒
export function getCurrentTime(number) {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const day = now.getDate();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
	// 格式化为 "YYYY-MM-DD HH:MM:SS"
	return`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 防抖
export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}