import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { useMutation, useQuery } from "@apollo/client";
import { GET_COUNTRY_LIST, GET_STATE_LIST, REGISTER_MUTATION } from "../../../Graphql/Queries";

const CompanyDetailsForm: React.FC<{ companyNameInput: string, designationInput: string, phoneCountryCodeInput: string, phoneNoInput: string }> = ({ companyNameInput, designationInput, phoneCountryCodeInput, phoneNoInput }) => {

  const [companyName, setCompanyName] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [stateOptions, setStateOptions] = useState<{
    stateId: string | null;
    id: string;
    name: string;
  }[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ id: string; name: string; dialingCode: string }[]>([]);
  const [selectedCountryDialingCode, setSelectedCountryDialingCode] = useState<string>("");

  const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>();
  const location = useLocation();
  const userData = location.state;
  const navigate = useNavigate();




  // Country List Dropdwon

  const { data: countryData } = useQuery(GET_COUNTRY_LIST);

  useEffect(() => {
    if (countryData && countryData.countryList) {
      setCountryOptions(countryData.countryList);
    }
  }, [countryData]);

  // State List Dropdwon

  const { data: stateData } = useQuery(GET_STATE_LIST, {
    variables: { countryId: selectedCountryId },
    skip: !selectedCountryId,
  });

  useEffect(() => {
    if (stateData && stateData.stateList) {
      setStateOptions(stateData.stateList);
    }
  }, [stateData]);



  // Selected Country DialingCode Is Phone Number Input side Showed Method

  const handleCountryChange = (e: { target: { value: string } }) => {
    const selectedId = e.target.value;
    const selectedCountry = countryOptions.find(country => country.id === selectedId);

    if (selectedCountry) {
      setSelectedCountryId(selectedCountry.id); // Set the selected country ID
      setCountry(selectedId);
      setCountryName(selectedCountry.name)
      setSelectedCountryDialingCode(selectedCountry.dialingCode);
    } else {
      setCountry("");
      setSelectedCountryDialingCode("");
    }
  };


  // Company Details Intergration

  const isFormValid = () => {
    return companyName && designation && industry && country && state && companyAddress && contactNumber && phoneNumber;
  };


  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmit(true);

    if (!isFormValid()) return;

    const companyData = {
      userData,
      userCompanyName: companyName,
      userCompanyId: "vanigam",
      jobTitle: designation,
      industry: industry,
      country: countryName,
      state: stateName,
      selectedCountryDialingCode: selectedCountryDialingCode,
      userCompanyAddress: companyAddress,
      contactNumber: contactNumber,
      userCompanyPhoneNumber: phoneNumber
    };

    navigate(`${process.env.REACT_APP_BASE_PATH}/register-password`, { state: companyData });
  };


  //   if (redirect) {
  //     return <Navigate to={redirect} />;
  //   }

  return (
    <>
      <form onSubmit={handleNext}>
        <div className="company-details-form">
          <h4 className="company-details-form-headline">Company details</h4>

          <div className="row">
            {companyNameInput && (
              <div className="col-md-12">
                <div className="company-details-hatimbig-parent">
                  <input
                    className="company-details-hatimbig"
                    placeholder="Company Name"
                    type="text"
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <div className={`company-details-frame-cname ${submit && !companyName ? 'error' : ''}`}></div>
                  {submit && !companyName && <div className="text-danger error-message-required">Company name is required</div>}
                </div>
              </div>
            )}
            {designationInput && (
              <div className="col-md-6">
                <div className="company-details-hatimbig-parent">
                  <input
                    className="company-details-hatimbig"
                    placeholder="Designation"
                    type="text"
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                  <div className={`company-details-frame-designation ${submit && !designation ? 'error' : ''}`}></div>
                  {submit && !designation && <div className="text-danger error-message-required">Designation is required</div>}
                </div>
              </div>
            )}
            <div className="col-md-6">
              <div className="company-details-hatimbig-parent">
                <input
                  className="company-details-hatimbig"
                  placeholder="Industry"
                  type="text"
                  onChange={(e) => setIndustry(e.target.value)}
                />
                <div className={`company-details-frame-industry ${submit && !industry ? 'error' : ''}`}></div>
                {submit && !industry && <div className="text-danger error-message-required">Industry is required</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="company-details-hatimbig-parent dropdown-method-topside">
                <div className="companyform-group">
                  <span className="dialing-codes">{selectedCountryDialingCode}</span>
                  <select
                    onChange={handleCountryChange}
                    id="country"
                    className="country-select"
                    value={country}
                    style={{
                      paddingLeft: selectedCountryDialingCode ? '50px' : '18px', background: 'transparent', marginTop: '10px', color: '#888',
                      ...(submit && country.length === 0 ? { borderColor: "red" } : {}),
                    }}
                  >
                    <option disabled value="">Country</option>
                    {countryOptions.length > 0 ? (
                      countryOptions.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No countries available</option>
                    )}
                  </select>
                </div>
                <div className="company-details-frame-country"></div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="company-details-hatimbig-parent">
                <div className="companyform-group">

                  <select
                    onChange={(e) => {
                      const selectedState = stateOptions.find((list) => list.stateId === e.target.value);
                      setState(e.target.value); setStateName(selectedState ? selectedState.name : "");
                    }} // Sets stateId as the value
                    value={state}
                    id="state"
                    className="country-select"
                    disabled={!country}
                  >
                    <option disabled value="">State</option>
                    {stateOptions.length > 0 ? (
                      stateOptions.map((list) => (
                        list.stateId ? (
                          <option key={list.stateId} value={list.stateId}>
                            {list.name}
                          </option>
                        ) : null // If stateId is null, render nothing
                      ))
                    ) : (
                      <option value="">No states available</option>
                    )}
                  </select>
                </div>
                <div className="company-details-frame-state"></div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="company-details-hatimbig-parent">
                <input
                  className="company-details-hatimbig"
                  placeholder="Company Address"
                  type="text"
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                />
                <div className={`company-details-frame-caddress ${submit && !companyAddress ? 'error' : ''}`}></div>
                {submit && !companyAddress && <div className="text-danger error-message-required">Company address is required</div>}
              </div>
            </div>
            <div className="col-md-6">

              <div className="company-details-hatimbig-parent">
                <input
                  className="company-details-hatimbig"
                  placeholder="Compay ID"
                  type="text"
                  maxLength={12}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
                <div className={`company-details-frame-cnumber ${submit && !contactNumber ? 'error' : ''}`}></div>
                {submit && !contactNumber && <div className="text-danger error-message-required">Contact number is required</div>}
              </div>
            </div>

            {phoneCountryCodeInput && (
              <div className="col-md-6">
                <div className="company-details-hatimbig-parent">
                  <span style={{ color: "#888" }}> {selectedCountryDialingCode}
                    <input style={{ marginLeft: "5px" }}
                      className="company-details-hatimbig"
                      placeholder="Company's phone number"
                      type="text"
                      maxLength={12}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </span>
                  <div className={`company-details-frame-pnumber ${submit && !phoneNumber ? 'error' : ''}`}></div>
                  {submit && !phoneNumber && <div className="text-danger error-message-required">Phone number is required</div>}
                </div>
              </div>
            )}
            <div className="company-details-register-btn">
              <button className={`${!isFormValid() ? 'disabled' : ''}`} disabled={!isFormValid()}>Next</button>
            </div>
            <div className="register-link">
              <span className="company-details-not-a-member">
                Already have an account?{" "}
              </span>
              <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-in`} className="company-details-register-now" id="signup-link">
                Login
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CompanyDetailsForm;
