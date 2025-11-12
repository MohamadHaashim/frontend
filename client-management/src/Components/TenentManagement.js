import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import SuperSidenav from '../Sidenav/SuperSidenav'
import { Link, Navigate } from 'react-router-dom'
import Url from '../Api/Url';
import { FadeLoader } from 'react-spinners';
import { Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SuperHeader from '../Header/SuperHeader';

function TenentManagement() {


  // Client List Api Usestate
  const [list, setList] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(true);

  // Pagination Usestate
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  // Client Delete Api Usestate
  const [delete_id, setId] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    tenantList(currentPage);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [currentPage]);


  // Pagination Method

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // List Api Start
  const tenantList = async (page) => {
    let token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/" />;
    }

    const response = await fetch(Url.start + Url.tenantList, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        pageIndex: page - 1,
        dataLength: recordsPerPage,
      }),
    });

    try {
      const responseData = await response.json();
      if (responseData.apiStatus.code === "404") {
        setList([]);
        setNoData(true);
      } else if (responseData.apiStatus.code === "200") {
        setList(responseData.result.tenantData);
        // console.log(responseData.result.tenantData,"ddddd");

        setTotalRecords(responseData.result.totalRecordCount);
        setNoData(false);
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };



  // Tenant Delete Api Start
  const tenantDelete = async () => {
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.tenantDelete + delete_id, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    try {
      const responseData = await response.json();
      if (responseData.apiStatus.code === "200") {
        toast.success(responseData.apiStatus.message);
        // Refresh the client list

        const newTotalRecords = totalRecords - 1;
        setTotalRecords(newTotalRecords);

        let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }

        tenantList(currentPage);
      } else {
        toast.error(responseData.apiStatus.message);
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // Pagination Method



  const renderPaginationItems = () => {
    let items = [];
    const maxPageNumbersToShow = 7; // Maximum number of page numbers to show at once
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
  return (
    <div>
      <SuperHeader />
      <SuperSidenav />
      <main id="main" className="main">
        <div className="pagetitle">
          <div className="row">
            <div className="col-md-12">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/TenentManagement">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Tenant Management</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h1>Tenant Management</h1>
            </div>
            <div style={{ textAlign: "right" }} className="col-md-6">
              <Link
                to={"/TenentPage/" + "Add"}
                style={{
                  float: "right",
                  marginBottom: "15px",
                  // marginTop: "10px",
                }}
                type="button"
                class="btn btn-primary"
              >
                ADD
              </Link>
            </div>
          </div>


        </div>


        <section className="section profile crud-top">
          <div className="card">
            <div className="card-body">
              <div className="row over">
                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                    <FadeLoader color="#36d7b7" />
                  </div>
                ) : list.length === 0 ? (
                  <h4 style={{ textAlign: "center", paddingTop: "40px" }}>NO DATA FOUND</h4>
                ) : (
                  <>
                    <table className="table table-hover tableHost">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Tenant Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Phone</th>
                          <th scope="col">User Name</th>
                          <th scope="col">Address</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((list, ind) => (
                          <tr key={list.id}>
                            <th scope="row">{(currentPage - 1) * recordsPerPage + ind + 1}</th>
                            <td>{list.tenant_name}</td>
                            <td>{list.email}</td>
                            <td>{list.phone}</td>
                            <td>{list.userData ? list.userData.user_name : null}</td>
                            {/* <td>{list.userData.map((item)=>(<td>{item.user_name}</td>))}</td> */}
                            <td>{list.address}</td>
                            <td className="clients">
                              <li>
                                <Link to={{ pathname: `/SuperView/${list.id}` }} state={list} className="eye">
                                  <i className="fa-solid fa-eye eye"></i>
                                </Link>
                              </li>
                              <li>
                                <Link to={{ pathname: `/TenentPage/Edit/${list.id}` }} className="edit" state={list}>
                                  <i className="fa-regular fa-pen-to-square edit-font"></i>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="delete"
                                  onClick={() => { setId(list.id); setValue(list.tenant_name); }}
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete"
                                >
                                  <i className="fa-solid fa-trash delete-font"></i>
                                </Link>
                              </li>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      <Pagination>
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {renderPaginationItems()}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                      </Pagination>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>


        {/* delete pop-up */}
        <div
          className="modal fade"
          id="delete"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Client Delete
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                Are You Sure Want To Delete Tenant Name <span style={{ color: "red" }}>{value}?</span>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  data-bs-dismiss="modal"
                  onClick={tenantDelete}
                  type="button"
                  className="btn btn-primary"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default TenentManagement
