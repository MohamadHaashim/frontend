import React from "react"
const Input = (props) => {
    const {Icon,handleChange,value,name,placeholder,type,label, min, max, disabled}=props
    return(
        <div className="form-floating ">
            <input type={type} className="form-control" name={name} placeholder={placeholder} value={value} max={max} min={min} disabled={disabled}
                onChange={handleChange} />
            <label style={{color:'rgb(118, 118, 118)'}} >{label}</label>
            {
                Icon && 
                <div className='input_icon'><Icon style={{color:'black'}}/></div>
            }
        </div>
    )
}
export default Input