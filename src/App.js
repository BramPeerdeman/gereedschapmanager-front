import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AddGereedschap from './gereedschap/AddGereedschap';
import EditGereedschap from './gereedschap/EditGereedschap';
import ViewGereedschap from './gereedschap/ViewGereedschap';

function App() {
  return (
    <div className="App">
      <Router>
      <Navbar/>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/addgereedschap" element={<AddGereedschap />} />
        <Route exact path="/editgereedschap/:id" element={<EditGereedschap />} />
        <Route exact path="/viewgereedschap/:id" element={<ViewGereedschap />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
