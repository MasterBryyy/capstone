import './App.css';
import Landingpage from './pages/landingpage';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import ManageAccount from './pages/ManageAccount';
function App() {
  const AppLayout = () => (
    <>
      <Navbar />
      <Outlet />
    </>
  );

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Landingpage />} />

          {/* Use <Route> directly without nested <Routes> */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/manage" element={<ManageAccount />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
