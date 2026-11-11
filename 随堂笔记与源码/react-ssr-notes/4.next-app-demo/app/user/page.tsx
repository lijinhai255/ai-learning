"use client";

import { useEffect } from "react";

// import { useEffect } from "react";

export default function User() {
  useEffect(() => {
    console.log(123);
  }, []);
  return (
    <div>
      <h1>user</h1>
      <canvas id="canvas"></canvas>
    </div>
  );
}
