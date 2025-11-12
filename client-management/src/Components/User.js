import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Sidenav from "../Sidenav/Sidenav";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import { Button, Modal, Form, Spinner, Pagination } from "react-bootstrap";
import Url from "../Api/Url";
import { toast } from "react-toastify";
import { FadeLoader } from 'react-spinners';

function User() {

  //User  List Api Usestate
  const [list, setList] = useState([])
  const [noData, setNoData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState("")

  // Pagination Usestate
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  //User  Deklete Api Usestate
  const [user_id, setId] = useState("")

  useEffect(() => {
    userList(currentPage)
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [currentPage])

  // Pagination Method

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // User List Api Start

  const userList = async (page) => {
    // e.preventDefault();
    setNoData(true)
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.userList, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "pageIndex": page - 1,
        "dataLength": recordsPerPage
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);

      if (responceData.code == "404") {
        setNoData(true)
        setList([]);

      }
      else if (responceData.apiStatus.code == "200") {
        setList(responceData.result.userData);
        setTotalRecords(responceData.result.totalRecordCount);
        setNoData(false)
        
      }

    } catch (error) {
      console.log("Error handled =" + error);

    }
  };

  // User Delete Api Start

  const userDelete = async () => {
    // e.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.userDelete + user_id, {
      method: "DELETE",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      // body: JSON.stringify({}),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);

      if (responceData.apiStatus.code == "200") {
        toast.success(responceData.apiStatus.message);

        const newTotalRecords = totalRecords - 1;
        setTotalRecords(newTotalRecords);

        let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }

        userList(currentPage)
      } else {
        toast.error(responceData.apiStatus.message);
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
      <Header />
      <Sidenav />
      <main id="main" class="main">
        <div class="pagetitle">

          <div className="row">
            <div className="col-md-12">
              <nav>
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <Link to="/User">Home</Link>
                  </li>
                  <li class="breadcrumb-item active">User Management</li>
                </ol>
              </nav>
            </div>
          </div>


          <div className="row">
            <div className="col-md-6">
              <h1>User Management</h1>
            </div>
            <div style={{ textAlign: "right" }} className="col-md-6">
              <Link
                to={"/Userpage/" + "Add"}
                style={{
                  float: "right",
                  marginBottom: "15px",
                  // marginTop: "10px",
                }}
                type="button"
                class="btn btn-primary"
              >
                Add
              </Link>
            </div>
          </div>



        </div>



        {/* table start */}

        <section class="section profile crud-top">
          <div className="card">
            <div className="card-body">

              {
                loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                    <FadeLoader color="#36d7b7" />
                  </div>
                ) : list.length === 0 ? (
                  <h4 style={{ textAlign: "center", paddingTop: "40px" }}>NO DATA FOUND</h4>
                ) : (
                  <><table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Client Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>

                      {list.map((item, ind) => (
                        <tr key={item.id}>
                          <th scope="row">{(currentPage - 1) * recordsPerPage + ind + 1}</th>
                          <td>{item.user_name}</td>
                          <td>{item.client_name}</td>
                          <td>{item.email_id}</td>
                          <td>{item.phone}</td>
                          <td>
                            <td className='clients'>

                              <li>
                                <Link to={{ pathname: `/Userpage/Edit/${item.id}` }} state={item} className="edit"

                                >
                                  <i className="fa-regular fa-pen-to-square edit-font"></i>
                                </Link>{" "}
                              </li>
                              <li>
                                <Link
                                  onClick={() => {
                                    setId(item.id);
                                    setValue(item.user_name);
                                  }}
                                  className="delete"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete"

                                >
                                  <i className="fa-solid fa-trash delete-font"></i>
                                </Link>
                              </li>
                            </td>
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
                )
              }

            </div>
          </div>
        </section>

        {/* {list.length === 0 && <h4 style={{textAlign:"center"}}>No Data Found</h4>} */}

        {/* delete pop-up */}

        <div
          class="modal fade"
          id="delete"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">
                  User Delete
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">Are You Sure Want To Delete User Name <span style={{ color: "red" }}>{value}</span>?</div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button onClick={userDelete} data-bs-dismiss="modal" type="button" class="btn btn-primary">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default User;
