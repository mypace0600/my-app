// /vide.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // 빌드 결과물이 dist 폴더에 생성되도록 설정
  },
});
