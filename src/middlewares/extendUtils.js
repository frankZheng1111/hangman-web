'use strict'
// 添加方法res.formatByRespContentType
// 根据res设定的header执行对应的回调函数
// 若无匹配则执行第一个
//
export function setMethodFormatByRespContentType (req, res, next) {
  res.formatByRespContentType = function(formatCallbacks) {
    let matchCallback = formatCallbacks[0][1];
    formatCallbacks.some(([contentType, callback]) => {
      if (contentType === res.get('Content-Type')) {
        matchCallback = callback;
      }
    });
    return matchCallback();
  }
  next();
}
