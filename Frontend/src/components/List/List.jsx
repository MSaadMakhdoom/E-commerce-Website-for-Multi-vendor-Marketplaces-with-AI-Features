import React from "react";
import "./List.scss";
import Card from "../Card/Card";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";

const List = ({ subCats, maxPrice, sort }) => {
  const { data, loading, error } = useFetch(
    `http://127.0.0.1:8000/product-inventory/product-search/${subCats}/${maxPrice}/${sort}`
  );

  return (
    <div className="list">
      
      {loading
        ? "loading"
        : data?.map((item) => (
            <Link className="link" to={`/product/${item?.id}`}>
              <div className="card">
                <div className="image">
                  <img src= {`http://127.0.0.1:8000//${item.image}`} alt= {`http://127.0.0.1:8000//${item.image}`} />
                </div>
                <h2>{item?.title}</h2>
                <div className="prices">
                  <h3>RS:{item?.price}</h3>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default List;
