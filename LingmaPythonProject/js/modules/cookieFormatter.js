/**
 * Cookie格式化工具模块
 * 提供将Cookie数据转换为不同格式的功能
 * 
 * 该模块包含以下主要功能:
 * 1. 将Cookie数据格式化为多种输出格式 (JSON, CSV, XML, Netscape)
 * 2. 解析不同格式的输入数据并转换为Cookie对象数组
 * 3. 提供XML转义等辅助功能
 * 
 * 支持的格式说明:
 * - JSON: JavaScript对象表示法，易于程序处理
 * - CSV: 逗号分隔值，适用于电子表格软件
 * - XML: 可扩展标记语言，结构化良好
 * - Netscape: Netscape Cookie格式，兼容curl等工具
 */

import { Utils } from '../utils/utils.js';

/**
 * 格式化 Cookies 数据为指定格式
 * 根据传入的格式参数，将Cookie数据转换为相应的格式
 * 
 * @param {Array|Object} cookies - Cookies 数据，可以是数组或按域名分组的对象
 * @param {string} format - 目标格式 (json, csv, xml, netscape)
 * @param {boolean} isGrouped - 是否已按域名分组，影响格式化方式
 * @returns {Object} 格式化后的数据对象，包含对应格式的属性
 * 
 * @example
 * // 格式化为JSON
 * formatCookiesData(cookies, 'json', false);
 * // 返回: { cookies: [...] }
 * 
 * @example
 * // 格式化为CSV
 * formatCookiesData(cookies, 'csv', false);
 * // 返回: { csv: "domain,flag,path,secure,expiration,name,value\n..." }
 */
function formatCookiesData(cookies, format, isGrouped) {
  switch (format) {
    case 'csv':
      return { csv: cookiesToCsv(cookies, isGrouped) };
    case 'xml':
      return { xml: cookiesToXml(cookies, isGrouped) };
    case 'netscape':
      return { netscape: cookiesToNetscape(cookies, isGrouped) };
    default: // json
      return { cookies: cookies };
  }
}

/**
 * 将 Cookies 转换为 CSV 格式
 * CSV格式遵循Netscape Cookie文件格式标准，包含7个字段:
 * domain, flag, path, secure, expiration, name, value
 * 
 * @param {Array|Object} cookies - Cookies 数据
 * @param {boolean} isGrouped - 是否已按域名分组
 * @returns {string} CSV 格式的字符串，包含头部和数据行
 * 
 * @example
 * const cookies = [{domain: ".example.com", name: "uid", value: "123"}];
 * cookiesToCsv(cookies, false);
 * // 返回: "domain,flag,path,secure,expiration,name,value\n".example.com",FALSE,"/",FALSE,0,"uid","123"\n"
 */
function cookiesToCsv(cookies, isGrouped) {
  // 定义CSV头部字段
  const headers = ['domain', 'flag', 'path', 'secure', 'expiration', 'name', 'value'];
  // 添加头部行
  let csvContent = headers.join(',') + '\n';
  
  /**
   * 将单个Cookie对象格式化为CSV行
   * @param {Object} cookie - Cookie对象
   * @returns {string} CSV格式的行数据
   */
  function formatCookieAsCsv(cookie) {
    const fields = [
      `"${cookie.domain || ''}"`,           // 域名，用引号包围
      cookie.httpOnly ? 'TRUE' : 'FALSE',   // HttpOnly标志
      `"${cookie.path || '/'}"`,            // 路径，用引号包围
      cookie.secure ? 'TRUE' : 'FALSE',     // 安全标志
      cookie.expirationDate ? Math.floor(cookie.expirationDate) : 0, // 过期时间戳
      `"${cookie.name || ''}"`,             // Cookie名称，用引号包围
      `"${cookie.value || ''}"`             // Cookie值，用引号包围
    ];
    return fields.join(',');
  }
  
  // 根据数据是否分组采用不同的处理方式
  if (isGrouped) {
    // 处理分组的 cookies (按域名分组的对象)
    Object.values(cookies).forEach(group => {
      group.forEach(cookie => {
        csvContent += formatCookieAsCsv(cookie) + '\n';
      });
    });
  } else {
    // 处理未分组的 cookies (Cookie对象数组)
    if (Array.isArray(cookies)) {
      cookies.forEach(cookie => {
        csvContent += formatCookieAsCsv(cookie) + '\n';
      });
    }
  }
  
  return csvContent;
}

