/**
 * Cookie 导出工具 - Popup 脚本
 * 提供用户界面交互和消息传递功能
 * 
 * 该脚本负责处理用户界面的所有交互逻辑，包括:
 * 1. 用户输入事件处理
 * 2. 与后台脚本通信
 * 3. 界面状态更新和数据展示
 * 4. 文件导入导出操作
 * 5. Cookie 管理功能
 */

import { CookieFormatter } from './js/modules/cookieFormatter.js';
import { CookieValidator } from './js/modules/cookieValidator.js';
import { ErrorLogger } from './js/modules/errorLogger.js';
import { UIManager } from './js/ui/uiManager.js';
import { Utils } from './js/utils/utils.js';

// 定义翻译映射表
const translations = {
  "zh-CN": {
    "extensionName": "Cookie 导出工具",
    "chinese": "中文",
    "english": "English",
    "french": "Français",
    "exportTab": "导出",
    "importTab": "导入",
    "manageTab": "管理",
    "exportOptions": "导出选项",
    "domainFilter": "域名过滤:",
    "domainFilterPlaceholder": "例如: example.com",
    "domainFilterAriaLabel": "按域名过滤 cookies",
    "exportFormat": "导出格式:",
    "exportFormatAriaLabel": "选择导出格式",
    "jsonFormat": "JSON",
    "csvFormat": "CSV",
    "xmlFormat": "XML",
    "netscapeFormat": "Netscape Cookie",
    "secureOnly": "仅安全 Cookies (HTTPS)",
    "secureOnlyAriaLabel": "仅导出安全 cookies",
    "httpOnly": "仅 HTTP-Only Cookies",
    "httpOnlyAriaLabel": "仅导出 HTTP-Only cookies",
    "progressInitialText": "0%",
    "exportCurrent": "导出当前网站 Cookie",
    "exportAll": "导出所有 Cookie",
    "copyCurrent": "复制当前网站 Cookie",
    "copyAll": "复制所有 Cookie",
    "cookieCountInitialText": "Cookies: 0",
    "importCookies": "导入 Cookies",
    "dragAndDropHint": "拖放 Cookie 文件到此处或点击选择文件",
    "browseFiles": "浏览文件",
    "refreshCookies": "刷新 Cookie 列表",
    "deleteAllCookies": "删除所有 Cookie",
    "showExpiredCookies": "显示已过期 Cookie",
    "showActiveCookies": "显示有效 Cookie",
    "loadingCookies": "正在加载 Cookie 列表...",
    "closeModalText": "×",
    "cookieDetailsTitle": "Cookie 详情",
    "languageChanged": "语言已切换为:",
    "searchPlaceholder": "搜索Cookie名称或域名...",
    "cookiesLoaded": "已加载 {{count}} 个 Cookie"
  },
  "en": {
    "extensionName": "Cookie Export Tool",
    "chinese": "中文",
    "english": "English",
    "french": "Français",
    "exportTab": "Export",
    "importTab": "Import",
    "manageTab": "Manage",
    "exportOptions": "Export Options",
    "domainFilter": "Domain Filter:",
    "domainFilterPlaceholder": "e.g.: example.com",
    "domainFilterAriaLabel": "Filter cookies by domain",
    "exportFormat": "Export Format:",
    "exportFormatAriaLabel": "Select export format",
    "jsonFormat": "JSON",
    "csvFormat": "CSV",
    "xmlFormat": "XML",
    "netscapeFormat": "Netscape Cookie",
    "secureOnly": "Secure Cookies Only (HTTPS)",
    "secureOnlyAriaLabel": "Export secure cookies only",
    "httpOnly": "HTTP-Only Cookies Only",
    "httpOnlyAriaLabel": "Export HTTP-Only cookies only",
    "progressInitialText": "0%",
    "exportCurrent": "Export Current Site Cookies",
    "exportAll": "Export All Cookies",
    "copyCurrent": "Copy Current Site Cookies",
    "copyAll": "Copy All Cookies",
    "cookieCountInitialText": "Cookies: 0",
    "importCookies": "Import Cookies",
    "dragAndDropHint": "Drag and drop Cookie file here or click to select file",
    "browseFiles": "Browse Files",
    "refreshCookies": "Refresh Cookie List",
    "deleteAllCookies": "Delete All Cookies",
    "showExpiredCookies": "Show Expired Cookies",
    "showActiveCookies": "Show Active Cookies",
    "loadingCookies": "Loading cookie list...",
    "closeModalText": "×",
    "cookieDetailsTitle": "Cookie Details",
    "languageChanged": "Language changed to:",
    "searchPlaceholder": "Search cookie name or domain...",
    "cookiesLoaded": "Loaded {{count}} cookies"
  },
  "fr": {
    "extensionName": "Outil d'exportation de cookies",
    "chinese": "中文",
    "english": "English",
    "french": "Français",
    "exportTab": "Exporter",
    "importTab": "Importer",
    "manageTab": "Gérer",
    "exportOptions": "Options d'exportation",
    "domainFilter": "Filtre de domaine:",
    "domainFilterPlaceholder": "ex: example.com",
    "domainFilterAriaLabel": "Filtrer les cookies par domaine",
    "exportFormat": "Format d'exportation:",
    "exportFormatAriaLabel": "Sélectionner le format d'exportation",
    "jsonFormat": "JSON",
    "csvFormat": "CSV",
    "xmlFormat": "XML",
    "netscapeFormat": "Netscape Cookie",
    "secureOnly": "Cookies sécurisés uniquement (HTTPS)",
    "secureOnlyAriaLabel": "Exporter uniquement les cookies sécurisés",
    "httpOnly": "Cookies HTTP-Only uniquement",
    "httpOnlyAriaLabel": "Exporter uniquement les cookies HTTP-Only",
    "progressInitialText": "0%",
    "exportCurrent": "Exporter les cookies du site actuel",
    "exportAll": "Exporter tous les cookies",
    "copyCurrent": "Copier les cookies du site actuel",
    "copyAll": "Copier tous les cookies",
    "cookieCountInitialText": "Cookies: 0",
    "importCookies": "Importer des cookies",
    "dragAndDropHint": "Glissez-déposez le fichier de cookies ici ou cliquez pour sélectionner un fichier",
    "browseFiles": "Parcourir les fichiers",
    "refreshCookies": "Actualiser la liste des cookies",
    "deleteAllCookies": "Supprimer tous les cookies",
    "showExpiredCookies": "Afficher les cookies expirés",
    "showActiveCookies": "Afficher les cookies actifs",
    "loadingCookies": "Chargement de la liste des cookies...",
    "closeModalText": "×",
    "cookieDetailsTitle": "Détails du Cookie",
    "languageChanged": "Langue changée en:",
    "searchPlaceholder": "Rechercher le nom du cookie ou le domaine...",
    "cookiesLoaded": "{{count}} cookies chargés"
  }
};

