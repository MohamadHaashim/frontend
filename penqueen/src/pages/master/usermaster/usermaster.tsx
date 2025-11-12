import React from "react";
import DefaultLayout from "../../../layout/defaultlayout";
import { FormButton, Table } from "../../../components/tool/tool";

const UserMaster: React.FC = () => {
  const headers = ["Action", "User Name", "Employee Name", "Email","User Type"];
  const data = [
    [1, "Mohamad Haashim", "haashim@example.com", "Admin","Admin"],
    [2, "Roshan Asraf", "roshan@example.com", "Manager","Admin"],
  ];

  return (
    <DefaultLayout>
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">

        <h1 className="mb-4">User Master</h1>
         <div className="d-flex gap-3">
            
            <FormButton className="btn-size">Export to Excel</FormButton>
            <FormButton className="btn-size">Add New Stock</FormButton>
          </div>
          </div>
        <Table 
            headers={headers} 
            data={data} 
        />
      </div>
    </DefaultLayout>
  );
};

export default UserMaster;
