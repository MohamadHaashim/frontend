import React from 'react';
import { APIcreateTime ,APIupdateTime} from '../../../../api-wrapper/scheduler-wrapper/ApiTime';
import { useDispatch, } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleLoader } from '../../../../store/Action/loader';
import { addTimeSchema } from '../../../../utility/validator';
import { useEffect } from 'react';

function AddTime({ setTimeModal, scheduleId, formData, setFormData, addFlag, setAddFlag, getTime, timeId }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control
    } = useForm({
        resolver: yupResolver(addTimeSchema)
    });
    const dispatch = useDispatch()

    const mainLabel = [
        { value: 'Sunday', label: 'Sunday' },
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
    ];

    const submitHandler = data => {
        dispatch(handleLoader(true))
        let sendData = {
            dayName: data.dayName,
            startTime: data.startTime,
            endTime: data.endTime,
        }
        if (timeId) {
            APIupdateTime(sendData,scheduleId,timeId)
                .then((res) => {
                    if (res.isSuccess) {
                        dispatch(handleLoader(false))
                        toast.success(res.message)
                        getTime()
                        setTimeModal(false)
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
        else {
            APIcreateTime(sendData, scheduleId)
                .then((res) => {
                    if (res.isSuccess) {
                        dispatch(handleLoader(false))
                        toast.success(res.message)
                        getTime()
                        setTimeModal(false)
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

    }

    useEffect(() => {
        if (formData) {
            reset(formData)
        }
        if (addFlag) {
            setValue('dayName', null)
            setValue('startTime', null)
            setValue('endTime', null)
            setAddFlag(false)
        }
    }, [formData]);

    


    return (
        <form className='mb-4' onSubmit={handleSubmit(submitHandler)}  >
            <div className='col-10 m-auto mt-2'>
                <div className='col mb-2'>
                    <label>Day Of Week</label><br />
                    <Controller
                        control={control}
                        name="dayName"
                        {...register("dayName")}
                        render={({ field }) => (
                            <select className="form_rule" {...field}>
                                <option hidden>Select</option>
                                {mainLabel.map((el, i) => (
                                    <option value={el.value} key={i}>
                                        {el.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {errors.dayName && <p className="error">{errors.dayName.message}</p>}
                </div>

                <div className='col mb-2'>
                    <label>Start Time</label><br />
                    <Controller
                        control={control}
                        {...register("startTime")}
                        render={({ field }) => (
                            <input
                                type="time"
                                className='input_rule'
                                {...field}
                            />
                        )}
                    />
                    {errors.startTime && <p className="error">{errors.startTime.message}</p>}
                </div>

                <div className='col mb-2'>
                    <label>End Time</label><br />
                    <Controller
                        control={control}
                        {...register("endTime")}
                        render={({ field }) => (
                            <input
                                type="time"
                                className='input_rule'
                                {...field}
                            />
                        )}
                    />
                    {errors.endTime && <p className="error">{errors.endTime.message}</p>}
                </div>

            </div>
            <div className="col-12 d-flex justify-content-center pt-3">
                <button className="btn cancel col-3 m-2" type="button" onClick={() => setTimeModal(false)}>Cancel</button>
                <button className="btn save col-3 m-2" type="submit">Apply</button>
            </div>
        </form>
    )
}

export default AddTime