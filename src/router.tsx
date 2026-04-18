import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Home";

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
