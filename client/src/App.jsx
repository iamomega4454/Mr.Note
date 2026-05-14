import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FolderView from "./pages/FolderView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/folders/:folderId" element={<FolderView />} />
    </Routes>
  );
}
