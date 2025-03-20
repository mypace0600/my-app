const Splash = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="splash-container">
      <h1>Welcome to Wordle</h1>
      <button onClick={handleGoogleLogin} className="login-button">
        Login with Google
      </button>
    </div>
  );
};

export default Splash;
