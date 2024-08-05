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
import { Eye, Trash } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Link } from 'react-router-dom';
import CartLinesPopup from '@/components/Cart/CartLinesPopup';

const SavedCarts = () => {
  const [carts, setCarts] = useState(null);
  const [loadingCarts, setLoadingCarts] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [selectedCart, setSelectedCart] = useState(null)

  const { user } = useAuth();

  const deleteCart = async (id) => {
    setLoadingDelete(true);
    await axios
      .delete(`${import.meta.env.VITE_REACT_API_URL}/quote/delete/`, {
        // Correctly pass the body here
        headers: {
          Authorization: `Bearer ${user}`
        },

        data: { quote_id: id }
      })
      .then(() => {
        setLoadingDelete(false);
        toast.success('Quote deleted');
        setCarts(carts.filter((q) => q.id !== id));
        setIdToDelete(null);
      })
      .catch((e) => {
        setLoadingDelete(false);
        toast.error('Error deleting quote');
      });
  };

  useEffect(() => {
    const getCarts = async () => {
      setLoadingCarts(true);
      await axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/cart/saved`, {
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          setLoadingCarts(false);
          setCarts(res.data);
        })
        .catch((e) => {
          toast.error('Error getting carts');
          setLoadingCarts(false);
        });
    };
    getCarts();
  }, []);
  return (
    <div className="wrapper">
      <h3 className="capitalize text-xl font-bold">Saved carts</h3>

      {loadingCarts ? (
        <div className="h-full flex items-center justify-center mt-12">
          <ClipLoader
            color={'black'}
            loading={loadingCarts}
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
                <TableHead>Cart ID</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Lines number</TableHead>

                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {carts?.map((cart) => (
                <TableRow key={cart?.id}>
                  <TableCell>{cart?.id}</TableCell>
                  <TableCell>{cart?.end_user_id}</TableCell>
                  <TableCell>{cart?.lines?.length}</TableCell>

                  <TableCell className="flex gap-2">
                    {/*<Dialog>
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
                            onClick={() => deleteCart(idToDelete)}
                            disabled={loadingDelete}
                            className="bg-red-500 text-white hover:bg-red-500/90">
                            {loadingDelete ? 'Deleting quote...' : 'Delete'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>*/}

                    <DialogBig>
                      <DialogTriggerBig onClick={() => setSelectedCart(cart)}>
                        <Eye size={22} />
                      </DialogTriggerBig>
                      <DialogContentBig className='max-h-[600px] overflow-auto'>
                        <CartLinesPopup cart={cart}/>
                      </DialogContentBig>
                    </DialogBig>
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

export default SavedCarts;