/**
 * 获取指定语言的翻译消息
 * @param {string} key - 翻译键
 * @param {string} language - 语言代码
 * @returns {string} 翻译后的消息
 */
function getLocalizedMessage(key, language) {
  if (translations[language] && translations[language][key]) {
    return translations[language][key];
  }
  // 如果找不到指定语言的翻译，回退到中文
  return translations["zh-CN"][key] || key;
}

// 页面加载完成后应用本地化
document.addEventListener('DOMContentLoaded', function() {
  // 获取语言选择器元素
  const languageSelector = document.getElementById('language-selector');
  
  // 首先尝试从存储中获取语言设置，如果没有则使用浏览器默认语言
  chrome.storage.local.get(['language'], function(result) {
    let savedLanguage = result.language;
    
    if (!savedLanguage) {
      // 获取浏览器UI语言
      const browserLanguage = chrome.i18n.getUILanguage();
      
      // 根据浏览器语言设置默认语言
      const supportedLanguages = ['zh-CN', 'en', 'fr'];
      if (supportedLanguages.includes(browserLanguage)) {
        savedLanguage = browserLanguage;
      } else if (browserLanguage.startsWith('zh')) {
        savedLanguage = 'zh-CN';
      } else {
        // 默认使用英语
        savedLanguage = 'en';
      }
      
      // 保存语言设置
      chrome.storage.local.set({language: savedLanguage});
    }
    
    // 设置语言选择器的值
    languageSelector.value = savedLanguage;
    
    // 应用界面本地化设置
    applyLocalization();
  });
  
  // 获取所有需要操作的 DOM 元素
  // 导出相关按钮
  const exportCurrentBtn = document.getElementById('export-current-btn');
  const exportAllBtn = document.getElementById('export-all-btn');
  const copyCurrentBtn = document.getElementById('copy-current-btn');
  const copyAllBtn = document.getElementById('copy-all-btn');

  // 导入相关元素
  const importBtn = document.getElementById('import-btn');
  const fileInput = document.getElementById('file-input');
  const browseFilesBtn = document.getElementById('browse-files');
  const dropArea = document.getElementById('drop-area');
  
  // 界面显示元素
  const resultDiv = document.getElementById('result');
  const cookieCount = document.getElementById('cookie-count');
  const cookieList = document.getElementById('cookie-list');
  const cookieDetailModal = document.getElementById('cookie-detail-modal');
  const cookieDetailContent = document.getElementById('cookie-detail-content');
  const closeModal = document.getElementById('close-modal');
  
  // 过滤和格式选择元素
  const domainFilter = document.getElementById('domain-filter');
  const formatSelect = document.getElementById('format-select');
  const secureOnlyCheckbox = document.getElementById('secure-only');
  const httpOnlyCheckbox = document.getElementById('http-only');
  
  // 语言选择器已在上面声明
  
  // 标签页相关元素
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // 管理页面元素
  const refreshCookiesBtn = document.getElementById('refresh-cookies');
  const deleteAllCookiesBtn = document.getElementById('delete-all-cookies');
  const manageDomainFilter = document.getElementById('manage-domain-filter');
  const showExpiredCookiesCheckbox = document.getElementById('show-expired-cookies');
  const showActiveCookiesCheckbox = document.getElementById('show-active-cookies');
  const cookieSearch = document.getElementById('cookie-search');
  
  // 进度条元素
  const exportProgress = document.getElementById('export-progress');
  const importProgress = document.getElementById('import-progress');
  
  // 默认设置：只显示已过期的 Cookie
  showExpiredCookiesCheckbox.checked = true;
  showActiveCookiesCheckbox.checked = false;
  
  // 绑定事件监听器
  // 导出相关按钮事件
  exportCurrentBtn.addEventListener('click', exportCurrentCookies);
  exportAllBtn.addEventListener('click', exportAllCookies);
  copyCurrentBtn.addEventListener('click', copyCurrentCookies);
  copyAllBtn.addEventListener('click', copyAllCookies);
  
  // 导入相关事件
  importBtn.addEventListener('click', importCookies);
  fileInput.addEventListener('change', (e) => UIManager.handleFileSelect(e, dropArea));
  browseFilesBtn.addEventListener('click', () => fileInput.click());
  
  // 界面交互事件
  languageSelector.addEventListener('change', changeLanguage);
  refreshCookiesBtn.addEventListener('click', loadCookies);
  deleteAllCookiesBtn.addEventListener('click', deleteAllCookies);
  manageDomainFilter.addEventListener('input', loadCookies);
  showExpiredCookiesCheckbox.addEventListener('change', loadCookies);
  showActiveCookiesCheckbox.addEventListener('change', loadCookies);
  cookieSearch.addEventListener('input', loadCookies);
  
  // 模态框关闭事件
  closeModal.addEventListener('click', () => {
    cookieDetailModal.style.display = 'none';
  });
  
  // 点击模态框外部关闭模态框
  window.addEventListener('click', (event) => {
    if (event.target === cookieDetailModal) {
      cookieDetailModal.style.display = 'none';
    }
  });
  
  // 拖放事件监听器
  dropArea.addEventListener('dragover', (e) => UIManager.handleDragOver(e, dropArea));
  dropArea.addEventListener('dragleave', (e) => UIManager.handleDragLeave(e, dropArea));
  dropArea.addEventListener('drop', (e) => UIManager.handleDrop(e, dropArea, fileInput));
  
  // 标签页切换事件
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // 更新活动标签按钮状态
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // 显示对应的标签内容
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });
      
      // 如果切换到管理标签页，加载 Cookie 列表
      if (tabId === 'manage-tab') {
        loadCookies();
      }
    });
  });
  
  // 添加键盘事件支持，提升用户体验
  document.addEventListener('keydown', function(e) {
    // ESC键关闭弹窗，如果模态框打开则先关闭模态框
    if (e.key === 'Escape') {
      if (cookieDetailModal.style.display === 'block') {
        cookieDetailModal.style.display = 'none';
      } else {
        window.close();
      }
      return;
    }
    
    // 获取当前活动的标签页
    const activeTab = document.querySelector('.tab-content.active');
    
    // 快捷键支持（仅在导入标签页中）
    if (activeTab && activeTab.id === 'import-tab') {
      // Ctrl+O 打开文件选择
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        fileInput.click();
      }
    }
    
    // 快捷键支持（仅在导出标签页中）
    if (activeTab && activeTab.id === 'export-tab') {
      // Ctrl+E 导出当前网站 Cookie
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportCurrentCookies();
      }
      
      // Ctrl+Shift+E 导出所有 Cookie
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        exportAllCookies();
      }
      
      // Ctrl+C 复制当前网站 Cookie
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        copyCurrentCookies();
      }
      
      // Ctrl+Shift+C 复制所有 Cookie
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyAllCookies();
      }
    }
    
    // 快捷键支持（仅在管理标签页中）
    if (activeTab && activeTab.id === 'manage-tab') {
      // F5 或 Ctrl+R 刷新 Cookie 列表
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        loadCookies();
      }
      
      // Ctrl+D 删除所有 Cookie
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        deleteAllCookies();
      }
    }
    
    // 标签页切换快捷键
    // Ctrl+1 切换到导出标签页
    if (e.ctrlKey && e.key === '1') {
      e.preventDefault();
      switchTab('export-tab');
    }
    
    // Ctrl+2 切换到导入标签页
    if (e.ctrlKey && e.key === '2') {
      e.preventDefault();
      switchTab('import-tab');
    }
    
    // Ctrl+3 切换到管理标签页
    if (e.ctrlKey && e.key === '3') {
      e.preventDefault();
      switchTab('manage-tab');
    }
  });
  
  // 初始化 Cookie 计数显示
  updateCookieCount();
  
  /**
   * 切换标签页
   * @param {string} tabId - 标签页ID
   */
  function switchTab(tabId) {
    // 更新活动标签按钮
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      }
    });
    
    // 显示对应的标签内容
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === tabId) {
        content.classList.add('active');
      }
    });
    
    // 如果切换到管理标签页，加载 Cookie 列表
    if (tabId === 'manage-tab') {
      loadCookies();
    }
  }
  
  /**
   * 应用本地化
   */
  function applyLocalization() {
    console.log('Applying localization');
    // 获取当前选择的语言
    const currentLanguage = languageSelector.value;
    console.log('Current selected language:', currentLanguage);
    
    // 本地化所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const message = getLocalizedMessage(key, currentLanguage);
      console.log('Localizing element:', element, 'Key:', key, 'Message:', message);
      if (message) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = message;
        } else if (element.tagName === 'TITLE') {
          // 特殊处理标题元素
          document.title = message;
        } else if (element.tagName === 'OPTION') {
          // 特殊处理选项元素
          element.textContent = message;
        } else {
          // 对于普通元素，直接更新 textContent
          element.textContent = message;
          console.log('Updated element content to', message);
        }
      }
    });
    
    // 本地化 placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const message = getLocalizedMessage(key, currentLanguage);
      if (message) {
        element.placeholder = message;
      }
    });
    
    // 本地化 aria-label 属性
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const message = getLocalizedMessage(key, currentLanguage);
      if (message) {
        element.setAttribute('aria-label', message);
      }
    });
    
    // 本地化 aria-label 属性（使用 data-i18n-aria-label）
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria-label');
      const message = getLocalizedMessage(key, currentLanguage);
      if (message) {
        element.setAttribute('aria-label', message);
      }
    });
    
    // 更新HTML的lang属性
    document.documentElement.lang = currentLanguage;
    
    // 验证更新结果
    setTimeout(() => {
      console.log('Verification after localization:');
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const message = getLocalizedMessage(key, currentLanguage);
        if (message && element.textContent !== message) {
          console.warn('Element content mismatch:', element, 'Expected:', message, 'Actual:', element.textContent);
        }
      });
    }, 0);
  }
  
  /**
   * 更新 Cookie 计数显示
   */
  function updateCookieCount() {
    chrome.cookies.getAll({}, (cookies) => {
      // 使用本地化消息显示Cookie计数
      const message = chrome.i18n.getMessage("cookiesLoaded");
      if (message) {
        cookieCount.textContent = message.replace("{{count}}", cookies.length);
      } else {
        cookieCount.textContent = `Cookies: ${cookies.length}`;
      }
    });
  }
  
  /**
   * 切换语言
   */
  function changeLanguage() {
    const selectedLanguage = languageSelector.value;
    console.log('Changing language to:', selectedLanguage);
    
    // 保存语言设置到存储中
    chrome.storage.local.set({language: selectedLanguage}, function() {
      console.log('Language setting saved: ' + selectedLanguage);
    });
    
    // 重新应用本地化来更新界面文本
    applyLocalization();
    console.log('Localization applied');
    
    // 显示语言切换成功的消息
    const lang = languageSelector.value;
    const langNames = {
      'zh-CN': chrome.i18n.getMessage("chinese"),
      'en': chrome.i18n.getMessage("english"),
      'fr': chrome.i18n.getMessage("french")
    };
    UIManager.showResult(`${chrome.i18n.getMessage("languageChanged")} ${langNames[lang] || lang}`, 'success', resultDiv);
    setTimeout(() => {
      resultDiv.style.display = 'none';
    }, 1500);
  }
  
  /**
   * 获取用户设置的过滤选项
   * @returns {Object|null} 过滤选项对象或null（无过滤条件时）
   */
  function getFilters() {
    const filters = {};
    
    if (domainFilter.value.trim()) {
      filters.domain = domainFilter.value.trim();
    }
    
    if (secureOnlyCheckbox.checked) {
      filters.secureOnly = true;
    }
    
    if (httpOnlyCheckbox.checked) {
      filters.httpOnly = true;
    }
    
    // 只有当有过滤条件时才返回过滤器对象
    return Object.keys(filters).length > 0 ? filters : null;
  }
  
  /**
   * 获取管理页面的过滤选项
   * @returns {Object} 过滤选项对象
   */
  function getManageFilters() {
    return {
      domain: manageDomainFilter.value.trim(),
      showExpired: showExpiredCookiesCheckbox.checked,
      showActive: showActiveCookiesCheckbox.checked
    };
  }
  
  /**
   * 统一的Cookie过滤函数
   * 根据提供的过滤条件对Cookie数组进行过滤，支持域名过滤、搜索和过期时间过滤
   * 
   * @param {Array} cookies - 要过滤的Cookie数组，每个元素都是一个Cookie对象
   * @param {Object} filters - 过滤条件对象，可能包含以下属性:
   *   - domain: {string} 域名过滤条件，只保留包含此字符串的域名
   *   - searchTerm: {string} 搜索条件，匹配Cookie名称或域名
   *   - showExpired: {boolean} 是否显示已过期的Cookie
   *   - showActive: {boolean} 是否显示有效的Cookie
   * @returns {Array} 过滤后的Cookie数组
   * 
   * @example
   * const cookies = [{name: "uid", domain: ".example.com"}, {name: "sid", domain: ".test.com"}];
   * const filters = {domain: "example", showExpired: true, showActive: false};
   * const filtered = filterCookies(cookies, filters);
   * // 返回只包含example域名且已过期的Cookie
   */
  function filterCookies(cookies, filters) {
    // 创建cookies数组的副本，避免修改原始数组
    let filteredCookies = [...cookies];
    
    // 域名过滤：只保留域名包含指定字符串的Cookie
    if (filters.domain) {
      filteredCookies = filteredCookies.filter(cookie => 
        cookie.domain.includes(filters.domain)
      );
    }
    
    // Cookie搜索：根据名称或域名搜索Cookie
    if (filters.searchTerm) {
      filteredCookies = filteredCookies.filter(cookie => 
        cookie.name.toLowerCase().includes(filters.searchTerm) || 
        cookie.domain.toLowerCase().includes(filters.searchTerm)
      );
    }
    
    // 过期时间过滤：根据Cookie的有效性进行过滤
    if (!filters.showExpired && !filters.showActive) {
      // 如果两个选项都没选中，显示空列表
      filteredCookies = [];
    } else if (filters.showExpired && !filters.showActive) {
      // 只显示已过期的 Cookie（默认设置）
      const now = Date.now() / 1000; // 转换为秒
      filteredCookies = filteredCookies.filter(cookie => {
        // 显示已过期的 Cookie（有设置过期时间且已过期）
        return cookie.expirationDate && cookie.expirationDate <= now;
      });
    } else if (!filters.showExpired && filters.showActive) {
      // 只显示有效的 Cookie
      const now = Date.now() / 1000; // 转换为秒
      filteredCookies = filteredCookies.filter(cookie => {
        // 显示有效的 Cookie（会话 Cookie 或者未过期的 Cookie）
        return !cookie.expirationDate || cookie.expirationDate > now;
      });
    }
    // 如果两个选项都选中，显示所有 Cookie，不需要额外过滤
    
    return filteredCookies;
  }
  
  /**
   * 获取选中的导出格式
   * @returns {string} 导出格式
   */
  function getExportFormat() {
    return formatSelect.value;
  }
  
  /**
   * 显示网络错误
   * @param {string} operation - 操作名称
   * @param {string} error - 错误详情
   */
  function showNetworkError(operation, error) {
    // 记录错误日志
    ErrorLogger.logError('network', operation, '网络错误', { error: error });
    
    UIManager.showNetworkError(operation, error, resultDiv);
  }
  
  /**
   * 显示文件错误
   * @param {string} operation - 操作名称
   * @param {string} error - 错误详情
   */
  function showFileError(operation, error) {
    // 记录错误日志
    ErrorLogger.logError('file', operation, '文件错误', { error: error });
    
    UIManager.showFileError(operation, error, resultDiv);
  }
  
  /**
   * 显示格式错误
   * @param {string} format - 格式类型
   * @param {string} error - 错误详情
   */
  function showFormatError(format, error) {
    // 记录错误日志
    ErrorLogger.logError('format', format, '格式错误', { error: error });
    
    UIManager.showFormatError(format, error, resultDiv);
  }
  
  /**
   * 显示详细错误信息
   * @param {string} message - 错误消息
   * @param {Array|string} details - 详细错误信息
   */
  function showError(message, details = []) {
    // 记录错误日志
    ErrorLogger.logError('general', '显示错误', message, { details: details });
    
    UIManager.showError(message, details, resultDiv);
  }
  
  /**
   * 显示结果消息
   * @param {string} message - 要显示的消息
   * @param {string} type - 消息类型 (success|error|loading)
   */
  function showResult(message, type) {
    UIManager.showResult(message, type, resultDiv);
  }
  
  /**
   * 显示加载状态
   * @param {string} message - 显示的加载消息
   */
  function showLoading(message) {
    UIManager.showLoading(message, resultDiv);
  }
  
  /**
   * 更新进度条
   * @param {HTMLElement} progressContainer - 进度条容器元素
   * @param {number} progress - 进度值 (0-100)
   */
  function updateProgress(progressContainer, progress) {
    UIManager.updateProgress(progressContainer, progress);
  }
  
  /**
   * 通用的导出处理函数
   * 处理所有导出和复制操作，根据参数决定是下载文件还是复制到剪贴板
   * 
   * @param {Object} sendMessageParams - 发送到后台的消息参数
   * @param {HTMLElement} button - 触发导出的按钮元素，用于状态更新
   * @param {string} defaultText - 按钮默认文本
   * @param {string} filename - 下载文件名（仅在下载时使用）
   * @param {boolean} shouldDownload - 是否下载文件，false表示复制到剪贴板
   */
  function handleExport(sendMessageParams, button, defaultText, filename, shouldDownload = true) {
    // 显示加载状态
    showLoading(chrome.i18n.getMessage("exportCurrentLoading"));
    // 禁用按钮并更新文本
    button.disabled = true;
    button.textContent = chrome.i18n.getMessage("exporting");
    
    // 显示导出进度条
    updateProgress(exportProgress, 0);
    exportProgress.style.display = 'block';
    
    // 添加格式参数
    sendMessageParams.format = getExportFormat();
    
    // 发送消息到后台脚本以获取 cookies
    chrome.runtime.sendMessage(sendMessageParams, function(response) {
      // 恢复按钮状态
      button.disabled = false;
      button.textContent = defaultText;
      
      if (response.error) {
        // 显示错误信息
        showError(`${chrome.i18n.getMessage("error")}: ${response.error}`);
        // 记录错误日志
        ErrorLogger.logError('export', '导出Cookie', response.error);
      } else {
        // 更新进度到50%
        updateProgress(exportProgress, 50);
        
        // 显示统计信息
        let statsInfo = '';
        if (response.count !== undefined) {
          statsInfo = `<p>${chrome.i18n.getMessage("exportSuccess")} ${response.count} 个 cookies</p>`;
        }
        
        // 根据格式显示内容
        let content = '';
        switch (getExportFormat()) {
          case 'csv':
            content = response.csv;
            break;
          case 'xml':
            content = response.xml;
            break;
          case 'netscape':
            content = response.netscape;
            break;
          default: // json
            content = JSON.stringify(response.cookies, null, 2);
        }
        
        // 更新进度到75%
        updateProgress(exportProgress, 75);
        
        if (shouldDownload) {
          // 显示结果但不包含复制按钮
          showResult(statsInfo, 'success');
          // 下载文件
          downloadFile(content, filename, getExportFormat());
        } else {
          // 复制到剪贴板
          navigator.clipboard.writeText(content).then(function() {
            showResult(chrome.i18n.getMessage("copied"), 'success');
            setTimeout(() => {
              resultDiv.style.display = 'none';
            }, 2000);
          }).catch(function(err) {
            console.error('无法复制文本: ', err);
            showError(chrome.i18n.getMessage("copyFailed"), `${chrome.i18n.getMessage("detailedError")}: ${err.message}`);
            // 记录错误日志
            ErrorLogger.logError('clipboard', '复制到剪贴板', err.message);
          });
        }
        
        // 更新进度到100%
        updateProgress(exportProgress, 100);
        
        // 更新 Cookie 计数
        updateCookieCount();
      }
    });
  }
  
  /**
   * 导入 Cookies
   */
  function importCookies() {
    const file = fileInput.files[0];
    if (!file) {
      showError(chrome.i18n.getMessage("selectFileError"));
      return;
    }
    
    // 自动识别文件格式
    const format = Utils.detectFileFormat(file.name);
    const reader = new FileReader();
    
    showLoading(chrome.i18n.getMessage("importLoading"));
    importBtn.disabled = true;
    importBtn.textContent = chrome.i18n.getMessage("importing");
    
    // 显示导入进度条
    updateProgress(importProgress, 0);
    importProgress.style.display = 'block';
    
    reader.onload = function(e) {
      const content = e.target.result;
      
      // 更新进度到50%
      updateProgress(importProgress, 50);
      
      // 发送消息到后台脚本以导入 cookies
      chrome.runtime.sendMessage({
        action: "importCookies",
        data: content,
        format: format
      }, function(response) {
        importBtn.disabled = false;
        importBtn.textContent = chrome.i18n.getMessage("importCookies");
        
        if (response.error) {
          // 根据错误类型显示不同的错误信息
          if (response.error.includes("网络")) {
            showNetworkError("导入Cookie", response.error);
          } else if (response.error.includes("文件")) {
            showFileError("读取文件", response.error);
          } else if (response.error.includes("格式")) {
            showFormatError(format, response.error);
          } else {
            showError(`${chrome.i18n.getMessage("error")}: ${response.error}`);
          }
          updateProgress(importProgress, 0);
        } else {
          // 验证导入的数据
          const validationResult = CookieValidator.validateCookies(response.cookies, format);
          
          if (!validationResult.valid) {
            showError(
              "导入验证失败:", 
              validationResult.errors
            );
            // 记录错误日志
            ErrorLogger.logError('validation', '导入Cookie验证', '验证失败', { errors: validationResult.errors });
            updateProgress(importProgress, 0);
          } else {
            const validCount = validationResult.validCookies.length;
            const invalidCount = response.cookies.length - validCount;
            
            let message = chrome.i18n.getMessage("importSuccess").replace("{{count}}", validCount);
            if (invalidCount > 0) {
              message += `<br>另有 ${invalidCount} 个 Cookie 因格式问题被忽略`;
            }
            
            // 更新进度到100%
            updateProgress(importProgress, 100);
            
            showResult(message, 'success');
            // 更新 Cookie 计数
            updateCookieCount();
          }
        }
      });
    };
    
    reader.onerror = function() {
      importBtn.disabled = false;
      importBtn.textContent = chrome.i18n.getMessage("importCookies");
      showFileError("读取文件", reader.error.message);
      updateProgress(importProgress, 0);
    };
    
    reader.readAsText(file);
  }
  
  /**
   * 导出当前网站的 Cookies
   */
  function exportCurrentCookies() {
    // 获取当前活动标签页
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (chrome.runtime.lastError) {
        showNetworkError("获取当前标签页", chrome.runtime.lastError.message);
        return;
      }
      
      const currentTab = tabs[0];
      if (!currentTab || !currentTab.url) {
        showNetworkError("获取当前网站URL", "无法获取当前页面URL");
        return;
      }
      
      const domain = Utils.getDomain(currentTab.url);
      const filename = `cookies-${domain}`;
      
      handleExport(
        {
          action: "exportCookies",
          url: currentTab.url,
          filters: getFilters()
        }, 
        exportCurrentBtn, 
        chrome.i18n.getMessage("exportCurrent"), 
        filename,
        true // 下载文件
      );
    });
  }
  
  /**
   * 导出所有 Cookies
   */
  function exportAllCookies() {
    handleExport(
      {
        action: "exportAllCookies",
        filters: getFilters()
      }, 
      exportAllBtn, 
      chrome.i18n.getMessage("exportAll"), 
      'all-cookies',
      true // 下载文件
    );
  }
  
  /**
   * 复制当前网站的 Cookies 到剪贴板
   */
  function copyCurrentCookies() {
    // 获取当前活动标签页
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (chrome.runtime.lastError) {
        showNetworkError("获取当前标签页", chrome.runtime.lastError.message);
        return;
      }
      
      const currentTab = tabs[0];
      if (!currentTab || !currentTab.url) {
        showNetworkError("获取当前网站URL", "无法获取当前页面URL");
        return;
      }
      
      handleExport(
        {
          action: "exportCookies",
          url: currentTab.url,
          filters: getFilters()
        }, 
        copyCurrentBtn, 
        chrome.i18n.getMessage("copyCurrent"),
        null, // 无需文件名
        false // 不下载文件，仅复制到剪贴板
      );
    });
  }
  
  /**
   * 复制所有 Cookies 到剪贴板
   */
  function copyAllCookies() {
    handleExport(
      {
        action: "exportAllCookies",
        filters: getFilters()
      }, 
      copyAllBtn, 
      chrome.i18n.getMessage("copyAll"),
      null, // 无需文件名
      false // 不下载文件，仅复制到剪贴板
    );
  }
  
  /**
   * 加载并显示 Cookie 列表
   */
  function loadCookies() {
    cookieList.innerHTML = `<p>${chrome.i18n.getMessage("loadingCookies")}</p>`;
    
    chrome.cookies.getAll({}, function(cookies) {
      if (chrome.runtime.lastError) {
        cookieList.innerHTML = `<p class="error">${chrome.i18n.getMessage("error")}: ${chrome.runtime.lastError.message}</p>`;
        // 记录错误日志
        ErrorLogger.logError('cookies', '获取Cookie列表', chrome.runtime.lastError.message);
        return;
      }
      
      // 构建过滤条件
      const manageFilters = getManageFilters();
      const filters = {
        domain: manageFilters.domain,
        showExpired: manageFilters.showExpired,
        showActive: manageFilters.showActive,
        searchTerm: cookieSearch.value.trim().toLowerCase()
      };
      
      // 应用过滤器
      const filteredCookies = filterCookies(cookies, filters);
      
      if (filteredCookies.length === 0) {
        cookieList.innerHTML = `<p>${chrome.i18n.getMessage("cookiesLoaded").replace("{{count}}", "0")}</p>`;
        return;
      }
      
      cookieList.innerHTML = `<p>${chrome.i18n.getMessage("cookiesLoaded").replace("{{count}}", filteredCookies.length)}</p>`;
      
      const cookieContainer = document.createElement('div');
      filteredCookies.forEach(cookie => {
        const cookieElement = document.createElement('div');
        cookieElement.className = 'cookie-item';
        
        // 格式化过期时间
        let expirationText = chrome.i18n.getMessage("sessionCookie");
        let isExpired = false;
        if (cookie.expirationDate) {
          const expirationDate = new Date(cookie.expirationDate * 1000);
          expirationText = expirationDate.toLocaleString();
          isExpired = cookie.expirationDate <= (Date.now() / 1000);
        }
        
        cookieElement.innerHTML = `
          <div class="cookie-header">
            <span class="cookie-domain">${Utils.escapeHtml(cookie.domain)}</span>
            <span class="cookie-name">${Utils.escapeHtml(cookie.name)}</span>
          </div>
          <div class="cookie-value">${Utils.escapeHtml(cookie.value.substring(0, 50))}${cookie.value.length > 50 ? '...' : ''}</div>
          <div class="cookie-details">
            <div>${chrome.i18n.getMessage("path")}: ${Utils.escapeHtml(cookie.path)}</div>
            <div>${chrome.i18n.getMessage("expiration")}: ${Utils.escapeHtml(expirationText)} ${isExpired ? '<strong style="color: red;">[' + chrome.i18n.getMessage("expired") + ']</strong>' : '<strong style="color: green;">[' + chrome.i18n.getMessage("active") + ']</strong>'}</div>
            <div>
              ${chrome.i18n.getMessage("secure")}: ${cookie.secure ? chrome.i18n.getMessage("yes") : chrome.i18n.getMessage("no")} | 
              HttpOnly: ${cookie.httpOnly ? chrome.i18n.getMessage("yes") : chrome.i18n.getMessage("no")} | 
              SameSite: ${cookie.sameSite || chrome.i18n.getMessage("none")}
            </div>
          </div>
          <div class="cookie-actions">
            <button class="view-detail-btn" data-cookie='${JSON.stringify(cookie)}'>
              ${chrome.i18n.getMessage("viewDetails")}
            </button>
            <button class="delete-btn" data-domain="${Utils.escapeHtml(cookie.domain)}" data-name="${Utils.escapeHtml(cookie.name)}" data-path="${Utils.escapeHtml(cookie.path)}">
              ${chrome.i18n.getMessage("deleteCookie")}
            </button>
          </div>
        `;
        cookieContainer.appendChild(cookieElement);
      });
      
      cookieList.appendChild(cookieContainer);
      
      // 绑定查看详情按钮事件
      document.querySelectorAll('.view-detail-btn').forEach(button => {
        button.addEventListener('click', function() {
          const cookieData = JSON.parse(this.getAttribute('data-cookie'));
          showCookieDetail(cookieData);
        });
      });
      
      // 绑定删除按钮事件
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
          const domain = this.getAttribute('data-domain');
          const name = this.getAttribute('data-name');
          const path = this.getAttribute('data-path');
          
          if (confirm(chrome.i18n.getMessage("confirmDeleteCookie"))) {
            deleteCookie(domain, name, path, this);
          }
        });
      });
    });
  }
  
  /**
   * 显示 Cookie 详细信息
   * @param {Object} cookie - Cookie 对象
   */
  function showCookieDetail(cookie) {
    // 格式化过期时间
    let expirationText = chrome.i18n.getMessage("sessionCookie");
    if (cookie.expirationDate) {
      const expirationDate = new Date(cookie.expirationDate * 1000);
      expirationText = expirationDate.toLocaleString();
    }
    
    // 格式化创建时间（如果可用）
    let creationText = chrome.i18n.getMessage("unknown");
    if (cookie.creationDate) {
      const creationDate = new Date(cookie.creationDate * 1000);
      creationText = expirationDate.toLocaleString();
    }
    
    cookieDetailContent.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("name")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${Utils.escapeHtml(cookie.name)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("value")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd; word-break: break-all;">${Utils.escapeHtml(cookie.value)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("domain")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${Utils.escapeHtml(cookie.domain)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("path")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${Utils.escapeHtml(cookie.path)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("expiration")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${Utils.escapeHtml(expirationText)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("creationTime")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${Utils.escapeHtml(creationText)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("secure")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${cookie.secure ? chrome.i18n.getMessage("yes") : chrome.i18n.getMessage("no")}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">HttpOnly:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${cookie.httpOnly ? chrome.i18n.getMessage("yes") : chrome.i18n.getMessage("no")}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">SameSite:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${cookie.sameSite || chrome.i18n.getMessage("none")}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("hostOnly")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${cookie.hostOnly ? chrome.i18n.getMessage("yes") : chrome.i18n.getMessage("no")}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px; border-bottom: 1px solid #ddd;">${chrome.i18n.getMessage("session")}:</td>
          <td style="padding: 5px; border-bottom: 1px solid #ddd;">${cookie.session ? chrome.i18n.getMessage("yes") : chrome.i18n.getMessage("no")}</td>
        </tr>
      </table>
    `;
    
    cookieDetailModal.style.display = 'block';
  }
  
  /**
   * 删除单个 Cookie
   * @param {string} domain - Cookie 域名
   * @param {string} name - Cookie 名称
   * @param {string} path - Cookie 路径
   * @param {HTMLElement} button - 触发删除的按钮元素
   */
  function deleteCookie(domain, name, path, button) {
    // 构造删除 URL
    const protocol = domain.startsWith('.') ? 'http' : 'https';
    const url = `${protocol}://${domain.replace(/^\./, '')}${path}`;
    
    chrome.cookies.remove({
      url: url,
      name: name
    }, function(details) {
      if (chrome.runtime.lastError) {
        showError(`${chrome.i18n.getMessage("error")}: ${chrome.runtime.lastError.message}`);
        // 记录错误日志
        ErrorLogger.logError('cookies', '删除Cookie', chrome.runtime.lastError.message);
      } else {
        showResult(chrome.i18n.getMessage("cookieDeleted"), 'success');
        // 从列表中移除该项
        button.closest('.cookie-item').remove();
        // 更新 Cookie 计数
        updateCookieCount();
        setTimeout(() => {
          resultDiv.style.display = 'none';
        }, 2000);
      }
    });
  }
  
  /**
   * 删除所有 Cookie
   */
  function deleteAllCookies() {
    if (!confirm(chrome.i18n.getMessage("confirmDeleteAllCookies"))) {
      return;
    }
    
    chrome.cookies.getAll({}, function(cookies) {
      if (chrome.runtime.lastError) {
        showError(`${chrome.i18n.getMessage("error")}: ${chrome.runtime.lastError.message}`);
        // 记录错误日志
        ErrorLogger.logError('cookies', '获取Cookie列表用于删除', chrome.runtime.lastError.message);
        return;
      }
      
      // 应用当前过滤器
      const filters = getManageFilters();
      let cookiesToDelete = cookies;
      
      // 域名过滤
      if (filters.domain) {
        cookiesToDelete = cookiesToDelete.filter(cookie => 
          cookie.domain.includes(filters.domain)
        );
      }
      
      // 过期时间过滤
      if (!filters.showExpired && !filters.showActive) {
        // 如果两个选项都没选中，不删除任何 Cookie
        cookiesToDelete = [];
      } else if (filters.showExpired && !filters.showActive) {
        // 只删除已过期的 Cookie（默认）
        const now = Date.now() / 1000; // 转换为秒
        cookiesToDelete = cookiesToDelete.filter(cookie => {
          return cookie.expirationDate && cookie.expirationDate <= now;
        });
      } else if (!filters.showExpired && filters.showActive) {
        // 只删除有效的 Cookie
        const now = Date.now() / 1000; // 转换为秒
        cookiesToDelete = cookiesToDelete.filter(cookie => {
          return !cookie.expirationDate || cookie.expirationDate > now;
        });
      } else if (filters.showExpired && filters.showActive) {
        // 删除所有显示的 Cookie
      }
      
      let deletedCount = 0;
      
      if (cookiesToDelete.length === 0) {
        showResult(chrome.i18n.getMessage("allCookiesDeleted"), 'success');
        loadCookies(); // 重新加载列表
        updateCookieCount(); // 更新计数
        setTimeout(() => {
          resultDiv.style.display = 'none';
        }, 2000);
        return;
      }
      
      cookiesToDelete.forEach(cookie => {
        const protocol = cookie.secure ? 'https' : 'http';
        const domain = cookie.domain.replace(/^\./, '');
        const url = `${protocol}://${domain}${cookie.path}`;
        
        chrome.cookies.remove({
          url: url,
          name: cookie.name
        }, function(details) {
          if (chrome.runtime.lastError) {
            console.error('删除Cookie失败:', chrome.runtime.lastError);
            // 记录错误日志
            ErrorLogger.logError('cookies', '删除Cookie', chrome.runtime.lastError.message);
          } else {
            deletedCount++;
          }
          
          // 当所有 Cookie 都处理完后
          if (deletedCount === cookiesToDelete.length) {
            showResult(chrome.i18n.getMessage("allCookiesDeleted"), 'success');
            loadCookies(); // 重新加载列表
            updateCookieCount(); // 更新计数
            setTimeout(() => {
              resultDiv.style.display = 'none';
            }, 2000);
          }
        });
      });
    });
  }
  
  /**
   * 下载文件
   * 使用Blob API创建文件并触发浏览器下载，确保资源得到正确清理
   * 
   * @param {string} content - 文件内容
   * @param {string} baseFilename - 基础文件名（不含扩展名）
   * @param {string} format - 文件格式 (json, csv, xml, netscape)
   * 
   * @example
   * downloadFile('{"name": "test"}', 'cookies-example', 'json');
   * // 将下载名为 cookies-example.json 的文件
   */
  function downloadFile(content, baseFilename, format) {
    // 初始化MIME类型和文件扩展名
    let mimeType = 'application/octet-stream';
    let extension = format;
    let url = null;
    let a = null;
    
    try {
      // 根据格式设置正确的MIME类型和扩展名
      switch (format) {
        case 'json':
          mimeType = 'application/json';
          break;
        case 'csv':
          mimeType = 'text/csv';
          break;
        case 'xml':
          mimeType = 'application/xml';
          break;
        case 'netscape':
          extension = 'txt';
          mimeType = 'text/plain';
          break;
      }
      
      // 构造完整文件名
      const filename = `${baseFilename}.${extension}`;
      // 创建Blob对象
      const blob = new Blob([content], {type: mimeType});
      // 创建对象URL
      url = URL.createObjectURL(blob);
      
      // 创建临时<a>元素用于触发下载
      a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
    } catch (error) {
      // 错误处理
      console.error('下载文件时发生错误:', error);
      showError(`${chrome.i18n.getMessage("downloadFailed")}: ${error.message}`);
      // 记录错误日志
      ErrorLogger.logError('file', '下载文件', error.message);
    } finally {
      // 清理DOM元素
      if (a && a.parentNode) {
        setTimeout(() => {
          a.parentNode.removeChild(a);
          a = null;
        }, 100);
      }
      
      // 清理对象URL，释放内存
      if (url) {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          url = null;
        }, 100);
      }
    }
  }
});