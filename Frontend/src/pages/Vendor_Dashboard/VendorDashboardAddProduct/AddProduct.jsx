import Sidebar from "../../../components/dashboard/sidebar/Sidebar.jsx";

import "./addproduct.scss";

import Table from "../../../components/dashboard/addProduct/AddProduct.jsx";


import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <div className="listContainer">
          <div className="listTitle">Add new Product</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
