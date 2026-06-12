import ReviewList from "../reviews/ReviewList";
import ProductCard from "./ProductCard";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { productsAPI, type Product } from "./productsAPI";

const ProductDetail = () => {
  const { id } = useParams();
  const productId = Number(id) | 0;

  const productQuery = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => productsAPI.fetchProduct(productId),
  });

  if (productQuery.isError || !productQuery.data?.product) {
    return <p className="text-red-500">Could not fetch products. Try again!</p>;
  }
  console.log(`Product: ${JSON.stringify(productQuery)}`);
  const { name, brand, price, rating } = productQuery.data.product;

  return (
    <div>
      <div className="grid grid-cols-5">
        <ProductCard
          key={productId}
          name={name}
          brand={brand}
          price={price}
          rating={rating}
        />
      </div>
      <div className="border-t-2 pt-5 mt-5">
        {productId != 0 && <ReviewList productId={productId} />}
      </div>
    </div>
  );
};

export default ProductDetail;
