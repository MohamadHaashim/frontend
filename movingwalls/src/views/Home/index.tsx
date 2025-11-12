import React, { useEffect, useState } from "react";
import LandingLayout from "../../layouts/landing";
import { Link } from "react-router-dom";
import LogoImage from "../../assets/brand/home-logo.svg";
import LandingImage from '../../assets/images/mask-group@2x.png';
import LandingContent from "../../components/home/landing-image-content";
import ExploreProperties from "../../components/home/explore-properties";
import PropertiesCarousel from "../../components/home/properties-carousel";
import ClientServed from "../../components/home/client-served";
import ClientSays from "../../components/home/client-says";
import QuestionForm from "../../components/home/question-form";
import './index.css';
import { useMutation, useQuery } from "@apollo/client";
import client, { MEDIA_URL } from "../../Graphql/apolloClient";
import { Get_Country_Code, Get_Currency_Code_Details, Media_Id } from "../../Graphql/Queries";
interface LandingPageProps {
  setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
}
const LandingPage: React.FC<LandingPageProps> = ({ setCurrencyCode }) => {
  const [currencyCode, setLandingCurrencyCode] = useState<string>("");
  const [countryIds, setcountryId] = useState<string>("");
  const [config, setConfig] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [contactUsConfig, setContactUsConfig] = useState<any[]>([]);
  const [showFooter, setShowFooter] = useState<boolean>(false);
  const [headline, setHeadline] = useState<string>("");
  const [subHeadline, setSubHeadline] = useState<string>("");
  const [contactussubHeadline, setcontactusSubHeadline] = useState<string>("");
  const [contactusHeadline, setcontactusHeadline] = useState<string>("");
  const [headerLogo, setHeaderLogo] = useState<string>("");
  const [yourLogo, setyourLogo] = useState<string>("");
  const [terms, setTerms] = useState<string>("");
  const [privacy, setprivacy] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [insta, setInsta] = useState<string>("");
  const [backgroundImages, setBackgroundImage] = useState('');
  const [contactImage, setContactImage] = useState('');
  const [linkendIn, setLinkedIn] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");

  // Query to fetch country data
  const { data: countryData, error: countryError } = useQuery(Get_Country_Code, {
    variables: { ownerId: process.env.REACT_APP_COMPANY_ID },
    skip: !process.env.REACT_APP_COMPANY_ID,
    onError: (error) => {
      console.error("Error fetching country data:", error);
    },
  });
  useEffect(() => {
    if (countryData?.getCountryCodeNoToken) {
      localStorage.setItem("countryId", countryData.getCountryCodeNoToken.countryId);
      setcountryId(countryData.getCountryCodeNoToken.countryId);
      localStorage.setItem("countryName", countryData.getCountryCodeNoToken.countryName);
    }
  }, [countryData]);
  const companyId = localStorage.getItem("countryName")

  const fetchCurrencyCode = async () => {
    const variables = {
      countryCurrencyCode: companyId
    };
    try {
      const { data } = await client.query({
        query: Get_Currency_Code_Details,
        variables,
      });
      const { country, currencyCode } = data.currencyCodeDetails;
      setCurrencyCode(currencyCode);
      setLandingCurrencyCode(currencyCode);
      localStorage.setItem("currencyCode", data.currencyCodeDetails.currencyCode)
    } catch (err) {
      console.error("Fetch Content Error:", err);
    }
  }
  useEffect(() => {
    if (companyId) {
      fetchCurrencyCode();
    }
  }, [companyId]);
  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
        const data = await response.json();
        const value = data.find((page: any) => page.name === "Landing Page");
        setContent(value.fields);
        const headlineField = value.fields.find((field: any) => field.key === "headline");
        const subHeadlineField = value.fields.find((field: any) => field.key === "sub headline");
        const headerLogoField = value.fields.find((field: any) => field.key === "panel");
        const yourLogoImg = value.fields.find((field: any) => field.components && field.components.some((comp: { title: string; }) => comp.title === "General settings"));
        const logoLen = ((value.fields[0].components[0].components[1].components).length)
        for (let i = 0; i < logoLen; i++) {
          if ((value.fields[0].components[0].components[1].components[i].key) == "MediumLogo") {
            setyourLogo(value.fields[0].components[0].components[1].components[i].url)
            break;
          }

        }
        const values = data.find((page: any) => page.name === "Terms & conditions");
        const termLen = (values.fields[0].components[0].components).length;
        for (let i = 0; i < termLen; i++) {
          if ('key' in values.fields[0].components[0].components[i]) {
            if (values.fields[0].components[0].components[i].key === "terms_conditionsDocument") {
              if ((values.fields[0].components[0].components[i].defaultValue).length > 0) {
                setTerms(values.fields[0].components[0].components[i].defaultValue[0].data.text)
                break;
              }
            }
            else {
              if (values.fields[0].components[0].components[i].key === "TermsText") {
                setTerms(values.fields[0].components[0].components[i].defaultValue)
              }
            }
          }
        }

        const privacyvalues = data.find((page: any) => page.name === "Privacy Policy");
        const privacyLen = (privacyvalues.fields[0].components[0].components).length;
        for (let i = 0; i < privacyLen; i++) {
          if ('key' in privacyvalues.fields[0].components[0].components[i]) {
            if (privacyvalues.fields[0].components[0].components[i].key === "privacyPolicyDocument") {
              if ((privacyvalues.fields[0].components[0].components[i].defaultValue).length > 0) {
                setprivacy(privacyvalues.fields[0].components[0].components[i].defaultValue[0].data.text)
                console.log
                  (privacyvalues.fields[0].components[0].components[i].defaultValue[0].data.text)
                console.log(i);
                break;
              }
            }
            else {
              if (privacyvalues.fields[0].components[0].components[i].key === "privacyPolicyTemplate") {
                setprivacy(privacyvalues.fields[0].components[0].components[i].defaultValue)
                console.log(privacyvalues.fields[0].components[0].components[i].defaultValue)
                console.log(i)
              }
            }
          }
        }
        const clientImgField = value.fields.find((field: any) => field.title === "Testimonials");
        const addressField = value.fields.find((field: any) => field.key === "address");
        const websiteField = value.fields.find((field: any) => field.key === "WebsiteUrl");
        const emailField = value.fields.find((field: any) => field.key === "email");
        const socialMediaLinkField = value.fields.find((field: any) => field.key === "SocialmediaLinks");
        const [facebook, twitter, instagram, linkendIn] = socialMediaLinkField.components[0].components.map((component: { defaultValue: any; }) => component.defaultValue);
        const bgImageField = value.fields.find((field: any) => field.key === "Backgroundimage");
        if (bgImageField && bgImageField.defaultValue.length > 0) {
          const imageUrl = bgImageField.defaultValue[0].data.url;
          setBackgroundImage(bgImageField.url + imageUrl);

        }
        const contactImageField = value.fields.find((field: any) => field.key === "Contactusform");
        const contactLen = ((contactImageField.components[0].components).length);
        for (let i = 0; i < contactLen; i++) {
          if ('key' in contactImageField.components[0].components[i]) {
            const key = contactImageField.components[0].components[i].key;
            const value = contactImageField.components[0].components[i].defaultValue;
            if (key === "Contactheadline") {
              setcontactusHeadline(value);
            } else if (key === "contactsubHeadline") {
              setcontactusSubHeadline(value);
            }
            else if (key === "contanctusClientImage") {
              setContactImage(value[0].data.url);
            }

          }
        }
        // setContactImage(contactImageField.components[0].components[3].url + contactImageField.components[0].components[3].defaultValue[0].url);
        const token: any = localStorage.getItem('authToken');
        setAuthToken(token);
        setFacebook(facebook);
        setTwitter(twitter);
        setInsta(instagram);
        setLinkedIn(linkendIn);
        setAddress(addressField.defaultValue);
        setWebsite(websiteField.defaultValue);
        setEmail(emailField.defaultValue);
        setHeadline(headlineField.defaultValue);
        setSubHeadline(subHeadlineField.defaultValue);
        setHeaderLogo(headerLogoField);
      } catch (error) {
      }
    };

    fetchContent();
  }, []);

  // Fetch configuration data
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
        const data = await response.json();
        const landingPageConfig = data.find((page: { name: string; }) => page.name === "Landing Page");
        const contactusConfig = data.find((page: { name: string; }) => page.name === "Contact Us");
        setConfig(landingPageConfig.configurations || []);
        setContactUsConfig(contactusConfig.configurations || []);
        const footerConfig = landingPageConfig.configurations.find((item: { key: string; }) => item.key === "footer");
        setShowFooter(footerConfig ? footerConfig.default : true);

      } catch (error) {
        console.error("Error fetching config data:", error);
      }
    };

    fetchConfig();
  }, []);

  const isFieldEnabled = (key: string, config: any[]) => {
    const fieldConfig = config.find((field) => field.key === key);
    return fieldConfig ? fieldConfig.default : true;
  };
  const isFieldEnabledGeneric = (key: string) => isFieldEnabled(key, config);
  const isContactUsFieldEnabledGeneric = (key: string) => isFieldEnabled(key, contactUsConfig);
  const isFieldEnabledCNumber = (key: string) => isFieldEnabled(key, contactUsConfig);
  const isLandingImageEnabled = isFieldEnabledGeneric("do you need an image in your landing page");
  return (
    <LandingLayout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <nav className="navbar navbar-expand-lg">
              <Link to={`${process.env.REACT_APP_BASE_PATH}/landing-page`}>
                {isFieldEnabledGeneric("logo") && (
                  <img className="logo-img" src={yourLogo} alt="Your Logo" />
                )}
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <form className=" nav-btn landing-nav">
                  {isFieldEnabledGeneric("Explore") && (
                    <Link to={`${process.env.REACT_APP_BASE_PATH}/explore-property`}><button className="landing-btn btn-outline-primary" type="button">Explore</button></Link>)}
                  <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-in`}>
                    {isFieldEnabledGeneric("login") && (
                      <button className="landing-btn login-btn" type="button">Login</button>
                    )}
                  </Link>
                </form>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="landing-bg">
        {/* {isFieldEnabledGeneric("do you need an image in your landing page") && (
          <> */}
        <div
          className={`landing-img ${isLandingImageEnabled ? 'show-image' : ''}`}
          style={{
            backgroundImage: isLandingImageEnabled && backgroundImages ? `url(${LandingImage})` : '',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat', margin: 'auto', width: '100%', height: '100%'
          }}
        > <div className="container">
            <div className="row">
              <div className="col-md-12">
                <LandingContent
                  showHeadline={isFieldEnabledGeneric("headline")}
                  showSubHeadline={isFieldEnabledGeneric("sub headline")}
                  headline={headline}
                  subHeadline={subHeadline}
                />
              </div>
            </div>
          </div>
        </div>
        {/* </>
        )} */}
        <div className="container">
          {isFieldEnabledGeneric("featured properties") && (
            <div className="explore-pro">
              <div className="row">
                <div className="explore-cnt1 col-md-6">
                  <h2>Explore billboards</h2>
                </div>
                <div className="explore-cnt2 col-md-6">
                  {true ? (
                    <p><Link to={`${process.env.REACT_APP_BASE_PATH}/explore-property`}>View all</Link></p>) : (
                    <p data-bs-toggle="modal" data-bs-target="#redirectToLoginModal" >View all</p>
                  )}
                </div>
              </div>
              <ExploreProperties countryIds={countryIds} currencyCode={currencyCode} />
            </div>
          )}
          {isFieldEnabledGeneric("popular properties") && (
            <div className="properties-carousel row">
              <div className="col-md-12">
                <h2>Billboards with maximum views</h2>
              </div>
              <PropertiesCarousel currencyCode={currencyCode} />
            </div>
          )}
          {isFieldEnabledGeneric("clients we have served") && (
            <div className="client-served-cnt row">
              <div className=" col-md-12">
                <h2>Clients we’ve served</h2>
              </div>
              <ClientServed />
            </div>
          )}
          {isFieldEnabledGeneric("clients testimonials") && (
            <div className="client-says-cnt row">
              <div className="col-md-12">
                <h2>What our clients say</h2>
              </div>
              <div className="client-says-cnt-content col-md-12">
                <ClientSays />
              </div>
            </div>
          )}
          <div className="row">
            {isFieldEnabledGeneric("start a campaign") && (
              <div className="client-start col-md-12 text-center">
                {true ? (<Link to={`${process.env.REACT_APP_BASE_PATH}/sign-in`}><button className="btn btn-primary">Start Campaign</button></Link>) : (
                  <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#redirectToLoginModal">Start Campaign</button>
                )}
              </div>
            )}
          </div>


          <div className="question-cnt row">
            {isFieldEnabledGeneric("contact form") && (<>
              <div className="col-md-6">
                <div className="question-cnt-left">
                  <h1>{contactusHeadline}</h1>
                  <p>{contactussubHeadline}</p>
                </div>
              </div>
              <QuestionForm
                showEmailField={isContactUsFieldEnabledGeneric("e-mail")}
                showContactImg={isFieldEnabledGeneric("add image for contact us")}
                showNamelField={isContactUsFieldEnabledGeneric("fullName")}
                showCNumber={isFieldEnabledCNumber("phoneNumber")}
                showMessageField={isContactUsFieldEnabledGeneric("message")}
                contactImageField={contactImage}
              />
            </>)}
          </div>


        </div>

        {showFooter && (
          <div className="footer-cnt">
            <div className="container">
              <div className="footer-container">
                <div className="row">
                  <div className="footer-left-cnt col-md-6">
                    <p>Contact</p>
                    {isFieldEnabledGeneric("contact email") && (
                      <h5>{email}</h5>
                    )}
                  </div>

                  <div className="footer-right-cnt col-md-6">
                    {isFieldEnabledGeneric("social media links") && (
                      <>
                        <a target="_blank" href={facebook}><i className="fa-brands fa-facebook"></i></a>
                        <a target="_blank" href={twitter}><i className="fa-brands fa-twitter"></i></a>
                        <a target="_blank" href={insta}><i className="fa-brands fa-instagram"></i></a>
                        <a target="_blank" href={linkendIn}> <i className="fa-brands fa-linkedin"></i></a>
                      </>
                    )}

                  </div>
                  <div className="footer-left-cnt col-md-6">
                    {isFieldEnabledGeneric("address") && (
                      <>
                        <p>Address</p>
                        <h5>{address}</h5>
                      </>
                    )}
                  </div>

                  <div style={{ cursor: 'pointer' }} className="footer-right-cnt col-md-6" >
                    <p>
                      {isFieldEnabledGeneric("terms&conditions") && (
                        <span data-bs-toggle="modal" data-bs-target="#terms&condition">Terms & conditions</span>)}
                      {isFieldEnabledGeneric("privacy policy") && (
                        <span data-bs-toggle="modal" data-bs-target="#privacypolicy">| Privacy policy</span>)}</p>
                  </div>
                  <div className="footer-left-cnt col-md-6">
                    <p>Website</p>
                    <h5>{website}</h5>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}


      </div>



      <div className="modal fade" id="terms&condition" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header term-header">
              <h5 className="modal-title terms-title" id="exampleModalLabel">Terms & conditions</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body term-body">
              <p>{terms}</p>
            </div>
            <div className="modal-footer term-footer">
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="privacypolicy" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header term-header">
              <h5 className="modal-title terms-title" id="exampleModalLabel">Privacy Policy</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body term-body">
              {privacy}
            </div>
            <div className="modal-footer term-footer">
            </div>
          </div>
        </div>
      </div>
      {/* <div className="modal fade" id="redirectToLoginModal" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header explore_property_filter_popup_header border-0" >
              <h5 className="modal-title">Warning !</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              You need to be login to view
              <div className="text-center">
                <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-in`}><button className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Login</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div> */}


    </LandingLayout>
  );
};

export default LandingPage;
