import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { ChevronLeft, ChevronRight, Eye, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

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
  Dialog as DialogSmall,
  DialogContent as DialogContentSmall,
  DialogDescription as DialogDescriptionSmall,
  DialogFooter as DialogFooterSmall,
  DialogHeader as DialogHeaderSmall,
  DialogTitle as DialogTitleSmall
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Input } from '@/components/ui/input';
import CartLinesPopup from '@/components/Cart/CartLinesPopup';
import ReactPaginate from 'react-paginate';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Quotes = () => {
  const [quotes, setQuotes] = useState(null);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const navigate = useNavigate();

  const [loadingOrder, setLoadingOrder] = useState(null);

  const [poNumber, setPoNumber] = useState(null);
  const [quoteToOrder, setQuoteToOrder] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageClick = (event) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('page', event.selected + 1);
    setSearchParams(updatedSearchParams.toString());
  };

  const orderCart = async (quote) => {
    setLoadingOrder(true);

    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/orders/create`,

        {
          quote_number: quote?.number,
          poNum: poNumber,
          useOTS: false
        },
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then((res) => {
        setPoNumber(null);
        setLoadingOrder(false);
        toast.success('Order created successfully');
        //navigate('/orders');
      })
      .catch((e) => {
        setLoadingOrder(false);
        toast.error('Error creating order');
      });
  };

  const { user } = useAuth();

  const deleteQuote = async (id) => {
    setLoadingDelete(true);
    await axios
      .delete(`${import.meta.env.VITE_REACT_API_URL}/quote/delete/`, {
        // Correctly pass the body here
        headers: {
          Authorization: `Bearer ${user}`
        },

        data: { quote_number: id }
      })
      .then(() => {
        setLoadingDelete(false);
        toast.success('Quote deleted');
        setQuotes(quotes.filter((q) => q?.quote.number !== id));
        setIdToDelete(null);
      })
      .catch((e) => {
        setLoadingDelete(false);
        toast.error('Error deleting quote');
      });
  };

  useEffect(() => {
    const getQuotes = async () => {
      setLoadingQuotes(true);
      await axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/quote/all`, {
          params: {
            page: searchParams.get('page') || 1
          },
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          setLoadingQuotes(false);
          setQuotes(res.data);
        })
        .catch((e) => {
          toast.error('Error getting quotes');
          setLoadingQuotes(false);
        });
    };
    getQuotes();
  }, [searchParams]);

  const loadToCart = async (quote) => {
    setLoadingOrder(true);

    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/quote/load`,

        {
          cart_id: quote?.cart_id,
          
        },
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then((res) => {
        setPoNumber(null);
        setLoadingOrder(false);
        toast.success('Quote loaded successfully');
        navigate('/cart');
      })
      .catch((e) => {
        setLoadingOrder(false);
        toast.error('Error loading quote to cart');
        console.log((e))
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  return (
    <div className="wrapper">
      <h3 className="capitalize text-xl font-bold">My quotes</h3>

      {loadingQuotes ? (
        <div className="h-full flex items-center justify-center mt-12">
          <ClipLoader
            color={'black'}
            loading={loadingQuotes}
            //cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="mt-4 lg:mt-8">
          <Table className="whitespace-nowrap w-full">
            <TableHeader className="capitalize">
              <TableRow>
                <TableHead>Quote Number</TableHead>
                <TableHead>Quote Name</TableHead>
                <TableHead>Creation Date</TableHead>

                <TableHead>OTS Address</TableHead>
                <TableHead>Net sale</TableHead>
                <TableHead>Tax amount</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {quotes?.data?.map((quote) => (
                <TableRow key={quote?.quote?.number}>
                  <TableCell>{quote?.quote?.number}</TableCell>

                  <TableCell className="max-w-[150px] whitespace-normal">
                    {quote?.quote?.name}
                  </TableCell>
                  <TableCell>{formatDate(quote?.quote?.created_at)}</TableCell>
                  <TableCell className="max-w-[200px] whitespace-normal">
                    {[
                      quote?.quote?.OTSAddr1,
                      quote?.quote?.OTSCity,
                      quote?.quote?.OTSZip,
                      quote?.quote?.OTSProv,
                      quote?.quote?.OTSCountry
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </TableCell>

                  <TableCell>{quote?.quote?.net_sale}</TableCell>
                  <TableCell>{quote?.quote?.tax_amount}</TableCell>
                  <TableCell>{quote?.quote?.total_sale}</TableCell>

                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger onClick={() => setIdToDelete(quote?.quote?.number)}>
                        <Trash size={22} />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Quote</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          Are you sure you want to delete this quote? This action cannot be undone.
                          This will permanently delete this quote.
                        </DialogDescription>

                        <DialogFooter>
                          <Button
                            onClick={() => deleteQuote(idToDelete)}
                            disabled={loadingDelete}
                            className="bg-red-500 text-white hover:bg-red-500/90">
                            {loadingDelete ? 'Deleting quote...' : 'Delete'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <DialogBig>
                      <DialogTriggerBig>
                        <Eye size={22} />
                      </DialogTriggerBig>
                      <DialogContentBig className="max-h-[600px] overflow-auto">
                        <CartLinesPopup
                          cart={{
                            cart: { name: quote?.quote?.name, id: quote?.quote?.number },
                            lines: quote?.quote?.lines
                          }}
                          forQuotes={true}
                        />
                      </DialogContentBig>
                    </DialogBig>

                    <DialogSmall>
                      <DialogTrigger>
                        <Button
                          onClick={() => setQuoteToOrder(quote?.quote)}
                          className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary ">
                          Load to cart
                        </Button>
                      </DialogTrigger>
                      <DialogContentSmall>
                        <DialogHeaderSmall>
                          <DialogTitleSmall>Load to cart </DialogTitleSmall>
                        </DialogHeaderSmall>

                        <DialogDescriptionSmall className="flex flex-col gap-2">
                          <div className="mb-2">
                            This action will overwrite the current cart. Are you sure you wanna
                            performe this action?
                          </div>
                        </DialogDescriptionSmall>

                        <DialogFooterSmall>
                          <Button
                            disabled={loadingOrder}
                            onClick={() => (loadingOrder ? null : loadToCart(quoteToOrder))}
                            className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary">
                            {loadingOrder ? 'loading to cart...' : 'Load to cart'}
                          </Button>
                        </DialogFooterSmall>
                      </DialogContentSmall>
                    </DialogSmall>

                    <DialogSmall>
                      <DialogTrigger>
                        <Button
                          onClick={() => setQuoteToOrder(quote?.quote)}
                          className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary ">
                          Create Order
                        </Button>
                      </DialogTrigger>
                      <DialogContentSmall>
                        <DialogHeaderSmall>
                          <DialogTitleSmall>Create Order </DialogTitleSmall>
                        </DialogHeaderSmall>

                        <DialogDescriptionSmall className="flex flex-col gap-2">
                          <div className="mb-2">
                            <label>PO Number:</label>
                            <Input
                              className="mt-1"
                              value={poNumber}
                              onChange={(e) => setPoNumber(e.target.value)}
                            />
                          </div>
                        </DialogDescriptionSmall>

                        <DialogFooterSmall>
                          <Button
                            disabled={loadingOrder}
                            onClick={() => (loadingOrder ? null : orderCart(quoteToOrder))}
                            className="w-100 rounded-md bg-green-primary text-white hover:bg-green-primary/90 border-green-primary">
                            {loadingOrder ? 'Creating order...' : 'Create order'}
                          </Button>
                        </DialogFooterSmall>
                      </DialogContentSmall>
                    </DialogSmall>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ReactPaginate
        breakLabel="..."
        previousLabel={<ChevronLeft size={24} />}
        nextLabel={<ChevronRight size={24} />}
        pageClassName={'py-1.5 px-3'}
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={Math.ceil(quotes?.meta?.total / quotes?.meta?.per_page)}
        renderOnZeroPageCount={null}
        containerClassName="pagination flex justify-center mt-4 gap-4"
        activeClassName="active bg-green-primary  text-white"
        previousLinkClassName="previous mr-2 flex items-center justify-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-200"
        nextLinkClassName="next ml-2 flex items-center justify-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-200"
        disabledClassName="disabled opacity-50 cursor-not-allowed"
        initialPage={(parseInt(searchParams.get('page')) || 1) - 1}
      />
    </div>
  );
};

export default Quotes;
