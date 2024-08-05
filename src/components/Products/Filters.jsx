import { useAuth } from '@/context/auth-context';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Filters = () => {
  const [categories, setCategories] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const {user} = useAuth()

  useEffect(() => {
    const getCategories = async () => {
      await axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/products/categories/brands`, {
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          setCategories(res.data);
        })
        .catch((e) => {
          toast.error('Error getting categories');
        });
    };

    getCategories();
  }, []);

  const handleFilter = (category) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.delete('query');
    updatedSearchParams.set('page', 1);
    updatedSearchParams.set('category', category);
    setSearchParams(updatedSearchParams.toString());
  };
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-100 w-full px-4 py-2 mt-4 whitespace-nowrap gap-4 overflow-auto">
      {categories?.map((category) => (
        <div
          onClick={() => handleFilter(category?.category?.name)}
          className="cursor-pointer text-md text-gray-500">
          {category?.category?.name}
        </div>
      ))}
    </div>
  );
};

export default Filters;
