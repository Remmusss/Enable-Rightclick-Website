// Gỡ các ràng buộc của trang đối với chuột phải
document.addEventListener('contextmenu', e => e.stopPropagation(), true);

// Chặn toàn bộ các event listener ngăn thao tác chuột
['contextmenu', 'mousedown', 'mouseup', 'dragstart', 'selectstart', 'copy'].forEach(event => {
  window.addEventListener(event, function (e) {
    e.stopImmediatePropagation();
  }, true);
});

// Hàm enable chuột phải cho các element
function enableRightClickForElements(elements) {
  elements.forEach(el => {
    if (el && el.style) {
      el.style.userSelect = 'auto';
      el.style.webkitUserSelect = 'auto';
      el.style.mozUserSelect = 'auto';
      el.style.msUserSelect = 'auto';
      el.oncontextmenu = null;
      el.ondragstart = null;
      el.onselectstart = null;
      el.onmousedown = null;
      el.onmouseup = null;
      
      // Xóa các attribute chặn chuột phải
      el.removeAttribute('oncontextmenu');
      el.removeAttribute('ondragstart');
      el.removeAttribute('onselectstart');
    }
  });
}

// Enable cho tất cả element hiện tại
enableRightClickForElements(document.querySelectorAll('*'));

// Thêm observer để xử lý các element được thêm động
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      if (node.nodeType === 1) { // Element node
        enableRightClickForElements([node]);
        
        // Xử lý các element con
        const children = node.querySelectorAll('*');
        if (children.length > 0) {
          enableRightClickForElements(Array.from(children));
        }
      }
    });
  });
});

// Bắt đầu observe nếu document.body đã tồn tại
if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} else {
  // Nếu body chưa load, đợi DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

console.log('✅ Enable Right Click: Script đã được thực thi thành công');
