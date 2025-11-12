import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Col, Row, Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import '../Profile/index.css';
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import Url from "../../../Api";

interface Profile {
    countryCode: string;
    isActive: boolean;
    profileId: string;
    profileName: string;
    timezone: string;
}

const Profile: React.FunctionComponent = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

    const [searchValue, setSearchValue] = useState<string>("");
    const [reasone, setReasone] = useState<string>("");
    const [searchValuepop, setSearchValuepop] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModal1, setShowModal1] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showAddModal1, setShowAddModal1] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);


    // Fetch profiles from API
    const profileList = () => {
        let userToken = localStorage.getItem("userToken");
        let AuthToken = `Bearer ${userToken}`;
        setLoading(true)
        axios
            .get( Url.api + Url.adminProfiles, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: AuthToken,
                }
            })
            .then((res) => {
                setProfiles(res.data.result.awsProfilesPreferences);

            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => { // Corrected syntax
                setLoading(false);
            });
    }

    useEffect(() => {
        profileList();
    }, []);


    // search in,
    let value = "";
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        value = (e.target as HTMLInputElement).value;
        console.log(value);

        if (e.key === "Enter") {
            setSearchValue((e.target as HTMLInputElement).value);
            e.preventDefault();
        }
    };

    const search = () => {
        setSearchValue(value);
    };

    const filteredProfiles = profiles.filter((profile: Profile) => {
        const searchString = searchValue.toLowerCase();
        return (
            profile.profileName.toLowerCase().includes(searchString) ||
            profile.profileId.toString().includes(searchString)
        );
    });

    let value1 = "";
    const handleKeyDown1 = (e: React.KeyboardEvent<HTMLInputElement>) => {
        value = (e.target as HTMLInputElement).value;
        console.log(value1);

        if (e.key === "Enter") {
            setSearchValuepop((e.target as HTMLInputElement).value);
            e.preventDefault();
        }
    };

    const searchpop = () => {
        setSearchValuepop(value1);
    };

    const filteredProfilespop = profiles.filter((profile: Profile) => {
        const searchString = searchValuepop.toLowerCase();
        return (
            profile.profileName.toLowerCase().includes(searchString) ||
            profile.profileId.toString().includes(searchString)
        );
    });

    // save in,
    const Save = () => {
        let userToken = localStorage.getItem("userToken");
        const requestdata = {
            profiles: profiles,
        };
        console.log(requestdata);
        if (selectedProfiles.length > 0) {
            axios
                .post(
                    "https://adsautomationapistaging.agilensmartservices.com/BackgroundServices/Ads/Profiles",
                    requestdata,
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                )
                .then((res) => {
                    if (res.data.success === true) {
                        if (res.data.message === "Sync Queued successfully") {
                            toast.success("Profile sync successfully");
                            window.location.reload();
                        } else {
                            toast("Something went wrong");
                        }
                    } else {
                        toast("Profile sync failed");
                    }
                })
                .catch((error) => {
                    toast("Something went wrong");
                });
        } else {
            // toast("Select or deselect any profile checkbox");
        }
    };

    const handleCheckboxChange = (profile: Profile, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedProfiles = profiles.map((p: Profile) =>
            p.profileId === profile.profileId ? { ...p, isActive: e.target.checked } : p
        );
        setProfiles(updatedProfiles);
        setSelectedProfiles(updatedProfiles);
    };

    // Function to handle modal display
    const handleShowModal = (profileId: string) => {
        setShowModal(true)
        setSelectedProfileId(profileId);
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setShowModal1(false);
    }
    // Function to handle modal-popup display
    const handleShowModal1 = (profileId: string) => {
        setShowModal1(true);
        setSelectedProfileId(profileId);
    }
    const handleCloseModal1 = () => setShowModal1(false);

    // refresh
    const handleRefresh = () => {
        // profileList();
        // console.log("Hello"); 
        let userToken = localStorage.getItem("userToken");
        let AuthToken = `Bearer ${userToken}`;
        axios
            .post(Url.api + Url.adminSyncprofiles, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: AuthToken,
                }
            })
            .then((res) => {

                if (res.data.success === true) {
                    toast.success(res.data.message)
                    profileList();

                } else {
                    toast("Profile active error");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // is active
    const isActiveCall = (isActivating: boolean) => {
        let userToken = localStorage.getItem("userToken");
        if (!selectedProfileId) {
            toast("Please select a profile to activate/deactivate.");
            return;
        }
        const requestdata = {
            profile: {
                profileId: selectedProfileId,
                isActive: isActivating ? true : false,
            },
            reason: reasone
        };
        console.log("req data from active", requestdata);

        axios
            .post(
                Url.api + Url.adminProfile,
                requestdata,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )
            .then((res) => {
                if (res.data.success === true) {
                    toast.success(res.data.message)
                    console.log("successfully activated or Deactive ");
                    profileList()
                    handleCloseModal()
                } else {
                    toast("Profile active error");
                }
            })
            .catch((error) => {
                console.log("error from profile", error);
                toast("Something went wrong");
            });
    }

    return (
        <DashboardLayout>
            <Row className="ms-2 me-3">
                <div className="profile-container mt-4">
                    <div className="d-flex align-items-center justify-content-between mt-4">
                        <form className="me-3 w-25"><div className="search-filter-container ">
                            <i className="fa fa-search" aria-hidden="true"></i>
                            <input type="text" placeholder="Search" id="globalSearch" name="globalSearch" onKeyDown={handleKeyDown} />
                        </div>
                        </form>
                        <div>
                            <button className="btn btn-primary add-rules-btn pt-2 remove-button text-light" onClick={() => setShowAddModal1(true)} > Add Profile</button>
                        </div>
                    </div>
                    {/* active */}
                    <Modal show={showAddModal1} onHide={() => setShowAddModal1(false)} size="xl" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="d-flex align-items-center justify-content-between mt-4">
                                <form className="me-3 w-25"><div className="search-filter-container ">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                    <input type="text" placeholder="Search" id="globalSearch" name="globalSearch" onKeyDown={handleKeyDown1} />
                                </div>
                                </form>
                                <div>
                                    <button
                                        className="btn btn-primary add-rules-btn pt-2 remove-button text-light"
                                        onClick={handleRefresh} >
                                        <i className="fa-solid fa-arrows-rotate"></i> Refresh
                                    </button>
                                </div>
                            </div>
                            <table className="table table-hover mt-4 table-light">
                                <thead className="admin-user-table-head">
                                    <tr>
                                        <th scope="col">Profile Id</th>
                                        <th scope="col">Profile</th>
                                        <th scope="col">Country</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="admin-user-table-body">
                                    {loading ? (
                                        (
                                            <div className="loading-container">
                                                <div
                                                    style={{
                                                        marginBottom: "250px",
                                                        marginTop: "250px",
                                                    }}
                                                >
                                                    <CircularProgress
                                                        className="loading"
                                                        style={{ margin: "auto" }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    ) :
                                        filteredProfilespop.length > 0 ? (
                                            filteredProfilespop
                                                .filter((profile) => !profile.isActive)
                                                .sort((a, b) => a.profileName.localeCompare(b.profileName))
                                                .map((profile) => (
                                                    <tr key={profile.profileId}>
                                                        <td>{profile.profileId}</td>
                                                        <td>{profile.profileName}</td>
                                                        <td>
                                                            <img src={`${process.env.PUBLIC_URL}/assets/flags/${profile.countryCode.toUpperCase()}.png`}
                                                                alt={`${profile.countryCode} Flag`}
                                                                className="admin-profile-flag" />
                                                            {profile.countryCode}
                                                        </td>
                                                        <td
                                                            className={`admin-profile-inactive text-danger`}
                                                            // onClick={handleShowModal1} 
                                                            onClick={() => handleShowModal1(profile.profileId)}
                                                        >
                                                            <button className="btn btn-success text-white admin-profile-active-btn">
                                                                Activate
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center align-content-center admin-profile-nodata">
                                                    No DeActivate Profiles
                                                </td>
                                            </tr>
                                        )}

                                </tbody>
                            </table>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showModal1} onHide={handleCloseModal1} centered className="admin-user-custom-modal">
                        <Modal.Header closeButton className="admin-user-custom-modal-header ">
                            <h6>Confirm Activation</h6>
                        </Modal.Header>
                        <Modal.Body className="admin-user-custom-modal-body">
                            <h6>Ready to enable daily Ads report sync for SP, SB, and SD for this profile?</h6>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center border-0">
                            <Button variant="secondary" className="admin-profile-popup-cancel" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button className="btn btn-primary add-rules-btn pt-2 remove-button text-light" variant="primary" onClick={() => { Save(); isActiveCall(true); }}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* deactive */}
                    <table className="table table-hover mt-4 table-light">
                        <thead className="admin-user-table-head">
                            <tr>
                                <th scope="col">Profile Id</th>
                                <th scope="col">Profile</th>
                                <th scope="col">Country</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="admin-user-table-body">

                            {filteredProfiles.length > 0 ? (
                                filteredProfiles
                                    .filter((profile) => profile.isActive)
                                    .sort((a, b) => a.profileName.localeCompare(b.profileName))
                                    .map((profile) => (
                                        <tr key={profile.profileId}>
                                            <td>{profile.profileId}</td>
                                            <td>{profile.profileName}</td>
                                            <td>
                                                <img
                                                    src={`${process.env.PUBLIC_URL}/assets/flags/${profile.countryCode.toUpperCase()}.png`}
                                                    alt={`${profile.countryCode} Flag`}
                                                    className="admin-profile-flag" />
                                                {profile.countryCode}
                                            </td>
                                            <td
                                                className={`admin-profile-inactive text-success`}
                                                onClick={() => handleShowModal(profile.profileId)}>
                                                <button className="btn btn-danger text-white admin-profile-active-btn">
                                                    Deactivate
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center align-content-center admin-profile-nodata" >
                                        No Active Profiles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Modal Component */}
                    <Modal show={showModal} onHide={handleCloseModal} centered className="admin-user-custom-modal">
                        <Modal.Header closeButton className="admin-user-custom-modal-header">
                            <h6>Confirm Deactivation</h6>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <label htmlFor="removalReason" className="custom-textarea-label">
                                    <h6 className="admin-profile-textarea">Reason for Deactivation ?</h6>
                                </label>
                                <textarea className="custom-textarea" id="removalReason" onChange={(e) => setReasone(e.target.value)}></textarea>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="admin-user-custom-modal-footer">
                            <Button variant="secondary" className="admin-profile-popup-cancel" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button className="btn btn-primary add-rules-btn pt-2 remove-button text-light" variant="primary" onClick={() => { Save(); isActiveCall(false); }}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Row>
        </DashboardLayout>
    );
};

export default Profile;
