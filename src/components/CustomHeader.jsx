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
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      {/* 왼쪽 영역 */}
      <div
        style={{
          minWidth: "120px", // 양쪽 고정 너비
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {!isHome && <HomeButton />}
        {isHome && <LogOutButton />}
      </div>

      {/* 가운데 타이틀 (absolute 중앙 정렬) */}
      <h2
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        Wordle Quiz
      </h2>

      {/* 오른쪽 영역 */}
      <div
        style={{
          minWidth: "120px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {!isAdmin && <HeartStatus />}
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
