import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  productsAPI,
  type ProductInfo,
  type ProductResponse,
} from './productsAPI';
import ProductCard from './ProductCard';

type Props = {
  limit?: number;
};

const Products = ({ limit = 10 }: Props) => {
  const productsQuery = useQuery<ProductResponse>({
    queryKey: ['products', limit],
    queryFn: () => productsAPI.fetchProducts(limit),
  });

  if (productsQuery.isLoading) {
    return <p className="text-gray-500">Loading products...</p>;
  }

  if (productsQuery.isError) {
    return <p className="text-red-500">Could not fetch products. Try again!</p>;
  }

  if (!productsQuery.data?.products.length) {
    return <p className="text-gray-500">No products available. Try again!</p>;
  }
  const { products } = productsQuery.data;
  return (
    <div>
      <div className="mb-5">
        <div className="font-bold text-2xl mb-3">Products</div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product: ProductInfo) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <ProductCard
                name={product.name}
                brand={product.brand}
                price={product.price}
                rating={product.rating}
                imagePath={`src/assets/${product.imagePath}`}
                imageAlt={product.imageAlt}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
