import axios from "axios";

export async function getListProduct(skip:number) {
  const root = process.env.API || "https://dummyjson.com";
  const endpoint = `/products?limit=20&skip=${skip}`;
  try {
    const res = await axios({
      method: "GET",
      url: root + endpoint,
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
}


export async function getListProductByQuery(query: String) {
    const root = process.env.API || "https://dummyjson.com";
    const endpoint = `/product/search?q=${query}`;
    try {
      const res = await axios({
        method: "GET",
        url: root + endpoint,
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      throw error;
    }
  }
  
  