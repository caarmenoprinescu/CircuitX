import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./pages/Root";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { EventsBrowse } from "./pages/EventsBrowse";
import { EventDetail } from "./pages/EventDetail";
import { TechAdvantage } from "./pages/TechAdvantage";
import { OrganizerDashboard } from "./pages/OrganizerDashboard";
import { EventForm } from "./pages/EventForm";
import { EventStatistics } from "./pages/EventStatistics";
import { MyGarage } from "./pages/MyGarage";
import { CarForm } from "./pages/CarForm";
import { MyProfile } from "./pages/MyProfile";
import { useApp } from "../context/AppContext";
import { JSX } from "react";
import { OrganizerEventDetail } from "./pages/OrganizerEventDetail";


function RequireAuth({ children, roles }: { children: JSX.Element, roles?: string[] }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "events", Component: EventsBrowse },
      { path: "events/:id", Component: EventDetail },
      {
        path: "tech-advantage/:eventId",
        element: <RequireAuth roles={["pilot"]}><TechAdvantage /></RequireAuth>
      },
      {
        path: "organizer/dashboard",
        element: <RequireAuth roles={["organizer"]}><OrganizerDashboard /></RequireAuth>
      },
      
      {
        path: "organizer/event/:id",
        element: <RequireAuth roles={["organizer"]}><OrganizerEventDetail /></RequireAuth>
      },
      {
        path: "organizer/event/new",
        element: <RequireAuth roles={["organizer"]}><EventForm /></RequireAuth>
      },
      {
        path: "organizer/event/:id/edit",
        element: <RequireAuth roles={["organizer"]}><EventForm /></RequireAuth>
      },
      {
        path: "organizer/event/:id/statistics",
        element: <RequireAuth roles={["organizer"]}><EventStatistics /></RequireAuth>
      },
      {
        path: "garage",
        element: <RequireAuth roles={["pilot"]}><MyGarage /></RequireAuth>
      },
      {
        path: "garage/add",
        element: <RequireAuth roles={["pilot"]}><CarForm /></RequireAuth>
      },
      {
        path: "garage/:id/edit",
        element: <RequireAuth roles={["pilot"]}><CarForm /></RequireAuth>
      },
      {
        path: "profile",
        element: <RequireAuth><MyProfile /></RequireAuth>
      },
    ],
  },
]);