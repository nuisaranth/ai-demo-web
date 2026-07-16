# เว็บไซต์ตัวอย่าง Digital Marketing & AI

เว็บไซต์บริษัทตัวอย่างสำหรับ **คอร์ส Digital Marketing & AI** ไม่ต้องใช้ฐานข้อมูล ไม่ต้องใช้ API Key และไม่ต้องแก้โค้ด — จัดการทุกอย่างผ่านหน้า Admin แบบ visual และข้อมูลถูกเก็บไว้ในเบราว์เซอร์ของคุณ

## 🚀 Deploy เว็บไซต์ของคุณเอง (คลิกเดียว)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_GITHUB_USERNAME%2Fai-demo-web)

> หลังจาก deploy แล้ว คุณไม่จำเป็นต้องยุ่งกับ GitHub อีกเลย จัดการทุกอย่างได้ที่ `/admin`

## 🧭 วิธีใช้งาน (สำหรับนักเรียน)

1. เปิดเว็บไซต์ที่ deploy แล้ว แล้วไปที่ **`/admin`** (พิมพ์ในแถบที่อยู่)
2. **ขั้นตอนที่ 1 — GA4:** วาง Measurement ID ของคุณ (`G-XXXXXXXXXX`) แล้วกด Save จากนั้นเปิด GA4 → Realtime เพื่อดูตัวเองแบบเรียลไทม์
3. **ขั้นตอนที่ 2 — Blog:** อัปโหลดบทความ `.md` ที่สร้างโดย AI ระบบจะเผยแพร่ทันทีที่ `/blog`
4. **ขั้นตอนที่ 3 — SEO:** แก้ไข Title Tag, Meta Description, Schema และรูปภาพบทความพร้อม alt text
5. เปิดบทความแล้วศึกษาแถบ **SEO Inspector** — ตัวอย่างผล search, จำนวน heading, schema และมุมมอง `</>` raw-HTML

## 🛠 การพัฒนาบนเครื่อง (Local Development)

```bash
npm install
npm run dev
```

สร้างด้วย Next.js (App Router), TypeScript และ Tailwind CSS ข้อมูลทั้งหมดถูกเก็บไว้ใน `localStorage` — การรีเฟรชหน้าเว็บจะไม่ทำให้ข้อมูลหาย แต่การล้างข้อมูลเบราว์เซอร์จะรีเซ็ตดีโม
