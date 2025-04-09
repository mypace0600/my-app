// /main.jsx

import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <App /> // StrictMode를 제거한 상태로 App 컴포넌트만 렌더링
);
