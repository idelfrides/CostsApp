import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Message from "../layout/Message";
import Container from "../layout/Container";
import styles from './Projects.module.css';
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";
import Loading from "../layout/Loading";


function Projects(){
    const [projects, setProjects] = useState([])
    const [projectMessage, setProjectMessage] = useState('')
    const [removeLoading, setRemoveLoading] = useState(false)
    
    const location = useLocation()
    let message = ''

    if(location.state){
        message = location.state.msg
        console.log(location)
    }

    // console.log('I AM MR. OBAMA INIT --------------')
    // console.log(location.state)
    // console.log(location.hash)
    // console.log(location.search)
    // console.log(location.pathname)
    // console.log(location.pathname.replace('/projects', '').trim())
    // console.log('I AM MR. OBAMA END -----------------')

    useEffect(() => {
        setTimeout(() => {
            fetch("http://localhost:5000/projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
            })
            .then((resp) =>  resp.json())
            .then((data) => {
                console.log(data)
                setProjects(data)
                setRemoveLoading(true)
            })
            .catch((err) => console.log(err))
        }, 30)
    }, [])

    function removeProject(deleteId) {
        fetch(`http://localhost:5000/projects/${deleteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((resp) =>  resp.json())
        .then(() => {
            setProjects(projects.filter((project) => project.id !== deleteId ))
            setProjectMessage('Projeto removido com sucesso!')
        })
        .catch((err) => console.log(err))   
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>My Projects</h1>
                <LinkButton to='/newproject' text='Novo Projeto' />
            </div>
            
            {message && <Message msg={message} type="success" />}
            {projectMessage && <Message msg={projectMessage} type="success" />}
            
            <Container customClass='start'>
                {projects.length > 0 && 
                    projects.map((proj) => <ProjectCard 
                        id={proj.id} 
                        name={proj.name} 
                        budget={proj.budget} 
                        category={proj.category.name}
                        key={proj.id}
                        handleRemove={removeProject}
                    />)
                }
                {!removeLoading && <Loading />}
                {removeLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    )
}

export default Projects;