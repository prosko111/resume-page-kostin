# 🚀 Инструкции по развертыванию портфолио

## Быстрый запуск локально

### Метод 1: Python сервер (рекомендуется)
```bash
cd /Users/aleksejkostin/Documents/GitHub/resume-page-kostin
python3 -m http.server 8080
```
Откройте браузер: http://localhost:8080

### Метод 2: Node.js Live Server
```bash
npm install -g live-server
cd /Users/aleksejkostin/Documents/GitHub/resume-page-kostin
live-server --port=8080
```

### Метод 3: PHP сервер
```bash
cd /Users/aleksejkostin/Documents/GitHub/resume-page-kostin
php -S localhost:8080
```

## 📁 Текущая структура проекта

```
resume-page-kostin/
├── index.html              ✅ Готов
├── manifest.json           ✅ Готов
├── sw.js                   ✅ Готов  
├── robots.txt              ✅ Готов
├── sitemap.xml             ✅ Готов
├── .gitignore              ✅ Готов
├── README.md               ✅ Готов
├── package.json            ✅ Готов
├── DEPLOYMENT.md           ✅ Готов (этот файл)
└── assets/
    ├── css/
    │   └── style.css       ✅ Готов (25KB)
    ├── js/
    │   └── main.js         ✅ Готов (18KB)
    └── images/
        └── favicon.svg     ✅ Готов
```

## 🎯 Что работает прямо сейчас

✅ **HTML** - Полная семантическая разметка  
✅ **CSS** - Современные стили с анимациями  
✅ **JavaScript** - Полная интерактивность  
✅ **Адаптивность** - Работает на всех устройствах  
✅ **SEO** - Оптимизированные метатеги  
✅ **PWA** - Готов для установки как приложение  
✅ **Производительность** - Оптимизированная загрузка  

## 🌐 Развертывание в продакшн

### GitHub Pages
1. Создайте репозиторий на GitHub
2. Загрузите все файлы
3. Settings → Pages → Source: Deploy from a branch
4. Branch: main, Folder: / (root)

### Netlify
1. Drag & Drop папку на netlify.com
2. Или подключите GitHub репозиторий
3. Настройки сборки: 
   - Build command: (оставить пустым)
   - Publish directory: (оставить пустым)

### Vercel
```bash
npm i -g vercel
cd /Users/aleksejkostin/Documents/GitHub/resume-page-kostin
vercel --prod
```

### Surge.sh
```bash
npm install -g surge
cd /Users/aleksejkostin/Documents/GitHub/resume-page-kostin
surge
```

## 📱 Тестирование

### Локальное тестирование
- **Desktop**: http://localhost:8080
- **Mobile**: Откройте DevTools → Toggle device toolbar
- **PWA**: DevTools → Application → Manifest

### Онлайн инструменты
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WAVE**: https://wave.webaim.org/

## 🔧 Дополнительные настройки

### Добавление фотографии
1. Добавьте фото в `assets/images/profile.jpg`
2. Замените в CSS:
```css
.image-placeholder {
    background-image: url('../images/profile.jpg');
    background-size: cover;
    background-position: center;
}
```

### Настройка Google Analytics
Добавьте в `<head>`:
```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Добавление домена
Замените в файлах:
- `robots.txt`: `[your-domain]` → ваш домен
- `sitemap.xml`: `[your-domain]` → ваш домен
- `package.json`: `[username]` → ваш GitHub username

## 🔍 Проверка готовности

- [ ] Сайт открывается локально
- [ ] Мобильная версия работает корректно
- [ ] Все ссылки ведут в нужные разделы
- [ ] Анимации работают плавно
- [ ] Контактная информация актуальна
- [ ] Manifest загружается без ошибок
- [ ] Service Worker регистрируется

## 📞 Поддержка

Если возникли вопросы:
- Telegram: [@prosko111](https://t.me/prosko111)
- Email: prosko111@yandex.ru

---

**Портфолио готово к использованию! 🎉**

Текущий сервер работает на: http://localhost:8080