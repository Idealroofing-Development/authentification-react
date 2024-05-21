import React from 'react';
import { Select, Button } from '@chakra-ui/react';
import product from '../../assets/product.png';
import product1 from '../../assets/product1.jpg';

const ProductCard = () => {
  return (
    <div className="rounded-xl flex-col sm:flex-row flex gap-4 border border-gray-200 items-start">
      <div className="sm:shrink-0">
        <img
          className="h-48 w-full sm:h-full sm:w-48 object-contain rounded-md"
          src={product}
          alt="product image"
        />
      </div>

      <div className="flex justify-between flex-col p-2 ">
        <div>
          <h3 className="text-xl font-bold mb-2">Product Title</h3>
          <div className="mb-4 text-sm">
            Immerse yourself in the world of music with the SleekTech Wireless Headphones. These
            stylish and ergonomic headphones deliver crystal-clear sound quality and unparalleled
            comfort, making them perfect for long listening sessions at home or on the go.
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-wrap gap-2">
            <select className="bg-white rounded-lg border border-gray-300 py-1 px-2 text-sm">
              {/* you should not use selected in React, react prevent it and it says you should use `value` or `defaultValue` */}
              <option value="" disabled selected>
                Gauge
              </option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>

            <select className="bg-white rounded-lg border border-gray-300 py-1 px-2 text-sm">
              <option value="" disabled selected>
                Color
              </option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>

            <input
              className="bg-white rounded-lg border border-gray-300 py-1 px-2 text-sm max-w-[80px]"
              placeholder="Quantity"
            />
            <input
              className="bg-white rounded-lg border border-gray-300 py-1 px-2 text-sm max-w-[80px]"
              placeholder="Length"
            />
          </div>
          <div>
            <Button
              className="bg-green-primary text-white rounded-lg py-1 px-2 text-sm"
              size={'sm'}
              colorScheme="blue">
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
