import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const onLoginClick = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if (username && password) {
      const res = await axios.post("http://localhost:3005/api/login", {
        username: username,
        password: password,
      });

      alert(res.data.message);

      if (res.data.message === "Login successful.") {
        navigate("/landingpage", { state: { username } });
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Define the background image URL
  const backgroundImageUrl =
    "https://thumbs.dreamstime.com/b/empty-seats-subway-cinematic-lighting-white-neon-generative-ai-empty-seats-subway-cinematic-lighting-white-neon-291457257.jpg";

  // Inline style for backgro und image
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div className="vh-100 flex items-center justify-center" style={backgroundStyle}>
      <div className="pa4 bg-white-80 br3 shadow-5 mw6">
        <h1 className="f2">Login to Transit Database:</h1>
        <div className="mv2">
          <label className="db fw6 lh-copy f4" htmlFor="username">
            Enter Username:
          </label>
          <input
            className="pa2 input-reset ba bg-transparent hover-bg-black-20 w-100"
            type="text"
            ref={usernameRef}
          />
        </div>
        <div className="mv2">
          <label className="db fw6 lh-copy f4" htmlFor="password">
            Enter Password:
          </label>
          <input
            className="pa2 input-reset ba bg-transparent hover-bg-black-20 w-100"
            type="password"
            ref={passwordRef}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="f4 link dim ph3 pv2 mb2 dib white bg-dark-blue"
            onClick={onLoginClick}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
