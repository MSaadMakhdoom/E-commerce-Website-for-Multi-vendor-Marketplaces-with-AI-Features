import Sidebar from "../../../components/dashboard/sidebar/Sidebar.jsx";

import "./updateproduct.scss";

import Table from "../../../components/dashboard/updateProduct/UpdateProduct.jsx";


import "bootstrap/dist/css/bootstrap.min.css";

const UpdateProduct = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <div className="listContainer">
          <div className="listTitle">Update product</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
