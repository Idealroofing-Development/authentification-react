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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Edit, PlusIcon, Trash } from 'lucide-react';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useContext } from 'react';
import { PermissionsContext } from '@/context/permissionsContext';
import { useSearchParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const Clients = () => {
  const [clients, setClients] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [clientToEditInfos, setClientToEditInfos] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    comment: '',
    id: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: ''
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [clientInfos, setClientsInfos] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    comment: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip: ''
  });

  const { user } = useAuth();

  const { permissions } = useContext(PermissionsContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState(null)

  const handlePageClick = (event) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('page', event.selected + 1);
    setSearchParams(updatedSearchParams.toString());
  };

  useEffect(() => {
    const getClient = async () => {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/endusers`, {
          params: {
            page: searchParams.get('page') || 1
          },
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          setLoading(false);
          setClients(res.data.data);
          setResult(res.data)
        })
        .catch(() => {
          setLoading(false);
          toast.error('Error getting End Users');
        });
    };
    getClient();
  }, []);

  const deleteClient = async (id) => {
    setLoadingDelete(true);
    await axios
      .delete(`${import.meta.env.VITE_REACT_API_URL}/endusers/delete/?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user}`
        }
      })
      .then(() => {
        setLoadingDelete(false);
        toast.success('Client deleted');
        setClients(clients.filter((c) => c.id !== id));
        setIdToDelete(null);
      })
      .catch((e) => {
        setLoadingDelete(false);
        toast.error('Error deleting user');
      });
  };

  const addClient = async () => {
    setLoadingAdd(true);
    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/endusers/store`,
        {},
        {
          params: clientInfos,
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then((res) => {
        setLoadingAdd(false);
        setClients((prevClients) => [clientInfos, ...prevClients]);
        setClientsInfos({
          name: '',
          email: '',
          phone: '',
          company: '',
          comment: '',
          address: '',
          city: '',
          state: '',
          country: '',
          zip: ''
        });
        toast.success('Client added successfully');
      })
      .catch((e) => {
        setLoadingAdd(false);
        toast.error('Error Adding Client');
      });
  };

  useEffect(() => {
    console.log(clients);
  }, [clients]);

  const updateClient = async () => {
    setLoadingUpdate(true);

    // Find the client in the clients array with the same ID
    const existingClient = clients.find((client) => client.id === clientToEditInfos.id);

    // Clone the clientToEditInfos to avoid mutating the original object
    const updatedClientInfo = { ...clientToEditInfos };

    // If the email hasn't changed, remove it from the updatedClientInfo
    if (existingClient && existingClient.email === clientToEditInfos.email) {
      delete updatedClientInfo.email;
    }

    await axios
      .patch(
        `${import.meta.env.VITE_REACT_API_URL}/endusers/update`,
        {},
        {
          params: updatedClientInfo,
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then((res) => {
        setLoadingUpdate(false);

        // Replace the client with the same ID in the clients array
        const updatedClients = clients?.map((client) =>
          client.id === clientToEditInfos.id ? { ...client, ...clientToEditInfos } : client
        );

        setClients(updatedClients);

        // Reset clientToEditInfos
        setClientToEditInfos({
          name: '',
          email: '',
          phone: '',
          company: '',
          comment: '',
          address: '',
          city: '',
          state: '',
          country: '',
          zip: ''
        });

        toast.success('Client updated successfully');
      })
      .catch((e) => {
        setLoadingUpdate(false);
        toast.error('Error Updating Client');
      });
  };

  return (
    <div className="wrapper">
      <div className="flex gap-4 justify-between items-center">
        <h3 className="capitalize text-xl font-bold">My Clients</h3>
        {permissions?.find((p) => p?.name === 'create end users') ? (
          <Dialog>
            <DialogTrigger>
              <Button className="text-white bg-green-primary hover:bg-green-primary/90 border-none">
                <PlusIcon size={16} />
                <div className="text-sm">Add new client</div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add new client</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <Tabs defaultValue="infos" className="w-full">
                  <TabsList className="w-full flex justify-evenly">
                    <TabsTrigger className="w-full" value="infos">
                      Infos
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="address">
                      Address
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent className="flex flex-col gap-2 text-black" value="infos">
                    <div className="flex flex-col gap-1">
                      <label>Name</label>
                      <Input
                        value={clientInfos.name}
                        onChange={(e) => setClientsInfos({ ...clientInfos, name: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>Email</label>
                      <Input
                        value={clientInfos.email}
                        onChange={(e) => setClientsInfos({ ...clientInfos, email: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>Phone</label>
                      <Input
                        value={clientInfos.phone}
                        onChange={(e) => setClientsInfos({ ...clientInfos, phone: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>Company</label>
                      <Input
                        value={clientInfos.company}
                        onChange={(e) =>
                          setClientsInfos({ ...clientInfos, company: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>comment</label>
                      <Input
                        value={clientInfos.comment}
                        onChange={(e) =>
                          setClientsInfos({ ...clientInfos, comment: e.target.value })
                        }
                      />
                    </div>
                  </TabsContent>
                  <TabsContent className="flex flex-col gap-2 text-black" value="address">
                    <div className="flex flex-col gap-1">
                      <label>Address</label>
                      <Input
                        value={clientInfos.address}
                        onChange={(e) =>
                          setClientsInfos({ ...clientInfos, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>City</label>
                      <Input
                        value={clientInfos.city}
                        onChange={(e) => setClientsInfos({ ...clientInfos, city: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>State</label>
                      <Input
                        value={clientInfos.state}
                        onChange={(e) => setClientsInfos({ ...clientInfos, state: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>Country</label>
                      <Input
                        value={clientInfos.country}
                        onChange={(e) =>
                          setClientsInfos({ ...clientInfos, country: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label>ZIP</label>
                      <Input
                        value={clientInfos.zip}
                        onChange={(e) => setClientsInfos({ ...clientInfos, zip: e.target.value })}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogDescription>
              <div className="flex justify-end">
                <Button
                  onClick={addClient}
                  disabled={loadingAdd}
                  className="text-white bg-green-primary hover:bg-green-primary/90 border-none mt-1 ">
                  {loadingAdd ? 'Adding client...' : 'Add client'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {clients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client?.name}</TableCell>
                  <TableCell>{client?.email}</TableCell>
                  <TableCell>{client?.company}</TableCell>
                  <TableCell>{client?.phone}</TableCell>
                  <TableCell className="max-w-[250px] whitespace-normal">
                    {client?.comment}
                  </TableCell>
                  <TableCell className="flex gap-3">
                    {permissions?.find((p) => p?.name === 'delete end users') ? (
                      <Dialog>
                        <DialogTrigger onClick={() => setIdToDelete(client.id)}>
                          <Trash size={22} />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Client</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Are you sure you want to delete this markup?This action cannot be
                            undone. This will permanently delete this markup.
                          </DialogDescription>

                          <DialogFooter>
                            <Button
                              onClick={() => deleteClient(idToDelete)}
                              disabled={loadingDelete}
                              className="bg-red-500 text-white hover:bg-red-500/90">
                              {loadingDelete ? 'Deletin client...' : 'Delete'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : null}

                    {permissions?.find((p) => p?.name === 'update end users') ? (
                      <Dialog>
                        <DialogTrigger onClick={() => setClientToEditInfos(client)}>
                          <Edit size={22} />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit client</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            <Tabs defaultValue="infos" className="w-full">
                              <TabsList className="w-full flex justify-evenly">
                                <TabsTrigger className="w-full" value="infos">
                                  Infos
                                </TabsTrigger>
                                <TabsTrigger className="w-full" value="address">
                                  Address
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent className="flex flex-col gap-2 text-black" value="infos">
                                <div className="flex flex-col gap-1">
                                  <label>Name</label>
                                  <Input
                                    value={clientToEditInfos.name}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        name: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label>Email</label>
                                  <Input
                                    value={clientToEditInfos.email}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        email: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label>Phone</label>
                                  <Input
                                    value={clientToEditInfos.phone}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        phone: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label>Company</label>
                                  <Input
                                    value={clientToEditInfos.company}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        company: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label>comment</label>
                                  <Input
                                    value={clientToEditInfos.comment}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        comment: e.target.value
                                      })
                                    }
                                  />
                                </div>
                              </TabsContent>
                              <TabsContent
                                className="flex flex-col gap-2 text-black"
                                value="address">
                                <div className="flex flex-col gap-1">
                                  <label>Address</label>
                                  <Input
                                    value={clientToEditInfos.address}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        address: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label>City</label>
                                  <Input
                                    value={clientToEditInfos.city}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        city: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label>State</label>
                                  <Input
                                    value={clientToEditInfos.state}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        state: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label>Country</label>
                                  <Input
                                    value={clientToEditInfos.country}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        country: e.target.value
                                      })
                                    }
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label>ZIP</label>
                                  <Input
                                    value={clientToEditInfos.zip}
                                    onChange={(e) =>
                                      setClientToEditInfos({
                                        ...clientToEditInfos,
                                        zip: e.target.value
                                      })
                                    }
                                  />
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogDescription>
                          <div className="flex justify-end">
                            <Button
                              onClick={updateClient}
                              disabled={loadingUpdate}
                              className="text-white bg-green-primary hover:bg-green-primary/90 border-none mt-1 ">
                              {loadingUpdate ? 'Updating client...' : 'Update client'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <ReactPaginate
            breakLabel="..."
            previousLabel={<ChevronLeft size={24} />}
            nextLabel={<ChevronRight size={24} />}
            pageClassName={'py-1.5 px-3'}
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={Math.ceil(result?.total / result?.per_page)}
            renderOnZeroPageCount={null}
            containerClassName="pagination flex justify-center mt-4 gap-4"
            activeClassName="active bg-green-primary  text-white"
            previousLinkClassName="previous mr-2 flex items-center justify-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-200"
            nextLinkClassName="next ml-2 flex items-center justify-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-200"
            disabledClassName="disabled opacity-50 cursor-not-allowed"
            initialPage={(parseInt(searchParams.get('page')) || 1) - 1}
          />
        </div>
      )}
    </div>
  );
};

export default Clients;
