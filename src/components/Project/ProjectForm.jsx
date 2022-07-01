import { useState, useEffect } from "react";
import styles from "./ProjectForm.module.css";
import Input from "../form/Input";
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";
export default function ProjectForm({ handleSubmit, btnText, projectData }) {
  const [project, setProject] = useState(projectData || {});
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/categories", {
      method: "GET",
      headers: { "content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //Send data from project
  const submit = (e) => {
    e.preventDefault();
    handleSubmit(project);
  };
  //Getting input names/Project name and budget
  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value });
  }
  //Select project category
  function handleCategory(e) {
    setProject({
      ...project,
      category: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    });
  }
  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        name="name"
        text="Insira o nome do projecto"
        placeholder="Insira o nome do projecto"
        handleOnChange={handleChange}
        value= {project.name ? project.name: ''}
      />
      <Input
        type="number"
        name="budget"
        text="Orçamento do projecto"
        placeholder="Insira o orçamento total"
        handleOnChange={handleChange}
        value= {project.budget ? project.budget: ''}
      />
      <Select
        name="category_id"
        text="Insira a categoria"
        options={categories}
        handleOnChange={handleCategory}
        value= {project.category ? project.category.id: ''}
      /> 
      <SubmitButton text={btnText} />
    </form>
  );
}
