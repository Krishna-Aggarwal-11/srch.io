import { BrowserRouter , Routes, Route} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
function App() {
  

  return (
    <>
      <BrowserRouter>
      
      <Routes>
        <Route path="/"  element={<Home/>}/>
        <Route path="/search" element={<Search/>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
