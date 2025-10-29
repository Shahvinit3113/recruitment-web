import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loader = () => (
  <div>
    <Skeleton height={150} /> {/* Big rectangle (e.g. image area) */}
    <Skeleton count={2} /> {/* Two text line placeholders */}
  </div>
);

export default Loader;
