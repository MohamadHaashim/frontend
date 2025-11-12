import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import FilterLogo from "../../assets/images/sliders@2x.png";
import BackIcon from "../../assets/images/back-icon.svg";
import SearchLogo from "../../assets/images/search.svg";
import DoubleChevron from "../../assets/images/doublechevron.svg";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import client from "../../Graphql/apolloClient";
import ContentFilter from '../../assets/images/contentfilter.png';
import ContentVideo from '../../assets/images/contentvideo.png';
import ContentImg from '../../assets/images/contentpic.png'
import { GRAPHQL_URI } from '../../Graphql/apolloClient';
import { CONTENT_HUB_QUERY, DELETE_CONTENT_MUTATION } from "../../Graphql/Queries";
import './index.css';
import { generateMockData } from "../../Graphql/MockData";

interface ContentHubList {
  id: string;
  fileName: string;
  mimeType: string;
  thumbnail: string;
  resolution: string;
  duration: string;
  filePath: string;
}

const ContentHub = () => {
  const [contentHubList, setContentHubList] = useState<ContentHubList[]>([]);
  const [filteredResults, setFilteredResults] = useState<ContentHubList[]>([]);
  const [deleteContent] = useMutation(DELETE_CONTENT_MUTATION);
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>([]);
  const [selectedMimeType, setSelectedMimeType] = useState<string | null>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");
  const companyId = process.env.REACT_APP_COMPANY_ID;
  const userId = localStorage.getItem("userId");

  const { loading: loadingCartList, error: errorCartList, data: dataCartList, refetch: refetchContentHubList } = useQuery(CONTENT_HUB_QUERY, {
    variables: {
      accessToken: token,
      page: currentPage - 1,
      size: 10,
      metadatatype: "LMX_CREATIVE",
      metadatacampaign: false,
      companyId: companyId,
      creatives: true,
      userId: userId,
      sort: "lastModifiedDate,desc",
      fileName: search,
      resolution: selectedResolutions.length > 0 ? selectedResolutions.join(',') : "",
      mimeType: selectedMimeType || "",
    }
  });

  const fetchContentHubList = async (page: number = currentPage) => {
    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    setLoading(true);

    const variables = {
      accessToken: token,
      page: page - 1,  // Zero-based index for the backend
      size: 10,
      metadatatype: "LMX_CREATIVE",
      metadatacampaign: false,
      companyId: companyId,
      creatives: true,
      userId: userId,
      sort: "lastModifiedDate,desc",
      fileName: search,
      resolution: selectedResolutions.length > 0 ? selectedResolutions.join(',') : "",
      mimeType: selectedMimeType || "",
    };

    try {
      const { data } = await client.query({
        query: CONTENT_HUB_QUERY,
        variables,
      });

      const contentHub = data.contentHub || [];
      setContentHubList(contentHub);
      setFilteredResults(contentHub);

      // Use totalPages returned from the backend or calculate it if not provided
      const totalPages = data.totalPages > 0 ? data.totalPages : Math.ceil(contentHub.length / 5);
      setTotalPages(totalPages);

    } catch (err) {
      console.error("Fetch Content Error:", err);
      toast.error("An unexpected error occurred while fetching content");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchContentHubList(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };


  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };
  //Select all checkbox
  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      const allIds = filteredResults.map(content => content.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  useEffect(() => {
    if (process.env.REACT_APP_MOCK_DATA === 'true') {
      generateMockData(CONTENT_HUB_QUERY).then((mockResponse: any) => {
        const data = mockResponse.data
        setContentHubList(data.contentHub);
        setFilteredResults(data.contentHub);
        setTotalPages(data.contentHub[0]?.totalPages || 0);

      }).catch((err: any) => {
        console.error("Error generating mock data:", err);
      });
    } else {
      fetchContentHubList();
    }

  }, [currentPage, search]);
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteItem = (id: string) => {
    setDeleteItemId(id);
    const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !deleteItemId) return;

    setIsLoading(true);

    try {
      const response = await deleteContent({ variables: { accessToken: token, contentIds: [deleteItemId] } });
      const message = response.data.deleteContent[0].message;
      if (message.startsWith("error.")) {
        toast.warn("Internal server Error");
      } else {
        toast.success(message);
        window.location.reload();
        fetchContentHubList();
      }
    } catch (error) {
      toast.error("Failed to delete content");
      window.location.reload();
    } finally {
      setIsLoading(false);
      const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
      modal.hide();
      setDeleteItemId(null);
    }
  };


  //Delete All
  const handleDeleteAll = async () => {

    if (selectedIds.length === 0) {
      toast.warn("No items selected for deletion");
      return;
    }
    const modal = new window.bootstrap.Modal(document.getElementById('deleteAllModal'));
    modal.show();
  }
  const confirmDeleteAll = async () => {
    const token = localStorage.getItem("authToken");
    setIsLoading(true);
    try {
      const response = await deleteContent({ variables: { accessToken: token, contentIds: selectedIds } });
      const message = response.data.deleteContent[0].message;
      if (message.startsWith("error.")) {
        toast.warn("Internal server Error");
      } else {
        toast.success(message);
        window.location.reload();
        fetchContentHubList();
        setSelectedIds([]);
      }
    } catch (error) {
      toast.error("Failed to delete selected content");
      window.location.reload();
    }
    finally {
      setIsLoading(false);
      const modal = new window.bootstrap.Modal(document.getElementById('deleteAllModal'));
      modal.hide();
      setDeleteItemId(null);
    }
  };
  {/* Filter Data */ }
  const handleApplyFilters = () => {
    const filteredResults = contentHubList.filter(content => {
      const matchesResolution = selectedResolutions.length === 0 || selectedResolutions.includes(content.resolution);
      const matchesMimeType = !selectedMimeType || content.mimeType === selectedMimeType;

      return matchesResolution && matchesMimeType;
    });

    setFilteredResults(filteredResults);
  };


  //File Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
  };


  const handleUpload = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !companyId || !userId) {
      toast.error("Missing authentication data.");
      return;
    }

    if (files.length === 0) {
      toast.warn("No files selected for upload.");
      return;
    }

    setUploadProgress(new Array(files.length).fill(0));

    let successfulUploads = 0; // Track the number of successful uploads

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("operations", JSON.stringify({
        query: `mutation UploadContent($accessToken: String!, $file: Upload!, $mediaOwnerId: String!, $filetype: String!, $source: String!, $userId: String!) {
          uploadcontent(
            accessToken: $accessToken,
            file: $file,
            mediaOwnerId: $mediaOwnerId,
            filetype: $filetype,
            source: $source,
            userId: $userId
          ) {
            success
            message
          }
        }`,
        variables: {
          accessToken: token,
          file: null,
          mediaOwnerId: companyId,
          filetype: "LMX_CREATIVE",
          source: "LMX_COMMERCE",
          userId: userId,
        },
      }));

      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", files[i]);

      const xhr = new XMLHttpRequest();

      // Track the upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prev) => {
            const updatedProgress = [...prev];
            updatedProgress[i] = percentComplete;
            return updatedProgress;
          });
        }
      });

      xhr.open('POST', GRAPHQL_URI);
      xhr.onload = () => {
        const responseData = JSON.parse(xhr.responseText);

        if (xhr.status !== 200) {
          toast.error(responseData.errors ? responseData.errors[0].message : "File upload failed");
          return;
        }

        if (responseData.data.uploadcontent.success) {
          successfulUploads++; // Increment successful upload counter
          toast.success(`File uploaded successfully`);

          // Check if all files have been successfully uploaded
          if (successfulUploads === files.length) {
            setUploadProgress([]);
            setPreviewUrls([]);
            setFiles([]);
            fetchContentHubList();
            window.location.reload();
          }
        } else {
          toast.error(responseData.data.uploadcontent.message);
        }
      };

      xhr.onerror = () => {
        toast.error("Failed to upload file.");
      };
      xhr.send(formData);
    }
  };

  const handleDelete = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setUploadProgress((prevProgress) => prevProgress.filter((_, i) => i !== index));
  };



  const handleResolutionReset = () => {
    setSelectedResolutions([]);
    setSelectedMimeType(null);
    refetchContentHubList();
  };
  const handleMimeReset = () => {
    setSelectedMimeType(null);
    refetchContentHubList();
  };

  //Data Search
  const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setSearch(event.currentTarget.value);
      setCurrentPage(1)
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRotate = () => {
    setSearch('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  return (
    <AuthLayout>
      <>
        <div className="contenthub-full-content">
          <div className="container mt-2">
            <div className="navbar-back-btn"><img alt="" src={BackIcon} /><Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`} >Back</Link> </div>
          </div>
          <div className="container content-hub-grand-parent">
            <form className="content-hub-form">
              <div className="contenthub-head">
                <h5>Content Hub</h5>
              </div>
              <div className="content-hub-parent row">
                <div className="contenthub-search col-md-6">
                  <img src={SearchLogo} alt="" />
                  <input
                    type="text" className="border-bottom-only no-focus-border"
                    placeholder="Search for your campaigns"
                    ref={inputRef}
                    onKeyDown={handleSearchChange}

                  />
                  <span>
                    <i onClick={handleRotate} className="fa-solid fa-rotate"></i>
                  </span>
                </div>
                <div className="contenthub-buttons col-md-6">
                  <button type="button" className="content-upload" data-bs-toggle="modal" data-bs-target="#FilterUpload">UPLOAD</button>
                  <button type="button" className="content-filter" data-bs-toggle="modal" data-bs-target="#FilterRes">Filters</button>
                  {/* <img src={FilterLogo} alt="" /> */}
                  <svg className="property_list_filter_icon" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_819_70172)">
                      <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M10.3516 14.163C10.3516 13.804 10.6426 13.513 11.0016 13.513H16.2516C16.6105 13.513 16.9016 13.804 16.9016 14.163C16.9016 14.522 16.6105 14.813 16.2516 14.813L11.0016 14.813C10.6426 14.813 10.3516 14.522 10.3516 14.163Z"></path>
                      <path fill="#232222" fill-rule="evenodd" clip-rule="evenodd" d="M2.10156 14.163C2.10156 13.804 2.39258 13.513 2.75156 13.513H8.00156C8.36055 13.513 8.65156 13.804 8.65156 14.163C8.65156 14.522 8.36055 14.813 8.00156 14.813H2.75156C2.39258 14.813 2.10156 14.522 2.10156 14.163Z"></path>
                      <path fill="#232222" fill-rule="evenodd" clip-rule="evenodd" d="M8.85156 8.49636C8.85156 8.13737 9.14258 7.84635 9.50156 7.84635L16.2516 7.84635C16.6105 7.84635 16.9016 8.13737 16.9016 8.49635C16.9016 8.85534 16.6105 9.14635 16.2516 9.14635H9.50156C9.14258 9.14635 8.85156 8.85534 8.85156 8.49636Z"></path>
                      <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M2.10156 8.49636C2.10156 8.13737 2.39258 7.84635 2.75156 7.84635H6.50156C6.86055 7.84635 7.15156 8.13737 7.15156 8.49636C7.15156 8.85534 6.86055 9.14635 6.50156 9.14635H2.75156C2.39258 9.14635 2.10156 8.85534 2.10156 8.49636Z"></path>
                      <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M11.8516 2.82969C11.8516 2.4707 12.1426 2.17969 12.5016 2.17969L16.2516 2.17969C16.6105 2.17969 16.9016 2.4707 16.9016 2.82969C16.9016 3.18867 16.6105 3.47969 16.2516 3.47969L12.5016 3.47969C12.1426 3.47969 11.8516 3.18867 11.8516 2.82969Z"></path>
                      <path fill="#232222" fill-rule="evenodd" clip-rule="evenodd" d="M2.10156 2.82969C2.10156 2.4707 2.39258 2.17969 2.75156 2.17969L9.50156 2.17969C9.86055 2.17969 10.1516 2.4707 10.1516 2.82969C10.1516 3.18867 9.86055 3.47969 9.50156 3.47969L2.75156 3.47969C2.39258 3.47969 2.10156 3.18867 2.10156 2.82969Z"></path>
                      <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M11.0016 16.938C10.6426 16.938 10.3516 16.647 10.3516 16.288V12.038C10.3516 11.679 10.6426 11.388 11.0016 11.388C11.3605 11.388 11.6516 11.679 11.6516 12.038V16.288C11.6516 16.647 11.3605 16.938 11.0016 16.938Z"></path>
                      <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M6.50156 11.2714C6.14258 11.2714 5.85156 10.9803 5.85156 10.6214L5.85156 6.37136C5.85156 6.01237 6.14258 5.72136 6.50156 5.72136C6.86055 5.72136 7.15156 6.01237 7.15156 6.37135V10.6214C7.15156 10.9803 6.86055 11.2714 6.50156 11.2714Z"></path>
                      <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M12.5016 5.60469C12.1426 5.60469 11.8516 5.31367 11.8516 4.95469V0.704687C11.8516 0.345702 12.1426 0.0546875 12.5016 0.0546875C12.8605 0.0546875 13.1516 0.345702 13.1516 0.704687V4.95469C13.1516 5.31367 12.8605 5.60469 12.5016 5.60469Z"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_819_70172">
                        <rect width="17" height="18" fill="white" transform="translate(0.5 17) rotate(-90)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="contenthub-second-head col-md-6">
                  <h5>Creatives</h5>
                </div>
                <div className="contenthub-deleteall col-md-6">
                  <p onClick={handleDeleteAll}><i className="fa-solid fa-trash-can"></i> Delete All</p>
                </div>
              </div>
              <div className="contenthub-scrollbar">
                {loading ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                    <span className="loading-circle sp1">
                      <span className="loading-circle sp2">
                        <span className="loading-circle sp3"></span>
                      </span>
                    </span>
                  </div>
                ) : (
                  <table className="table table-hover content-hub-table">
                    <thead className="content-hub-thead">
                      <tr>
                        <th><input
                          type="checkbox"
                          checked={selectedIds.length === filteredResults.length && filteredResults.length > 0}
                          onChange={handleSelectAllChange}
                        /></th>
                        <th scope="col">Creative name</th>
                        <th scope="col">Creative type <img src={ContentFilter} alt="" /></th>
                        <th scope="col">Duration <img src={DoubleChevron} alt="" /></th>
                        <th scope="col">Resolution <img src={DoubleChevron} alt="" /></th>
                        <th className="delete-cell"></th>
                      </tr>
                    </thead>
                    <tbody className="content-hub-tbody">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((content) => (
                          <tr key={content.id} className="delete-cell">
                            <th scope="row">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(content.id)}
                                onChange={() => handleCheckboxChange(content.id)}
                              />
                            </th>
                            <td className="contenthub-img">
                              <img src={content.thumbnail} alt="" className="content-logo" />
                              <span className="contenthub-creatives-name">{content.fileName}</span>
                            </td>
                            <td>
                              {content.mimeType === 'video/mp4' ? (
                                <>
                                  <img className="table-icons" src={ContentVideo} alt="Video Thumbnail" />
                                  {content.mimeType}
                                </>
                              ) : content.mimeType === 'image/jpeg' ? (
                                <>
                                  <img className="table-icons" src={ContentImg} alt="Image Thumbnail" />
                                  {content.mimeType}
                                </>
                              ) : null}
                            </td>
                            <td>{content.duration}</td>
                            <td>{content.resolution}</td>
                            <td className="delete-cell">
                              <span className="delete-text" onClick={() => handleDeleteItem(content.id)}>
                                <i className="fa-solid fa-trash-can"></i> Delete
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center contenthub-creatives-nodata">No data found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="col-md-12">
                <nav aria-label="Page navigation example">
                  <ul className="pagination pagenation-align">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <Link
                        className="page-chevron-left page-link"
                        onClick={handlePreviousPage}
                        to="#"
                      >
                        <i className="fa-solid fa-angle-left"></i>
                      </Link>
                    </li>

                    <li className="page-item">
                      <span className="page-link">
                        {`Page ${currentPage} of ${totalPages}`}
                      </span>
                    </li>

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <Link
                        className="page-chevron-right page-link"
                        onClick={handleNextPage}
                        to="#"
                      >
                        <i className="fa-solid fa-angle-right"></i>
                      </Link>
                    </li>
                  </ul>
                </nav>



              </div>


            </form>
          </div>

          {/* Filter-Resolutions-Modal */}
          <div className="modal fade" id="FilterRes" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content content-hub-filter-popup">
                <div className="modal-header contenthub-filter-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">Filters</h1>
                  <button type="button" className="contenthub-fliter-close" data-bs-dismiss="modal"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="modal-body contenthub-body row">
                  <div className="contenthub-filter-left col-md-6">
                    <h5>Resolution</h5>
                    <h5 data-bs-toggle="modal" data-bs-target="#FilterMime">Mime type</h5>
                  </div>
                  <div className="contenthub-filter-right col-md-6">
                    {/* Display all available resolutions */}
                    {Array.from(new Set(contentHubList.map(content => content.resolution)))
                      .map((resolution, index) => (
                        <div key={index} className="contenthub-filter-option">
                          <div className="col-md-12">
                            <input
                              type="checkbox"
                              id={`resolution-${index}`}
                              checked={selectedResolutions.includes(resolution)}
                              onChange={() => {
                                setSelectedResolutions(prev =>
                                  prev.includes(resolution) ? prev.filter(res => res !== resolution) : [...prev, resolution]
                                );
                              }}
                            />
                            <label className="c-box" htmlFor={`resolution-${index}`}>{resolution}</label>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="modal-footer contenthub-popup-footer">
                  <button type="button" className="btn contenthub-filter-resetbtn" onClick={handleResolutionReset}>Reset</button>
                  <button type="button" className="btn contenthub-filter-applybtn" onClick={handleApplyFilters} data-bs-dismiss="modal">Apply filters</button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter-Mimetype-Modal */}
          <div className="modal fade" id="FilterMime" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content content-hub-filter-popup">
                <div className="modal-header contenthub-filter-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">Filters</h1>
                  <button type="button" className="contenthub-fliter-close" data-bs-dismiss="modal"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="modal-body contenthub-body row">
                  <div className="contenthub-filter-left col-md-6">
                    <h5 data-bs-toggle="modal" data-bs-target="#FilterRes">Resolution</h5>
                    <h5>Mime type</h5>
                  </div>
                  <div className="contenthub-filter-right col-md-6">
                    {/* Display all available mime types */}
                    {Array.from(new Set(contentHubList.map(content => content.mimeType)))
                      .map((mimeType, index) => (
                        <div key={index} className="contenthub-filter-option">
                          <div className="col-md-12">
                            <input
                              type="radio"
                              className="mime-type"
                              id={`mime-type-${index}`}
                              name="imageType"
                              checked={selectedMimeType === mimeType}
                              onChange={() => setSelectedMimeType(mimeType)}
                            />
                            <label className="c-radio" htmlFor={`mime-type-${index}`}>{mimeType}</label>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="modal-footer contenthub-popup-footer">
                  <button type="button" className="btn contenthub-filter-resetbtn" onClick={handleResolutionReset}>Reset</button>
                  <button type="button" className="btn contenthub-filter-applybtn" onClick={handleApplyFilters} data-bs-dismiss="modal">Apply filters</button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter-Apply-Upload-Modal */}
          <div className="modal fade" id="FilterUpload" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content contenthub-upload-filter-popup">
                <div className="modal-header contenthub-upload-filter-header">
                  <h1 className="modal-title" id="staticBackdropLabel">Upload File</h1>
                  <button type="button" className="contenthub-fliter-close" data-bs-dismiss="modal">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <div className="modal-body contenthub-upload-body row">
                  <div className="contenthub-upload-file col-md-12">
                    <h1><i className="fa-solid fa-cloud-arrow-up"></i></h1>
                    <h2>Drag & drop to upload</h2>
                    <h3>
                      <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
                      <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#014DC0' }}>or browse</label>
                    </h3>
                  </div>
                </div>
                <div className="container contenthub-image-upload">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="image-preview" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                      {files[index] && files[index].type.startsWith('video/') ? (
                        <div style={{ width: '89px', height: '52px', borderRadius: '5px', marginRight: '10px', overflow: 'hidden' }}>
                          <video
                            src={url}
                            style={{ width: '100%', height: '100%' }}
                            onLoadedMetadata={(e) => {
                              const video = e.target;
                            }}
                            muted
                            loop
                            autoPlay
                          />
                        </div>
                      ) : (
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          style={{ width: '89px', height: '52px', borderRadius: '5px', marginRight: '10px' }}
                        />
                      )}
                      <p style={{ width: '40%' }}>{files[index]?.name}</p>
                      {uploadProgress[index] > 0 && (
                        <div className="progress" style={{ height: '5px', marginTop: '10px', width: '292px', borderRadius: '12px', backgroundColor: '#D9D9D9' }}>
                          <div className="progress-bar" role="progressbar" style={{ width: `${uploadProgress[index]}%`, backgroundColor: '#014DC0' }}></div>
                        </div>
                      )}
                      <button onClick={() => handleDelete(index)} style={{ marginLeft: '10px', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: '#FF0000' }}>
                        <i className="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </div>
                  ))}

                </div>
                <div className="modal-footer contenthub-upload-popup-footer">
                  <i className="fa-solid fa-exclamation"></i>
                  <span>You may upload multiple files including JPEG, mp3, mp4, or webm</span>
                  <button type="button" className="btn contenthub-filter-uploadbtn" onClick={handleUpload}>Upload</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Delete Modal */}
        <div className="modal fade" id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header cart-delete-header">
                <h5 className="modal-title cart-delete-title" id="deleteModalLabel">Delete Item ?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body cart-delete-body">
                <h3 className="delete-bin"><i className="fa-solid fa-trash-arrow-up"></i></h3>
                <h6>Do you want to delete this item ?</h6>
              </div>
              <div className="modal-footer cart-delete-footer">
                <button type="button" className="cart-cancel" data-bs-dismiss="modal">Cancel</button>
                <button
                  type="button"
                  className="cart-delete"
                  onClick={confirmDelete}
                  disabled={isLoading}>
                  {isLoading ? ("Deleting...") : ("Delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/*DeleteAll Modal */}
        <div className="modal fade" id="deleteAllModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header cart-delete-header">
                <h5 className="modal-title cart-delete-title" id="deleteModalLabel">Delete Item ?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body cart-delete-body">
                <h3 className="delete-bin"><i className="fa-solid fa-trash-arrow-up"></i></h3>
                <h6>Do you want to delete this all item ?</h6>
              </div>
              <div className="modal-footer cart-delete-footer">
                <button type="button" className="cart-cancel" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="cart-delete" onClick={confirmDeleteAll} disabled={isLoading}>{isLoading ? ("Deleting...") : ("Delete")}</button>
              </div>
            </div>
          </div>
        </div>
      </>
    </AuthLayout>
  );
}

export default ContentHub;
