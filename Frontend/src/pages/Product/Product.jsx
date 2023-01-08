import React from "react";
import { useState } from "react";
import "./Product.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer";

const Product = () => {
  const id = useParams().id;

  const [selectedImg, setSelectedImg] = useState("img");
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  
  const { data, loading, error } = useFetch(
    `http://127.0.0.1:8000/product-inventory/product-detail/${id}`
  );

  console.log(data);

  return (
    <div className="product">
      {loading ? (
        "loading"
      ) : (
        <>
          <div className="left">
            <div className="mainImg">
              <img
                src={"http://127.0.0.1:8000/" + data?.image}
                alt={"http://127.0.0.1:8000/" + data?.image}
              />
            </div>
          </div>
          <div className="right">
            <h1>{data?.title}</h1>
            <span className="price">RS:{data?.price}</span>
            <p>{data?.brand_name}</p>

            <div className="quantity">
              <button
                onClick={() =>
                  setQuantity((prev) => (prev === 1 ? 1 : prev - 1))
                }
              >
                -
              </button>
              {quantity}
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
            </div>

            <button
              className="add"
              onClick={() =>
                dispatch(
                  addToCart({
                    id: data.id,
                    title: data.title,
                    desc: data.brand_name,
                    price: data.price,
                    img: `http://127.0.0.1:8000//${data.image}`,
                    quantity,
                    vendorfk: data.vendorfk,
                    totalbill: data.price * quantity,
                  })
                )
              }
            >
              <AddShoppingCartIcon /> ADD TO CART
            </button>

            <div className="info">
              <span>Vendor: {data?.vendorfk}</span>
              <span>Product Type: {data?.Product_category}</span>
              <span>Available Shop Location:{data?.available_location} </span>
            </div>
            <hr />
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
