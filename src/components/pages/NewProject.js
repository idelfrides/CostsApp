import { useNavigate } from "react-router-dom";
import styles from './NewProject.module.css';
import ProjectFrom from '../project/ProjectForm.js';


function NewProject(){
    // const history = useHistory()
    const navigate = useNavigate();

    function createPost(project){
        // initialize cost and services

        project.cost = 0
        project.services = []

        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            // redirect to projects page
            // navigate("/projects")
            navigate("/projects", {msg: "Projeto criado com sucesso!"})
        })
        .catch((err) => console.log(err))
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Create Project</h1>
            <p>Create a project, so you can add new features on it later.</p>
            <ProjectFrom 
                handleSubmit={createPost} 
                btnText="Criar Projeto" 
            />
        </div>
    )
}

export default NewProject;