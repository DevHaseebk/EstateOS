// Next.js turns static image imports into { src, width, height } objects.
declare module '*.jpg' { const image: { src: string; width: number; height: number }; export default image; }
declare module '*.jpeg' { const image: { src: string; width: number; height: number }; export default image; }
declare module '*.webp' { const image: { src: string; width: number; height: number }; export default image; }
