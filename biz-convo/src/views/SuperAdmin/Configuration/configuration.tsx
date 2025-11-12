import DashboardLayout from "../../../layouts/DashboardLayout";
import SuperAdminTopNav from "../../../shared/TopNav/superAdmin";
import Footer from "../../../shared/Footer";
import general_Logo from "../../../assets/img/bizconvo-logo.png";
import "./configuration.css";
function Configuration() {

    return (
        <>
            <DashboardLayout>
                <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                    <SuperAdminTopNav />
                    <div className="container-fluid py-1">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                <li className="breadcrumb-item text-sm"><a className="opacity-5 text-dark" href="#">Pages</a></li>
                                <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Settings</li>
                            </ol>
                            <h6 className="font-weight-bolder text-start mb-0">Settings</h6>
                        </nav>
                    </div>
                    <div className="dashboard-maincontent container-fluid py-4">
                        <div className="card p-3">
                            <h3>General Settings</h3>
                            <p className="border"></p>
                            <div className="bg-dark text-white general-heading-para">
                                <p>Upload will be processed automatically on valid selection.</p>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <p>Logo</p>
                                    <div className="config-general-img position-relative">
                                        <img src={general_Logo} alt="logo-general" className="config-general-logo m-3" />
                                        <p className="config-close-icon">
                                            <i className="fa-solid fa-xmark"></i>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4 d-flex gap-5">
                                    <div>
                                        <p>Small Logo</p>
                                        <div className="config-general-img position-relative">
                                            <img src={general_Logo} alt="logo-general" className="config-general-logo-2 m-3" />
                                            <p className="config-close-icon">
                                                <i className="fa-solid fa-xmark"></i>
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Favicon</p>
                                        <div className="config-general-img position-relative">
                                            <img src={general_Logo} alt="logo-general" className="config-general-logo-3 m-3" />
                                            <p className="config-close-icon">
                                                <i className="fa-solid fa-xmark"></i>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <p className="border mt-4"></p>

                            <div className="row">
                                <div className="col-md-12 login-input-group">
                                    <div className="vendor-create-container">
                                        <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-globe"></i> Your Website Name</label>
                                    </div>
                                </div>
                                <div className="col-md-12 login-input-group">
                                    <div className="vendor-create-container">
                                        <textarea
                                            id="vendor-crt-input"
                                            className="vendor-crt-input create-bot-textarea"
                                            placeholder=" "
                                            required
                                        />
                                        <label
                                            htmlFor="vendor-crt-input"
                                            className="vendor-crt-label"
                                        >
                                            <i className="fa-solid fa-teeth"></i> Your Website Description
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="campaign-template mt-5">
                                <h6 className="campaign-temp-head">Contact Settings</h6>
                                <div className="row">
                                    <div className="col-md-12 login-input-group">
                                        <div className="col-md-12 login-input-group">
                                            <div className="vendor-create-container">
                                                <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-envelope"></i> Contact Email</label>
                                            </div>
                                            <small>It will be used to receive contact form emails</small>
                                        </div>
                                    </div>
                                    <div className="col-md-12 login-input-group">
                                        <div className="vendor-create-container">
                                            <textarea
                                                id="vendor-crt-input"
                                                className="vendor-crt-input create-bot-textarea"
                                                placeholder=" "
                                                required
                                            />
                                            <label
                                                htmlFor="vendor-crt-input"
                                                className="vendor-crt-label"
                                            >
                                                <i className="fa-solid fa-server"></i> Contact Details
                                            </label>
                                        </div>
                                        <small>Details added here will be shown on contact page</small>
                                    </div>
                                </div>
                            </div>
                            <div className="campaign-template mt-5">
                                <h6 className="campaign-temp-head">Localization</h6>
                                <div className="row">
                                    <div className="col-md-12 login-input-group">
                                        <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            <input
                                                type="text"
                                                id="vendor-crt-input"
                                                className={"vendor-crt-input loginfilled-frame-username"}
                                                placeholder=" "
                                                required
                                                readOnly
                                            />
                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-coins"></i> Select Timezone</label>
                                            <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                            <ul className="dropdown-menu storename-dropdown-menu">
                                                <li >
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    > India
                                                    </a>
                                                </li>
                                                <li >
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    > Pakistan
                                                    </a>
                                                </li>
                                                <li >
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    > Australia
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-12 login-input-group">
                                        <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            <input
                                                type="text"
                                                id="vendor-crt-input"
                                                className={"vendor-crt-input loginfilled-frame-username"}
                                                placeholder=" "
                                                required
                                                readOnly
                                            />
                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-language"></i> Default Language</label>
                                            <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                            <ul className="dropdown-menu storename-dropdown-menu">
                                                <li >
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                    > Default Lnaguage (English)
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-start">
                                <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorcreate">Save</button>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </main>
            </DashboardLayout>
        </>
    )
}
export default Configuration;