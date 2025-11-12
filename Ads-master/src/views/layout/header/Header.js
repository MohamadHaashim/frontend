import React, { useState, useEffect } from 'react'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { GoChevronDown } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileData, userLogout } from "../../../store/Action/authActions";
import Spinner from "../../other/Spinner";
function Header({ open, setOpen }) {
    const Loading = useSelector(state => state.loader)
    const [userDetails, setUserDetails] = useState()
    const navigate = useNavigate()
    const userProfile = useSelector(state => state.auth.userProfile)
    const dispatch = useDispatch()
    const getUserDetails = async () => {
        try {
            await dispatch(userProfileData())
        } catch (e) {
            console.log('err::', e)
        }
    }
    useEffect(() => {
        getUserDetails()
    }, [])
    useEffect(() => {
        setUserDetails(userProfile?.profile)
    }, [userProfile])
    const onClickLogout = () => {
        dispatch(userLogout())
        navigate('/')
        window.location.reload()
    }

    
    return (
        <div className="top-header d-flex justify-content-between align-items-center py-3" >
            <div className="d-flex align-items-center">
                <Link className="px-1 me-2" onClick={() => { setOpen(!open) }} >
                    {!open ? <AiOutlineMenuFold className='sidebar_text' style={{ fontSize: "25px" }} /> :
                        <AiOutlineMenuUnfold className='sidebar_text' style={{ fontSize: "25px" }} />}
                </Link>
                <h6 className='m-0 WelcomeText sidebar_text'>Welcome</h6>
            </div>
            <div className="d-flex align-items-center">
                <div className="">
                    <div className="dropdown" style={{ float: 'right' }}>
                        <button className="dropbtn m-0">
                            <p className='WelcomeText m-0 sidebar_text'  >Hi, {userDetails?.fullName}</p>
                            <GoChevronDown style={{ fontSize: '18px' }} className=' m-1 sidebar_text' />
                        </button>
                        <div className="dropdown-content">
                        <Link to={'/changePassword'} style={{ fontSize: "13px" }}>Change Password</Link>
                            <Link to={''} style={{ fontSize: "13px" }} onClick={() => onClickLogout()}>Logout</Link>
                      
                        </div>
                    </div>
                </div>
            </div>
            {
                Loading.loader === true &&
                <div className="loader">
                    <Spinner />
                </div>
            }

        </div>
    )
}

export default Header