/**
 * 将 Cookies 转换为 XML 格式
 * XML格式具有良好的结构化特性，便于程序解析和人类阅读
 * 
 * @param {Array|Object} cookies - Cookies 数据
 * @param {boolean} isGrouped - 是否已按域名分组
 * @returns {string} XML 格式的字符串
 * 
 * @example
 * const cookies = [{domain: ".example.com", name: "uid", value: "123"}];
 * cookiesToXml(cookies, false);
 * // 返回: <?xml version="1.0" encoding="UTF-8"?>
<cookies>
  <cookie>
    <domain>.example.com</domain>
    ...
  </cookie>
</cookies>
 */
function cookiesToXml(cookies, isGrouped) {
  // 添加XML声明和根元素
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<cookies>\n';
  
  /**
   * 将单个Cookie对象格式化为XML节点
   * @param {Object} cookie - Cookie对象
   * @param {string} indent - 缩进字符串，用于格式化输出
   * @returns {string} XML格式的节点字符串
   */
  function formatCookieAsXml(cookie, indent = '  ') {
    return `${indent}<cookie>\n` +
      `${indent}  <domain>${Utils.escapeXml(cookie.domain || '')}</domain>\n` +
      `${indent}  <flag>${cookie.httpOnly ? 'TRUE' : 'FALSE'}</flag>\n` +
      `${indent}  <path>${Utils.escapeXml(cookie.path || '/')}</path>\n` +
      `${indent}  <secure>${cookie.secure ? 'TRUE' : 'FALSE'}</secure>\n` +
      `${indent}  <expiration>${cookie.expirationDate ? Math.floor(cookie.expirationDate) : 0}</expiration>\n` +
      `${indent}  <name>${Utils.escapeXml(cookie.name || '')}</name>\n` +
      `${indent}  <value>${Utils.escapeXml(cookie.value || '')}</value>\n` +
      `${indent}</cookie>\n`;
  }
  
  // 根据数据是否分组采用不同的处理方式
  if (isGrouped) {
    // 处理分组的 cookies
    Object.entries(cookies).forEach(([domain, group]) => {
      // 为每个域名添加包装元素
      xmlContent += `  <domain name="${Utils.escapeXml(domain)}">\n`;
      group.forEach(cookie => {
        xmlContent += formatCookieAsXml(cookie, '    ');
      });
      xmlContent += `  </domain>\n`;
    });
  } else {
    // 处理未分组的 cookies
    if (Array.isArray(cookies)) {
      cookies.forEach(cookie => {
        xmlContent += formatCookieAsXml(cookie);
      });
    }
  }
  
  xmlContent += '</cookies>';
  return xmlContent;
}

/**
 * 将 Cookies 转换为 Netscape Cookie 格式
 * Netscape格式是广泛支持的标准Cookie文件格式，兼容curl等工具
 * 
 * @param {Array|Object} cookies - Cookies 数据
 * @param {boolean} isGrouped - 是否已按域名分组
 * @returns {string} Netscape Cookie 格式的字符串
 * 
 * @example
 * const cookies = [{domain: ".example.com", name: "uid", value: "123"}];
 * cookiesToNetscape(cookies, false);
 * // 返回: "# Netscape HTTP Cookie File\n...\n.example.com\tFALSE\t/\tFALSE\t0\tuid\t123\n"
 */
function cookiesToNetscape(cookies, isGrouped) {
  // 添加文件头注释
  let netscapeContent = '# Netscape HTTP Cookie File\n' +
    '# http://curl.haxx.se/rfc/cookie_spec.html\n' +
    '# This file was generated by Cookie Export Tool\n\n';
  
  /**
   * 将单个Cookie对象格式化为Netscape格式行
   * Netscape格式: domain flag path secure expiration name value (7个字段，用制表符分隔)
   * @param {Object} cookie - Cookie对象
   * @returns {string} Netscape格式的行数据
   */
  function formatCookieAsNetscape(cookie) {
    // Netscape 格式: domain flag path secure expiration name value
    const domain = cookie.domain || '';                     // 域名
    const flag = cookie.httpOnly ? 'TRUE' : 'FALSE';        // HttpOnly标志 (TRUE/FALSE)
    const path = cookie.path || '/';                        // 路径
    const secure = cookie.secure ? 'TRUE' : 'FALSE';        // 安全标志 (TRUE/FALSE)
    const expiration = cookie.expirationDate ? Math.floor(cookie.expirationDate) : 0; // 过期时间戳
    const name = cookie.name || '';                         // Cookie名称
    const value = cookie.value || '';                       // Cookie值
    
    // 用制表符连接各字段
    return `${domain}\t${flag}\t${path}\t${secure}\t${expiration}\t${name}\t${value}`;
  }
  
  // 根据数据是否分组采用不同的处理方式
  if (isGrouped) {
    // 处理分组的 cookies
    Object.values(cookies).forEach(group => {
      group.forEach(cookie => {
        netscapeContent += formatCookieAsNetscape(cookie) + '\n';
      });
    });
  } else {
    // 处理未分组的 cookies
    if (Array.isArray(cookies)) {
      cookies.forEach(cookie => {
        netscapeContent += formatCookieAsNetscape(cookie) + '\n';
      });
    }
  }
  
  return netscapeContent;
}

