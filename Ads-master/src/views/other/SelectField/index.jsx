import React from 'react';
import Select from 'react-select'

const SelectField=(props)=>{
    const {handleChange,options,name,value,label,isMulti,style,height}= props

    return(
         <Select
            id="floatingSelectGrid"
            name={name}
            options={options}
            isMulti={isMulti}
            isClearable={true}
            isDisabled={false}
            isLoading={false}
            defaultValue={value}
            value={value}
            onChange={handleChange}
   
            placeholder={label}
            theme={(theme) => ({
                ...theme,
                borderRadius: 5,
                colors: {
                  ...theme.colors,
                  primary25: '#3f80ea',
                  primary: '#3f80ea',
                },
              })}
        />
    )
}
export default SelectField