import * as Yup from 'yup'

export const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
        .required('Old Password is required')
        .nullable(),

    newPassword: Yup.string()
        .required('New Password is required')
        .nullable(),

    confirmNewPassword: Yup.string()
        .required('Confirm Password is required')
        .nullable(),
})


export const ruleTiming = Yup.object().shape({
    question_details: Yup.array()
        .of(
            Yup.object().shape({
                qn_details: Yup.string().required("Question Synonym is Required")
            })

        ),


});

export const addScheduleSchema = Yup.object().shape({
    scheduleName: Yup.string()
        .required('Schedule Name is required')

})


export const addTimeSchema = Yup.object().shape({
    dayName: Yup.mixed().required('Please select a day'),
    startTime: Yup.string().required('Please select a start time'),
    endTime: Yup.string().required('Please select a end time')
})
