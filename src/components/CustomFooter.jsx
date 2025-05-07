import { useEffect } from "react";
/**
 * CustomFooter 컴포넌트
 * - 홈에서는 약관 버튼 표시
 * - 관리자 페이지에서는 관리자 텍스트 표시
 * - 그 외에는 간단한 텍스트
 */
const CustomFooter = () => {
  useEffect(() => {
    // AdFit 스크립트가 이미 로드되어 있지 않다면 추가
    if (
      !document.querySelector(
        "script[src='//t1.daumcdn.net/kas/static/ba.min.js']"
      )
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      document.body.appendChild(script);
    }
  }, []);
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "10px 20px",
        backgroundColor: "#eaeaea",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90px",
        borderTop: "1px solid #ddd",
        zIndex: 1000, // 다른 요소에 가려지지 않게
      }}
    >
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit="DAN-UTk7TIpbeWkgid1p"
        data-ad-width="728"
        data-ad-height="90"
      ></ins>
    </footer>
  );
};

export default CustomFooter;
