import React from 'react';
import Title from '../../layout/Title/title';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePasswordSchema } from '../../../utility/validator';
import { changePwdApi } from '../../../api-wrapper/rule-wrapper/ApiAuth';
import { handleLoader } from '../../../store/Action/loader';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiTwotoneEye ,AiFillEyeInvisible} from "react-icons/ai";
import { useState } from 'react';
function ChangePassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(changePasswordSchema)
    });
    const dispatch = useDispatch()

    const [eyeIcon, setEyeIcons] = useState({
        oldPwd:false,
        newPwd:false,
        confirmPwd:false
    });

    const submitHandler = (data) => {
        dispatch(handleLoader(true))
        changePwdApi(data)
            .then((res) => {
                if (res.isSuccess) {
                    dispatch(handleLoader(false))
                    toast.success(res.message)
                    
                }
                else {
    
                    dispatch(handleLoader(false))
                    toast.error(res.message)

                }
            }).catch((err) => {
                dispatch(handleLoader(false))
                toast.error("Something went wrong, please try again")

            });
    }



      
    return (
        <div className='main-container change_password'>
            <Title name={'Change Password'} />
            <form className='form-block' onSubmit={handleSubmit(submitHandler)} style={{width:'60%'}}>

                <div className='form_group'>
                    <label>Old Password:</label>
                    <input type={eyeIcon.oldPwd ? 'text' :'password'} {...register("oldPassword")} />
                    {errors.oldPassword && <p className="error">{errors.oldPassword.message}</p>}
                    {
                        eyeIcon.oldPwd ? 
                        <AiTwotoneEye onClick={()=>setEyeIcons({...eyeIcon,oldPwd:false})}/>
                        :
                        <AiFillEyeInvisible onClick={()=>setEyeIcons({...eyeIcon,oldPwd:true})}/>
                    }
               
                </div>
          

                <div className='form_group'>
                    <label>New Password:</label>
                    <input type={eyeIcon.newPwd ? 'text' :'password'} {...register("newPassword")} />
                    {errors.newPassword && <p className="error">{errors.newPassword.message}</p>}
                    {
                        eyeIcon.newPwd ? 
                        <AiTwotoneEye onClick={()=>setEyeIcons({...eyeIcon,newPwd:false})}/>
                        :
                        <AiFillEyeInvisible onClick={()=>setEyeIcons({...eyeIcon,newPwd:true})}/>
                    }
                </div>

                <div className='form_group'>
                    <label>Confirm Password:</label>
                    <input type={eyeIcon.confirmPwd ? 'text' :'password'} {...register("confirmNewPassword")} />
                    {errors.confirmNewPassword && <p className="error">{errors.confirmNewPassword.message}</p>}
                    {
                        eyeIcon.confirmPwd ? 
                        <AiTwotoneEye onClick={()=>setEyeIcons({...eyeIcon,confirmPwd:false})}/>
                        :
                        <AiFillEyeInvisible onClick={()=>setEyeIcons({...eyeIcon,confirmPwd:true})}/>
                    }
                </div>

                <div className="col-12 d-flex justify-content-center pt-3">
                    <button className="btn cancel col-3 m-2" type="button" >Cancel</button>
                    <button className="btn save col-3 m-2" type="submit" >Apply</button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword