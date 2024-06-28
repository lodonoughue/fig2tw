import { useState } from "react";
import Button from "./Button";

function toggleMode() {
  document.documentElement.classList.toggle("mode__dark");
}

export default function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <div>
        <Button onClick={toggleMode}>Toggle mode</Button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p>Click on the Vite and React logos to learn more</p>
    </>
  );
}
