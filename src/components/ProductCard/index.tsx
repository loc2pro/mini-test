import { IProduct } from "@/types/product";
import React, { FC } from "react";

const ProductCard: FC<IProduct> = (props) => {
  const { title, images, price } = props;
  return (
    <div className="product-card">
      <div className="thumbnail">{
        images?.length && (
          <img src={images[0]} alt={title} />
        )
      }
      </div>
      <div className="title">
        <span> {title}</span>
        <span> {price}</span>
      </div>
    </div>
  );
};

export default ProductCard;
