import { Button } from '@/components/ui/button';
import React from 'react';
import { BiPrinter } from 'react-icons/bi';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import product from '../assets/product.webp';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/fullWdialgog';

import {
  Dialog as DialogSmall,
  DialogContent as DialogContentSmall,
  DialogDescription as DialogDescriptionSmall,
  DialogFooter as DialogFooterSmall,
  DialogHeader as DialogHeaderSmall,
  DialogTitle as DialogTitleSmall
} from '@/components/ui/dialog';
import EditPopup from '@/components/Cart/EditPopup';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserInfoContext } from '@/context/userInfosContext';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [cartInfos, setCartInfos] = useState(null);
  const [loading, setLoading] = useState(false);

  const [endUsers, setEndUsers] = useState(null);
  const [selectedEndUser, setSelectedEndUser] = useState(null);
  const [loadingAttach, setLoadingAttach] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [customAddress, setCustomAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingCreatingQuote, setLoadingCreatingQuote] = useState(false);
  const [attachedClient, setAttachedClient] = useState(null);
  const [miscCharges, setMiscCharges] = useState(0);
  const [linesTotal, setLinesTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [customAddressValues, setCustomAddressValues] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    phone: '',
    name: '',
    email: ''
  });

  const [loadingSaveCart, setLoadingSaveCart] = useState(false);

  const [loadingOrder, setLoadingOrder] = useState(false);

  const [poNumber, setPoNumber] = useState(null);
  const [quoteName, setQuoteName] = useState(null);
  const [cartName, setCartName] = useState(null);

  const navigate = useNavigate();

  const orderCart = async () => {
    setLoadingOrder(true);
    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/orders/create`,
        selectedAddress
          ? selectedAddress?.label === 'My address'
            ? {
                cart_id: cartInfos?.id,
                ship_id: selectedAddress?.ship_id ? selectedAddress?.ship_id : '',
                OTSContact: '',
                OTSName: '',
                OTSAddr1: '',
                OTSAddr2: '',
                OTSAddr3: '',
                OTSCity: '',
                OTSProv: '',
                OTSZip: '',
                OTSCountry: '',
                useOTS: false,
                poNum: poNumber
              }
            : {
                cart_id: cartInfos?.id,
                ship_id: '',
                OTSContact: selectedAddress?.phone,
                OTSName: selectedAddress?.name,
                OTSAddr1: selectedAddress?.address,
                OTSAddr2: '',
                OTSAddr3: '',
                OTSCity: selectedAddress?.city,
                OTSProv: selectedAddress?.state,
                OTSZip: selectedAddress?.zip,
                OTSCountry: selectedAddress?.country,
                useOTS: true,
                poNum: poNumber
              }
          : {
              cart_id: cartInfos?.id,
              ship_id: '',
              OTSContact: customAddressValues?.phone,
              OTSName: customAddressValues?.name,
              OTSAddr1: customAddressValues?.address,
              OTSAddr2: '',
              OTSAddr3: '',
              OTSCity: customAddressValues?.city,
              OTSProv: customAddressValues?.state,
              OTSZip: customAddressValues?.zip,
              OTSCountry: customAddressValues?.country,
              useOTS: true,
              poNum: poNumber
            },

        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then((res) => {
        setLoadingOrder(false);
        toast.success('Order created successfully');
        navigate('/orders');
      })
      .catch((e) => {
        setLoadingOrder(false);
        toast.error('Error creating order');
      });
  };

  const { user } = useAuth();
  const { userInfos } = useContext(UserInfoContext);

  useEffect(() => {
    if (user) {
      console.log('token', user);
    }
  }, [user]);

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hours}:${minutes}`;
  };

  const saveCart = async () => {
    setLoadingSaveCart(true);
    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/cart/save`,
        {
          name:
            cartName || `${formatDate(new Date())} ${userInfos?.first_name} ${userInfos?.last_name}`
        },
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then(() => {
        setCartName(null);
        setLoadingSaveCart(false);
        toast.success('Cart saved successfully');
        navigate('/carts');
      })
      .catch((e) => {
        setLoadingSaveCart(false);
        toast.error('Error saving cart');
      });
  };

  const deleteItem = async (id) => {
    //console.log("cartItem", cart.filter((cartItem) => cartItem.line.id !== id.toString()))
    setLoadingDelete(true);
    await axios
      .delete(`${import.meta.env.VITE_REACT_API_URL}/cart/line/delete/?line_id=${id}`, {
        headers: {
          Authorization: `Bearer ${user}`
        }
      })
      .then((res) => {
        setLoadingDelete(false);
        //setSelectedPartNum(null);
        toast.success('Product added to cart successfully');

        setCart((prevCart) => {
          // Filter out the cart item where line.id matches the id
          const updatedCart = prevCart.filter((cartItem) => cartItem.line.id !== id);
          return updatedCart;
        });
      })
      .catch((e) => {
        setLoadingDelete(false);
        toast.error('Error deleting Line');
      });
  };

  const detachClient = async () => {
    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/cart/enduser/detach`,
        {
          end_user_id: attachedClient?.id
        },
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then(() => {
        toast.success('Client detached successfully');
        setAttachedClient(null);
      })
      .catch((e) => {
        toast.error('Error detaching client');
      });
  };

  useEffect(() => {
    const calculateMiscCharges = () => {
      return cart?.reduce((acc, line) => {
        const { product_ifilm_fee, product_iEmbossed_fee } = line.line;
        return acc + parseFloat(product_ifilm_fee) + parseFloat(product_iEmbossed_fee);
      }, 0);
    };

    const calculateLinesTotal = () => {
      return cart?.reduce((acc, line) => {
        const { line_full_price	 } = line.line;
        return acc + parseFloat(line_full_price	) ;
      }, 0);
    };

    const miscChargesTotal = calculateMiscCharges();
    const linesTotalAmount = calculateLinesTotal();
    const subTotalAmount = miscChargesTotal + linesTotalAmount;

    setMiscCharges(miscChargesTotal);
    setLinesTotal(linesTotalAmount);
    setSubTotal(subTotalAmount);
  }, [cart]);

  const requestQuote = async () => {
    setLoadingCreatingQuote(true);
    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/quote/store`,
        selectedAddress
          ? selectedAddress?.label === 'My address'
            ? {
                //cart_id: Number(cartInfos?.id),
                ship_id: selectedAddress?.ship_id,
                OTSContact: '',
                OTSName: '',
                OTSAddr1: '',
                OTSAddr2: '',
                OTSAddr3: '',
                OTSCity: '',
                OTSProv: '',
                OTSZip: '',
                OTSCountry: '',
                useOTS: false,
                name:
                  quoteName ||
                  `${formatDate(new Date())} ${userInfos?.first_name} ${userInfos?.last_name}`
              }
            : {
                //cart_id: Number(cartInfos?.id),
                ship_id: '',
                OTSContact: selectedAddress?.phone,
                OTSName: selectedAddress?.name,
                OTSAddr1: selectedAddress?.address,
                OTSAddr2: '',
                OTSAddr3: '',
                OTSCity: selectedAddress?.city,
                OTSProv: selectedAddress?.state,
                OTSZip: selectedAddress?.zip,
                OTSCountry: selectedAddress?.country,
                useOTS: true,
                name:
                  quoteName ||
                  `${formatDate(new Date())} ${userInfos?.first_name} ${userInfos?.last_name}`
              }
          : {
              //cart_id: Number(cartInfos?.id),
              ship_id: '',
              OTSContact: customAddressValues?.phone,
              OTSName: customAddressValues?.name,
              OTSAddr1: customAddressValues?.address,
              OTSAddr2: '',
              OTSAddr3: '',
              OTSCity: customAddressValues?.city,
              OTSProv: customAddressValues?.state,
              OTSZip: customAddressValues?.zip,
              OTSCountry: customAddressValues?.country,
              useOTS: true,
              name:
                quoteName ||
                `${formatDate(new Date())} ${userInfos?.first_name} ${userInfos?.last_name}`
            },

        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then((res) => {
        setLoadingCreatingQuote(false);
        toast.success('Quote created successfully');
        navigate('/quotes');
      })
      .catch((e) => {
        setLoadingCreatingQuote(false);
        toast.error('Error creating quote');
      });
  };

  useEffect(() => {
    if (addresses) {
      setSelectedAddress(addresses?.find((c) => c.is_default == 1));
    }
  }, [addresses]);

  const getAddresses = async () => {
    setLoadingAddresses(true);
    setAddresses([]);
    setPoNumber(null);
    setQuoteName(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_API_URL}/cart/addresses`, {
        headers: {
          Authorization: `Bearer ${user}`
        }
      });

      setLoadingAddresses(false);

      const { endUser, customer_addresses } = res.data;

      const formattedAddresses = [];

      if (endUser) {
        formattedAddresses.push({
          label: 'Client address',
          name: endUser?.name,
          email: endUser?.email,
          phone: endUser?.phone,
          address: endUser.address,
          city: endUser.city,
          state: endUser.state,
          country: endUser.country,
          zip: endUser.zip,
          is_default: '0'
        });
      }

      const customerAddresses = customer_addresses.map((addr) => ({
        label: 'My address',
        address: addr.address,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        zip: addr.zip,
        is_default: addr.is_default
      }));

      setAddresses([...formattedAddresses, ...customerAddresses]);
    } catch (e) {
      setLoadingAddresses(false);
      toast.error('Error getting addresses');
      setAddresses(null);
    }
  };

  useEffect(() => {
    const getEndUsers = async () => {
      await axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/endusers`, {
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          setEndUsers(res.data);
        })
        .catch(() => {
          toast.error('Error getting End Users');
        });
    };

    getEndUsers();
  }, []);

  const deleteLine = async (id) => {
    //setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const getCart = async () => {
      setLoading(true);
      await axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/cart/lines`, {
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          setLoading(false);
          setCartInfos(res.data.cart);
          const cartData = res.data.lines.map((item) => ({
            ...item,
            line: {
              ...item.line,
              id: item.line.id.toString() // Ensure ID is treated as a string
            }
          }));
          setCart(cartData);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    };

    getCart();
  }, []);

  const AttachCart = async () => {
    setLoadingAttach(true);
    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/cart/enduser/attach`,
        {
          end_user_id: selectedEndUser
        },
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then(() => {
        toast.success('Cart attached successfully');
        setLoadingAttach(false);
        setAttachedClient(endUsers?.find((c) => c.id == selectedEndUser));
      })
      .catch((e) => {
        toast.error('Error attaching cart');
        setLoadingAttach(false);
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

  useEffect(() => {
    const getClient = async () => {
      axios
        .get(
          `${import.meta.env.VITE_REACT_API_URL}/endusers/show?id=${Number(cartInfos?.end_user_id)}`,
          {
            headers: {
              Authorization: `Bearer ${user}`
            }
          }
        )
        .then((res) => {
          setAttachedClient(res.data);
        })
        .catch(() => {
          toast.error('Error getting Attached client');
        });
    };

    if (cartInfos?.end_user_id) getClient();
  }, [cartInfos]);

  return (
    <div className="wrapper">
      {loading ? (
        <div className="h-full flex items-center justify-center mt-12">
          <ClipLoader
            color={'black'}
            loading={loading}
            //cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <div className="flex lg:items-center lg:justify-between lg:flex-row flex-col gap-4">
            <div className="flex items-center gap-4 justify-between lg:justify-normal">
              <h3 className="capitalize text-xl font-bold">Your shopping cart</h3>
              <DialogSmall>
                <DialogTrigger>
                  <Button className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary">
                    Save cart
                  </Button>
                </DialogTrigger>
                <DialogContentSmall>
                  <DialogHeaderSmall>
                    <DialogTitleSmall>Save cart </DialogTitleSmall>
                  </DialogHeaderSmall>

                  <DialogDescriptionSmall className="flex flex-col gap-2">
                    <div className="mb-2">
                      <label>Name:</label>
                      <Input
                        className="mt-1"
                        value={cartName}
                        onChange={(e) => setCartName(e.target.value)}
                      />
                    </div>
                  </DialogDescriptionSmall>

                  <DialogFooterSmall>
                    <Button
                      className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary"
                      disabled={loadingSaveCart}
                      onClick={loadingSaveCart ? null : saveCart}>
                      {loadingSaveCart ? 'Saving cart...' : 'Save cart'}
                    </Button>
                  </DialogFooterSmall>
                </DialogContentSmall>
              </DialogSmall>
            </div>
            <div>
              <Button className="text-lg font-semibold" size="lg">
                <BiPrinter className="mr-2 h-8 w-8" /> Print
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row w-100 lg:mt-8 items-baseline">
            <Table className="whitespace-nowrap lg:w-[100%] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Items</TableHead>
                  <TableHead>QTY</TableHead>
                  <TableHead>Option(s)</TableHead>
                  <TableHead className="text-right">Price</TableHead>

                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex gap-2 min-w-max">
                      <img
                        src={
                          item?.line?.product_category?.toLowerCase() === 'flashing' ||
                          item?.line?.product_category?.toLowerCase() === 'accessories'
                            ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/trim/${item?.line?.product_brand.toLowerCase()}.webp`
                            : item?.line?.product_category?.toLowerCase() === 'flats'
                              ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/flat/${item?.line?.product_brand.toLowerCase()}.webp`
                              : item?.line?.product_category?.toLowerCase() === 'screws'
                                ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/screws/${item?.line?.product_brand.toLowerCase()}.webp`
                                : item?.line?.product_category?.toLowerCase() === 'sliding doors'
                                  ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/west/${item?.line?.product_brand.toLowerCase()}.webp`
                                  : item?.line?.product_category?.toLowerCase() === 'roofing/siding'
                                    ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/${item?.line?.product_brand?.toLowerCase()}/panel.webp`
                                    : item?.line?.product_category?.toLowerCase() === 'decking'
                                      ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/${item?.line?.product_brand?.toLowerCase()}/diagram.webp`
                                      : product
                        }
                        alt="Product Image"
                        className="border-gris-claire border rounded-lg w-40 aspect-w-1 aspect-h-1"
                      />

                      <div>
                        <h3 className="font-bold mb-2">{item?.line?.product_name}</h3>
                        <div className="text-gris-claire text-lg">
                          {item?.part[0]?.color_enc && <p>color: {item?.part[0]?.color_enc}</p>}

                          {item?.part[0]?.gauge && <p>Gauge: {item?.part[0]?.gauge}</p>}

                          <p>Length: {item?.line?.product_entryLen}</p>

                          {item?.part[0]?.size1 && <p>Size1: {item?.part[0]?.size1}</p>}

                          {item?.part[0]?.size2 && <p>size2: {item?.part[0]?.size2}</p>}

                          {item?.part[0]?.sub_brand && <p>Profile: {item?.part[0]?.sub_brand}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-40 ">
                      <p className="w-full">{item?.line?.product_salesQty}</p>
                    </TableCell>
                    <TableCell className="max-w-max">
                      <div className="text-gris-claire text-lg">
                        {(() => {
                          try {
                            const productVariablesString = item?.line?.product_variables;
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
                      <div className="text-base">
                        <p>
                          ${Number(item?.line?.line_full_price)?.toFixed(4)}
                          <span className="text-xs italic text-gray-700">
                          {" "}(${Number(item?.line?.unity_price)?.toFixed(4)} per unit)
                          </span>
                        </p>
                        <p className="text-gray-500">
                          ${Number(item?.line?.line_full_cost)?.toFixed(4)}
                          <span className="text-xs italic text-gray-500">
                            {" "}(${Number(item?.line?.product_cost)?.toFixed(4)} per unit)
                          </span>
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="w-full">
                      <div className="flex gap-3 items-center justify-center w-full">
                        <Dialog>
                          <DialogTrigger>
                            <Edit className="cursor-pointer" size={22} />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit cart line</DialogTitle>
                              <DialogDescription>
                                <EditPopup
                                  vars={parseProductVariables(
                                    item?.line?.product_variables
                                      ? item?.line?.product_variables
                                      : {}
                                  )}
                                  id={item?.line?.id}
                                  setCart={setCart}
                                />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <DialogSmall>
                          <DialogTrigger onClick={() => setIdToDelete(item?.line?.id)}>
                            <Trash size={22} />
                          </DialogTrigger>
                          <DialogContentSmall>
                            <DialogHeaderSmall>
                              <DialogTitleSmall>Delete Line</DialogTitleSmall>
                            </DialogHeaderSmall>
                            <DialogDescription>
                              Are you sure you want to delete this line? This action cannot be
                              undone. This will permanently delete this line.
                            </DialogDescription>

                            <DialogFooterSmall>
                              <Button
                                onClick={() => deleteItem(idToDelete)}
                                disabled={loadingDelete}
                                className="bg-red-500 text-white hover:bg-red-500/90">
                                {loadingDelete ? 'Deleting line...' : 'Delete'}
                              </Button>
                            </DialogFooterSmall>
                          </DialogContentSmall>
                        </DialogSmall>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="border border-gris-claire rounded-lg p-4 lg:w-[30%] h-auto">
              <div className="border-b-2 border-black flex flex-col gap-8 pb-8">
                <div className="flex justify-between items-center">
                  <p>Misc Charges : </p>
                  <p>${Number(miscCharges)?.toFixed(2)}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p>Lines Total : </p>
                  <p>${Number(linesTotal)?.toFixed(2)}</p>
                </div>

                {/*<div className="flex justify-between items-center">
                  <p>Delivery Fee : </p>
                  <p>${subTotal}</p>
                </div>*/}
              </div>

              <div className="border-b-2 border-black flex flex-col gap-8 py-8">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Subtotal : </p>
                  <p>${Number(subTotal)?.toFixed(2)}</p>
                </div>

                <div className="flex justify-end items-center">
                  <p>+ Applicable Taxes</p>
                </div>
              </div>

              {/*<div className="py-8">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Grand Total : </p>
                  <p>$245978</p>
                </div>
              </div>*/}

              <div className="flex flex-col gap-4 mt-4">
                {!attachedClient ? (
                  <>
                    <select
                      className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:opacity-50"
                      onChange={(e) => setSelectedEndUser(e.target.value)}
                      value={selectedEndUser}>
                      <option value="">Select an client</option>
                      {endUsers?.map((user) => (
                        <option key={user?.id} value={user?.id}>
                          {user?.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      disabled={loadingAttach || !selectedEndUser}
                      onClick={loadingAttach ? null : AttachCart}
                      className="w-100 rounded-md">
                      {loadingAttach ? 'Attaching cart' : 'Attach a client'}
                    </Button>
                  </>
                ) : (
                  <div>
                    This cart is attached to {attachedClient?.name},{' '}
                    <span
                      onClick={detachClient}
                      className="text-blue-500 hover:text-blue-500/90 underline cursor-pointer">
                      Detach this client?
                    </span>
                  </div>
                )}
                <DialogSmall>
                  <DialogTrigger>
                    <Button
                      onClick={getAddresses}
                      className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary w-full">
                      Request Quote
                    </Button>
                  </DialogTrigger>
                  <DialogContentSmall>
                    <DialogHeaderSmall>
                      <DialogTitleSmall>Please choose an address </DialogTitleSmall>
                    </DialogHeaderSmall>
                    {loadingAddresses ? (
                      <DialogDescriptionSmall>
                        <div className="h-[300px] flex justify-center items-center">
                          <ClipLoader
                            color={'black'}
                            loading={loadingAddresses}
                            //cssOverride={override}
                            size={150}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        </div>
                      </DialogDescriptionSmall>
                    ) : (
                      <DialogDescriptionSmall className="flex flex-col gap-2">
                        <div className="mb-2">
                          <label>Name:</label>
                          <Input
                            className="mt-1"
                            value={quoteName}
                            onChange={(e) => setQuoteName(e.target.value)}
                          />
                        </div>
                        {addresses?.map((address) => (
                          <div
                            onClick={() => setSelectedAddress(address)}
                            className={`flex justify-between gap-4 text-black border rounded-md px-4 py-3 cursor-pointer ${
                              JSON.stringify(selectedAddress) === JSON.stringify(address)
                                ? 'ring-2 ring-blue-500'
                                : ''
                            }`}
                            key={address?.ship_id}>
                            <div>
                              <h3 className="font-blod text-xl">{address.label}</h3>
                              <div>
                                {address?.address +
                                  ', ' +
                                  address?.city +
                                  ', ' +
                                  address?.zip +
                                  ' ' +
                                  address?.state +
                                  ', ' +
                                  address?.country}
                              </div>
                            </div>
                            <div>
                              <input
                                checked={
                                  JSON.stringify(selectedAddress) === JSON.stringify(address)
                                }
                                type="radio"
                              />
                            </div>
                          </div>
                        ))}

                        <div
                          onClick={() => setSelectedAddress(null)}
                          className={`flex justify-between gap-4 text-black border rounded-md px-4 py-3 cursor-pointer ${
                            !selectedAddress ? 'ring-2 ring-blue-500' : ''
                          }`}>
                          <div>
                            <h3 className="font-blod text-xl">Custom address</h3>
                          </div>
                          <div>
                            <input checked={!selectedAddress} type="radio" />
                          </div>
                        </div>
                      </DialogDescriptionSmall>
                    )}

                    <DialogFooterSmall>
                      <Button
                        disabled={loadingCreatingQuote}
                        onClick={loadingCreatingQuote ? null : requestQuote}
                        className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary">
                        {loadingCreatingQuote ? 'Creating quote...' : 'Request Quote'}
                      </Button>
                    </DialogFooterSmall>
                  </DialogContentSmall>
                </DialogSmall>

                <DialogSmall>
                  <DialogTrigger>
                    <Button onClick={getAddresses} className="w-100 rounded-md  text-white  w-full">
                      Order
                    </Button>
                  </DialogTrigger>
                  <DialogContentSmall>
                    <DialogHeaderSmall>
                      <DialogTitleSmall>Please choose an address </DialogTitleSmall>
                    </DialogHeaderSmall>
                    {loadingAddresses ? (
                      <DialogDescriptionSmall>
                        <div className="h-[300px] flex justify-center items-center">
                          <ClipLoader
                            color={'black'}
                            loading={loadingAddresses}
                            //cssOverride={override}
                            size={150}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        </div>
                      </DialogDescriptionSmall>
                    ) : (
                      <DialogDescriptionSmall className="flex flex-col gap-2">
                        <div className="mb-2 text-black">
                          <label>
                            PO Number:{' '}
                            <span className="text-xs italic text-gray-500">{'(required)'}</span>
                          </label>
                          <Input
                            className="mt-1"
                            value={poNumber}
                            onChange={(e) => setPoNumber(e.target.value)}
                          />
                        </div>
                        {addresses?.map((address) => (
                          <div
                            onClick={() => setSelectedAddress(address)}
                            className={`flex justify-between gap-4 text-black border rounded-md px-4 py-3 cursor-pointer ${
                              JSON.stringify(selectedAddress) === JSON.stringify(address)
                                ? 'ring-2 ring-blue-500'
                                : ''
                            }`}
                            key={address?.ship_id}>
                            <div>
                              <h3 className="font-blod text-xl">{address.label}</h3>
                              <div>
                                {address?.address +
                                  ', ' +
                                  address?.city +
                                  ', ' +
                                  address?.zip +
                                  ' ' +
                                  address?.state +
                                  ', ' +
                                  address?.country}
                              </div>
                            </div>
                            <div>
                              <input
                                checked={
                                  JSON.stringify(selectedAddress) === JSON.stringify(address)
                                }
                                type="radio"
                              />
                            </div>
                          </div>
                        ))}

                        <div
                          onClick={() => setSelectedAddress(null)}
                          className={`flex justify-between gap-4 text-black border rounded-md px-4 py-3 cursor-pointer ${
                            !selectedAddress ? 'ring-2 ring-blue-500' : ''
                          }`}>
                          <div>
                            <h3 className="font-blod text-xl">Custom address</h3>
                          </div>
                          <div>
                            <input checked={!selectedAddress} type="radio" />
                          </div>
                        </div>
                      </DialogDescriptionSmall>
                    )}

                    <DialogFooterSmall>
                      <Button
                        disabled={loadingOrder || !poNumber}
                        onClick={loadingOrder ? null : orderCart}
                        className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary">
                        {loadingOrder ? 'Creating order...' : 'Create order'}
                      </Button>
                    </DialogFooterSmall>
                  </DialogContentSmall>
                </DialogSmall>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
