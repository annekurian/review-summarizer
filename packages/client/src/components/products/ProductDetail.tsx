import ReviewList from '../reviews/ReviewList';
import ProductCard from './ProductCard';
import { NavLink, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, type Product } from './productsAPI';

const ProductDetail = () => {
  const { id } = useParams();
  const productId = Number(id) | 0;

  const productQuery = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => productsAPI.fetchProduct(productId),
  });

  if (productQuery.isLoading) {
    return <p className="text-gray-500">Loading products...</p>;
  }
  if (productQuery.isError) {
    return <p className="text-red-500">Could not fetch products. Try again!</p>;
  }
  if (!productQuery.data) {
    return <p className="text-gray-500">No products available. Try again!</p>;
  }
  console.log(`Products Query: ${JSON.stringify(productQuery.data)}`);
  const {
    name,
    brand,
    price,
    rating,
    imagePath,
    imageAlt = '',
    description,
  } = productQuery.data.product;

  return (
    <div>
      <div className="grid grid-cols-4">
        <ProductCard
          name={name}
          brand={brand}
          price={price}
          rating={rating}
          imagePath={`../src/assets/${imagePath}`}
          imageAlt={imageAlt}
          description={description}
        />
        <div className="col-start-4">
          <NavLink to="/products" style={{ color: 'blue' }}>
            Back to Products
          </NavLink>
        </div>
      </div>
      <div className="border-t-2 pt-5 mt-5">
        {productId != 0 && <ReviewList productId={productId} />}
      </div>
    </div>
  );
};

export default ProductDetail;
