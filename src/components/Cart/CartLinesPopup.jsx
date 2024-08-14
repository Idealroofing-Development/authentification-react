import React from 'react';
import {
  Dialog as DialogBig,
  DialogContent as DialogContentBig,
  DialogDescription as DialogDescriptionBig,
  DialogFooter as DialogFooterBig,
  DialogHeader as DialogHeaderBig,
  DialogTitle as DialogTitleBig,
  DialogTrigger as DialogTriggerBig
} from '@/components/ui/fullWdialgog';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useState } from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const CartLinesPopup = ({ cart, forQuotes, forOrders }) => {
  const { user } = useAuth();
  const [selectedLines, setSeletedLines] = useState([]);

  const [loadingCopy, setLoadingCopy] = useState(false);

  const copyLines = async () => {
    setLoadingCopy(true);
    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/cart/lines/load`,
        {
          lines: selectedLines
        },
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then(() => {
        setLoadingCopy(false);
        toast.success('Lines copied successfully');
      })
      .catch(() => {
        setLoadingCopy(false);
        toast.error('Error copying lines');
      });
  };

  function parseProductVariables(input) {
    if (!input) return {};

    const allowedProperties = ['A', 'B', 'C', 'P1', 'P2', 'X', 'Y'];
    const result = {};
    const parts = input.split(' ');

    let index = 0;

    // Check if the first part is "Louv:"
    if (parts[index] && parts[index].startsWith('Louv:')) {
      index++; // Move to the next part
      // Check if the next part is the number (e.g., "4:")
      if (parts[index] && parts[index].includes(':')) {
        index++; // Move to the next part
        // Extract the letters part (e.g., "AEGI")
        if (parts[index]) {
          const letters = parts[index];
          result.V = letters.split('');
          index++; // Move to the next part
        }
      }
    }

    // Extract the remaining key-value pairs (A=8", B=2", etc.)
    parts.slice(index).forEach((part) => {
      const [key, value] = part.split('=');
      if (key && value && allowedProperties.includes(key)) {
        result[key] = parseFloat(value.replace('"', ''));
      }
    });

    return result;
  }

  const handleSelectLine = (id) => {
    if (selectedLines?.includes(id)) {
      // Remove the item from the array
      setSeletedLines((prevLines) => prevLines.filter((l) => l !== id));
    } else {
      // Add the item to the array
      setSeletedLines((prevLines) => [...prevLines, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedLines?.length === cart?.lines?.length) {
      setSeletedLines([]);
    } else {
      const allIds = cart?.lines?.map((item) => item.id);
      setSeletedLines(allIds);
    }
  };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <>
      <DialogHeaderBig>
        <DialogTitleBig>
          <>
            {forQuotes ? (
              cart?.cart?.name ? (
                <div>{cart?.cart?.name}</div>
              ) : (
                <div>Quote N° {cart?.cart?.id}</div>
              )
            ) : forOrders ? (
              cart?.cart?.name ? (
                <div>{cart?.cart?.name}</div>
              ) : (
                <div>Order N° {cart?.cart?.id}</div>
              )
            ) : (
              <div className="flex gap-4 justify-between items-center">
                {cart?.name ? <div>{cart?.name}</div> : <div>Cart N° {cart?.id}</div>}

                <Button
                  onClick={loadingCopy ? null : copyLines}
                  disabled={loadingCopy}
                  className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary mr-4">
                  {loadingCopy ? 'Copying lines ...' : 'Copy lines'}
                </Button>
              </div>
            )}
          </>
        </DialogTitleBig>

        <Table className="whitespace-nowrap lg:w-[100%] w-full">
          <TableHeader>
            <TableRow>
              {forQuotes || forOrders ? null : (
                <TableHead className="w-[20px]">
                  <input
                    onChange={handleSelectAll}
                    checked={selectedLines?.length === cart?.lines?.length}
                    type="checkbox"
                  />
                </TableHead>
              )}

              <TableHead>Items</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>Option(s)</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart?.lines?.map((item, index) => (
              <TableRow key={index}>
                {forQuotes || forOrders ? null : (
                  <TableCell>
                    <input
                      onChange={() => handleSelectLine(item.id)}
                      checked={selectedLines.includes(item.id)}
                      type="checkbox"
                    />
                  </TableCell>
                )}

                <TableCell className="flex gap-2 min-w-max">
                  <img
                    src={
                      item.product_category?.toLowerCase() === 'flashing' ||
                      item.product_category?.toLowerCase() === 'accessories'
                        ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/trim/${item.product_brand.toLowerCase()}.webp`
                        : item.product_category?.toLowerCase() === 'flats'
                          ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/flat/${item.product_brand.toLowerCase()}.webp`
                          : item.product_category?.toLowerCase() === 'screws'
                            ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/screws/${item.product_brand.toLowerCase()}.webp`
                            : item.product_category?.toLowerCase() === 'sliding doors'
                              ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/west/${item.product_brand.toLowerCase()}.webp`
                              : item.product_category?.toLowerCase() === 'roofing/siding'
                                ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/${item.product_brand?.toLowerCase()}/panel.webp`
                                : item.product_category?.toLowerCase() === 'decking'
                                  ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/${item.product_brand?.toLowerCase()}/diagram.webp`
                                  : product
                    }
                    alt="Product Image"
                    className="border-gris-claire border rounded-lg w-40 aspect-w-1 aspect-h-1"
                  />

                  <div>
                    <h3 className="font-bold mb-2">{item.product_name}</h3>
                    {/* <div className="text-gris-claire text-lg">
                      {item?.part[0]?.color_enc && <p>color: {item?.part[0]?.color_enc}</p>}

                      {item?.part[0]?.gauge && <p>Gauge: {item?.part[0]?.gauge}</p>}

                      <p>Length: {item.product_entryLen}</p>

                      {item?.part[0]?.size1 && <p>Size1: {item?.part[0]?.size1}</p>}

                      {item?.part[0]?.size2 && <p>size2: {item?.part[0]?.size2}</p>}

                      {item?.part[0]?.sub_brand && <p>Profile: {item?.part[0]?.sub_brand}</p>}
                    </div>*/}

                    <div>{item?.product_partNum}</div>
                  </div>
                </TableCell>
                <TableCell className="w-40 ">
                  <p className="w-full">{item.product_salesQty}</p>
                </TableCell>
                <TableCell className="max-w-max">
                  <div className="text-gris-claire text-lg">
                    {(() => {
                      try {
                        const productVariablesString = item.product_variables;
                        const parsedVariables = productVariablesString
                          ? parseProductVariables(productVariablesString)
                          : {};

                        return Object.entries(parsedVariables).map(([key, value]) => (
                          <p className="max-w-max" key={key}>
                            {key}: {Array.isArray(value) ? value.join(', ') : value}
                          </p>
                        ));
                      } catch (error) {
                        console.error('Invalid product variables string:', error);
                        return null;
                      }
                    })()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className=" text-lg">
                    <p>
                      ${Number(item?.line_full_price)?.toFixed(4)}
                      <span className="text-xs italic text-gray-700">
                        {' '}
                        (${Number(item?.unity_price)?.toFixed(4)} per unit)
                      </span>
                    </p>
                    <p className='text-gray-500'>
                      ${Number(item?.line_full_cost)?.toFixed(4)}
                      <span className="text-xs italic text-gray-500">
                        {' '}
                        (${Number(item?.product_cost)?.toFixed(4)} per unit)
                      </span>
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogHeaderBig>
    </>
  );
};

export default CartLinesPopup;
