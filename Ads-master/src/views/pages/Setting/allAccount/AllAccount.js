import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleLoader } from '../../../../store/Action/loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { listingProfiles, mainAccountsList, changeStatus, searchProfileIds } from '../../../../store/Action/amazonAction';

function AllAccount({ setSelectedCampagin, setViewCampaign, setSwitchTab, selectedCampagin, loader, switchTab }) {
    const [managerList, setManagerList] = useState(false);
    const [managerData, setManagerData] = useState();
    const [profileData, setProfileData] = useState([]);
    const [search, setSearch] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [searchValue, setSearchValue] = useState();
    const [searchData, setSearchData] = useState([]);
    const [dummyData, setdummyData] = useState([]);
    const [ids, setIds] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (switchTab == "connect") {
            managerAccList()
        }

    }, [switchTab]);
    const managerAccList = async () => {

        dispatch(handleLoader(loader == false ? false : true));

        try {
            const res = await dispatch(mainAccountsList());
            setManagerData(res?.data?.data);
            listProfile(false);
        } catch (e) {
            dispatch(handleLoader(false));
        }
    };

    const listProfile = async (refresh) => {
        dispatch(handleLoader(loader == false ? false : true));
        let data = []
        try {
            const req = {
                refresh: refresh
            };
            const res = await dispatch(listingProfiles(req));
            const updatedProfileData = res?.data?.data.map(item => ({ ...item, checked: item.isDashboard }));
            setProfileData(updatedProfileData)
            setdummyData(updatedProfileData)
            dispatch(handleLoader(false));
            let find = res?.data?.data.filter(x => x.isDashboard == true)

            find.map(el => {
                data.push(el.profileId)
            })
            setIds(data)
        } catch (e) {
            dispatch(handleLoader(false));
        }
    };

    const handleSearch = (event) => {
        if (event.target.value === "") {
            setSearch(false)
        }

        setSearchValue(event.target.value)
    }

    const handleRefresh = (event) => {
        listProfile(true);
    }

    const saveHandler = async () => {
        dispatch(handleLoader(true));
        const checkedProfileIds = profileData.filter(item => item.checked).map(item => item.profileId);
        const data = {
            profileIds: ids
        };
        try {
            const res = await dispatch(changeStatus(data))
            // setIsLoading(false)
            if (res.status === 200) {
                // toast.success(res.data.message)
                // setEmailVerified(true)
                dispatch(handleLoader(false));
                toast.success(res.data.message)
            } else {
                // toast.error(res.data.message)
                dispatch(handleLoader(false));
                toast.error(res.message)
            }
        } catch (e) {
            dispatch(handleLoader(false));
            toast.error("Something went wrong, please try again")


        }
    }

    const searchProfile = async () => {
        dispatch(handleLoader(true));


        const data = {
            search: searchValue
        };
        try {
            setSearch(true)
            const res = await dispatch(searchProfileIds(data))
            // setIsLoading(false)
            if (res.status === 200) {
                // toast.success(res.data.message)
                // setEmailVerified(true)
                dispatch(handleLoader(false));

                const updatedProfileData = res?.data?.data.map(item => ({ ...item, checked: item.isDashboard }));
                setSearchData(updatedProfileData)
                setdummyData(updatedProfileData)

            } else {
                // toast.error(res.data.message)
                dispatch(handleLoader(false));
                setSearch(false)

            }
        } catch (e) {
            dispatch(handleLoader(false));
            setSearch(false)


        }
    }
    const changeHandler = (e, item) => {

        if (e.target.checked) {

            setIds([
                ...ids,
                item
            ])
        }
        else {
            setIds(ids.filter(x => x !== item));
        }


    }

    return (
        <>
            <div className="row mb-3">
                <div class="col-12 d-flex align-items-center justify-content-end">
                    <button title="Refresh" onClick={() => handleRefresh()} class="border_btn ms-2">Refresh</button>
                </div>
            </div>
            <div className="row justify-content-center align-items-center ">
                {managerData && (
                    <>
                        <h5 className="pb-3">Manager Account</h5>
                        {managerData?.managerAccounts?.map((item, index) => (
                            <div
                                className="mb-2"
                                onClick={() => setManagerList(!managerList)}
                                key={index}
                            >
                                <div className="managerBox p-2">
                                    <p className="px-2 py-0 m-0">
                                        <b>{item?.managerAccountName}</b>
                                    </p>{" "}
                                    -
                                    <p className="px-2 py-0 m-0">
                                        {item?.managerAccountId}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                <div className='row mt-2 px-0'>
                    {profileData?.length > 0 && (
                        <><div className='col-4'>
                            <input type="text" className='account_search p-1 w-100 h-100' onChange={handleSearch} placeholder='Search account..' />
                        </div>
                            <div className='col-4 d-flex flex-wrap gap-3'>

                                <button className='blue_btn' onClick={() => searchProfile()}>Search</button>
                                <button className='btn btn-primary' onClick={() => saveHandler()}>Save</button>

                            </div><div className='col-4'>
                                {/* <button className='blue_btn' onClick={() => saveHandler()}>Save</button> */}
                            </div></>
                    )}

                </div>


                <div className="pt-3">
                    {
                        dummyData?.length > 0 &&
                        dummyData?.map((item, index) => (
                            // <div key={index} className="p-2" style={{ backgroundColor: '#D3D3D3' }} onClick={() => handleCampaign(item.profileId)}>
                            <div
                                key={index}
                                className="p-2 d-flex flex-wrap gap-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    // setSelectedCampagin(item);
                                    // setViewCampaign(true);
                                    // setSwitchTab("campaign");
                                    // const updatedProfileData = [...profileData];
                                    // updatedProfileData[index].checked = !updatedProfileData[index].checked;
                                    // setProfileData(updatedProfileData);
                                    // setSelectedCampagin(item);
                                    // setViewCampaign(true);
                                    // setSwitchTab("campaign");
                                    // setViewCampaign(true);
                                    // setSwitchTab("campaign");
                                }}
                            >
                                {/* <label
                                    className="listRow"
                                    style={{ cursor: "pointer" }}
                                > */}
                                <input
                                    type="checkbox"
                                    // Check if item is in selectedCampagin
                                    checked={ids.includes(item.profileId)}
                                    onClick={(e) => {
                                        // const updatedProfileData = [...profileData];
                                        // updatedProfileData[index].checked = !updatedProfileData[index].checked;
                                        // setProfileData(updatedProfileData);
                                        changeHandler(e, item.profileId)
                                    }}
                                />
                                <h6
                                    className="p-0 mx-2 my-0"
                                    style={{ color: "#2E8BC0" }}
                                    onClick={() => {
                                        // setSelectedCampagin(item);
                                        // setViewCampaign(true);
                                        // setSwitchTab("campaign");
                                    }}
                                >
                                    {item.name} - {item.type} - {item.countryCode} -{" "}
                                    {item.profileId}

                                </h6>
                                {/* </label> */}
                            </div>
                        ))

                    }

                </div>
                {/* <div className='d-flex justify-content-center'>
                    <button className='blue_btn' onClick={() => saveHandler()}>Save</button>
                </div> */}

            </div>
        </>
    )
}

export default AllAccount