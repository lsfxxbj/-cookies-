/**
 * UI 管理模块
 * 处理用户界面相关的功能
 */

/**
 * 显示加载状态
 * @param {string} message - 显示的加载消息
 * @param {HTMLElement} resultDiv - 结果显示元素
 */
function showLoading(message, resultDiv) {
  resultDiv.innerHTML = `
    <div class="spinner"></div>
    <p>${message}</p>
  `;
  resultDiv.className = 'loading';
  resultDiv.style.display = 'block';
}

/**
 * 显示结果消息
 * @param {string} message - 要显示的消息
 * @param {string} type - 消息类型 (success|error|loading)
 * @param {HTMLElement} resultDiv - 结果显示元素
 */
function showResult(message, type, resultDiv) {
  resultDiv.innerHTML = message;
  resultDiv.className = type;
  resultDiv.style.display = 'block';
}

/**
 * 显示详细错误信息
 * @param {string} message - 错误消息
 * @param {Array|string} details - 详细错误信息
 * @param {HTMLElement} resultDiv - 结果显示元素
 */
function showError(message, details, resultDiv) {
  let errorHtml = `<p><strong>${message}</strong></p>`;
  
  if (Array.isArray(details) && details.length > 0) {
    errorHtml += '<ul style="margin-top: 10px; text-align: left;">';
    details.forEach(detail => {
      errorHtml += `<li>${detail}</li>`;
    });
    errorHtml += '</ul>';
  } else if (typeof details === 'string' && details) {
    errorHtml += `<p style="margin-top: 10px; text-align: left;">${details}</p>`;
  }
  
  showResult(errorHtml, 'error', resultDiv);
}

/**
 * 显示网络错误
 * @param {string} operation - 操作名称
 * @param {string} error - 错误详情
 * @param {HTMLElement} resultDiv - 结果显示元素
 */
function showNetworkError(operation, error, resultDiv) {
  const errorMessage = `网络错误：无法${operation}`;
  const errorDetails = [
    "请检查网络连接是否正常",
    "确认目标网站可以正常访问",
    "如果问题持续存在，请稍后再试"
  ];
  
  if (error) {
    errorDetails.push(`详细信息: ${error}`);
  }
  
  showError(errorMessage, errorDetails, resultDiv);
}

/**
 * 显示文件错误
 * @param {string} operation - 操作名称
 * @param {string} error - 错误详情
 * @param {HTMLElement} resultDiv - 结果显示元素
 */
function showFileError(operation, error, resultDiv) {
  const errorMessage = `文件错误：无法${operation}`;
  const errorDetails = [
    "请检查文件是否损坏",
    "确认文件格式是否正确",
    "尝试重新选择文件"
  ];
  
  if (error) {
    errorDetails.push(`详细信息: ${error}`);
  }
  
  showError(errorMessage, errorDetails, resultDiv);
}

/**
 * 显示格式错误
 * @param {string} format - 格式类型
 * @param {string} error - 错误详情
 * @param {HTMLElement} resultDiv - 结果显示元素
 */
function showFormatError(format, error, resultDiv) {
  const errorMessage = `格式错误：${format}格式不正确`;
  const errorDetails = [
    "请检查文件内容是否符合格式要求",
    "确认文件没有被损坏",
    "参考示例文件格式进行调整"
  ];
  
  if (error) {
    errorDetails.push(`详细信息: ${error}`);
  }
  
  showError(errorMessage, errorDetails, resultDiv);
}

/**
 * 更新进度条
 * @param {HTMLElement} progressContainer - 进度条容器元素
 * @param {number} progress - 进度值 (0-100)
 */
function updateProgress(progressContainer, progress) {
  const progressBar = progressContainer.querySelector('.progress-bar');
  const progressText = progressContainer.querySelector('.progress-text');
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${Math.round(progress)}%`;
  
  if (progress > 0 && progress < 100) {
    progressContainer.style.display = 'block';
  } else if (progress >= 100) {
    setTimeout(() => {
      progressContainer.style.display = 'none';
    }, 500);
  }
}

/**
 * 处理拖拽悬停事件
 * @param {Event} e - 拖拽事件
 * @param {HTMLElement} dropArea - 拖放区域元素
 */
function handleDragOver(e, dropArea) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.style.backgroundColor = '#e6f3ff';
  dropArea.style.borderColor = '#007bff';
}

/**
 * 处理拖拽离开事件
 * @param {Event} e - 拖拽事件
 * @param {HTMLElement} dropArea - 拖放区域元素
 */
function handleDragLeave(e, dropArea) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.style.backgroundColor = '#f9f9f9';
  dropArea.style.borderColor = '#ccc';
}

/**
 * 处理文件拖放事件
 * @param {Event} e - 拖拽事件
 * @param {HTMLElement} dropArea - 拖放区域元素
 * @param {HTMLElement} fileInput - 文件输入元素
 */
function handleDrop(e, dropArea, fileInput) {
  e.preventDefault();
  e.stopPropagation();
  
  dropArea.style.backgroundColor = '#f9f9f9';
  dropArea.style.borderColor = '#ccc';
  
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    // 显示文件名
    dropArea.innerHTML = `<p>${chrome.i18n.getMessage("selectedFile")}: ${files[0].name}</p>
      <p data-i18n="dragAndDropHint">${chrome.i18n.getMessage("dragAndDropHint")}</p>`;
  }
}

/**
 * 处理文件选择事件
 * @param {Event} e - 选择事件
 * @param {HTMLElement} dropArea - 拖放区域元素
 */
function handleFileSelect(e, dropArea) {
  if (e.target.files.length) {
    // 显示文件名
    dropArea.innerHTML = `<p>${chrome.i18n.getMessage("selectedFile")}: ${e.target.files[0].name}</p>
      <p data-i18n="dragAndDropHint">${chrome.i18n.getMessage("dragAndDropHint")}</p>`;
  }
}

// 导出所有函数
export const UIManager = {
  showLoading,
  showResult,
  showError,
  showNetworkError,
  showFileError,
  showFormatError,
  updateProgress,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect
};