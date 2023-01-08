import React from "react";
import "./Categories.scss";
import { Link } from "react-router-dom";

import useFetch from "../../hooks/useFetch";

const Categories = () => {
  const { data, loading, error } = useFetch(`http://127.0.0.1:8000/product-inventory/Category-list/`);

  return (
    <div className="grid-container">
       <h5>Categories</h5>
      {data?.map((item) => {
        return (
          <Link className="link" to={`/products/${item?.id}`}>
            <button>{item?.name}</button>
          </Link>
        );
      })}
    </div>
  );
};

export default Categories;
