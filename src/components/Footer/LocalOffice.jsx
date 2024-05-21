import React from 'react';
import { useState, useEffect, useRef } from 'react';

export default function LocalOffice({ localOffice, onchangeOffice }) {
  const divRef = useRef(null);

  return (
    <div className="w-full">
      <div className="text-center lg:text-lg flex flex-row lg:flex-col">
        <div
          ref={divRef}
          className={`inline-block  lg:p-2 lg:pt-4 w-full cursor-pointer ${
            localOffice === 1 ? 'bg-vert-claire text-green-500 lg:text-black' : 'text-gris-claire'
          }`}
          onClick={() => onchangeOffice(1)}>
          Head Office
        </div>

        <div
          ref={divRef}
          className={`inline-block  lg:p-2  w-full cursor-pointer ${
            localOffice === 2 ? 'bg-vert-claire text-green-500 lg:text-black' : 'text-gris-claire'
          }`}
          onClick={() => onchangeOffice(2)}>
          Québec office
        </div>

        <div
          ref={divRef}
          className={`inline-block  lg:p-2  w-full cursor-pointer ${
            localOffice === 3 ? 'bg-vert-claire text-green-500 lg:text-black' : 'text-gris-claire'
          }`}
          onClick={() => onchangeOffice(3)}>
          Brampton office{' '}
        </div>
        <div
          ref={divRef}
          className={`inline-block  lg:p-2 lg:pt-4
            w-full cursor-pointer ${
              localOffice === 4 ? 'bg-vert-claire text-green-500 lg:text-black' : 'text-gris-claire'
            }`}
          onClick={() => onchangeOffice(4)}>
          {' '}
          Moncton office{' '}
        </div>
      </div>
      <div className="  lg:hidden flex text-xs items-center justify-center mt-4">
        © Powered By: Ideal Roofing Company Limited, Manufacturers
      </div>
    </div>
  );
}
