import React from "react";
import DefaultLayout from "../../../layout/defaultlayout";
import { Table } from "../../../components/tool/tool";
import { FormButton } from "../../../components/tool/tool";

const StockMaster: React.FC = () => {
     const headers = ["Action", "Code", "Procduct Name", "Item Category","Quantity","price"];
  const data = [
    [1, "0001", "pant", "shirt","50","540","Active"],
    [2, "0021", "track", "T-shirt","10","640","Active"],
    [3, "0031", "polofits", "pant","30","740","Active"],
    [4, "0431", "alpha", "pant","80","840","Active"],
    [5, "5432", "inner", "poomax","90","340","Active"],
  ];
  return (
   <DefaultLayout>
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
  <h5 className="fw-bold text-uppercase">Stock Inventory</h5>

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
  )
};

export default StockMaster;