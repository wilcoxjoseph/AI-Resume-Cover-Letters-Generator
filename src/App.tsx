import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Document from "./Document/doc";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/document" element={<Document />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
