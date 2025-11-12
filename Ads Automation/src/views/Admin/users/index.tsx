import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Col, Row, Modal, Button } from "react-bootstrap";
import axios from "axios";
import './index.css';
import { toast } from "react-toastify";
import Url from "../../../Api";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

interface userListDataType {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    status: string; 
    createdOn: string;
    isProfileSelected: boolean;
    keywordStrategy: string | null;

}

const Users: React.FunctionComponent = () => {
    const [userStoredValue, setUserStoredValue] = useState<userListDataType[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModal1, setShowModal1] = useState<boolean>(false);
    const [showAddModal1, setShowAddModal1] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState<string>("")
    const [pass, setPass] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // list call
    const userList = () => {
        let userToken = localStorage.getItem("userToken");
        let AuthToken = `Bearer ${userToken}`;
        axios
            .get(Url.api + Url.usersAll, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: AuthToken,
                },
            })
            .then((res) => {
                setUserStoredValue(res.data);
                console.log("user data---->.", res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }

    // register api call
    const registerCall = () => {
        let userToken = localStorage.getItem("userToken");
        const reqData = {
            userName: email,
            email: email,
            password: pass
        }
        axios
            .post(
                Url.api + Url.usersRegister,
                reqData,
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
                    handleCloseModal1()
                } else {
                    toast("Profile active error");
                }
            })
            .catch((error) => {
                console.log("error from profile", error);
                toast("Something went wrong");
            });
    }

    // edit api call
    const editCall =(id: string, status: boolean, userData: userListDataType)=>{
        let userToken = localStorage.getItem("userToken");
        const reqData = {
            id:id ,
            firstName: userData.firstName ?? "",
            lastName: userData.lastName ?? "",
            phone: userData.phone ?? "",
            isConnected: true,
            isProfileSelected: userData.isProfileSelected ?? true,
            keywordStrategy:  userData.keywordStrategy ?? ""
        }
        axios
            .put(
                Url.api + Url.usersPut +id,
                reqData,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )
            .then((res) => {
                if (res.data.success === true) {
                    toast.success(res.data.message)
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((error) => {
                console.log("error from userEdit", error);
                toast("Something went wrong");
            });
    }
    useEffect(() => {
        userList();
    }, []);

    const toggleStatus = (id: string, currentStatus: boolean) => {
        const selectedUser = userStoredValue.find((user) => user.id === id);
        if (!selectedUser) {
            console.error("User not found");
            return;
        }
         // Update the local state first for UI change
        setUserStoredValue((prevProfiles) =>
            prevProfiles.map((user) =>
                user.id === id ? { ...user, status: currentStatus ? "Inactive" : "Active" } : user
            ))
             // Call the edit API to update the status in the backend
        editCall(id, !currentStatus, selectedUser);  // Pass updated status and user data
    
    }
    // Function to handle modal display
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Function to handle modal-popup display
    const handleShowModal1 = (id: string) => {
        setSelectedUserId(id)
        setShowModal1(true);
    }
    const handleCloseModal1 = () => {
        setShowModal(false)
        setShowModal1(false);
        setSelectedUserId(null)
    }
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    // delete call 
    const deleteApiCall = () => {
        if (!selectedUserId) return;
        let userToken = localStorage.getItem("userToken");
        let AuthToken = `Bearer ${userToken}`;

        axios
        .delete(
            Url.api + Url.usersDelete +selectedUserId,{
                headers: {
                    Authorization: AuthToken,
                },
            }
        )
        
        .then((res) => {
            if (res.data.success === true) {
                toast.success(res.data.message)
                handleCloseModal1()
                userList()
            } else {
                toast("Profile active error");
            }
        })
        .catch((error) => {
            console.log("error from profile", error);
            toast("Something went wrong");
        });

    }

    // email error,
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        const gmailRegex = /^[^\s@]+@gmail\.com$/;
        if (!gmailRegex.test(emailValue)) {
            setEmailError("*Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

// password error,

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordValue = e.target.value;
        setPass(passwordValue);

        if (!validatePassword(passwordValue)) {
            setPasswordError(
                "*Password must be at least 8 characters long,contain letters,numbers,and special characters."
            );
        } else {
            setPasswordError(""); 
        }
    };
    return (
        <DashboardLayout>
            <Row className="ms-2 me-3">
                <div className="profile-container mt-4">
                    <div className="d-flex align-items-center justify-content-between mt-4">
                        <form className="me-3 w-25"><div className="search-filter-container ">
                            <i className="fa fa-search" aria-hidden="true"></i>
                            <input type="text" placeholder="Search" id="globalSearch" name="globalSearch" />  {/* onKeyDown={handleKeyDown} */}
                        </div>
                        </form>
                        <div>
                            <button className="btn btn-primary add-rules-btn pt-2 remove-button text-light" onClick={() => setShowAddModal1(true)} ><i className="fa-regular fa-user"></i> Add User</button>
                        </div>
                    </div>

                    <Modal show={showAddModal1} onHide={() => setShowAddModal1(false)} size="lg" centered>
                        <Modal.Header closeButton className="bg-light">
                            <Modal.Title>Add New User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>

                                <div className="form-group">
                                    <label htmlFor="exampleFormControlInput1" className="admin-user-input-head">User Name</label>
                                    <div className="col-sm-12 mt-2">
                                        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter your Name" onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>

                                <div className="form-group mt-1">
                                    <label htmlFor="exampleFormControlInput1" className="admin-user-input-head">
                                        Email address
                                    </label>
                                    <div className="col-sm-12 mt-2">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Enter your email"
                                            onChange={handleEmailChange} // Use the updated email handler
                                            value={email}
                                        />
                                        {emailError && <span className="text-danger user-form-error">{emailError}</span>}
                                    </div>
                                </div>

                                <div className="col-sm-12 mt-1">
                                    <div className="form-group">
                                        <label htmlFor="inputPassword" className="col-form-label admin-user-input-head">
                                            Password
                                        </label>
                                        <div className="col-sm-12 mt-1 position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                id="inputPassword"
                                                placeholder="Enter a password"
                                                onChange={handlePasswordChange} // Use the updated password handler
                                                value={pass}
                                            />
                                            <button
                                                type="button"
                                                className="input-group-text admin-user-icon"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                                            </button>
                                        </div>
                                        {passwordError && <span className="text-danger user-form-error">{passwordError}</span>}
                                    </div>
                                </div>
                                <div className="admin-user-create">
                                    <button className="btn btn-primary add-rules-btn pt-2 remove-button mt-4 text-light" type="submit" onClick={() => registerCall()}>Create</button>
                                </div>
                            </form>

                        </Modal.Body>
                    </Modal>

                    <table className="table table-hover mt-4 table-light">
                        <thead className="admin-user-table-head">
                            <tr>
                                <th scope="col">Email</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody className="admin-user-table-body">
                            {userStoredValue.map((val, ind) => (
                                <tr key={ind}>
                                    <td>{val.email}</td>
                                    <td>{val.createdOn}</td>
                                    <td>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={val.status === "Active"}
                                                onChange={() => toggleStatus(val.id, val.status === "Active")}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                    <td><button className="btn text-danger" onClick={()=>handleShowModal1(val.id)}><i className="fa-solid fa-trash"></i></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Modal show={showModal1} onHide={handleCloseModal1} centered className="admin-user-custom-modal">
                        <Modal.Header closeButton className="admin-user-custom-modal-header">
                            <h6>Confirm User Deletion</h6>
                        </Modal.Header>
                        <Modal.Body className="admin-user-custom-modal-body">
                            <h6>Are you sure? this will permanently delete the user?</h6>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center border-0">
                            <Button variant="secondary" className="admin-profile-popup-cancel" onClick={handleCloseModal1}>
                                Cancel
                            </Button>
                            <Button className="btn btn-primary add-rules-btn pt-2 remove-button text-light" variant="primary" onClick={()=>deleteApiCall()}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </Row>
        </DashboardLayout>
    );
};

export default Users;
