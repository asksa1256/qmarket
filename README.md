# Q-Market

## 페이지 구조

```
src/app/
├── (core) # 핵심 기능 그룹
│ ├── item/
│ │ ├── [item_id]/
│ │ │ └── page.tsx # 아이템 상세 (SSG + Revalidate)
│ │ └── layout.tsx
│ ├── users/
│ │ ├── [user_id]/
│ │ └──── page.tsx # 유저 상세 (SSR)
│ ├── mypage/
│ │ └── page.tsx # 내 아이템/찜 목록 (SSR, Auth)
├── (static) # 부가/정적 기능 그룹
│ ├── faq/
│ │ └── page.tsx # FAQ (SSG)
│ ├── notice/
│ │ └── page.tsx # 공지사항 (SSG)
├── layout.tsx # 메인 레이아웃 (Nav, Header, Footer)
└── page.tsx # 홈 화면
```

## DB 세팅

```
- Supabase DB: 아이템 판매/구매 현황, 아이템 등록 요청 목록, 거래 내역, 유저 데이터 등
- Supabase Storage: 아이템 미리보기 이미지
- Redis Upstash: 일일 아이템 등록 횟수, 인기 검색어 순위
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
