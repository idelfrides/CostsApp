import styles from './Select.module.css';

function Select({ text, name, options, handleOnChange, value }){
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <select 
                name={name} id={name} 
                value={value || ''} 
                onChange={handleOnChange}
                >
                <option>Selecione uma opção</option>
                {options?.map((myoption) => (
                    <option value={myoption.id} key={myoption.id}>
                        {myoption.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

// value used in backend
// key used for react as an unique item

export default Select;