import { Routes, Route } from 'react-router-dom';
import RootLayout from './routes/RootLayout';
import Home from './routes/HomePage';
import Analysis from './routes/AnalysisPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="analysis/:courseId" element={<Analysis />} />
      </Route>
    </Routes>
  );
}
