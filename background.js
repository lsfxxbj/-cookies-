/**
 * Cookie 导出工具 - 后台脚本
 * 处理来自 popup 的消息并执行 Cookie 导出操作
 * 
 * 该脚本作为 Service Worker 运行，负责与 Chrome API 交互，
 * 处理所有与 Cookie 相关的操作，包括导出、导入和格式化等
 */

// 导入 CookieFormatter 模块
import { CookieFormatter } from './js/modules/cookieFormatter.js';

// 监听来自 popup 或 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 验证消息来源，确保消息来自扩展本身，防止跨站攻击
  if (!sender || !sender.id || sender.id !== chrome.runtime.id) {
    sendResponse({error: chrome.i18n.getMessage("invalidMessageSource")});
    return true;
  }
  
  // 根据请求的操作类型进行不同的处理
  if (request.action === "exportCookies") {
    // 导出当前网站的 cookies
    // 验证URL参数是否存在且为字符串类型
    if (!request.url || typeof request.url !== 'string') {
      sendResponse({error: chrome.i18n.getMessage("invalidUrlParameter")});
      return true;
    }
    
    // 简单的URL验证，确保URL格式正确
    try {
      new URL(request.url);
    } catch (e) {
      sendResponse({error: chrome.i18n.getMessage("invalidUrlFormat")});
      return true;
    }
    
    // 获取当前活动标签页的 cookies
    // 使用 chrome.cookies.getAll API 根据 URL 获取对应的 cookies
    chrome.cookies.getAll({url: request.url}, (cookies) => {
      // 检查是否有错误发生
      if (chrome.runtime.lastError) {
        console.error('获取 Cookies 失败:', chrome.runtime.lastError);
        sendResponse({error: chrome.i18n.getMessage("getCookiesFailed") + ": " + chrome.runtime.lastError.message});
      } else {
        // 应用过滤器，根据用户设置的条件过滤 cookies
        const filteredCookies = filterCookies(cookies, request.filters);
        // 根据用户选择的格式返回数据
        const response = CookieFormatter.formatCookiesData(filteredCookies, request.format || 'json', false);
        response.count = filteredCookies.length;
        sendResponse(response);
      }
    });
    // 保持消息通道开放，直到异步操作完成
    return true;
  } else if (request.action === "exportAllCookies") {
    // 导出所有 cookies
    // 获取所有 cookies，不指定特定 URL
    chrome.cookies.getAll({}, (cookies) => {
      // 检查是否有错误发生
      if (chrome.runtime.lastError) {
        console.error('获取所有 Cookies 失败:', chrome.runtime.lastError);
        sendResponse({error: chrome.i18n.getMessage("getCookiesFailed") + ": " + chrome.runtime.lastError.message});
      } else {
        // 性能优化：如果cookies数量很大(超过10000个)，直接返回而不分组以提高性能
        const totalCookies = cookies.length;
        if (totalCookies > 10000) {
          // 对于大量cookies，直接返回而不分组以提高性能
          const filteredCookies = request.filters ? filterCookies(cookies, request.filters) : cookies;
          // 根据格式返回数据
          const response = CookieFormatter.formatCookiesData(filteredCookies, request.format || 'json', false);
          response.count = filteredCookies.length;
          response.grouped = false;
          sendResponse(response);
        } else {
          // 按域名分组 cookies，便于用户查看和管理
          let groupedCookies = {};
          cookies.forEach(cookie => {
            const domain = cookie.domain;
            // 如果该域名还没有对应的数组，则创建一个空数组
            if (!groupedCookies[domain]) {
              groupedCookies[domain] = [];
            }
            // 将当前 cookie 添加到对应域名的数组中
            groupedCookies[domain].push(cookie);
          });
          
          // 应用过滤器
          if (request.filters) {
            // 遍历所有域名，对每个域名下的 cookies 应用过滤器
            Object.keys(groupedCookies).forEach(domain => {
              groupedCookies[domain] = filterCookies(groupedCookies[domain], request.filters);
              // 如果过滤后没有 cookies，删除该域名条目以节省空间
              if (groupedCookies[domain].length === 0) {
                delete groupedCookies[domain];
              }
            });
          }
          
          // 根据格式返回数据
          const response = CookieFormatter.formatCookiesData(groupedCookies, request.format || 'json', true);
          response.count = totalCookies;
          response.grouped = true;
          sendResponse(response);
        }
      }
    });
    // 保持消息通道开放，直到异步操作完成
    return true;
  } else if (request.action === "importCookies") {
    // 导入 cookies
    try {
      // 使用 CookieFormatter 解析导入的数据
      const importedCookies = CookieFormatter.parseImportedCookies(request.data, request.format);
      sendResponse({success: true, count: importedCookies.length});
    } catch (error) {
      // 如果解析过程中出现错误，返回错误信息
      sendResponse({error: chrome.i18n.getMessage("importFailed") + ": " + error.message});
    }
    return true;
  } else {
    // 如果请求的操作类型未知，返回错误信息
    sendResponse({error: chrome.i18n.getMessage("unknownAction")});
  }
});

/**
 * 根据过滤条件过滤 cookies
 * @param {Array} cookies - 要过滤的 cookies 数组
 * @param {Object} filters - 过滤条件对象，可能包含 domain, secureOnly, httpOnly 等属性
 * @returns {Array} 过滤后的 cookies 数组
 */
function filterCookies(cookies, filters) {
  // 如果没有提供过滤条件，直接返回原数组
  if (!filters) return cookies;
  
  // 验证过滤器参数是否为对象类型
  if (typeof filters !== 'object') return cookies;
  
  // 使用数组的 filter 方法对 cookies 进行过滤
  return cookies.filter(cookie => {
    // 验证cookie对象是否存在且为对象类型
    if (!cookie || typeof cookie !== 'object') return false;
    
    // 域名过滤：检查 cookie 的域名是否包含指定的域名
    if (filters.domain && typeof filters.domain === 'string' && !cookie.domain.includes(filters.domain)) {
      return false;
    }
    
    // 仅安全 cookies：如果设置了 secureOnly 且 cookie 不是安全的，则过滤掉
    if (filters.secureOnly && !cookie.secure) {
      return false;
    }
    
    // 仅 HTTP-Only cookies：如果设置了 httpOnly 且 cookie 不是 HTTP-Only 的，则过滤掉
    if (filters.httpOnly && !cookie.httpOnly) {
      return false;
    }
    
    // 如果所有条件都满足，保留该 cookie
    return true;
  });
}

// 当插件安装时，显示一些说明
chrome.runtime.onInstalled.addListener(() => {
  console.log('Cookie 导出工具已安装');
});