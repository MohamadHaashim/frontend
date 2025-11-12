import React, { useState, useEffect } from 'react'
import { createCampaignTime, getCampaignTimeById } from '../../../../api-wrapper/time-wrapper/ApiCampaignTime';
import moment from 'moment';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { format, parse } from 'date-fns';
import { setHours, setMinutes } from 'date-fns';
import { updateCampaignTimeById } from "../../../../api-wrapper/time-wrapper/ApiCampaignTime";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from 'react-redux';
function TimeSelectModal(props) {
    const { setTimeModal, fromTime, setFromTime, toTime, setToTime, selectedCampagin, timeZoneCountry, editId, getTimings } = props

    const [error, setError] = useState({ from: "", to: "" })
    const dispatch = useDispatch()


    const selector = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' },
    ];

    // create and update
    const submitHandler = (e) => {
        e.preventDefault()
        var flag = false;
        let errorData = {}
        if (!fromTime) {
            errorData = { ...errorData, from: "From time is required." }
        }
        if (!toTime) {
            errorData = { ...errorData, to: "To time is required." }
        }
        if (fromTime && toTime) {
            if (fromTime < toTime) {
                flag = true
            } else {
                errorData = { ...errorData, to: "Please select proper time range." }
            }
        }
        setError(errorData)
        if (flag) {
            if (editId) {
                dispatch(handleLoader(true));
                let data = {
                    fromTime: moment(fromTime, 'hh:mm A').format('HH:mm'),
                    toTime: moment(toTime, 'hh:mm A').format("HH:mm"),
                };

                updateCampaignTimeById(editId, data)
                    .then((res) => {
                        if (res.isSuccess) {
                            dispatch(handleLoader(false));
                            toast.success(res.message);

                        } else {
                            dispatch(handleLoader(false));
                            toast.error(res.message);
                        }
                        getTimings()
                        setTimeModal(false)

                    })
                    .catch((err) => {
                        dispatch(handleLoader(false));
                        toast.error(err);
                        setTimeModal(false)
                    });


            }
            else {

                let sendData = {
                    profileId: selectedCampagin.profileId,
                    fromTime: moment(fromTime, 'hh:mm A').format('HH:mm'),
                    toTime: moment(toTime, 'hh:mm A').format("HH:mm"),
                    countryCode: selectedCampagin.countryCode,
                    timezone: timeZoneCountry
                }
                createCampaignTime(sendData)
                    .then((res) => {
                        if (res.isSuccess) {
                            toast.success(res.message)
                        } else {
                            toast.error(res.message)
                        }
                        getTimings()
                        setTimeModal(false)
                    }).catch((err) => {
                        toast.error(err)

                        setTimeModal(false)
                    });
            }

        }
    }

    return (
        <>
            <form className='mb-4' >
                <div className='col-10 m-auto mt-2'>
                    <div className='col mb-2'>
                        <label>From Time</label><br />
                        <input type="time" className='input_rule' id="appt" name="appt"
                            value={fromTime}
                            onChange={(e) => { setFromTime(e.target.value) }} />
                        <p className="error">
                            {error?.from && error.from}
                        </p>
                    </div>
                    <div className='col mb-2'>
                        <label>To Time</label><br />
                        <input type="time" className='input_rule' id="appt" name="appt"
                            value={toTime}
                            onChange={(e) => setToTime(e.target.value)} />
                        <p className="error">
                            {error?.to && error.to}
                        </p>
                    </div>
                   
                </div>
                <div className="col-12 d-flex justify-content-center pt-3">
                    <button className="btn cancel col-3 m-2" type="button" onClick={() => setTimeModal(false)}>Cancel</button>
                    <button className="btn save col-3 m-2" type="button" onClick={(e) => submitHandler(e)}>Apply</button>
                </div>
            </form>
        </>
    )
}

export default TimeSelectModal