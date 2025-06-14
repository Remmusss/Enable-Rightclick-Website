(function () {
    const currentHost = window.location.hostname;
    const rootDomain = currentHost.split('.').slice(-2).join('.');
  
    // Sử dụng chrome.storage trong content script
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get({ enabledDomains: [] }, (data) => {
            const enabledDomains = data.enabledDomains || [];
            
            // Kiểm tra xem domain hiện tại có trong danh sách đã lưu không
            const isEnabled = enabledDomains.some(domain => {
                // Kiểm tra exact match hoặc subdomain
                return currentHost === domain || 
                       currentHost.endsWith('.' + domain) || 
                       rootDomain === domain;
            });
            
            if (isEnabled) {
                console.log('✅ Enable Right Click: Tự động kích hoạt cho domain', currentHost);
                enableRightClick();
            }
        });
    }

    // Hàm enable chuột phải
    function enableRightClick() {
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

        // Bắt đầu observe
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            // Nếu body chưa load, đợi DOM ready
            document.addEventListener('DOMContentLoaded', () => {
                if (document.body) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            });
        }
    }
})();
  