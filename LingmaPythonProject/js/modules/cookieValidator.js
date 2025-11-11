/**
 * Cookie 验证模块
 * 提供 Cookie 数据验证功能
 */

/**
 * 验证导入的 Cookie 数据
 * @param {Array|Object} cookies - Cookie 数据
 * @param {string} format - 数据格式
 * @returns {Object} 验证结果
 */
function validateCookies(cookies, format) {
  const result = {
    valid: true,
    errors: [],
    validCookies: []
  };
  
  try {
    // 根据格式验证数据
    switch (format) {
      case 'json':
        if (!Array.isArray(cookies) && typeof cookies !== 'object') {
          result.valid = false;
          result.errors.push('JSON数据格式不正确，应为数组或对象');
          return result;
        }
        
        // 如果是对象，转换为数组
        let cookieArray = Array.isArray(cookies) ? cookies : Object.values(cookies);
        
        // 验证每个 Cookie
        cookieArray.forEach((cookie, index) => {
          const cookieErrors = validateCookie(cookie);
          if (cookieErrors.length === 0) {
            result.validCookies.push(cookie);
          } else {
            result.errors.push(`Cookie ${index + 1}: ${cookieErrors.join(', ')}`);
          }
        });
        break;
        
      case 'csv':
        // CSV 格式已经在解析时验证
        if (Array.isArray(cookies)) {
          cookies.forEach((cookie, index) => {
            const cookieErrors = validateCookie(cookie);
            if (cookieErrors.length === 0) {
              result.validCookies.push(cookie);
            } else {
              result.errors.push(`Cookie ${index + 1}: ${cookieErrors.join(', ')}`);
            }
          });
        }
        break;
        
      case 'netscape':
        // Netscape 格式已经在解析时验证
        if (Array.isArray(cookies)) {
          cookies.forEach((cookie, index) => {
            const cookieErrors = validateCookie(cookie);
            if (cookieErrors.length === 0) {
              result.validCookies.push(cookie);
            } else {
              result.errors.push(`Cookie ${index + 1}: ${cookieErrors.join(', ')}`);
            }
          });
        }
        break;
        
      default:
        result.valid = false;
        result.errors.push(`不支持的格式: ${format}`);
    }
    
    // 如果没有有效的 Cookie，标记为无效
    if (result.validCookies.length === 0 && cookieArray && cookieArray.length > 0) {
      result.valid = false;
    }
    
  } catch (error) {
    result.valid = false;
    result.errors.push(`${chrome.i18n.getMessage("validationError")}: ${error.message}`);
  }
  
  return result;
}

/**
 * 验证单个 Cookie
 * @param {Object} cookie - Cookie 对象
 * @returns {Array} 错误信息数组
 */
function validateCookie(cookie) {
  const errors = [];
  
  // 检查必需字段
  if (!cookie.name) {
    errors.push('缺少 name 字段');
  }
  
  if (!cookie.value) {
    errors.push('缺少 value 字段');
  }
  
  if (!cookie.domain) {
    errors.push('缺少 domain 字段');
  }
  
  // 检查字段类型
  if (cookie.name && typeof cookie.name !== 'string') {
    errors.push('name 字段应为字符串');
  }
  
  if (cookie.value && typeof cookie.value !== 'string') {
    errors.push('value 字段应为字符串');
  }
  
  if (cookie.domain && typeof cookie.domain !== 'string') {
    errors.push('domain 字段应为字符串');
  }
  
  if (cookie.path && typeof cookie.path !== 'string') {
    errors.push('path 字段应为字符串');
  }
  
  // 检查过期时间
  if (cookie.expirationDate !== undefined && cookie.expirationDate !== null) {
    if (typeof cookie.expirationDate !== 'number' || cookie.expirationDate < 0) {
      errors.push('expirationDate 字段应为非负数');
    }
  }
  
  // 检查布尔字段
  if (cookie.secure !== undefined && typeof cookie.secure !== 'boolean') {
    errors.push('secure 字段应为布尔值');
  }
  
  if (cookie.httpOnly !== undefined && typeof cookie.httpOnly !== 'boolean') {
    errors.push('httpOnly 字段应为布尔值');
  }
  
  return errors;
}

// 导出函数
export const CookieValidator = {
  validateCookies,
  validateCookie
};