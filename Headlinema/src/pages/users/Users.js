import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, FormGroup } from "reactstrap";
import "./index.css";
import Url from "../../Api";
import {
    Block,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Row,
    Col,
    Button,
    RSelect,
} from "../../components/Component";
import Multiselect from 'multiselect-react-dropdown';
import axios, { formToJSON } from 'axios';
const regionMap = {
    "North America": "NA",
    "Europe": "EU",
    "Far East": "FE",
};
const Users = () => {
    const [createModal, setCreateModal] = useState(false);
    const [deleteModal, setDelteModeal] = useState(false);
    const [sendInviteModal, setSendInviteModal] = useState(false);
    const [clickedInvite, setClickedInvite] = useState(false);
    const [isInviteSent, setIsInviteSent] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [inviteData, setInviteData] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [formData, setFormData] = useState({
        username: "",   
        email: "",
        password: "",
        lwaRegions: [""],
    });

// localStorage.removeItem('initialId')

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(Url.api + Url.all, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log(response, "Response from API");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data); // Assuming `setUsers` is used to store the API data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleToggle = (id) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id
                    ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
                    : user
            )
        );
    };

    const [loading, setLoading] = useState(false);
    const handleOpenCreateModal = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        const config = {
            method: 'post',
            url: Url.api + Url.register,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                lwaRegions: formData.lwaRegions,
            },
        };

        try {
            const response = await axios(config);
            if (response.data.success === true) {
                console.log('Data posted successfully', response.data);
                fetchData();
                setCreateModal(false);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    lwaRegions: [""],
                });
            } else {
                console.log('Failed to create user', response.data);
            }
        } catch (error) {
            console.error('Error posting data', error);
        } finally {
            setLoading(false);
        }
    };
    
    const addUser = () => {
        setCreateModal(true);
    }

    const handleSendInviteClick = (userId, recipientEmail, region, plan) => {
        console.log("Prepare to send invite for:", { userId, recipientEmail, region, plan });
        setInviteData({ userId, recipientEmail, region, plan });
        setSendInviteModal(true);
    };

    const closeModel = () => {
        setSendInviteModal(false);
        setCreateModal(false);
        setDelteModeal(false);
    };

    const handleConfirmSendInvite = async () => {
        if (!inviteData) return;

        const { userId, recipientEmail, region, plan } = inviteData;

        console.log("Sending invite:", inviteData);
        const token = localStorage.getItem("token");
        setLoading(true);

        const payload = { userId, recipientEmail, region, plan };

        const config = {
            method: "post",
            url: Url.api + Url.EmailInvite,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const response = await axios(config);
            if (response.data.success) {
                console.log("Invite sent successfully:", response.data);
                fetchData(); 
                setSendInviteModal(false);
            } else {
                console.error("Failed to send invite:", response.data);
            }
        } catch (error) {
            console.error("Error sending invite:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenDeleteModal = () => {
        setDelteModeal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRegionChange = (selectedRegions) => {
        const regionMap = {
            "North America": "NA",
            Europe: "EU",
            "Far East": "FE",
        };
    
        const updatedRegions = selectedRegions.map((region) => regionMap[region.key] || region.key);
        setFormData((prevData) => ({
            ...prevData,
            lwaRegions: updatedRegions,
        }));
    };

    const renderTableCells = (region, user, handleSendInviteClick) => {
        const invites = users?.lwaEmailInvites || [];
        return (
            <React.Fragment key={region}>
                <td>
                    {invites.find(
                        (invite) => invite.region === region && invite.plan === "Ads"
                    )?.triggeredOn ? (
                        <button className="sent_btn text-black">Email Sent</button>
                    ) : (
                        <button
                            className="send_invite_btn text-white"
                            onClick={() => handleSendInviteClick(user.id, user.recipientEmail, region, "Ads")}
                        >
                            Send Invite
                        </button>
                    )}
                </td>
                <td>
                    {invites.find(
                        (invite) => invite.region === region && invite.plan === "SP"
                    )?.triggeredOn ? (
                        <button className="sent_btn text-black">Email Sent</button>
                    ) : (
                        <button
                            className="send_invite_btn text-white"
                            onClick={() => handleSendInviteClick(user.id, user.recipientEmail, region, "SP")}
                        >
                            Send Invite
                        </button>
                    )}
                </td>
            </React.Fragment>
        );
    };
    { ["NA", "EU", "FE"].map((region) => renderTableCells(region, users, handleSendInviteClick)) }

    const filteredUsers = users.filter(
        (user) =>
            user.userName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            new Date(user.createDate).toLocaleDateString("en-GB").includes(searchText)
    );

    return (
        <>
            <Row className="ms-2 me-3">
                <div className="profile-container mt-4">
                    <div className="d-flex align-items-center justify-content-between" style={{ marginTop: "50px" }}>
                        <form className="me-3 w-25">
                        <div className="search-filter-container" style={{ position: 'relative', width: '100%' }}>
                            <i 
                                className="fa-solid fa-magnifying-glass search_icon" 
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '10px',
                                    transform: 'translateY(-50%)',
                                    color: '#888',
                                }}
                            ></i>
                            <input 
                                type="text" 
                                placeholder="Search" 
                                id="globalSearch" 
                                name="globalSearch" 
                                style={{
                                    width: "100%",
                                    padding: "10px 10px 10px 40px",
                                    border: isFocused ? "2px solid #ebb96e" : "1px solid #ccc", 
                                    borderRadius: "4px",
                                    outline: "none", 
                                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                                    boxShadow: isFocused ? "0 0 5px #ebb96e" : "none",
                                  }}
                                  onFocus={() => setIsFocused(true)} 
                                onBlur={() => setIsFocused(false)} 
                                tabIndex={0} 
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                        </form>
                        <div>
                            <button className="btn btn-primary add-rules-btn remove-button text-light" onClick={addUser}>
                                <i className="fa-regular fa-user mr-1"></i>
                                Add User
                            </button>
                        </div>
                    </div>

                    {/* Add User Modal */}
                    <Modal isOpen={createModal} className="modal-dialog-centered" size="md" toggle={closeModel}>
                        <ModalBody>
                            <a
                                href="#dropdownitem"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    closeModel();
                                }}
                                className="close"
                            >
                                <i className="fa fa-times" aria-hidden="true" ></i>
                            </a>
                            <div className="p-2">
                                <h5 className="title">Add User</h5>
                                <div className="tab-content">
                                    <div id="create">
                                        <Row className="gy-4">
                                            <Col md="6">
                                                <FormGroup>
                                                    <label className="form-label" htmlFor="full-name">Username</label>
                                                    <input
                                                        type="text"
                                                        id="full-name"
                                                        className="form-control"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        placeholder="Enter Your Name"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="6">
                                                <FormGroup>
                                                    <label className="form-label" htmlFor="email">Email</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        className="form-control"
                                                        name="email" value={formData.email}
                                                        placeholder="Enter Your Email"
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label className="form-label" htmlFor="email">Region</label>
                                                    <Multiselect
                                                        displayValue="key"
                                                        onRemove={(selectedList) => handleRegionChange(selectedList)}
                                                        onSelect={(selectedList) => handleRegionChange(selectedList)}
                                                        options={[
                                                            { cat: "Group 1", key: "North America" },
                                                            { cat: "Group 1", key: "Europe" },
                                                            { cat: "Group 1", key: "Far East" },
                                                        ]}
                                                        showCheckbox
                                                        selectedValues={formData.lwaRegions
                                                            .map((regionKey) => {
                                                                const reverseRegionMap = {
                                                                    NA: "North America",
                                                                    EU: "Europe",
                                                                    FE: "Far East",
                                                                };
                                                                return reverseRegionMap[regionKey]
                                                                    ? { cat: "Group 1", key: reverseRegionMap[regionKey] }
                                                                    : null; // Filter out invalid or empty values
                                                            })
                                                            .filter(Boolean)}
                                                        // selectedValues= {formData?.lwaRegions[0] ?(formData.lwaRegions.map((regionKey) => {
                                                        //     console.log("regionKey", regionKey)
                                                        //     const reverseRegionMap = {
                                                        //         "NA": "North America",
                                                        //         "EU": "Europe",
                                                        //         "FE": "Far East",
                                                        //     };
                                                        //     return { cat: "Group 1", key: reverseRegionMap[regionKey] };
                                                        // })): [{ cat: "Group 1", key: "North America" }]}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col size="12">
                                                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                                    <li>
                                                        <Button color="primary" size="lg" onClick={(ev) => {
                                                            ev.preventDefault(); handleOpenCreateModal()
                                                            // submitForm(); 
                                                        }}>
                                                            Create User
                                                        </Button>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#dropdownitem"
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                closeModel();
                                                            }}
                                                            className="linkback"
                                                        >
                                                            Cancel
                                                        </a>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>

                    {/* User Table */}
                    <table className="table table-hover mt-4 table-light">
                        <thead className="admin-user-table-head">

                            <tr>
                                <th scope="col">Status</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Ads NA</th>
                                <th scope="col">SP NA</th>
                                <th scope="col">Ads EU</th>
                                <th scope="col">SP EU</th>
                                <th scope="col">Ads FE</th>
                                <th scope="col">SP FE</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="admin-user-table-body">
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={user.status === "Active"}
                                                // onChange={() => handleToggle(user.id)}
                                                disabled={true}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td>{user.userName}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.createDate).toLocaleDateString('en-GB')}</td>    

                                    {["NA", "EU", "FE"].map((region) => {
                                        const invitesForRegion = user.lwaEmailInvites.filter((invite) => invite.region === region);
                                        const inviteTypeAds = invitesForRegion.find((invite) => invite.type === "Ads");
                                        const inviteTypeSP = invitesForRegion.find((invite) => invite.type === "SP");

                                        return (
                                            <>
                                                {/* Ads Column */}
                                                <td key={`${region}-Ads`}>
                                                    {inviteTypeAds ? (
                                                        inviteTypeAds.acceptedOn ? ( // Check if acceptedOn is not null
                                                            <div className="tooltip-container">
                                                            <span className="sent_btn text-black">
                                                                <i className="fa-brands fa-nfc-directional"></i></span>
                                                                <span className="tooltip-text">Connected</span>
                                                                </div>
                                                        ) : inviteTypeAds.triggeredOn ? (
                                                            <>
                                                            <div className="tooltip-container">
                                                                <button className="sent_btn text-black"><i className="fa-solid fa-envelope-circle-check"></i>
                                                                </button>
                                                                <span className="tooltip-text"><b>Email Sent</b></span>
                                                                </div>
                                                                <div>
                                                                    {/* Uncomment if you want to show the time */}
                                                                    {/* {new Date(inviteTypeAds.triggeredOn).toLocaleTimeString('en-US', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        hour12: true,
                                                                    })} */}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="tooltip-containers">
                                                            <button
                                                                className="send_invite_btn text-white"
                                                                onClick={() => handleSendInviteClick(user.id, user.email, region, "Ads")}
                                                            >
                                                            <i class="fa-regular fa-paper-plane"></i>
                                                            
                                                            </button>
                                                            <span className="tooltip-texts"><b>Send Invite</b></span>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                </td>

                                                {/* SP Column */}
                                                <td key={`${region}-SP`}>
                                                {inviteTypeSP ? (
                                                    inviteTypeSP.acceptedOn ? ( 
                                                        <div className="tooltip-container">
                                                        <span className="connected_status text-success">
                                                            <i className="fa-brands fa-nfc-directional"></i></span>
                                                            <span className="tooltip-text">Connected</span>
                                                            </div>
                                                    ) : inviteTypeSP.triggeredOn ? (
                                                        <>
                                                        <div className="tooltip-container">
                                                            <button className="sent_btn text-black"><i className="fa-solid fa-envelope-circle-check"></i>
                                                            </button>
                                                            <span className="tooltip-text"><b>Email Sent</b></span>                                                            </div>
                                                            {/* Uncomment if you want to show the time */}
                                                            {/* <div>
                                                                {new Date(inviteTypeSP.triggeredOn).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true,
                                                                })}
                                                            </div> */}
                                                        </>
                                                    ) : (
                                                        <div className="tooltip-containers">
                                                        <button
                                                            className="send_invite_btn text-white"
                                                            onClick={() => handleSendInviteClick(user.id, user.email, region, "SP")}
                                                        >
                                                           <i className="fa-regular fa-paper-plane"></i>
                                                        </button>
                                                        <span className="tooltip-texts"><b>Send Invite</b></span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span></span>
                                                )}
                                            </td>
                                            </>
                                        );
                                    })}


                                    <td>
                                        <button
                                        
                                            className="btn text-danger fa_solid_fa_trash"
                                            onClick={() => handleOpenDeleteModal(user.id)}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Delete User Confirmation Modal */}
                    <Modal isOpen={deleteModal} toggle={closeModel} className="modal-dialog-centered" size="md">
                        <ModalBody>
                            <a
                                href="#dropdownitem"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    closeModel();
                                }}
                                className="close"
                            >
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </a>
                            <div className="p-2">
                                <h5 className="title">Confirm User Deletion</h5>
                                <div className="tab-content">
                                    <div id="delete">
                                        <Row className="gy-4">
                                            <Col size="12">
                                                <h6>Are you sure? This will permanently delete the user.</h6>
                                            </Col>
                                            <Col size="12">
                                                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                                    <li>
                                                        <Button
                                                            color="primary"
                                                            size="lg"
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                            }}
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#dropdownitem"
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                closeModel();
                                                            }}
                                                            className="linkback"
                                                        >
                                                            Cancel
                                                        </a>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={sendInviteModal} toggle={closeModel} className="modal-dialog-centered" size="md">
                        <ModalBody>
                            <a
                                href="#dropdownitem"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    closeModel();
                                }}
                                className="close"
                            >
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </a>
                            <div className="p-2">
                                <h5 className="title">Confirm Send Invite</h5>
                                <div className="tab-content">
                                    <div id="send-invite">
                                        <Row className="gy-4">
                                            <Col size="12">
                                                <h6>Are you sure? You want to send invite link to user mail.</h6>
                                            </Col>
                                            <Col size="12">
                                                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                                    <li>
                                                        <Button
                                                            color="primary"
                                                            size="lg"
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                handleConfirmSendInvite();
                                                            }}
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#dropdownitem"
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                closeModel();
                                                            }}
                                                            className="linkback"
                                                        >
                                                            Cancel
                                                        </a>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>

                </div>
            </Row>
        </>
    );
};

export default Users;
