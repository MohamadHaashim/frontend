import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Url from '../Api/Url';
import { toast } from 'react-toastify';




function SuperHeader() {
  const Navigate = useNavigate()

  const [log, setLog] = useState("")
  const [imgId, setImgId] = useState("")


  let superName = localStorage.getItem("superName");
  let id = localStorage.getItem("id")


  useEffect(() => {
    getMethod(id)
  })


  // Tenant Get

  const getMethod = async (id) => {
    // e.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.superProfile + id, {
      method: "GET",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      //   body: JSON.stringify({ }),
    });
    try {
      const responceData = await response.json();

      var dat = responceData.result.superadminData
      console.log(dat, "dat");

      setImgId(dat.imageData?.altered_file_name)

    } catch (error) {
      console.log("Error handled =" + error);
    }
  };


  const logoutFun = async () => {
    // e.preventDefault();

    let token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    const response = await fetch(Url.start + "api/logout/" + userId, {
      method: "GET",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      //   body: JSON.stringify({}),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);

      if (responceData.apiStatus.code == "200") {

        Navigate("/Login");
        localStorage.clear();

        toast.success(responceData.apiStatus.message);
      } else {
        toast.error(responceData.apiStatus.message);
      }


    } catch (error) {
      console.log("Error handled =" + error);

    }
  }

  const toggleClick = () => {
    var toggle = document.getElementsByClassName('toggle-sidebar')
    console.log(toggle.length == 2);
    console.log(toggle);
    if (toggle.length == 2) {
      document.querySelector('body').classList.remove('toggle-sidebar');
    } else {
      document.querySelector('body').classList.add('toggle-sidebar');
    }
  }

  return (
    <div className='toggle-sidebar'>
      <header id="header" class="header fixed-top d-flex align-items-center">

        <div class="d-flex align-items-center justify-content-between">
          <a href="#!" class="logo d-flex align-items-center">
            <img src="/assets/img/hs.logo.png" alt="" />
            {/* <span class="d-none d-lg-block"></span>   */}
          </a>
          <i class="bi bi-list toggle-sidebar-btn" onClick={toggleClick}></i>

        </div>
        {/* <!-- End Logo --> */}

        <div class="search-bar">
          <form class="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
            <button type="submit" title="Search"><i class="bi bi-search"></i></button>
          </form>
        </div>
        {/* <!-- End Search Bar --> */}

        <nav class="header-nav ms-auto">
          <ul class="d-flex align-items-center">

            <li class="nav-item d-block d-lg-none">
              <a class="nav-link nav-icon search-bar-toggle " href="#">
                <i class="bi bi-search"></i>
              </a>
            </li>
            {/* <!-- End Search Icon--> */}

            <li class="nav-item dropdown">

              <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                <i class="bi bi-bell"></i>
                <span class="badge bg-primary badge-number">4</span>
              </a>
              {/* <!-- End Notification Icon --> */}

              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li class="dropdown-header">
                  You have 4 new notifications
                  <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li class="notification-item">
                  <i class="bi bi-exclamation-circle text-warning"></i>
                  <div>
                    <h4>Lorem Ipsum</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>30 min. ago</p>
                  </div>
                </li>

                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li class="notification-item">
                  <i class="bi bi-x-circle text-danger"></i>
                  <div>
                    <h4>Atque rerum nesciunt</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>1 hr. ago</p>
                  </div>
                </li>

                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li class="notification-item">
                  <i class="bi bi-check-circle text-success"></i>
                  <div>
                    <h4>Sit rerum fuga</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>2 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li class="notification-item">
                  <i class="bi bi-info-circle text-primary"></i>
                  <div>
                    <h4>Dicta reprehenderit</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>4 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li class="dropdown-footer">
                  <a href="#">Show all notifications</a>
                </li>

              </ul>
              {/* <!-- End Notification Dropdown Items --> */}

            </li>
            {/* <!-- End Notification Nav --> */}

            <li class="nav-item dropdown">

              <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                <i class="bi bi-chat-left-text"></i>
                <span class="badge bg-success badge-number">3</span>
              </a>
              {/* <!-- End Messages Icon --> */}

              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li class="dropdown-header">
                  You have 3 new messages
                  <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li class="message-item">
                  <a href="#">
                    <img src="/assets/img/messages-1.jpg" alt="" class="rounded-circle" />
                    <div>
                      <h4>Maria Hudson</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>4 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li class="message-item">
                  <a href="#">
                    <img src="/assets/img/messages-2.jpg" alt="" class="rounded-circle" />
                    <div>
                      <h4>Anna Nelson</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>6 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li class="message-item">
                  <a >
                    <img src="/assets/img/messages-3.jpg" alt="" class="rounded-circle" />
                    <div>
                      <h4>David Muldon</h4>
                      <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                      <p>8 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li class="dropdown-footer">
                  <a href="#">Show all messages</a>
                </li>

              </ul>
              {/* <!-- End Messages Dropdown Items --> */}

            </li>
            {/* <!-- End Messages Nav --> */}

            <li class="nav-item dropdown pe-3">

              <a class="short nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">

                <img
                  class="rounded-circle"

                  src={imgId ? Url.start + Url.imageShowed + imgId : "/assets/img/noimages.jpg"}

                />
                <span class="d-none d-md-block dropdown-toggle ps-2">{superName}</span>
              </a>
              {/* <!-- End Profile Iamge Icon --> */}

              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li class="dropdown-header">
                  <h6>{superName}</h6>
                  <span>Web Developer</span>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <Link to="/SuperProfile" class="dropdown-item d-flex align-items-center">
                    <i class="bi bi-person"></i>
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <Link to="/Change" class="dropdown-item d-flex align-items-center">
                    {/* <i class="bi bi-gear"></i> */}
                    <i class="fa-solid fa-lock"></i>
                    <span>Change Password</span>
                  </Link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <a class="dropdown-item d-flex align-items-center" href="pages-faq.html">
                    <i class="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>

                <li>
                  <Link class="dropdown-item d-flex align-items-center" data-bs-toggle="modal"
                    data-bs-target="#logout" >
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </Link>
                </li>

              </ul>
              {/* <!-- End Profile Dropdown Items --> */}
            </li>
            {/* <!-- End Profile Nav --> */}

          </ul>





        </nav>
        {/* <!-- End Icons Navigation --> */}


      </header>

      <div className="modal fade" id="logout" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog logout" >
          <div className="modal-content">
            <div className="modal-header">
              <b className="modal-title font" id="exampleModalLabel">Are you sure you want to logout ?</b>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={logoutFun}>Yes</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperHeader
