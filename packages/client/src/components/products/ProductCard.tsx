import StarRating from '../reviews/StarRating';

type Props = {
  name: string;
  brand: string;
  price: number;
  rating: number;
  imagePath: string;
  imageAlt?: string;
  description?: string;
};

const ProductCard = ({
  name,
  brand,
  price,
  rating,
  imagePath,
  imageAlt,
  description = '',
}: Props) => {
  return (
    <>
      <div className="flex flex-col col-span-2">
        <h2 className="text-xl font-bold mb-5">{description}</h2>
        <div className="group relative">
          <img
            src={imagePath}
            alt={imageAlt}
            className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
          />
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-md text-gray-900 font-bold">
                <span aria-hidden="true" className="absolute inset-0"></span>
                {name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{brand}</p>
              <div className="mt-2">
                <StarRating value={rating} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">${price}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
