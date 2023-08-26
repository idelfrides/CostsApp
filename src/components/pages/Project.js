import { v4 as uuidv4 } from 'uuid';
import styles from './Project.module.css';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../layout/Loading";
import Container from "../layout/Container";
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';


function Project(){
    const { id } = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [msg, setMsg] = useState()
    const [msgType, setMsgType] = useState()
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)
        })
        .catch((err) => console.log(err))
    }, [id])

    function toggleProjectFrom(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceFrom(){
        setShowServiceForm(!showServiceForm)
    }

    function removeService (servId, cost){
        setMsg('')

        const servicesUpdated = project.services.filter(
            (service) => service.id !== servId
        )
        
        const projectUpdated = project
        
        // update project properties
        projectUpdated.services = servicesUpdated.services
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)
        
        if (projectUpdated.cost < 0){
            // correct project current cost
            projectUpdated.cost = 0
        }

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMsg("Serviço Removido com sucesso!")
            setMsgType("success")
            console.log(data)
        })
        .catch((err) => console.log(err))
    }

    function createService(){
        setMsg('')

        // last service
        const lastService = project.services[project.services.length - 1]         
        lastService.id = uuidv4()
        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // maximum value validation
        if(newCost > parseFloat(project.budget)){
            setMsg('Orçamento ultrapassado. Verifique o valor do serviço!')
            setMsgType("error")
            project.services.pop()
            setShowServiceForm(false)
            return false
        }

        // update project cost 
        project.cost = newCost

        // update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            // setProject(data)
            setMsg("Serviço adicionado com sucesso")
            setMsgType('success')
            setShowServiceForm(false)
            console.log(data)
        })
        .catch((err) => console.log(err))
    }

    function editProject(project){
        setMsg('')
        if (project.budget < project.cost){
            setMsg("[WARNING]: Orçamento não pode ser MENOR do que custo do projeto!")
            setMsgType('error')
            return false
        }
        
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)  
            setShowProjectForm(false)
            setMsg('Projeto atualizado com sucesso!')
            setMsgType('success')
        })
        .catch((err) => console.log(err))
    }

    return (
        <>
            {project.name ? 
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {msg && <Message type={msgType} msg={msg} /> }
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectFrom}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>

                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total Orçamento:</span> R$ {project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> R$ {project.cost}
                                    </p>
                                </div>
                                ) : (
                                    <div className={styles.project_info}>
                                        <ProjectForm 
                                            handleSubmit={editProject}
                                            btnText="Concluir Edição"
                                            projectData={project} 
                                        />
                                    </div>
                                )
                            }
                        </div>

                        {/* --------------------- GENERAL SERVICES AREA --------------- */}

                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço</h2>
                            <button className={styles.btn} onClick={toggleServiceFrom}>
                                {!showServiceForm ? 'Adionar Serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                    
                        <h2>Serviços</h2>
                        <Container customClass='start'>
                            {services.length > 0 && 
                                services.map((oneService) => (
                                    <ServiceCard 
                                        id={oneService.id}
                                        name={oneService.name}
                                        cost={oneService.cost}
                                        description={oneService.description}
                                        key={oneService.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }

                            {services.length === 0 && 
                                <p>Não há serviços cadastrados.</p>
                            }
                        </Container>
                    </Container>
                </div> : (
                    <Loading />
                )
            }
        </>
    )
}

export default Project;