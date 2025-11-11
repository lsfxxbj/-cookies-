/**
 * 工具函数模块
 * 包含通用的工具函数
 */

/**
 * 转义 HTML 特殊字符
 * @param {string} text - 要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * 转义 XML 特殊字符
 * 将XML中的特殊字符转换为对应的实体引用，确保XML格式正确
 * 
 * @param {string} unsafe - 包含特殊字符的字符串
 * @returns {string} 转义后的字符串
 */
function escapeXml(unsafe) {
  // 确保输入为字符串类型
  if (typeof unsafe !== 'string') return String(unsafe);
  
  // 替换XML特殊字符
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';    // 小于号
      case '>': return '&gt;';    // 大于号
      case '&': return '&amp;';   // 和号
      case '\'': return '&apos;'; // 撇号
      case '"': return '&quot;';  // 双引号
      default: return c;
    }
  });
}

/**
 * 从 URL 提取域名
 * @param {string} url - 完整 URL
 * @returns {string} 域名
 */
function getDomain(url) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch (e) {
    return "unknown-domain";
  }
}

/**
 * 根据文件扩展名自动识别文件格式
 * @param {string} filename - 文件名
 * @returns {string} 识别出的文件格式
 */
function detectFileFormat(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'json':
      return 'json';
    case 'csv':
      return 'csv';
    case 'xml':
      return 'xml';
    case 'txt':
      // Netscape cookie 文件通常使用 .txt 扩展名
      return 'netscape';
    default:
      // 默认使用 JSON 格式
      return 'json';
  }
}

// 导出所有函数
export const Utils = {
  escapeHtml,
  escapeXml,
  getDomain,
  detectFileFormat
};