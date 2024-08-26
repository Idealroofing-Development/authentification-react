import React, { useState, useEffect } from 'react';
import SearchBar from '../components/Products/SearchBar';
import Filters from '../components/Products/Filters';
import ProductsCollection from '../components/Products/ProductsCollection';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '@/context/auth-context';

export default function List() {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);

  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState(null);

  const {user} = useAuth()

  useEffect(() => {
    setLoadingData(true);

    const getProductByQuery = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user}`
        },
        params: {
          query: searchParams.get('query'),
          ...(searchParams.get('page') && { page: searchParams.get('page') })
        }
      };
      
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_REACT_API_URL}/products/search`,
          {},
          config
        );
        setResult(res.data);
      } catch (e) {
        setErrorData(e);
      } finally {
        setLoadingData(false);
      }
    };

    const getProductByCategory = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user}`
        },
        params: {
          category: searchParams.get('category'),
          ...(searchParams.get('page') && { page: searchParams.get('page') })
        }
      };

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_API_URL}/products/category`,
          config
        );
        setResult(res.data);
      } catch (e) {
        setErrorData(e);
      } finally {
        setLoadingData(false);
      }
    };

    const getProducts = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user}`
        },
        params: {
          ...(searchParams.get('page') && { page: searchParams.get('page') }),
          ...(searchParams.get('category') && { category: searchParams.get('category') })
        }
      };

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_API_URL}/products`,
          config
        );
        setResult(res.data);
      } catch (e) {
        setErrorData(e);
      } finally {
        setLoadingData(false);
      }
    };

    if (searchParams.get('query')) {
      getProductByQuery();
    } else if (searchParams.get('category')) {
      getProductByCategory();
    } else {
      getProducts();
    }
  }, [searchParams]);

  return (
    <div className="wrapper">
      <SearchBar />
      <Filters />
      {loadingData ? (
        <div className="h-full flex items-center justify-center mt-12">
          <ClipLoader
            color={'black'}
            loading={loadingData}
            //cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="mt-8">
          <ProductsCollection result={result} />
        </div>
      )}
    </div>
  );
}
