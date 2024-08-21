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
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import CartLinesPopup from '@/components/Cart/CartLinesPopup';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

import {
  Dialog as DialogBig,
  DialogContent as DialogContentBig,
  DialogDescription as DialogDescriptionBig,
  DialogFooter as DialogFooterBig,
  DialogHeader as DialogHeaderBig,
  DialogTitle as DialogTitleBig,
  DialogTrigger as DialogTriggerBig
} from '@/components/ui/fullWdialgog';
import ReactPaginate from 'react-paginate';

const Orders = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      await axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          setLoading(false);
          setOrders(res.data);
        })
        .catch((e) => {
          toast.error('Error getting quotes');
          setLoading(false);
        });
    };
    getOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  return (
    <div className="wrapper">
      <h3 className="capitalize text-xl font-bold">My Orders</h3>

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
        <div className="mt-4 lg:mt-8">
          <Table className="whitespace-nowrap w-full">
            <TableHeader className="capitalize">
              <TableRow>
                <TableHead>PO</TableHead>

                <TableHead>Creation Date</TableHead>
                <TableHead>Ship By Date</TableHead>
                <TableHead>OTS Address</TableHead>
                <TableHead>Net sale</TableHead>
                <TableHead>Tax amount</TableHead>

                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.number}>
                  <TableCell>{order?.poNum}</TableCell>

                  <TableCell>{formatDate(order?.created_at)}</TableCell>
                  <TableCell>{formatDate(order?.created_at)}</TableCell>
                  <TableCell>
                    {[
                      order?.OTSAddr1,
                      order?.OTSCity,
                      order?.OTSZip,
                      order?.OTSProv,
                      order?.OTSCountry
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </TableCell>
                  <TableCell>{order.net_sale}</TableCell>
                  <TableCell>{order.tax_amount}</TableCell>

                  <TableCell>
                    <DialogBig>
                      <DialogTriggerBig>
                        <Eye size={22} />
                      </DialogTriggerBig>
                      <DialogContentBig className="max-h-[600px] overflow-auto">
                        <CartLinesPopup
                          cart={{
                            cart: { name: order?.poNum, id: order?.number },
                            lines: order?.lines
                          }}
                          forOrders={true}
                        />
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

export default Orders;
