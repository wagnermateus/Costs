import styles from "./Project.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectForm from "../Project/ProjectForm";
import Container from "../layout/Container";
import Message from "../layout/Message";
import Loading from "../layout/Loading";
import ServiceForm from "../services/ServiceForm";
import ServiceCard from "../services/ServiceCard";
import { parse, v4 as uuidv4 } from "uuid";
export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setServices(data.services);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id]);
  function toogleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }
  function toogleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }
  function updateProject(project) {
    setMessage("");
    if (project.budget < project.cost) {
      setMessage("O orçamento não pode ser menor que o custo do projecto");
      setMessageType("error");
      return false;
    }
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setMessage("Projecto actualizado com sucesso");
        setMessageType("success");
        setShowProjectForm(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function createService(project) {
    //Reset msg status
    setMessage("");
    //Get last service
    const lastService = project.services[project.services.length - 1];

    lastService.id = uuidv4();
    const lastServiceCost = lastService.cost;
    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

    //max value validation
    if (newCost > parseFloat(project.budget)) {
      setMessage("Orçamento ultrapassado, verifique o valor do serviço");
      setMessageType("error");
      project.services.pop();
      return false;
    }
    // add service cost to project total cost
    project.cost = newCost;
    //update project
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setMessage("Serviço adicionado com sucesso");
        setMessageType("success");
        setShowServiceForm(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function removeService(id, cost) {
    const serviceUpdated = project.services.filter(
      (service) => service.id !== id
    )
    const projectUpdated = project;
    projectUpdated.services = serviceUpdated;
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);
    fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdated),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(projectUpdated);
        setServices(serviceUpdated);
        setMessage("Serviço removido com sucesso");
        setMessageType("success");

      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            <div className={styles.details_container}>
              {message && <Message msg={message} type={messageType} />}
              <h1>Projecto: {project.name}</h1>
              <button className={styles.btn} onClick={toogleProjectForm}>
                {!showProjectForm ? "Editar projecto" : "Fechar"}
              </button>
              {!showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria:</span>
                    {project.category.name}
                  </p>
                  <p>
                    <span>Total Orçamento:</span>
                    {project.budget}
                  </p>
                  <p>
                    <span>Total Gasto:</span>
                    {project.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={updateProject}
                    btnText={"Concluir"}
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button className={styles.btn} onClick={toogleServiceForm}>
                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar serviço"
                    projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 &&
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))}
              {services.length === 0 && <p>Não há serviços cadastrados</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
