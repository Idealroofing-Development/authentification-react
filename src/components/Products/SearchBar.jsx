import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { useSearchParams } from 'react-router-dom';

const SearchBar = () => {
  const [queryValue, setQueryValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (e) => {
    e.preventDefault()
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('query', queryValue);
    updatedSearchParams.set('page', 1);
    updatedSearchParams.delete('category');
    setSearchParams(updatedSearchParams.toString());
  };
  return (
    <div className="flex items-center gap-6 min-h-[54px] rounded-lg bg-gray-100 w-full px-4 py-2">
      <BiSearch color="gray" className="text-2xl" />
      <form className='flex flex-1' onSubmit={handleFilter}>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setQueryValue(e.target.value)}
          className="border-0 flex-1 bg-gray-100 outline-offset-0 placeholder:text-gray-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
        />
      </form>
    </div>
  );
};

export default SearchBar;
