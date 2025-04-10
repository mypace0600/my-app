// src/components/Header.jsx

import { useLocation } from "react-router-dom";
import HomeButton from "./HomeButton";
import LogOutButton from "./LogOutButton";
import HeartStatus from "./HeartStatus";

/**
 * props:
 * - onCreateClick (optional): "create" 버튼 클릭 시 호출할 콜백 (예: AdminQuiz에서 전달)
 * - showCreateButton (optional): 강제로 "create" 버튼 표시 여부 설정 가능
 * - isCreating (optional): 현재 create 모드인지 (버튼 텍스트 전환용)
 */

const CustomHeader = ({
  onCreateClick,
  showCreateButton = false,
  isCreating = false,
}) => {
  const location = useLocation();

  const isHome = location.pathname === "/home";
  const isAdmin = location.pathname.startsWith("/admin");

  const shouldShowCreate =
    showCreateButton || (isAdmin && typeof onCreateClick === "function");

  return (
    <header
      style={{
        padding: "10px 20px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>{!isHome && <HomeButton />}</div>

      <h2 style={{ margin: 0 }}>Wordle Quiz</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!isAdmin && <HeartStatus />}
        {isHome && <LogOutButton />}
        {shouldShowCreate && (
          <button className="btn btn-primary" onClick={onCreateClick}>
            {isCreating ? "cancel" : "create"}
          </button>
        )}
      </div>
    </header>
  );
};

export default CustomHeader;
