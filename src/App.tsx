import React from "react";
import ProductCard from "./components/ProductCard";
import { IProduct } from "./types/product";
import { getListProduct, getListProductByQuery } from "./api";
import debounce from "lodash/debounce";

function App() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [skip, setSkip] = React.useState<number>(0);
  const observerTarget = React.useRef(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [shouldCallAPI, setShouldCallAPI] = React.useState<boolean>(true);

  const fetchData = async () => {
    if (!shouldCallAPI) return ;
    const { products } = await getListProduct(skip);
    if (products.length) {
      setData((prev) => [...prev, ...products]);
      setSkip((prev) => prev + 20);
      return;
    }
    setShouldCallAPI(false);
  };

  React.useEffect(() => {
    //fetch first data
    fetchData();
  }, []);

  React.useEffect(() => {
    if (!shouldCallAPI) return ;
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
  }, [observerTarget, skip,shouldCallAPI]);// update depend avoid freeze observer
  

  const getProductByQuery = React.useCallback(async (query: string) => {
    const { products } = await getListProductByQuery(query);
    if (products) {
      setData(products);
      setSkip((prev) => prev + products.length);
    }
  }, []);

  const debouncedSendRequest: any = React.useMemo(() => {
    //debounce 0.5s
    return debounce(getProductByQuery, 500);
  }, [getProductByQuery]);

  const onChangeSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSendRequest(value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Project mini test</h2>
      </header>
      <div>
        <input type="text" value={searchTerm} onChange={onChangeSearch} />
      </div>
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
