import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from "../layout/Message";
import styles from "./Projects.module.css";
import LinkButton from "../layout/LinkButton";
import Container from "../layout/Container";
import ProjectCard from "../Project/ProjectCard";
import Loading from "../layout/Loading";
export default function Project() {
  const location = useLocation();
  let message = "";
  if (location.state) {
    message = location.state.message;
  }
  //Loading component state
  const [removeLoading, setRemoveLoading] = useState(false);
  //Getting projects data from database
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    //SetTimeout to showing loading component working
    setTimeout(() => {
      fetch("http://localhost:5000/projects", {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setProjects(data);
          setRemoveLoading(true);
        })
        .catch((err) => console.log(err));
    }, 300);
  }, []);
  //Delete Projects
  const [projectMessage, setProjectMessage] = useState("");
  function removeProject(id) {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => resp.json())
      .then((data) => {
        setProjects(projects.filter((project) => project.id !== id));
        setProjectMessage("Projecto excluído com sucesso");
      })
      .catch(err => console.log(err));
  }
  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projectos</h1>
        <LinkButton to="/newProject" text="Criar Projecto" />
      </div>
      {message && <Message msg={message} type="success" />}
      {projectMessage && <Message msg={projectMessage} type="success" />}
      <Container customClass="start"> 
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard key={project.id}
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project.category.name}
              handleRemove={removeProject}           
            />
            
          ))}
        {!removeLoading && <Loading />}
        {!removeLoading && projects.length <= 0 && (
          <p>Não há projectos cadastrados!</p>
        )}
      </Container>
    </div>
  );
}
