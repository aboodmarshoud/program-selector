# أداة اختيار البرنامج المناسب

هذا مشروع React + Vite جاهز للنشر على GitHub Pages.

## التشغيل على جهازك

```bash
npm install
npm run dev
```

## البناء النهائي

```bash
npm run build
npm run preview
```

## النشر على GitHub Pages

1. أنشئ مستودعًا جديدًا في GitHub.
2. ارفع ملفات هذا المشروع إلى المستودع.
3. ادخل إلى Settings > Pages.
4. من Build and deployment اختر Source = GitHub Actions.
5. ادفع أي تعديل إلى فرع main.
6. افتح تبويب Actions حتى يكتمل النشر.
7. رابط الموقع سيظهر في Settings > Pages.

ملاحظة: ملف `vite.config.js` يستخدم `base: "./"` حتى يعمل الموقع تحت أي اسم مستودع.
