import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "css-doodle";
import HeartAnimation from "./Heart";
import Player from "./Player.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <>
      <Player />
      <HeartAnimation />
    </>
  </React.StrictMode>
);
