import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import ChromeExtn from "../../assets/images/chrome-extension.svg";
import FirefoxExtn from "../../assets/images/firefox-extension.png";

interface FormState {
  redirect: string | null;
  token: string;
  extensionName: string;
  extensionVersion: string;
  extensionType: string;
  manifestVersion: string;
  extensionDownloaded: boolean;
}

const BrowserExtension: React.FC = () => {
  const navigate = useNavigate();

  const [state, setState] = useState<FormState>({
    token: "",
    extensionName: "",
    extensionVersion: "",
    extensionType: "",
    manifestVersion: "",
    redirect: null,
    extensionDownloaded: false,
  });

  const [extensionDownloaded, setExtensionDownloaded] =
    useState<boolean>(false);

  useEffect(() => {
    const browserExtensionElement = document.getElementById(
      "Aimosa_Browser_Extension"
    ) as HTMLInputElement;
    if (browserExtensionElement && browserExtensionElement.value) {
      const parsedElement = JSON.parse(browserExtensionElement.value);

      setState((prev) => ({
        ...prev,
        extensionType: parsedElement.type,
        manifestVersion: parsedElement.manifest_version,
        extensionName: parsedElement.name || "not installed",
        extensionVersion: parsedElement.version || "ot installed",
        isExtensionInstalled: true,
      }));
    }
  }, []);

  useEffect(() => {
    const browserExtn = document.getElementById(
      "Aimosa_Browser_Extension"
    ) as HTMLInputElement;
    if (browserExtn && browserExtn.value) {
      const extensionDetails = JSON.parse(browserExtn.value);
      console.log("Extension Name from Hidden Input:", extensionDetails.name);
      console.log(
        "Extension Version from Hidden Input:",
        extensionDetails.version
      );

      const extensionDownloaded = localStorage.getItem("extensionDownloaded");
      if (extensionDownloaded === "true") {
        setExtensionDownloaded(true);
      }
    }

    document
      .getElementById("extensionIcon")
      ?.addEventListener("click", handleInstall);

    return () => {
      document
        .getElementById("extensionIcon")
        ?.removeEventListener("click", handleInstall);
    };
  }, []);

  const saveExtensionDetailsToLocalStorage = (extensionDetails: {
    name: string;
    version: string;
  }) => {
    localStorage.setItem("extensionDetails", JSON.stringify(extensionDetails));
  };

  const handleInstall = () => {
    const { extensionName, extensionVersion } = state;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;

    saveExtensionDetailsToLocalStorage({
      name: extensionName,
      version: extensionVersion,
    });

    localStorage.setItem("extensionDownloaded", "true");

    setExtensionDownloaded(true);

    window.open(
      `https://chrome.google.com/webstore/detail/aimosa/fhefiglehhbhabmbenjaidfpedlnfdgg`,
      "_blank",
      `width=${viewportWidth},height=600`
    );
    localStorage.setItem("extensionDownloaded", "true");
    setState((prev) => ({ ...prev, extensionDownloaded: true }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    if (extensionDownloaded) {
      // If the extension is downloaded, redirect to the sync page
      navigate("/Dashboard");
    } else {
      // If the extension is not downloaded, open the extension installation window
      const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth;
      window.open(
        `https://chrome.google.com/webstore/detail/aimosa/fhefiglehhbhabmbenjaidfpedlnfdgg`,
        "_blank",
        `width=${viewportWidth},height=600`
      );
    }

    event.preventDefault();
  };

  const handleSyncClick = () => {
    const userToken = localStorage.getItem("userToken");
    const syncData = {
      userToken: userToken,
      daysToSync: 30,
      timeUnit: "Daily",
    };
    const apiCall = fetch(
      "https://api.aimosa.io/BackgroundServices/Ads/SyncUserQueue",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(syncData),
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    });

    const kdpWindow = window.open(
      `https://account.kdp.amazon.com?t=${userToken}`,
      "_blank",
      "width=800,height=600"
    );

    Promise.all([apiCall, kdpWindow]).then(([apiResponse]) => {
      console.log("API response:", apiResponse);
    });
  };

  return (
    <DefaultLayout>
      <div className="contanier-type2">
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            id="Aimosa_Browser_Extension"
            value={JSON.stringify({
              name: state.extensionName,
              version: state.extensionVersion,
            })}
          />
          <div className="center-title">
            <h2>Welcome to Aimosa</h2>
            <p>Getting ready to begin...</p>
          </div>
          <div className="mb-3">
            <h3 className="mb-2">Browser Extension</h3>
            <p>Get started by installing our browser extension</p>
            <div className="row">
              <div className="col-md-6 mb-3" style={{ alignItems: "center" }}>
                <div className="extension-box">
                  <img
                    src={ChromeExtn}
                    alt="chrom extension"
                    className="mb-4"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleInstall}
                  id="extensionIconChrome"
                  style={{
                    marginLeft: "20px",
                    padding: "8px",
                    backgroundColor: "#00D26E",
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                >
                  <div className="note">Install Chrome Extension</div>
                </button>
              </div>
              <div className="col-md-6 mb-3" style={{ alignItems: "center" }}>
                <div className="extension-box">
                  <img
                    src={FirefoxExtn}
                    alt="firefox extension"
                    className="mb-4"
                  />
                </div>
                <button
                  type="button"
                  // onClick={handleInstall}
                  id="extensionIconFirefox"
                  style={{
                    marginLeft: "20px",
                    padding: "8px",
                    backgroundColor: "#00D26E",
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                >
                  <div className="note">Install Firefox Extension</div>
                </button>
              </div>
              <div>
                <p> Name: {state.extensionName}</p>
                <p>Extension Version: {state.extensionVersion}</p>
              </div>
              {extensionDownloaded && (
                <div className="d-grid onboard-success-btn">
                  <div className="col-md-12">
                    <button
                      type="button"
                      onClick={handleSyncClick}
                      className="btn btn-primary"
                    >
                      Sync Now
                    </button>
                  </div>
                </div>
              )}
              <p>
                With the extension installed, simply click to launch Aimosa and
                get up and running in under a minute.
              </p>
            </div>

            <div className="browser-extn-note">
              <div className="row">
                <div className="col-md-12">
                  <p>
                    You don't need to keep the browser with the extension
                    running all the time. Simply check in whenever you want to
                    review your numbers, and Aimosa will stay in sync with KDP
                    and Amazon ads. Just visit <a href="/">aimosa.io</a> to get
                    started.
                  </p>
                </div>
                <div className="col-md-12">
                  <h6 className="mb-0">Still having trouble?</h6>
                  <p className="mb-0">
                    We're here to help. Send an email to{" "}
                    <a href="mailto:help@aimosa.io">help@aimosa.io</a> and we'll
                    help you get up and running in a way that works for you!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-grid onboard-success-btn">
            <div className="row">
              <div className="col-md-12">
                <button type="submit" className="btn btn-primary">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default BrowserExtension;
