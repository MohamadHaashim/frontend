import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import "./salesbill.css";
import { Button, Input } from "../../components/tool/tool";

const SalesBill: React.FC = () => {
  // const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");

  return (
    <DefaultLayout>
      <div className="sales-bill-page container py-2">
        {/* Title */}
        <div className="row g-3 align-items-center">
        <div className="col-md-3">
            <select className="form-select mt-4" aria-label="Salesman Name">
            <option value="">Salesman Name*</option>
            <option value="1">Retail</option>
            <option value="2">Wholesale</option>
            <option value="3">Online</option>
            </select>
        </div>
        <div className="col-md-2">
            <Input
            id="billNoLeft"
            label="Bill No"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>

        {/* Center Title */}
        <div className="col-md-4">
            <h1 className="mb-0">Sales Bill</h1>
        </div>

        {/* Bill No Input (Right Side) */}
       <div className="col-md-3 d-flex justify-content-end">
        <div style={{ width: "190px",minWidth:"190px"}}>
          <Input
            id="date"
            label="Date"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
      </div>
        </div>

        <div className="mt-1 row g-3 align-items-center">
        {/* Dropdown Column */}
        <div className="col-md-2">
            <Input
            id="customerName"
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>

        {/* Bill No Input (Left Side) */}
        <div className="col-md-2">
            <Input
            id="contactNo"
            label="Contact number"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>

        {/* Center Title */}
        <div className="col-md-2">
            <Input
            id="alternativeContactNo"
            label="Alternative number"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>
        <div className="col-md-2">
            <Input
            id="area"
            label="Area"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>

        {/* Bill No Input (Right Side) */}
        <div className="col-md-2">
            <Input
            id="cash type"
            label="Cash Type"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>
         <div className="col-md-2 d-flex">
            <Input
            id="time"
            label="Time"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>
        </div>
        <div className="mt-0 row g-3 align-items-center">
        {/* Dropdown Column */}
        <div className="col-md-1">
            <Input
            id="SNo"
            label="S.No"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>

        {/* Bill No Input (Left Side) */}
        <div className="col-md-1">
            <Input
            id="code"
            label="code"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>

        {/* Center Title */}
        <div className="col-md-3">
           {/* <div className="col-md-3"> */}
            <select className="form-select mt-4" aria-label="Salesman Name">
            <option value="">Product Name*</option>
            <option value="1">Retail</option>
            <option value="2">Wholesale</option>
            <option value="3">Online</option>
            </select>
        {/* </div> */}
        </div>
        <div className="col-md-2">
            <Input
            id="rate"
            label="Rate"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>

        {/* Bill No Input (Right Side) */}
        <div className="col-md-1">
            <Input
            id="pcs"
            label="Pcs"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>
         <div className="col-md-2 d-flex">
            <Input
            id="Amount"
            label="Amount(Rs)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
        </div>
        </div>

        {/* Another Input (email) */}
        {/* <div className="mt-4 col-md-3">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div> */}
        <div className="row mt-5">
          <div className="col-md-10">
            <table className="table ">
      <thead>
        <tr>
          <th scope="col">S.no</th>
          <th scope="col" className="w-25">Code</th>
          <th scope="col" className="w-25">Product Name</th>
          <th scope="col" className="w-25">Rate</th>
          <th scope="col">Pcs</th>
          <th scope="col" className="w-25 text-center">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>TTTpolofits</td>
          <td>pant</td>
          <td>350</td>
          <td>1</td>
          <td className="text-center">600</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>789T-shirt</td>
          <td>T-shirt</td>
          <td>250</td>
          <td>2</td>
          <td className="text-center">500</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>8787Trackpant</td>
          <td>nightpant</td>
          <td>600</td>
          <td>1</td>
          <td className="text-center">700</td>
        </tr>
      </tbody>
    </table>
          </div>
          <div className="col-md-2 d-flex flex-column align-items-start">
            <Button className="mb-2">CLEAR</Button>
            <Button className="mb-2">SAVE</Button>
            <Button className="mb-2">CANCEL</Button>
            <Button className="mb-2">EDIT</Button>
            <Button className="mb-2">DELETE</Button>
            <Button className="mb-2">HOLD</Button>
            <Button className="mb-2">UNHOLD</Button>
        </div>
    </div>
    <div className="row mt-3">
      <div className="col-md-4">
        <Input
            id="Amount"
            label="Amount(Rs)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
    </div> 
    <div className="col-md-4">
  <div className="d-flex align-items-center">
    <span className="me-2 fw-semibold mt-4" style={{ width: "70px" }}>Total pcs</span>
      <Input
            id="total"
            label="Total pcs"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
    </div>

      <Input
            id="total"
            label="net Amount"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            />
    </div>
    <div className="col-md-4">
  <div className="d-flex align-items-center">
    <span className="me-2 fw-semibold mt-4" style={{ width: "70px" }}>Sub Total</span>
    <Input
          id="sub-total"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)} label={""}/>
  </div>

  <div className="d-flex align-items-center">
    <span className="me-2 fw-semibold mt-4" style={{ width: "70px" }}>Discount</span>
    <Input
        id="discount"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)} label={""}/>
  </div>

  <div className="d-flex align-items-center">
    <span className="me-2 fw-semibold mt-4" style={{ width: "70px" }}>Round Off</span>
    <Input
          id="round-off"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)} label={""}/>
  </div>
</div>
    </div>
   
    </div>
    </DefaultLayout>
  );
};

export default SalesBill;
