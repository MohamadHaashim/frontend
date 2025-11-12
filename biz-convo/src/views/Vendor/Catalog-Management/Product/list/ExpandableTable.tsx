import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";

// Define the types
interface Product {
  id: number;
  item_group_id: string;
  retailer_id: string;
  name: string;
  currency: string;
  price: string;
  sale_price: string;
  sale_price_enabled: boolean;
  availability: any;
  description: string;
  brand: string;
  condition: string;
  url: string;
  category: string;
  catalog_id: string;
  content_id: string;
  status: boolean;
  images: any[];
  imgData: { mainImgUrl: string };
  product_id: string;
}



interface CatalogueGroup {
  item_group_id: string;
  products: Product[];
}

interface ExpandableTableProps {
  productlist: CatalogueGroup[];
  setretailerId: React.Dispatch<React.SetStateAction<string>>;

  setcatalogId: React.Dispatch<React.SetStateAction<string>>;

  setproductName: React.Dispatch<React.SetStateAction<string>>;
}
const ExpandableTable: React.FC<ExpandableTableProps> = ({
  productlist,
  setretailerId,

  setcatalogId,

  setproductName,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };
console.log(productlist,"productsToShow")

  return (
    <table className="table align-items-center justify-content-center mb-0">
      <thead>
        <tr className="vendor-table-mainhead">
          <th></th>
          <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7">
            Name
          </th>
          <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
            Variants
          </th>
          <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
            Availability
          </th>
          <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
            Price
          </th>
          <th className="text-center text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="text-start">
        {productlist?.map((group) => {
          const isExpanded = expandedGroups[group?.item_group_id] || false;
          const productsToShow = isExpanded
             ? group?.products ?? []
  : group?.products && group.products.length > 0
  ? [group.products[0]]
  : [];
          const hasMultipleProducts = group.products?.length > 1;
          return (
            <React.Fragment key={group.item_group_id}>
              {productsToShow.map((product, index) => (
                <tr
                  key={product.id}
                  onClick={() => {
                    if (index === 0) toggleGroup(group.item_group_id);
                  }}
                  style={{
                    cursor: index === 0 ? "pointer" : "default",
                    backgroundColor: isExpanded ? "#fcf8f8ff" : "#ffffff",
                  }}
                >
                  <td style={{ width: "10px", textAlign: "center" }}>
                    {index === 0 && hasMultipleProducts && (
                      <i
                        className="fa-solid fa-chevron-right"
                        style={{
                          transition: "transform 0.2s ease",
                          transform: isExpanded
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <div className="d-flex  align-items-center px-2">
                      {/* Media wrapper */}
                      <div className="thumb-wrapper position-relative">
                        {product?.imgData?.mainImgUrl &&
                        product.imgData.mainImgUrl.endsWith(".mp4") ? (
                          <video
                            className="thumb-media"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            src={product.imgData.mainImgUrl}
                          />
                        ) : !isExpanded &&
                          index === 0 &&
                          hasMultipleProducts ? (
                          <>
                            <img
                              className="thumb-media position-absolute top-0 end-0 "
                              src={group.products[0]?.imgData?.mainImgUrl || ""}
                              alt=""
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "cover",
                              }}
                            />
                            <img
                              className="thumb-media position-absolute bottom-0 start-0"
                              src={group.products[1]?.imgData?.mainImgUrl || ""}
                              alt=""
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "cover",
                              }}
                            />
                          </>
                        ) : (
                          <img
                            className="thumb-media w-100  "
                            src={product?.imgData?.mainImgUrl || ""}
                            alt={product?.name || "product image"}
                            style={{ width: "100%", height: "100%" }}
                          />
                        )}
                      </div>
                      <div className="ms-3 text-start text-sm">
                        <span>{product?.name}</span>
                        <br />
                        {"Group Id:" + group.item_group_id}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex ps-3">
                      <div className="align-middle text-start text-sm my-auto">
                              <span>{group.products.length}</span>
                      </div>
                      </div>
                    </td>
                  <td>
                    <div className="d-flex ps-3">
                      <div className="align-middle text-start text-sm my-auto">
                              <span>{product.availability ==="in stock" ? "In Stock" : "Out of Stock"}</span>
                      </div>
                      </div>
                    </td>
                  <td>
                    <div className="d-flex">
                      <div className="align-middle text-start text-sm my-auto">
                              <span>{product.price ? `₹${product.price}` : "N/A"}</span>
                      </div>
                      </div>
                    </td>
                  <td className="text-center align-middle vendor-login-td">
                    <div
                      className="actionEdit-tooltip-container"
                      style={{ cursor: "pointer" }}
                    >
                      <button
                        className="btn-3 vendorbtn-edit"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isExpanded && hasMultipleProducts) {
                            toggleGroup(group.item_group_id); // Expand first
                            return;
                          }
                          navigate(
                            `/vendor/catalog/product/edit/${product.product_id}`
                          );
                        }}
                      >
                        <span className="">
                          <i className="fa-regular fa-pen-to-square"></i>
                        </span>
                      </button>
                      &nbsp;
                      <div className="actionEdit-tooltip-text">Edit</div>
                    </div>
                    <div
                      className="actionDelete-tooltip-container"
                      style={{ cursor: "pointer" }}
                    >
                      <button
                        className="btn-3 vendorbtn-danger"
                        type="button"
                        data-bs-toggle="modal"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isExpanded && hasMultipleProducts) {
                            toggleGroup(group.item_group_id); // Expand first
                            return;
                          }
                          setretailerId(product?.product_id);
                          setproductName(product?.name);
                          setcatalogId(product?.catalog_id);
                        }}
                        data-bs-target="#vendordelete"
                      >
                        <span className="btn-inner--icon">
                          <i className="fa-regular fa-trash-can"></i>
                        </span>
                      </button>
                      <div className="actionDelete-tooltip-text">Delete</div>
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default ExpandableTable;
