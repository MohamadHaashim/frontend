import React, { useState } from 'react'
    const [buttonQuicktxt1, setButtonQuicktxt1] = useState('');
    const [buttonPhonetxt1, setButtonPhonetxt1] = useState('');
    const [buttonPhoneNotxt1, setButtonPhoneNotxt1] = useState('91');
    const [buttonCopycodetxt1, setButtonCopycodetxt1] = useState('');
    const [buttonurltxt1, setButtonurltxt1] = useState('');
    const [buttonwebUrltxt1, setButtonwebUrltxt1] = useState('');
    const [buttondynamicwebUrltxt1, setButtondynamicwebUrltxt1] = useState('');
    const [buttonexampleUrltxt1, setButtonexampleUrltxt1] = useState('');
    const [buttondynamicUrltxt1, setButtondynamicUrltxt1] = useState('');
    const [buttonQuickOpt1, setButtonQuickopt1] = useState(false);
    const [buttonPhoneOpt1, setButtonPhoneopt1] = useState(false);
    const [buttoncopyOpt1, setButtoncopyopt1] = useState(false);
    const [buttonurlOpt1, setButtonurlopt1] = useState(false);
    const [buttondynamicurlOpt1, setButtondynamicurlopt1] = useState(false);
    const [quickbtn1, setquickbtn1] = useState('None')
    const [phoenobtn1, setphoenobtn1] = useState('None')
    const [copybtn1, setcopybtn1] = useState('None')
    const [urlbtn1, seturlbtn1] = useState('None')
    const [dynamicurlbtn1, setdynamicurlbtn1] = useState('None')
    const [buttonActive1, setbuttonActive1] = useState(false);

const handleQuickButtonOpt1 = () => {
        setButtonQuickopt1(true)
        setbuttonActive1(true)
        setquickbtn1("QUICK_REPLY")
    }
    const handlePhoneButtonOpt1 = () => {
        setButtonPhoneopt1(true)
        setbuttonActive1(true)
        setphoenobtn1("PHONE_NUMBER")
    }
    const handleCopycodeButtonOpt1 = () => {
        setButtoncopyopt1(true)
        setbuttonActive1(true)
        setcopybtn1("COPY_CODE")
    }
    const handleurlButtonOpt1 = () => {
        setButtonurlopt1(true)
        setbuttonActive1(true)
        seturlbtn1("URL")
    }
    const handleDynamicurlButtonOpt1 = () => {
        setButtondynamicurlopt1(true)
        setbuttonActive1(true)
        setdynamicurlbtn1("URL")
    }
