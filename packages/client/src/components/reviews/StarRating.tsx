import { FaRegStar, FaStar } from "react-icons/fa";
type Props = {
  value: number;
};

const StarRating = ({ value }: Props) => {
  const placeholder = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1 text-yellow-500">
      {placeholder.map((p) => {
        let fillWidth = "0%";

        if (value >= p) {
          fillWidth = "100%";
        } else if (value > p - 1) {
          const decimal = value - (p - 1);
          fillWidth = `${decimal * 100}%`;
        }

        return (
          <div key={p} className="relative text-l">
            {/* Background Outline Star */}
            <FaRegStar />

            {/* Foreground Filled Star Overlay */}
            <div
              className="absolute top-0 left-0 overflow-hidden text-amber-400"
              style={{ width: fillWidth }}
            >
              {/* Width wrapper ensures the icon doesn't shrink/squish when clipped */}
              <div className="w-6">
                <FaStar />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
