import React, { useEffect, useState } from "react";
import { useCountStore } from "../stores/count";
// import styled from "styled-components";
import { styled } from "styled-components";
import { Link } from "react-router-dom";

const SCxHeader = styled.div`
  width: 100%;
  height: 100px;
  background-color: #000;
  color: #fff;
`;
const SCxHeaderButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  border-radius: 8px;
`;

export default function Header() {
  const [c, setC] = useState(0);
  const count = useCountStore((state) => state.count);
  const increment = useCountStore((state) => state.increment);
  const handleClick = () => {
    console.log("click");
    increment();
  };

  useEffect(() => {
    console.log("Header useEffect");
  });
  return (
    <div>
      <SCxHeader>
        c---{c}
        <button onClick={() => setC(c + 1)}>+1</button>
        <br />
        Header---{count}
        <SCxHeaderButton onClick={handleClick}>+1</SCxHeaderButton>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </SCxHeader>
    </div>
  );
}
