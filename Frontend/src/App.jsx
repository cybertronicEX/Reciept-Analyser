
import { Route, Routes } from "react-router-dom";
import './App.css';
import Home from './Components/Home';
import Navbar from './NavBar/NavBar';
import UploadReceipt from './Components/Receipt-Uploader/ReceiptUploader'
import ChargesTable from "./Components/Charges-Table/ChargesTable";
import DataVisualizationPage from "./Components/Data-Visualizer/DataVisualizer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar/><div className="container"><Home /></div></>} />
      <Route path="/ReceiptUploader" element={<><Navbar/><div className="container"><UploadReceipt /></div></>} />
      <Route path="/ChargesTable" element={<><Navbar/><div className="container"><ChargesTable /></div></>} />
      <Route path="/DataVisualizer" element={<><Navbar/><div className="container"><DataVisualizationPage /></div></>} />
    </Routes>
  );
}

export default App;
