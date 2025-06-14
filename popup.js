document.addEventListener('DOMContentLoaded', async () => {
    const currentDomainEl = document.getElementById('currentDomain');
    const enableBtn = document.getElementById('enableBtn');
    const btnText = document.getElementById('btnText');
    const status = document.getElementById('status');
    const domainsList = document.getElementById('domainsList');
    const domainCount = document.getElementById('domainCount');
    const clearAllBtn = document.getElementById('clearAll');

    let currentTab = null;
    let currentDomain = '';

    // Lấy thông tin tab hiện tại
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTab = tabs[0];
        
        if (currentTab && currentTab.url) {
            const url = new URL(currentTab.url);
            currentDomain = url.hostname.split('.').slice(-2).join('.');
            currentDomainEl.textContent = currentDomain;
        } else {
            currentDomainEl.textContent = 'Không thể xác định domain';
            enableBtn.disabled = true;
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tab:', error);
        currentDomainEl.textContent = 'Lỗi khi lấy thông tin trang';
        enableBtn.disabled = true;
    }

    // Kiểm tra trạng thái domain hiện tại
    chrome.storage.local.get({ enabledDomains: [] }, (data) => {
        const enabledDomains = data.enabledDomains || [];
        
        if (enabledDomains.includes(currentDomain)) {
            btnText.textContent = '✅ Đã bật chuột phải';
            enableBtn.style.background = '#2196F3';
            status.textContent = 'Domain này đã được kích hoạt';
        }
        
        updateDomainsList(enabledDomains);
    });

    // Xử lý sự kiện click nút Enable
    enableBtn.addEventListener('click', async () => {
        if (!currentTab || !currentDomain) return;

        try {
            enableBtn.disabled = true;
            btnText.textContent = 'Đang xử lý...';

            // Lưu domain vào storage
            chrome.storage.local.get({ enabledDomains: [] }, (data) => {
                const enabledDomains = new Set(data.enabledDomains || []);
                enabledDomains.add(currentDomain);
                
                chrome.storage.local.set({ enabledDomains: Array.from(enabledDomains) }, () => {
                    // Thực thi script enable
                    chrome.scripting.executeScript({
                        target: { tabId: currentTab.id },
                        files: ["enable.js"]
                    }, (result) => {
                        if (chrome.runtime.lastError) {
                            console.error('Lỗi khi inject script:', chrome.runtime.lastError);
                            btnText.textContent = 'Lỗi khi kích hoạt';
                            status.textContent = 'Không thể inject script';
                        } else {
                            btnText.textContent = '✅ Đã bật chuột phải';
                            enableBtn.style.background = '#2196F3';
                            status.textContent = 'Đã kích hoạt thành công!';
                            
                            // Cập nhật danh sách domains
                            updateDomainsList(Array.from(enabledDomains));
                            
                            // Tự động đóng popup sau 1.5 giây
                            setTimeout(() => {
                                window.close();
                            }, 1500);
                        }
                        enableBtn.disabled = false;
                    });
                });
            });
        } catch (error) {
            console.error('Lỗi khi enable:', error);
            btnText.textContent = 'Lỗi khi kích hoạt';
            enableBtn.disabled = false;
            status.textContent = 'Có lỗi xảy ra, vui lòng thử lại';
        }
    });

    // Xử lý sự kiện xóa tất cả domains
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa tất cả domain đã lưu?')) {
            chrome.storage.local.set({ enabledDomains: [] }, () => {
                updateDomainsList([]);
                status.textContent = 'Đã xóa tất cả domain';
                
                // Reset trạng thái nút nếu domain hiện tại cũng bị xóa
                if (currentDomain) {
                    btnText.textContent = 'Bật chuột phải cho trang này';
                    enableBtn.style.background = '#4CAF50';
                    status.textContent = '';
                }
            });
        }
    });

    // Hàm cập nhật danh sách domains
    function updateDomainsList(domains) {
        domainCount.textContent = domains.length;
        
        if (domains.length === 0) {
            domainsList.innerHTML = '<div class="empty-message">Chưa có domain nào được lưu</div>';
            return;
        }

        const domainsHtml = domains.map(domain => `
            <div class="domain-item">
                <span>${domain}</span>
                <button class="remove-btn" data-domain="${domain}">Xóa</button>
            </div>
        `).join('');

        domainsList.innerHTML = domainsHtml;

        // Thêm event listener cho các nút xóa
        domainsList.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const domainToRemove = e.target.getAttribute('data-domain');
                removeDomain(domainToRemove);
            });
        });
    }

    // Hàm xóa một domain cụ thể
    function removeDomain(domainToRemove) {
        chrome.storage.local.get({ enabledDomains: [] }, (data) => {
            const enabledDomains = data.enabledDomains.filter(domain => domain !== domainToRemove);
            
            chrome.storage.local.set({ enabledDomains }, () => {
                updateDomainsList(enabledDomains);
                status.textContent = `Đã xóa ${domainToRemove}`;
                
                // Reset trạng thái nút nếu domain hiện tại bị xóa
                if (domainToRemove === currentDomain) {
                    btnText.textContent = 'Bật chuột phải cho trang này';
                    enableBtn.style.background = '#4CAF50';
                }
            });
        });
    }
}); 