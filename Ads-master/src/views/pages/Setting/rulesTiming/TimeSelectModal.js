import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiOutlinePlus } from "react-icons/ai"
import { AiOutlineDelete, AiOutlineMinusCircle } from "react-icons/ai";
import { useForm, Controller, useFieldArray, get } from 'react-hook-form';
import { updateRuleTime } from '../../../../api-wrapper/time-wrapper/ApiRulesTime';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ruleTiming } from '../../../../utility/validator';
import { useDispatch } from "react-redux";
import { handleLoader } from '../../../../store/Action/loader';
function TimeSelectModal({ getTimings, setTimeModal, getTimesArr, editId }) {
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
        unregister,
        clearErrors
    } = useForm({
        resolver: yupResolver(ruleTiming)
    });

    const [mainRuleData, setMainRuleData] = useState([{}]);
    const [error, seterror] = useState();
    useEffect(() => {
        if (getTimesArr.length != 0) {
            setMainRuleData(getTimesArr)
        }
    }, [getTimesArr]);

    //remove field //
    const removeFieldHandler = index => {
        let arr = mainRuleData
        arr.splice(index, 1)
        setMainRuleData([...arr])
    }
    const addFieldHandler = () => {
        setMainRuleData([
            ...mainRuleData,
            {}
        ])
    }

    const mainRuleCheckHandler = (e, index) => {
        let arr = mainRuleData
        arr[index] = e.target.value
        setMainRuleData([...arr])
    }

    const submitHandler = (e) => {

        let flag = false;
        let errorData = {}
        const sendData = {
            times: mainRuleData
        }
        let mainArr = []

        sendData?.times?.map((el, index) => {
            let subArr = []
            if (Object.keys(el).length === 0) {
                flag = true;
                subArr.push({
                    Time: `Time is required`
                })
                mainArr[index] = 'Time is required'
            }
            else {
                let check = mainRuleData.filter((x, i) => i !== index && x === el);
                if (check.length > 0) {
                    flag = true;
                    subArr.push({
                        Time: "Duplicate element found"
                    });
                    mainArr[index] = "Duplicate value found";
                }
            }
            errorData = {
                ...errorData,
                mainRules: mainArr
            }

        })
        seterror(errorData)

        if (!flag) {
            dispatch(handleLoader(true))
            const sendData = {
                times: mainRuleData
            }
            updateRuleTime(editId, sendData)
                .then((res) => {
                    if (res.isSuccess) {
                        getTimings()
                        setTimeModal(false)
                        toast.success(res.message)
                    }
                    else {
                        toast.error(res.message)
                    }
                    dispatch(handleLoader(false))
                  
                }).catch((err) => {
                    setTimeModal(false)
                    toast.error(err)
                    dispatch(handleLoader(false))
                });
        }

    }

    const cancelHandler = () => {
        getTimings()
        setTimeModal(false)
    }
    return (
        <>
            <form className='rules_modal' >
                <div className="rule_field">
                    {mainRuleData && mainRuleData.map((element, index) => (
                        <div key={index}>

                            <div className="row mb-2 mt-2" >
                                <div className='col mb-2'>
                                    <label>Time</label><br />

                                    <input
                                        type="time"
                                        className="input_rule"
                                        id={`mainRuleData-${index}`}
                                        name={`mainRuleData-${index}`}
                                        onChange={(e) => mainRuleCheckHandler(e, index)}
                                        value={element}
                                    />

                                    <p className='error'>{error?.mainRules.length != 0 && error?.mainRules[index]}</p>
                                </div>
                                {
                                    index == 0 ?
                                        <div className="col-1 d-flex  align-items-center justify-content-center" onClick={() => addFieldHandler()}>
                                            <AiOutlinePlus size={22} className="icon" />
                                        </div>
                                        :
                                        <div className="col-1 d-flex  align-items-center justify-content-center" onClick={() => { removeFieldHandler(index) }}>
                                            <AiOutlineMinusCircle size={22} className="icon" />
                                        </div>
                                }
                            </div>
                        </div>
                    ))
                    }
                </div>
                <div className="col-12 d-flex justify-content-center pt-3">
                    <button className="btn cancel col-3 m-2" type="button" onClick={() => cancelHandler()}>Cancel</button>
                    <button className="btn save col-3 m-2" type="button" onClick={(e) => submitHandler(e)} >Apply</button>
                </div>
            </form>
        </>
    )
}

export default TimeSelectModal