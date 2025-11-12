import React from "react";
import DefaultLayout from "../../layout/defaultlayout";

const Dashboard: React.FC = () => {
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  // const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
    <DefaultLayout>
      <div className="dashboard-content p-4" style={{ marginTop: "70px" }}>
        <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
      </div>

    </DefaultLayout>
    </>
    // <div className="d-flex flex-column h-100 w-100">
    //   <Header
    //     toggleSidebar={toggleSidebar}
    //     companyName="PenQueen"
    //     userName="User Name"
    //     staff="Manager"
    //   />
    //   <div className="d-flex flex-grow-1" style={{ marginTop: "70px" }}>
    //     <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    //     <div
    //       className="flex-grow-1 d-flex align-items-center justify-content-center bg-light"
    //       style={{
    //         transition: "margin-left 0.3s ease-in-out",
    //         marginLeft: sidebarOpen ? "220px" : "0",
    //       }}
    //     >
    //       <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Dashboard;
