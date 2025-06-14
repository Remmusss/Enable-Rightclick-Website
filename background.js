// Background script cho Enable Right Click Extension
// Logic chính được xử lý trong popup.js

// Có thể thêm các listener khác nếu cần thiết trong tương lai
chrome.runtime.onInstalled.addListener(() => {
  console.log('Enable Right Click Extension đã được cài đặt');
});
