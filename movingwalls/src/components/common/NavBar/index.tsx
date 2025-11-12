import React, { Component, useEffect, useState } from "react";
import "./index.css";
import LogoImage from "../../../assets/brand/your-logo-in.png";
import Downarrow from "../../../assets/images/vector-8.svg";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { CART_INITIAL_QUERY } from "../../../Graphql/Queries";
import client from "../../../Graphql/apolloClient";
import { generateMockData } from "../../../Graphql/MockData";

const handleLogout = () => {
    const keysToRemove = [
        "selectedCampaignId",
        "selectedInventoryId",
        "billboardId",
        "state",
        "uId",
        "userAccountData",
        "campaignId",
        "inventoryIds",
        "authToken",
        "userName",
        "addedBillboardIds",
        "isPopupSubmited",
        "companyId",
        "exploreCartCount",
        "countryId"
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));
};

const NavBar = () => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    // const userName = localStorage.getItem('userNamee');
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [defaultCampName, setDefaultCampName] = useState("");
    useEffect(() => {
        const interval = setInterval(() => {
            const currentUserName = localStorage.getItem('userName');
            if (currentUserName !== userName) {
                setUserName(currentUserName || '');
            }
        }, 100);

        // Clean up the interval when the component is unmounted
        return () => clearInterval(interval);
    }, [userName]);


    const [cartItemCount, setCartItemCount] = useState(0);

    const fetchCartDetails = async () => {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem('userId');
        try {
            const { data } = await client.query({
                query: CART_INITIAL_QUERY,
                variables: {
                    accessToken: token,
                    userId: userId,

                }
            })
            // setCartItemCount(data.cartpageItem.length);
            setDefaultCampName(data?.cartpageItem[0]?.campaignName)
        } catch (error) {
            console.error("Error fetching property details:", error);
        }
    }


    const { data: myCart, loading, error, refetch } = useQuery(CART_INITIAL_QUERY, {
        variables: {
            accessToken: token,
            userId: userId,
        },
        onCompleted: (data) => {
            if (data?.cartpageItem) {
                const count = data.cartpageItem.length;
                setCartItemCount(count);
            }
        },
        fetchPolicy: 'network-only',
    });
    useEffect(() => {
        if (!loading && myCart?.cartpageItem) {
            const count = myCart.cartpageItem.length;
            setCartItemCount(count);
        }
    }, [myCart, loading]);

    useEffect(() => {
        if (process.env.REACT_APP_MOCK_DATA === 'true') {
            generateMockData(CART_INITIAL_QUERY)
                .then((mockResponse: any) => {
                    const data = mockResponse.data;
                    setCartItemCount(data.cartpageItem.length);
                    setDefaultCampName(data?.cartpageItem[0]?.campaignName)
                    refetch()
                })
                .catch((err: any) => {
                    console.error("Error generating mock data:", err);
                });
        } else {
            fetchCartDetails();
        }
    }, []);

    const Navigate = useNavigate();
    const navigateToCartlist = () => {
        Navigate(`${process.env.REACT_APP_BASE_PATH}/mycart`, { state: { showSaveAndRequest: true, defaultCampName } });
    };
    const [config, setConfig] = useState<any[]>([]);
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
                const data = await response.json();
                const landingPageConfig = data.find((page: { name: string; }) => page.name === "Landing Page");
                setConfig(landingPageConfig.configurations || []);

            } catch (error) {
                console.error("Error fetching config data:", error);
            }
        };

        fetchConfig();
    }, []);
    const [content, setContent] = useState<any[]>([]);
    const [yourLogo, setyourLogo] = useState<string>("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
                const data = await response.json();
                const value = data.find((page: any) => page.name === "Landing Page");
                setContent(value.fields);
                const logoLen = ((value.fields[0].components[0].components[1].components).length)
                for (let i = 0; i < logoLen; i++) {
                    if ((value.fields[0].components[0].components[1].components[i].key) == "MediumLogo") {
                        setyourLogo(value.fields[0].components[0].components[1].components[i].url)
                        break;
                    }

                }

            } catch (error) {
            }
        };

        fetchContent();
    }, []);

    const isFieldEnabled = (key: string, config: any[]) => {
        const fieldConfig = config.find((field) => field.key === key);
        return fieldConfig ? fieldConfig.default : true;
    };
    const isFieldEnabledGeneric = (key: string) => isFieldEnabled(key, config);

    return (
        <div className="container p-0 top-nav-bar-container">
            <div className="row">
                <div className="col-md-12">
                    <nav className="navbar navbar-expand-lg">

                        <a className="navbar-brand" href="#">
                            {isFieldEnabledGeneric("logo") && (
                                <img className="navbar-logoImg" src={yourLogo} alt="Logo" />
                            )}
                        </a>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link className="nav-link text-primary" to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`}><i className="fa-solid fa-house"></i> Home</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link text-primary" href="#" id="navbarDropdown" role="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        {userName}<b><i className="fa-solid fa-chevron-down navbar-chevron-down"></i></b>
                                    </a>
                                    <ul className="dropdown-menu navbar-drop" aria-labelledby="navbarDropdown">
                                        <li><Link className="dropdown-item nav-content" to={`${process.env.REACT_APP_BASE_PATH}/myaccount`}><i className="fa-regular fa-user"></i> My account</Link></li>
                                        <li><Link className="dropdown-item nav-content" to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`}><i className="fa-solid fa-bullhorn"></i> My campaigns</Link></li>
                                        <li><a className="dropdown-item nav-content" onClick={navigateToCartlist}><i className="fa-solid fa-cart-shopping"></i> My cart ({cartItemCount})</a></li>
                                        <li><Link className="dropdown-item nav-content" to={`${process.env.REACT_APP_BASE_PATH}/contenthub`}><i className="fa-regular fa-folder-open"></i> Content hub</Link></li>
                                        <li><Link className="dropdown-item nav-content" onClick={handleLogout} to={`${process.env.REACT_APP_BASE_PATH}/`}><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                    </nav>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