function test() {
  return (
    <div>







<div className="whatsapp-content">
    <div className="vendor-create-container whatsapp-under-buttons login-input-group">
    <div className="campaign-templates m-3 p-2 w-100">
        <h6 className="campaign-temp-head">Buttons (Required)</h6>
        <h6 className="create-word p-1">
            Create buttons that let customers respond to
            your message or take action.
        </h6>
        <div className="buttons-options" >
            {buttonQuickOpt1 ?
                <div className="row quick-replybtn">
                    <div className="col-md-6">
                        <p className="text-xs">Quick Reply Button</p>
                    </div>
                    <div className="col-md-6 text-end text-xs" onClick={(e) => { setButtonQuickopt1(false); setbuttonActive1(false); setquickbtn1("None"); setButtonQuicktxt1("") }}>
                        <i className="fa fa-times text-danger"></i>
                    </div>
                    <div className="col-md-12 login-input-group">
                        <p className="text-xs">Button Text</p>
                        <div className="vendor-create-container">
                            <input type="text" autoComplete="off" onChange={(e) => { setButtonQuicktxt1(e.target.value) }} value={buttonQuicktxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-a"></i></label>
                        </div>
                    </div>
                </div>
                : ""}
            {buttonPhoneOpt1 ?
                <div className="row mt-3 quick-replybtn">
                    <div className="col-md-6">
                        <p className="text-xs">Phone Number Button
                        </p>
                    </div>
                    <div className="col-md-6 text-end text-xs" onClick={() => { setbuttonActive1(false); setButtonPhoneopt1(false); setphoenobtn1("None"); setButtonPhoneNotxt1("91"); setButtonPhonetxt1("") }}>
                        <i className="fa fa-times text-danger"></i>
                    </div>
                    <div className="col-md-12 login-input-group">
                        <p className="text-xs">Button Text</p>
                        <div className="vendor-create-container">
                            <input type="text" autoComplete="off" onChange={(e) => { setButtonPhonetxt1(e.target.value) }} value={buttonPhonetxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-a"></i></label>
                        </div>
                        <br />
                        <p className="text-xs">Phone Number</p>
                        <div className="vendor-create-container">
                            <input type="text" autoComplete="off" maxLength={12} onChange={(e) => { setButtonPhoneNotxt1(e.target.value) }} value={buttonPhoneNotxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-phone"></i></label>
                        </div>
                        <div className='error-message-required'>Contact number should starts with country code without 0 or +</div>
                    </div>
                </div>
                : ""}
            {buttoncopyOpt1 ?
                <div className="row mt-3 quick-replybtn">
                    <div className="col-md-6">
                        <p className="text-xs">Coupon Code Copy Button
                        </p>
                    </div>
                    <div className="col-md-6 text-end text-xs" onClick={() => { setbuttonActive1(false); setButtoncopyopt1(false); setcopybtn1("None"); setButtonCopycodetxt1(""); }}>
                        <i className="fa fa-times text-danger"></i>
                    </div>
                    <div className="col-md-12 login-input-group">
                        <p className="text-xs">Example</p>
                        <div className="vendor-create-container">
                            <input type="text" autoComplete="off" onChange={(e) => { setButtonCopycodetxt1(e.target.value) }} value={buttonCopycodetxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"></label>
                        </div>
                    </div>
                </div>
                : ""}
            {buttonurlOpt1 ?
                <div className="row mt-3 quick-replybtn">
                    <div className="col-md-6">
                        <p className="text-xs">URL Button
                        </p>
                    </div>
                    <div className="col-md-6 text-end text-xs" onClick={() => { setbuttonActive1(false); setButtonurlopt1(false); seturlbtn1("None"); setButtonurltxt1(""); setButtonwebUrltxt1("") }}>
                        <i className="fa fa-times text-danger"></i>
                    </div>
                    <div className="col-md-12 login-input-group">
                        <p className="text-xs">Button Text</p>
                        <div className="vendor-create-container">
                            <input type="text" autoComplete="off" onChange={(e) => { setButtonurltxt1(e.target.value) }} value={buttonurltxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-a"></i></label>
                        </div>
                        <br />
                        <p className="text-xs">Website URL
                        </p>
                        <div className="vendor-create-container">
                            <input type="text" autoComplete="off" onChange={(e) => { setButtonwebUrltxt1(e.target.value) }} value={buttonwebUrltxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-link"></i></label>
                        </div>
                    </div>
                </div>
                : ""}
            {buttondynamicurlOpt1 ?
                <div className="row mt-3 quick-replybtn">
                    <div className="col-md-6">
                        <p className="text-xs">Dynamic URL Button
                        </p>
                    </div>
                    <div className="col-md-6 text-end text-xs" onClick={() => { setbuttonActive1(false); setButtondynamicurlopt1(false); setdynamicurlbtn1("None"); setButtondynamicUrltxt1(""); setButtondynamicwebUrltxt1(""); setButtonexampleUrltxt1("") }}>
                        <i className="fa fa-times text-danger"></i>
                    </div>
                    <div className="col-md-12 login-input-group">
                        <p className="text-xs">Button Text</p>
                        <div className="vendor-create-container">
                            <input type="text" autoComplete="off" onChange={(e) => { setButtondynamicUrltxt1(e.target.value) }} value={buttondynamicUrltxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-a"></i></label>
                        </div>
                        <br />
                        <p className="text-xs">Website URL
                        </p>
                        <div className="vendor-create-container">
                            <input type="text" autoComplete="off" onChange={(e) => { setButtondynamicwebUrltxt1(e.target.value) }} value={buttondynamicwebUrltxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-link"></i></label>
                            <p className="staff-passwordInputicon text-sm">{"{{1}}"}</p>
                        </div>
                        <div className="col-md-12 login-input-group">
                            <p className="text-xs">Example</p>
                            <div className="vendor-create-container">
                                <input type="text" autoComplete="off" onChange={(e) => { setButtonexampleUrltxt1(e.target.value) }} value={buttonexampleUrltxt1} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"></label>
                            </div>
                        </div>
                    </div>
                </div>
                : ""}
        </div>
        <button className="vendor-crt-btn2" onClick={(e)=>{e.preventDefault();handleQuickButtonOpt1()}}>
            <i className="fa-solid fa-reply"></i> Quick Replay
            Button
        </button>
        <button className="vendor-crt-btn2" onClick={(e)=>{e.preventDefault();handlePhoneButtonOpt1()}}>
            <i className="fa-solid fa-phone"></i> Phone Number
            Button
        </button>
        <button className="vendor-crt-btn2" onClick={(e)=>{e.preventDefault();handleCopycodeButtonOpt1()}}>
            <i className="fa-solid fa-clipboard"></i> Copy Code
            Button
        </button>
        <button className="vendor-crt-btn2" onClick={(e)=>{e.preventDefault();handleurlButtonOpt1()}}>
            <i className="fa-solid fa-link"></i> URL Button
        </button>
        <button className="vendor-crt-btn2" onClick={(e)=>{e.preventDefault();handleDynamicurlButtonOpt1()}}>
            <i className="fa-solid fa-link"></i> Dynamic URL
            Button
        </button>
    </div>
    </div>
    </div>        
    </div>
  )
}

export default test



































