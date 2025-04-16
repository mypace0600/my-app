// /components/AdminUser.jsx

import { useState, useEffect } from "react";
import { getUserList } from "../services/api";
import "../css/base.css";
import "../css/adminUser.css";
import CustomHeader from "./CustomHeader";

function AdminUser() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchUsers(page, searchKeyword);
  }, [page]);

  const fetchUsers = async (pageToLoad = page, keyword = searchKeyword) => {
    setLoading(true);
    try {
      const { content, totalPages } = await getUserList(
        pageToLoad,
        10,
        keyword
      );
      setUsers(content || []);
      console.log(content);
      setTotalPages(totalPages || 0);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      alert("Failed to load user list");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPage(0);
    fetchUsers(0, searchKeyword);
  };

  return (
    <div className="user-container">
      <CustomHeader />

      <h2>User Management</h2>

      <div className="search-bar">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search by email, nickname, etc."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Type</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id}>
                <td>{page * 10 + idx + 1}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-users">
          {searchKeyword ? "No users found" : "No users available"}
        </p>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i)
          .filter((p) => {
            if (totalPages <= 5) return true;
            if (p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 2)
              return true;
            return false;
          })
          .map((p, i, arr) => {
            const prev = arr[i - 1];
            const showDots = i > 0 && p - prev > 1;

            return (
              <span key={`page-wrapper-${p}`}>
                {showDots && (
                  <span key={`dots-${p}`} className="dots">
                    ...
                  </span>
                )}
                <button
                  key={`page-${p}`}
                  className={`btn-pagination-number ${
                    p === page ? "active" : ""
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p + 1}
                </button>
              </span>
            );
          })}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminUser;
