import React from 'react';
import { APIcreateSchedule, APIupdateSchedule } from '../../../../api-wrapper/scheduler-wrapper/ApiSchedule';
import { useDispatch, } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleLoader } from '../../../../store/Action/loader';
import { addScheduleSchema } from '../../../../utility/validator';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
function AddScheduler({ setAddSchedulerModal, selectedCampagin, editId, editData, getSchedule, addFlag, setAddFlag }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue
    } = useForm({
        resolver: yupResolver(addScheduleSchema)
    });
    const dispatch = useDispatch()

    // cancel //
    const cancelHandler = () => {
        setAddSchedulerModal(false)
    }


    // submit data  //
    const submitHandler = (data) => {

        dispatch(handleLoader(true))
        let sendData = {
            scheduleName: data.scheduleName,
            profileId: selectedCampagin.profileId,
            countryCode: selectedCampagin.countryCode,
            timezone: selectedCampagin.timezone
        }
        if (editId) {
            APIupdateSchedule(editId, sendData)
                .then((res) => {
                    if (res.isSuccess) {
                        dispatch(handleLoader(false))
                        toast.success(res.message)
                        getSchedule()
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
            APIcreateSchedule(sendData)
                .then((res) => {
                    if (res.isSuccess) {
                        dispatch(handleLoader(false))
                        toast.success(res.message)
                        getSchedule()
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

        setAddSchedulerModal(false)
    }
    useEffect(() => {

        if (editData) {
            reset(editData)
        }
        if (addFlag) {
            setValue('scheduleName', null)
            setAddFlag(false)
        }
    }, [editData]);

    return (
        <>
            <form className='mb-4 mt-2' onSubmit={handleSubmit(submitHandler)}>
                <div className='col-10 m-auto mt-2'>
                    <div className='col mb-2'>
                        <label>Schedule Name</label><br />
                       
                        <input type="text" {...register("scheduleName")} className='input_rule' placeholder='Enter Schedule name' />
                        {errors.scheduleName && <p className="error">{errors.scheduleName.message}</p>}
                    </div>

                </div>
                <div className="col-12 d-flex justify-content-center pt-3">
                    <button className="btn cancel col-3 m-2" type="button" onClick={() => cancelHandler()} >Cancel</button>
                    <button className="btn save col-3 m-2" type="submit">Apply</button>
                </div>
            </form>
        </>
    )
}

export default AddScheduler;
