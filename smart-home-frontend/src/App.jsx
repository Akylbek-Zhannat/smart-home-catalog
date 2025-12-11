import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Devices from "./pages/Devices.jsx";
import DeviceDetails from "./pages/DeviceDetails.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Analytics from "./pages/Analytics.jsx";
import Activity from "./pages/Activity.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import Events from "./pages/Events.jsx";
import Achievements from "./pages/Achievements.jsx";
import TopObjects from "./pages/TopObjects.jsx";
import Templates from "./pages/Templates.jsx";
import Items from "./pages/Items";
import Layout from "./components/Layout.jsx";
import MediaUploader from "./components/MediaUpload";
import MediaList from "./components/MediaList";
import MediaTest from "./pages/MediaTest.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="devices" element={<Devices />} />
          <Route path="devices/:id" element={<DeviceDetails />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity" element={<Activity />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="events" element={<Events />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="top-objects" element={<TopObjects />} />
          <Route path="templates" element={<Templates />} />
          <Route path="items" element={<Items />} />
          <Route path="media-test" element={<MediaTest />} />

        </Route>

        <Route path="*" element={<div className="p-8">Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