/**
 * 解析导入的 Cookies 数据
 * 根据指定的格式解析输入数据并转换为Cookie对象数组
 * 
 * @param {string} data - 导入的数据字符串
 * @param {string} format - 数据格式 (json, csv, netscape)
 * @returns {Array} 解析后的 Cookies 数组
 * @throws {Error} 当格式不支持或数据解析失败时抛出错误
 */
function parseImportedCookies(data, format) {
  switch (format) {
    case 'json':
      return parseJsonCookies(data);
    case 'csv':
      return parseCsvCookies(data);
    case 'netscape':
      return parseNetscapeCookies(data);
    default:
      throw new Error('不支持的文件格式');
  }
}

/**
 * 解析 JSON 格式的 Cookies
 * 支持数组格式和按域名分组的对象格式
 * 
 * @param {string} data - JSON 数据字符串
 * @returns {Array} Cookies 数组
 * @throws {Error} 当JSON格式无效或解析失败时抛出错误
 */
function parseJsonCookies(data) {
  try {
    const cookies = JSON.parse(data);
    // 验证是否为有效的 cookies 数组
    if (Array.isArray(cookies)) {
      return cookies;
    } else if (typeof cookies === 'object' && cookies !== null) {
      // 如果是按域名分组的对象，合并所有 cookies
      return Object.values(cookies).flat();
    }
    throw new Error('无效的 JSON 格式');
  } catch (e) {
    throw new Error('JSON 解析失败: ' + e.message);
  }
}

/**
 * 解析 CSV 格式的 Cookies
 * 解析符合Netscape Cookie格式标准的CSV数据
 * 
 * @param {string} data - CSV 数据字符串
 * @returns {Array} Cookies 数组
 * @throws {Error} 当CSV格式无效时抛出错误
 */
function parseCsvCookies(data) {
  // 按行分割并过滤空行
  const lines = data.split('\n').filter(line => line.trim() !== '');
  // 至少需要包含头部行和一行数据
  if (lines.length < 2) {
    throw new Error('CSV 数据格式不正确');
  }
  
  // 解析头部行，获取字段名
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const cookies = [];
  
  // 解析数据行
  for (let i = 1; i < lines.length; i++) {
    // 按逗号分割各字段
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    // 确保有足够的字段
    if (values.length >= 7) {
      const cookie = {
        domain: values[0],                    // 域名
        httpOnly: values[1].toUpperCase() === 'TRUE',  // HttpOnly标志
        path: values[2],                      // 路径
        secure: values[3].toUpperCase() === 'TRUE',    // 安全标志
        expirationDate: parseInt(values[4]) || null,   // 过期时间
        name: values[5],                      // Cookie名称
        value: values[6]                      // Cookie值
      };
      cookies.push(cookie);
    }
  }
  
  return cookies;
}

/**
 * 解析 Netscape 格式的 Cookies
 * 解析Netscape Cookie文件格式的数据
 * 
 * @param {string} data - Netscape Cookie 数据字符串
 * @returns {Array} Cookies 数组
 */
function parseNetscapeCookies(data) {
  // 按行分割，过滤空行和注释行
  const lines = data.split('\n').filter(line => 
    line.trim() !== '' && !line.startsWith('#')
  );
  
  const cookies = [];
  // 解析每一行
  for (const line of lines) {
    // 按制表符分割各字段
    const parts = line.split('\t');
    // 确保有足够的字段
    if (parts.length >= 7) {
      const cookie = {
        domain: parts[0],                     // 域名
        httpOnly: parts[1].toUpperCase() === 'TRUE',   // HttpOnly标志
        path: parts[2],                       // 路径
        secure: parts[3].toUpperCase() === 'TRUE',     // 安全标志
        expirationDate: parseInt(parts[4]) || null,    // 过期时间
        name: parts[5],                       // Cookie名称
        value: parts[6]                       // Cookie值
      };
      cookies.push(cookie);
    }
  }
  
  return cookies;
}

// 导出所有函数，使其可以在其他模块中使用
export const CookieFormatter = {
  formatCookiesData,
  cookiesToCsv,
  cookiesToXml,
  cookiesToNetscape,
  parseImportedCookies,
  parseJsonCookies,
  parseCsvCookies,
  parseNetscapeCookies
};