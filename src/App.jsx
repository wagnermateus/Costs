import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Company from "./components/pages/Company";
import Contact from "./components/pages/Contact";
import NewProject from "./components/pages/NewProject";
import Projects from "./components/pages/Projects";
import Project from "./components/pages/Project";
import Container from "./components/layout/Container";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
function App() {
  return (
    <>
      <Navbar />
      <Container customClass="min-height">
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
          </Route>
          <Route>
            <Route path="/company" element={<Company />} />
          </Route>
          <Route>
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route>
            <Route path="/newproject" element={<NewProject />} />
          </Route>
          <Route>
            <Route path="/projects" element={<Projects />} />
          </Route>
          <Route>
            <Route path="/project/:id" element={<Project />} />
          </Route>
        </Routes>
      </Container>
      <Footer />
    </>
  );
}
export default App;
