import React, { useEffect, useRef, useState } from 'react'
import Footer from '../../../../shared/Footer';
import TopNav from '../../../../shared/TopNav';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import { Link } from 'react-router-dom';
import "./index.css";
import CatalogUpload from "../../../../assets/img/Catalog_img_vdo.jpg";
import VendorAPI from '../../../../api/services/vendorLogin/vendorApi';
import { toast } from 'react-toastify';
import { baseURL } from '../../../../api/api';
import { FadeLoader } from 'react-spinners';
import { Pagination } from 'react-bootstrap';
type MediaPreview = {
  url: string;
  name: string;
  size: string;
  type: "image" | "video";
  modifiedTime: string;
  file: File;
};

function ProductImages() {
    const [productImg, setproductImg] = useState<any[]>([]);
    const [productView, setProductView] = useState<any>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(12);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [deleteAll, setdeleteAll] = useState(false);
    const [imgLoading, setimgLoading] = useState(false);
    const [previewFiles, setPreviewFiles] = useState<MediaPreview[]>([]);
    const fileInputRef = useRef<any>(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;
    const formatDate = (date: Date) => date.toLocaleString();

  const handleCopyToClipboard = (item: any) => {
    const textToCopy = `${baseURL}${item?.path}/${item?.altered_file_name}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedId(item.id);   // mark this item as copied
        setTimeout(() => setCopiedId(null), 1500); // reset after 1.5s
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formatted = date.toLocaleString("en-US", options);
  return formatted.replace(",", "") // Remove comma after day
                  .replace(" AM", "am")
                  .replace(" PM", "pm")
                  .replace(",", " @");
};

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  const validPreviews: MediaPreview[] = [];

  const imagePromises = files.map((file) => {
    const fileType = file.type;
    const isImage = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error(`Unsupported file type: ${file.name}`);
      return null;
    }

    if (isImage && file.size > 8 * 1024 * 1024) {
      toast.error(`Image '${file.name}' exceeds 8MB limit.`);
      return null;
    }

    if (isVideo && file.size > 100 * 1024 * 1024) {
      toast.error(`Video '${file.name}' exceeds 100MB limit.`);
      return null;
    }

    const url = URL.createObjectURL(file);

    if (isImage) {
      // ✅ Wrap image loading in a Promise
      return new Promise<MediaPreview | null>((resolve) => {
        const img = new Image();
        img.src = url;

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          console.log(`Media '${file.name}' resolution: ${width}x${height}`);

          if (width >= 500 && height >= 500) {
            resolve({
              url,
              type: "image",
              name: file.name,
              size: formatSize(file.size),
              modifiedTime: formatDate(new Date(file.lastModified)),
              file,
            });
          } else {
            toast.error(`Media '${file.name}' must be at least 500×500 pixels (currently ${width}×${height}).`);
            resolve(null);
          }
        };

        img.onerror = () => {
          toast.error(`Failed to load image '${file.name}'.`);
          resolve(null);
        };
      });
    }

    if (isVideo) {
      // Videos don’t need async loading/validation
      return Promise.resolve({
        url,
        type: "video",
        name: file.name,
        size: formatSize(file.size),
        modifiedTime: formatDate(new Date(file.lastModified)),
        file,
      });
    }

    return null;
  });

  // ✅ Wait for all image/video validations to finish
  const resolvedPreviews = await Promise.all(imagePromises);

  // ✅ Filter out nulls and update state
  const filteredPreviews = resolvedPreviews.filter((preview): preview is MediaPreview => !!preview);

  setPreviewFiles((prev) => [...prev, ...filteredPreviews]);
};



   const [submit, setSubmit] = useState(false);

const handleUploadImg = async () => {
    setSubmit(true);
  if (previewFiles.length === 0) {
    // toast.error("Please upload at least one file.");
    return;
  }
  setimgLoading(true)
  const formData = new FormData();
  previewFiles.forEach((item, index) => {
    formData.append(`images[${index}]`, item.file); 
  });
  try {
    const response = await VendorAPI.productUploadImgAPI(formData); 

    if (response.apiStatus?.code === "200") {
      handleProductImgList(currentPage, debouncedSearch);
      setSubmit(false);
      setimgLoading(false)
      toast.success(response.apiStatus.message);
      document.getElementById("closepopup")?.click();
    } else {
      toast.error(response.apiStatus?.message || "File import failed.");
      setimgLoading(false)
    }
  } catch (error) {
    console.error("Import Error:", error);
    setimgLoading(false)
    toast.error("An error occurred while importing the file.");
  } finally {
    setimgLoading(false)
  }
};
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]); // Assume IDs are strings
  const [selectedGroupIds1, setSelectedGroupIds1] = useState<string[]>([]); // Assume IDs are strings

const handleCheckboxChange = (groupId: any) => {
setSelectedGroupIds([groupId])
};
const handleSelectAll = () => {
      const allGroupIds = productImg.map((productImg: any) => productImg?.id);
      const allSelected = selectedGroupIds1.length === allGroupIds.length;
      if (allSelected) {
          setSelectedGroupIds1([]);
      } else {
            const allGroupIds = productImg.map((productImgList:any) => productImgList?.id);
            setSelectedGroupIds1(allGroupIds);
        }
    };
const handleCheckboxChange1 = (groupId: any) => {
  setSelectedGroupIds1((prevSelectedIds) =>
    prevSelectedIds.includes(groupId)
      ? prevSelectedIds.filter((id) => id !== groupId)
      : [...prevSelectedIds, groupId]
  );
};

const handleImgDelete = async () => {
  const deleteIds = selectedGroupIds.length ? selectedGroupIds : selectedGroupIds1;
  // if (deleteIds.length === 0) {
  //   toast.error("Please select at least one image to delete.");
  //   return;
  // }
  try {
  const payload = deleteAll ? { delete_all: deleteAll } : { deleteId: deleteIds };
  const responseData = await VendorAPI.productDeleteImgAPI(payload);
    if (responseData.apiStatus?.code === '200') {
      setSelectedGroupIds([]);
      setSelectedGroupIds1([]);
      setdeleteAll(false);
      document.getElementById("closedeleteModal")?.click();
      handleProductImgList(currentPage, debouncedSearch);
      toast.success(responseData.apiStatus.message);
    } else {
      toast.error(responseData.apiStatus.message || "Failed to delete images.");
    }
  } catch (error) {
    console.error("Error during bulk delete:", error);
    toast.error("An error occurred during bulk deletion.");
  }
};


  const handleDelete = (index:any) => {
    const updated = [...previewFiles];
    updated.splice(index, 1);
    setPreviewFiles(updated);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

   const handlePageChange = (pageNumber: any) => {
         if (pageNumber < 1 || pageNumber > totalPages) return;
         setCurrentPage(pageNumber);
      };
      const renderPaginationItems = () => {
         let items = [];
         const maxPageNumbersToShow = 7;
         const halfRange = Math.floor(maxPageNumbersToShow / 2);
   
         let startPage, endPage;
         if (totalPages <= maxPageNumbersToShow) {
            startPage = 1;
            endPage = totalPages;
         } else if (currentPage <= halfRange) {
            startPage = 1;
            endPage = maxPageNumbersToShow;
         } else if (currentPage + halfRange >= totalPages) {
            startPage = totalPages - maxPageNumbersToShow + 1;
            endPage = totalPages;
         } else {
            startPage = currentPage - halfRange;
            endPage = currentPage + halfRange;
         }
   
         if (startPage > 1) {
            items.push(
               <Pagination.Item key="1" active={1 === currentPage} onClick={() => handlePageChange(1)}>
                  1
               </Pagination.Item>
            );
            if (startPage > 2) {
               items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }
         }
   
         for (let number = startPage; number <= endPage; number++) {
            items.push(
               <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                  {number}
               </Pagination.Item>
            );
         }
   
         if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
               items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }
            items.push(
               <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
               </Pagination.Item>
            );
         }
   
         return items;
      };
const handleProductImgList = (page: any,search:any) => {
      setLoading(true)
      const apiData = {
        search:search,
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };
      VendorAPI.productImgListAPI(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setLoading(false)
               setproductImg(responseData.responseData?.imageData)
               setTotalRecords(responseData?.responseData?.totalRecordCount)
               console.log(responseData?.responseData?.totalRecordCount)
            } else {
               if (responseData.apiStatus.code == "404") {
               setproductImg([])
               }
               // toast.error(responseData.apiStatus.message);
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error while fetching product image details:", error);
            toast.error("An error occurred while fetching product image details.");
         });
   }
   const processFiles = (files: FileList | File[]) => {
  const fileArray = Array.from(files);
  const previews: MediaPreview[] = fileArray.map((file) => ({
    url: URL.createObjectURL(file),
    type: file.type.startsWith("image") ? "image" : "video",
    name: file.name,
    size: formatSize(file.size),
    modifiedTime: formatDate(new Date(file.lastModified)),
    file,
  }));
  setPreviewFiles((prev) => [...prev, ...previews]);
};
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error("Failed to load image for dimension check."));
      };
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the image file."));
    };

    reader.readAsDataURL(file);
  });
};

const getVideoDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    video.preload = "metadata";

    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight
      });
    };

    video.onerror = () => {
      reject(new Error("Failed to load video for dimension check."));
    };

    video.src = URL.createObjectURL(file);
  });
};

const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();

  const files = Array.from(event.dataTransfer.files);
  const validFiles: File[] = [];

  for (const file of files) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    try {
      if (isImage) {
        const { width, height } = await getImageDimensions(file);

        if (width < 500 || height < 500) {
          toast.error(
            `Image '${file.name}' must be at least 500×500 pixels (currently ${width}×${height}).`
          );
          continue;
        }
      } else if (isVideo) {
        const { width, height } = await getVideoDimensions(file);

        if (width < 500 || height < 500) {
          toast.error(
            `Video '${file.name}' must be at least 500×500 pixels (currently ${width}×${height}).`
          );
          continue;
        }
      }

      validFiles.push(file); // Valid image/video
    } catch (err) {
      toast.error(`Failed to validate '${file.name}'.`);
      console.error(err);
    }
  }

  if (validFiles.length > 0) {
    processFiles(validFiles);
  }

  event.dataTransfer.clearData();
};



useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedSearch(search);
        setCurrentPage(1);
    }, 1000);

    return () => {
        clearTimeout(handler);
    };
    }, [search]);
   useEffect(() => {
      handleProductImgList(currentPage,debouncedSearch);
   }, [currentPage,debouncedSearch])
   
  return (
    <>
    <DashboardLayout>
                <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                   <TopNav />
                   <div className="container-fluid py-1">
                      <div className="row">
                         <div className="col-md-6">
                            <nav aria-label="breadcrumb">
                               <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                  <li className="breadcrumb-item text-sm"><Link className="opacity-5 text-dark" to={"/vendor/dashboard"}>Dashboard</Link></li>
                                  <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Product</li>
                               </ol>
                               <h6 className="text-start font-weight-bolder mb-0">Product Images</h6>
                            </nav>
                         </div>
                         <div className="col-md-6 text-end position-relative d-flex justify-content-end align-items-center">
                            <div className={`search-box2 ${search ? 'active' : ''}`}>
                                <input className = "search-text2" type="text" placeholder = "Search Images..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                    <a href="#" className = "search-btn2">
                                        <i className="fas fa-search"></i>
                                    </a>
                            </div>
                            <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fa-solid fa-plus"></i> Add Image</button>&nbsp;
                           </div>
                      </div>
    
                   </div>
                   <div className="vendor-maincontent container-fluid py-4">
                      <div className="row">
                         <div className="col-12">
                            <div className="card mb-4">
                               <div className="card-body px-0 pt-0 pb-2">
                                  <div className="table-responsive p-0">
                                   {
                                        loading ? (
                                           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                              <FadeLoader color="#36d7b7" />
                                           </div>
                                        ) : productImg.length === 0 ? (
                                           <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                        ) : (
                                    <>
                                    <div className='d-flex justify-content-end align-items-center w-100 mt-n1 ' style={{padding:"0 3%"}}>
                                             {/* Left Section - Select All + Bulk Actions */}
                                             <div className='d-flex align-items-center gap-3 mt-3'>
                                                <button className='bulk-select contact-selectAllbtn' onClick={handleSelectAll}>
                                                   {selectedGroupIds1.length === productImg.length ? 'Unselect All' : 'Select All'}
                                                </button>
                                                <div className="dropdown">
                                                   <button className="btn show-entries-btn1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                   Bulk Actions
                                                   </button>
                                                   <ul className="dropdown-menu show-entries-dropdown">
                                                   <li>
                                                      <a onClick={()=>setdeleteAll(true)} className="dropdown-item" data-bs-toggle="modal" data-bs-target="#vendordelete">
                                                         Delete All Image
                                                      </a>
                                                   </li>
                                                   <li style={{ cursor: selectedGroupIds1.length === 0 ? 'not-allowed' : 'pointer' }}>
                                                      <a
                                                         className={`dropdown-item ${selectedGroupIds1.length === 0 ? 'disabled' : ''}`}
                                                         {...(selectedGroupIds1.length > 0 && { 'data-bs-toggle': 'modal', 'data-bs-target': '#vendordelete' })}
                                                         href="#"
                                                         onClick={(e) => { if (selectedGroupIds1.length === 0) e.preventDefault(); }}
                                                      >
                                                         Delete Selected Image
                                                      </a>
                                                   </li>
                                                   </ul>
                                                </div>
                                             </div>
                                             </div>
                                   
                                    <div className="gallery" style={{cursor:"default"}}>
                                    <div className="image-grid">
                                    {productImg.map((listData: any, index: number) => (
                                                <div
                                                    className={`image-item ${index % 2 === 0 ? "flip-left" : "flip-right"} ${
                                                    selectedGroupIds1.includes(listData?.id) ? "selected" : ""
                                                }`}
                                                key={listData?.id}
                                                >
                                                    {selectedGroupIds1.includes(listData?.id) && (
                                                <div className="checktick-icon">
                                                    <i className="fa-solid fa-check"></i>
                                                </div>
                                                )}

                                            <div
                                                className="image-wrapper"
                                                data-bs-toggle="modal"
                                                data-bs-target="#productimgview"
                                                onClick={() => setProductView(listData)}
                                                >
                                                {(() => {
                                                    const fileName = listData?.altered_file_name || "";
                                                    const fileExt = fileName.split(".").pop()?.toLowerCase();

                                                    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif"].includes(fileExt || "");
                                                    const isVideo = ["mp4", "mov", "avi", "webm", "mkv"].includes(fileExt || "");

                                                    const fileUrl = `${baseURL}${listData?.path}/${listData?.altered_file_name}`;

                                                    if (isImage) {
                                                    return <img src={fileUrl} alt={listData?.original_file_name} />;
                                                    } else if (isVideo) {
                                                    return (
                                                        <video controls autoPlay loop playsInline muted>
                                                        <source src={fileUrl} type={`video/${fileExt}`} />
                                                        Your browser does not support the video tag.
                                                        </video>
                                                    );
                                                    } else {
                                                    return <div>Unsupported format</div>;
                                                    }
                                                })()}
                            <div className="hover-overlay">
                                <i className="fa-solid fa-eye view-icon"></i>
                            </div>
                            </div>


                            <div className="image-meta" onClick={() => handleCheckboxChange1(listData?.id)}>
                            <div className="image-date mt-4">
                            {listData?.created_date ? formatDateTime(listData.created_date) : ""}
                            </div>

                            <div className="image-meta-row">
                                <div className="image-title">{listData?.original_file_name}</div>
                            <div className="copy-wrapper">
                            <div className="image-icon " onClick={(e)=>{handleCopyToClipboard(listData);e.stopPropagation();}} style={{ cursor: "pointer" }}>
                            <i className="fa-solid fa-copy url-copy"></i>
                            </div>
                            <span className={`copy-tooltip ${copiedId === listData.id ? "show" : ""}`}>
                                Copied
                            </span>
                            </div>

                                <div className="image-icondlt" data-bs-toggle="modal" data-bs-target="#vendordelete" onClick={(e) => {handleCheckboxChange(listData?.id);e.stopPropagation();}}><i className="fa-solid fa-trash img-dlt"></i></div>
                            </div>
                            </div>

                                        </div>
                                    ))}
                                    </div>
                                </div>
         
                                        <div className="store-pagination">
                                            <Pagination>
                                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                            {renderPaginationItems()}
                                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                            </Pagination>
                                        </div></>
                                        )}
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                      <Footer />
                   </div>
                </main>
             </DashboardLayout>


            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static"
  data-bs-keyboard="false">
      <div className="modal-dialog">
        <div className="modal-content all-modal-content">
          <div className="modal-header import-popup-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Add Images and Videos
            </h1>
          </div>

          <div className="ps-3">
            <p className="text-sm">
              Your images and videos need to be at least 500 × 500 pixels,
              and no larger than 8 MB for images and 100 MB for videos.
            </p>
          </div>

          <div className="modal-body text-center px-3 p-0">
            <form className="form-container" encType="multipart/form-data">
              <div
                className="upload-files-container"
                onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}
              >
                <div className="drag-file-area" style={submit && previewFiles.length === 0 ? { border: '1.6px dashed red' } : {}}>
                  <div>
                    <img
                      onClick={handleBrowseClick}
                      className="browse-files-text w-75 mb-4"
                      src={CatalogUpload}
                      alt="Upload Prompt"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <p className="dynamic-message mt-2 mb-n1 tblName">
                    Drop Anywhere to Import
                  </p>
                  <label className="label tblName">
                    or{" "}
                    <span className="browse-files">
                      <input
                        multiple
                        type="file"
                        className="default-file-input"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                      />
                      <span className="browse-files-text text-dark">
                        browse file
                      </span>{" "}
                      <span className="tblName">from device</span>
                    </span>
                  </label>
                </div>
                {submit && previewFiles.length === 0 && (
                    <div className="text-center text-danger error-message-required mt-n2">
                    Media file is required
                    </div>
                )}
                <div className="upload-container">
                  {previewFiles.map((item, index) => (
                    <div className="upload-item" key={index}>
                      <div className="upload-thumbnail">
                        {item.type === "image" ? (
                          <img
                            src={item.url}
                            alt={item.name}
                          />
                        ) : (
                          <video width="100" height="100" controls>
                            <source src={item.url} type={item.file.type} />
                          </video>
                        )}
                      </div>
                      <div className="upload-details text-start mt-2">
                        <p><strong>{item.name}</strong></p>
                        <p>Size: {item.size}</p>
                        <p>Modified: {item.modifiedTime}</p>
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                        >
                          <i className="fa-solid fa-trash catalog-imgUpload"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer d-flex border-0 justify-content-end">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              id="closepopup"
              onClick={()=>{setPreviewFiles([]);setSubmit(false);setimgLoading(false)}}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary import-btn-bg"
              onClick={handleUploadImg} disabled={imgLoading}
            style={{
                    opacity: imgLoading ? 0.8 : 1,
                    cursor: imgLoading ? 'not-allowed' : 'pointer',
                    color:imgLoading ? "white":"white",
                }}> {imgLoading ? "Save...":"Save"}
            </button>
          </div>
        </div>
      </div>
    </div>

    {/*Product Delete Modal*/}
    <div className="modal fade" id="vendordelete" tab-Index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content all-modal-content vendor-delete-content">
            <div className=" vendor-delete-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body vendor-delete-body">
                <div className="row">
                <div className="vendor-delete-icon">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h4 className="modal-confirm-head">Are You Sure !</h4>
                {deleteAll ? (
  <h6 className="modal-confirm-subhead">You want to delete all these product images?</h6>
) : selectedGroupIds1 && selectedGroupIds1.length > 0 ? (
  <h6 className="modal-confirm-subhead">You want to delete the selected product images?</h6>
) : selectedGroupIds && selectedGroupIds.length > 0 ? (
  <h6 className="modal-confirm-subhead">You want to delete this product image?</h6>
) : null}
</div>
            </div>
            <div className="modal-footer text-center vendor-delete-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closedeleteModal" onClick={()=>{setSelectedGroupIds([]);setSelectedGroupIds1([]);setdeleteAll(false)}}>No</button>&nbsp;
                <button type="button" className="btn btn-primary" onClick={handleImgDelete}>Yes</button>
            </div>
        </div>
    </div>
    </div>

    {/* Product Image View */}
               <div
  className="modal fade"
  id="productimgview"
  aria-labelledby="vendorviewLabel"
  aria-hidden="true"
  data-bs-backdrop="static"
  data-bs-keyboard="false"
>
  <div className="modal-dialog modal-dialog-centered template-view-modal-dialog">
    <div className="modal-content-viewImgproduct">
      <div className="p-0 modal-body text-center ">
        <div className="text-end">
          <div className="conversation-container">
            <div className="product-card">
              <button
                type="button"
                className="prdclose-icon"
                aria-label="Close"
                data-bs-dismiss="modal"
                 onClick={() => {
                    if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                    }
                    setProductView("");
                }}
              >
                <i className="fa-solid fa-circle-xmark img-viewxmark"></i>
              </button>

              <div className="product-tilt-effect">
  <div className="product-image">
    {(() => {
      const fileName = productView?.altered_file_name || "";
      const fileExt = fileName.split(".").pop()?.toLowerCase();

      const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif"].includes(fileExt || "");
      const isVideo = ["mp4", "mov", "avi", "webm", "mkv"].includes(fileExt || "");

      const fileUrl = `${baseURL}${productView?.path}/${productView?.altered_file_name}`;

      if (isImage) {
        return <img src={fileUrl} alt={productView?.original_file_name || ""} />;
      } else if (isVideo) {
        let mimeType = "video/mp4"; // default

        switch (fileExt) {
          case "mp4":
            mimeType = "video/mp4";
            break;
          case "mov":
            mimeType = "video/quicktime";
            break;
          case "avi":
            mimeType = "video/x-msvideo";
            break;
          case "webm":
            mimeType = "video/webm";
            break;
          case "mkv":
            // mkv is not widely supported by browsers, may need a player plugin or conversion
            mimeType = "video/x-matroska";
            break;
          default:
            mimeType = "video/mp4";
        }

        return (
          <video
          ref={videoRef}
            controls
            autoPlay
            loop
            playsInline
            style={{ maxWidth: "100%", height: "auto" }}
          >
            <source src={fileUrl} type={mimeType} />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return <div>Unsupported media format</div>;
      }
    })()}
  </div>
</div>


              <div className="product-info text-start">
                <div className="product-category">
                  {productView?.created_date ? formatDateTime(productView.created_date) : ""}
                </div>
                <h2 className="product-title">{productView?.original_file_name}</h2>
                <div className="product-description">
                  <p className="break-text">
                    {`${baseURL}${productView?.path}/${productView?.altered_file_name}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


    </>
  )
}

export default ProductImages