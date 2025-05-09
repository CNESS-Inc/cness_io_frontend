import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CnessFinalVersion } from "./screens/CnessFinalVersion";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <CnessFinalVersion />
  </StrictMode>,
);
