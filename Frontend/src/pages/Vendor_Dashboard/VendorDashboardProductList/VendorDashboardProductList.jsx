import Sidebar from "../../../components/dashboard/sidebar/Sidebar.jsx";

import "./vendordashboardproduct.scss";

import Table from "../../../components/dashboard/vendorproduct/product/VendorProduct.jsx";


import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <div className="listContainer">
          <div className="listTitle">Store Product </div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
