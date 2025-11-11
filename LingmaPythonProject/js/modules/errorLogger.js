/**
 * 错误日志记录模块
 * 提供错误日志记录和管理功能
 */

/**
 * 记录错误日志
 * @param {string} type - 错误类型
 * @param {string} operation - 操作名称
 * @param {string} message - 错误消息
 * @param {Object} details - 错误详情
 */
function logError(type, operation, message, details = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    type: type,
    operation: operation,
    message: message,
    details: details,
    url: window.location.href
  };
  
  // 获取现有的错误日志
  let errorLogs = [];
  try {
    const storedLogs = localStorage.getItem('cookieExporterErrorLogs');
    if (storedLogs) {
      errorLogs = JSON.parse(storedLogs);
    }
  } catch (e) {
    console.warn('无法读取现有错误日志:', e);
  }
  
  // 添加新日志
  errorLogs.push(errorLog);
  
  // 只保留最近的100条日志
  if (errorLogs.length > 100) {
    errorLogs = errorLogs.slice(-100);
  }
  
  // 保存日志
  try {
    localStorage.setItem('cookieExporterErrorLogs', JSON.stringify(errorLogs));
  } catch (e) {
    console.warn('无法保存错误日志:', e);
  }
  
  // 同时在控制台输出错误
  console.error(`[${type}] ${operation}: ${message}`, details);
}

/**
 * 获取所有错误日志
 * @returns {Array} 错误日志数组
 */
function getErrorLogs() {
  try {
    const storedLogs = localStorage.getItem('cookieExporterErrorLogs');
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (e) {
    console.warn('无法读取错误日志:', e);
    return [];
  }
}

/**
 * 清除所有错误日志
 */
function clearErrorLogs() {
  try {
    localStorage.removeItem('cookieExporterErrorLogs');
  } catch (e) {
    console.warn('无法清除错误日志:', e);
  }
}

/**
 * 导出错误日志为文本格式
 * @returns {string} 格式化的错误日志文本
 */
function exportErrorLogs() {
  const logs = getErrorLogs();
  if (logs.length === 0) {
    return "没有错误日志";
  }
  
  let logText = `错误日志导出时间: ${new Date().toISOString()}\n`;
  logText += `总共 ${logs.length} 条日志\n\n`;
  
  logs.forEach((log, index) => {
    logText += `--- 日志 ${index + 1} ---\n`;
    logText += `时间: ${log.timestamp}\n`;
    logText += `类型: ${log.type}\n`;
    logText += `操作: ${log.operation}\n`;
    logText += `消息: ${log.message}\n`;
    
    if (Object.keys(log.details).length > 0) {
      logText += `详情: ${JSON.stringify(log.details, null, 2)}\n`;
    }
    
    logText += `URL: ${log.url}\n\n`;
  });
  
  return logText;
}

// 导出所有函数
export const ErrorLogger = {
  logError,
  getErrorLogs,
  clearErrorLogs,
  exportErrorLogs
};