import React from "react";
import ProductCard from "./components/ProductCard";
import { IProduct } from "./types/product";
import { getListProduct } from "./api";

function App() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [skip, setSkip] = React.useState<number>(0);
  const observerTarget = React.useRef(null);

  const fetchData = async () => {
    const { products } = await getListProduct(skip);
    if (products) {
      setData((prev) => [...prev, ...products]);
      setSkip((prev) => prev + 20);
    }
  };

  React.useEffect(() => {
    //fetch first data
    fetchData();
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData();
        }
      },
      // Threshold of 1.0 will fire callback when 100% of element is visible
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, skip]);

  //freeze observer

  return (
    <div className="App">
      <header className="App-header">
        <h2>Project mini test</h2>
      </header>
      <div className="container">
        {data.length &&
          data.map((item: IProduct, index: number) => (
            <ProductCard {...item} key={index} />
          ))}
      </div>
      {loading && <p>Loading...</p>}
      <div ref={observerTarget} className="observer"></div>
    </div>
  );
}

export default App;
