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
import { Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

const Quotes = () => {
  const [quotes, setQuotes] = useState(null);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const {user} = useAuth()

  const deleteQuote = async (id) => {
    setLoadingDelete(true);
    await axios
      .delete(
        `${import.meta.env.VITE_REACT_API_URL}/quote/delete/`,
        {
            // Correctly pass the body here
          headers: {
            Authorization: `Bearer ${user}`
          },

          data: { quote_id: id },
        }
      )
      .then(() => {
        setLoadingDelete(false);
        toast.success('Quote deleted');
        setQuotes(quotes.filter((q) => q.id !== id));
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
  }, []);
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
                <TableHead>Project Name</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead>Customer Info</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Lines</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Checkout</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {quotes?.map((quote) => (
                <TableRow key={quote?.quote?.number}>
                  <TableCell>{quote?.quote?.number}</TableCell>
                  <TableCell>Test PN</TableCell>
                  <TableCell>Macha L</TableCell>
                  <TableCell>Macha L</TableCell>
                  <TableCell>Contractor A</TableCell>
                  <TableCell>2024-04-17</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>125 Maple St</TableCell>
                  <TableCell>$3562.85</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger onClick={() => setIdToDelete(quote?.quote?.number)}>
                        <Trash size={22} />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Client</DialogTitle>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Quotes;
