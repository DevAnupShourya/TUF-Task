import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import Navigation from './components/Navigation';
import Entries from './pages/Entries';
import Upload from './pages/Upload';


export default function App() {
  return (
    <BrowserRouter>
      <main>
        <Navigation />
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/entries" element={<Entries />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
