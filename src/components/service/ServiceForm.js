import styles from '../project/ProjectForm.module.css';
import { useState } from 'react';
import Input from '../form/Input';
import SubmitButton from '../form/SubmitButton';


function ServiceForm({ handleSubmit, btnText, projectData }){

    const [service, setService] = useState({})

    function submit (e){
        e.preventDefault()
        projectData.services.push(service)
        handleSubmit(projectData)
        console.log(projectData)
    }

    // the parameter 'e' mean event
    function handleChange (e) {
        setService({...service, [e.target.name]: e.target.value})
    }

    return (
            <form onSubmit={submit} className={styles.form}>
                <Input 
                    type='text' name="name"
                    text="Nome do serviço"
                    placeholder="Insira o nome do serviço"
                    handleOnChange={handleChange} 
                />
                <Input 
                    type='number' name="cost"
                    text="Custo do serviço"
                    placeholder="Insira o valor total do serviço"
                    handleOnChange={handleChange} 
                />
                <Input 
                    type='text' name="description"
                    text="Descrição do serviço"
                    placeholder="Insira a descrição do serviço"
                    handleOnChange={handleChange} 
                />
                <SubmitButton text={btnText} />
            </form>
    )
}

export default ServiceForm;