# 🖱️ Enable Right Click Extension

Extension Chrome giúp bật lại chức năng chuột phải trên các trang web đã bị chặn và tự động nhớ các domain đã kích hoạt.

## ✨ Tính Năng

### 🎯 Tính Năng Chính
- **Bật lại chuột phải** trên các trang web bị chặn
- **Tự động lưu domain** vào local storage
- **Tự động kích hoạt** cho tất cả trang con của domain đã lưu
- **Giao diện popup đẹp** với menu quản lý domain
- **Xem và quản lý** danh sách domain đã lưu
- **Xóa domain** riêng lẻ hoặc xóa tất cả

### 🔧 Tính Năng Kỹ Thuật
- **MutationObserver** để xử lý nội dung động
- **Cross-browser compatibility** với các CSS prefix
- **Error handling** và user feedback
- **Performance optimized** với lazy loading
- **Auto-inject** cho subdomain matching

## 🚀 Cài Đặt

### Cách 1: Từ Chrome Web Store (Sắp có)
1. Truy cập Chrome Web Store
2. Tìm kiếm "Enable Right Click"
3. Click "Add to Chrome"

### Cách 2: Cài Đặt Thủ Công
1. **Download** hoặc clone repository này
2. Mở **Chrome** → **Settings** → **Extensions**
3. Bật **Developer mode** (góc trên bên phải)
4. Click **Load unpacked** và chọn thư mục extension
5. Extension sẽ xuất hiện trong thanh công cụ

## 📖 Hướng Dẫn Sử Dụng

### Bật Chuột Phải Cho Trang Web
1. **Truy cập** trang web bị chặn chuột phải
2. **Click** vào icon extension trên thanh công cụ
3. **Click** nút "Bật chuột phải cho trang này"
4. **Thành công!** Chuột phải đã được kích hoạt

### Quản Lý Domain Đã Lưu
1. **Mở popup** extension
2. **Xem danh sách** domain đã lưu ở phần dưới
3. **Xóa domain** riêng lẻ bằng nút "Xóa"
4. **Xóa tất cả** bằng nút "Xóa tất cả"

### Tự Động Kích Hoạt
- Extension sẽ **tự động hoạt động** trên tất cả trang con của domain đã lưu
- Ví dụ: Lưu `google.com` → Tự động hoạt động trên `google.com\xyz`, `mail.google.com`, `drive.google.com`

## 🛠️ Cấu Trúc Dự Án

```
enable-right-click-extension-browser/
├── manifest.json         # Cấu hình extension
├── popup.html            # Giao diện popup
├── popup.js              # Logic popup
├── background.js         # Background script
├── autoinject.js         # Auto-inject content script
├── enable.js             # Script enable chuột phải
└── icon.png              # Icon extension
```

### Chi Tiết Files

| File | Mô Tả |
|------|-------|
| `manifest.json` | Cấu hình extension, permissions, content scripts |
| `popup.html` | Giao diện popup với CSS đẹp |
| `popup.js` | Xử lý logic popup, storage, domain management |
| `background.js` | Background service worker |
| `autoinject.js` | Tự động inject script cho domain đã lưu |
| `enable.js` | Script chính để enable chuột phải |

---

⭐ **Nếu extension hữu ích, hãy cho một star trên GitHub!** ⭐ 