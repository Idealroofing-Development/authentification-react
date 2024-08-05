import { Edit, Trash } from 'lucide-react';
import React from 'react';
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

import { Textarea } from '@/components/ui/textarea';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useState } from 'react';
import { Button } from '../ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/auth-context';

const MobileMarkups = ({ markup, categories, setMarkups }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [percentage, setPercentage] = useState('');
  const [description, setDescription] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const [forAllProducts, setForAllProducts] = useState(false);
  const [forSomeBrands, setForSomeBrands] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const {user} = useAuth()

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(2000 + year, month - 1, day);
  };

  useEffect(() => {
    if (markup) {
      setCategory(markup.category);
      setBrand(markup.brand);
      setPercentage(markup.pourcentage);
      setDescription(markup.description);
      setIsFixed(markup.is_fixed);
      setStartDate(markup.start_date);
      setEndDate(markup.end_date);
      if (markup.category) {
        const selectedCategoryData = categories?.find((cat) => cat.category.name === category);
        setFilteredBrands(selectedCategoryData ? selectedCategoryData.category.brands : []);
      } else {
        const allBrands = categories?.reduce((acc, cat) => acc.concat(cat.category.brands), []);
        setFilteredBrands(allBrands);
      }
      if (!markup.category && !markup.brand) {
        setForAllProducts(true);
      } else if (markup.brand) {
        setForSomeBrands(true);
      }
    }
  }, [markup]);
  
  useEffect(() => {
    if (category) {
      const selectedCategoryData = categories?.find((cat) => cat.category.name === category);
      setFilteredBrands(selectedCategoryData ? selectedCategoryData.category.brands : []);
      //setBrand("")
    } else {
      const allBrands = categories?.reduce((acc, cat) => acc.concat(cat.category.brands), []);
      setFilteredBrands(allBrands);
      //setBrand("");
    }
  }, [category]);

  const handleEditMarkup = async () => {
    setLoadingSubmit(true);
    await axios
      .patch(
        `${import.meta.env.VITE_REACT_API_URL}/markups/update`,
        {
          description: description,
          pourcentage: percentage,
          id: markup.id,
          //start_date: isFixed ? null : startDate ? format(startDate, 'yyyy-MM-dd') : null,
          //end_date: isFixed ? null : endDate ? format(endDate, 'yyyy-MM-dd') : null
        },
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then((res) => {
        setLoadingSubmit(false);
        toast.success('Markup updated successfully');
        setMarkups((prevMarkups) =>
          prevMarkups.map((markup) =>
            markup.id === res.data.markup.id
              ? {
                  ...res.data.markup,
                  is_fixed:
                    res.data.markup.is_fixed == 0 || res.data.markup.is_fixed == false
                      ? false
                      : true
                }
              : markup
          )
        );
      })
      .catch((e) => {
        setLoadingSubmit(false);
        console.log(e);
      });
  };

  const deleteMarkup = async () => {
    await axios.delete(`${import.meta.env.VITE_REACT_API_URL}/markups/delete`, {
        params: {
            id: markup.id
        },

        headers:{
            Authorization: `Bearer ${user}`
        }
    }).then((res) => {
        toast.success('Markup deleted successfully')
        setMarkups((prevMarkups) =>
          prevMarkups.filter((m) => m.id !== markup.id)
        );
    }).catch((e) => {
        console.log(e)
    })
  }
  return (
    <div className="rounded-xl shadow-lg p-3 border border-white bg-white relative flex flex-col gap-1.5">
      <p className="text-gray-700 text-base">
        <strong>Category:</strong> {markup?.category}
      </p>
      <p className="text-gray-700 text-base">
        <strong>Brand:</strong> {markup?.brand}
      </p>
      <p className="text-gray-700 text-base">
        <strong>End User:</strong> {markup?.end_user_id}
      </p>
      <p className="text-gray-700 text-base">
        <strong>Percentage:</strong> {markup?.pourcentage}%
      </p>
      <p className="text-gray-700 text-base">
        <strong>Start Date:</strong> {markup?.start_date}
      </p>
      <p className="text-gray-700 text-base">
        <strong>End Date:</strong> {markup?.end_date}
      </p>
      <p className="text-gray-700 text-base">
        <strong>Default:</strong> {markup?.is_fixed ? 'Yes' : 'NO'}
      </p>

      <p className="text-gray-700 text-base">
        <strong>Description:</strong> {markup?.description}
      </p>

      <div className="absolute top-2 right-2 p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex gap-2 rounded-lg text-gray-700">
        <Dialog>
          <DialogTrigger>
            <Edit className="cursor-pointer" size={22} />
          </DialogTrigger>
          <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Edit markup for{' '}
                  {markup?.category
                    ? `Category : ${markup?.category}`
                    : markup?.brand
                      ? `Brand : ${markup?.brand}`
                      : 'Edit Markup'}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-3 text-black">
                    {/*<div className="flex gap-3">
                      <div>
                        <input
                          checked={!forAllProducts}
                          onChange={() => setForAllProducts(false)}
                          className="mt-3"
                          type="checkbox"
                        />{' '}
                        <label>Make markup for some products</label>
                      </div>

                      <div>
                        <input
                          checked={forAllProducts}
                          onChange={() => {
                            setForAllProducts(true);
                          }}
                          className="mt-3"
                          type="checkbox"
                        />{' '}
                        <label>Make markup for All products</label>
                      </div>
                    </div>

                    <div>
                      <select
                        disabled={forAllProducts}
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setBrand('');
                        }}
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:opacity-50">
                        <option value={''}>Category</option>
                        {categories?.map((category, index) => (
                          <option key={index} value={category?.category?.name}>
                            {category?.category?.name}
                          </option>
                        ))}
                      </select>
                      <input
                        checked={forSomeBrands}
                        onChange={() => setForSomeBrands(!forSomeBrands)}
                        className="mt-3"
                        type="checkbox"
                        disabled={forAllProducts}
                      />{' '}
                      <label>Make markup only for a brand from this category</label>
                    </div>

                    <div>
                      <select
                        disabled={!forSomeBrands || forAllProducts}
                        onChange={(e) => setBrand(e.target.value)}
                        value={brand}
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:opacity-50">
                        <option value={''}>Brand</option>
                        {filteredBrands?.map((brand, index) => (
                          <option key={index} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>*/}

                    <div className="relative w-full">
                      <input
                        className="border rounded-md px-1 text-sm py-1 w-full border-gray-500 placeholder:text-gray-500 pr-6"
                        placeholder="percentage"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>

                    {/*<div>
                      <input
                        onChange={() => setIsFixed(!isFixed)}
                        type="checkbox"
                        checked={isFixed}
                      />{' '}
                      <label>Make this markup as default {isFixed}</label>
                    </div>

                    <div className="flex flex-col gap-3 md:grid md:grid-cols-2 ">
                      <Popover>
                        {isFixed ? (
                          <Button
                            disabled
                            variant={'outline'}
                            className="w-full justify-start text-left font-normal text-muted-foreground">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
                          </Button>
                        ) : (
                          <PopoverTrigger>
                            <Button
                              disabled={isFixed}
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !startDate && 'text-muted-foreground'
                              )}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
                            </Button>
                          </PopoverTrigger>
                        )}
                        {!isFixed && (
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        )}
                      </Popover>

                      <Popover>
                        {isFixed ? (
                          <Button
                            disabled
                            variant={'outline'}
                            className="w-full justify-start text-left font-normal text-muted-foreground">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : <span>End date</span>}
                          </Button>
                        ) : (
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !endDate && 'text-muted-foreground'
                              )}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, 'PPP') : <span>End date</span>}
                            </Button>
                          </PopoverTrigger>
                        )}
                        {!isFixed && (
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        )}
                      </Popover>
                    </div>*/}

                    <Textarea
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      placeholder="description"
                      className="border-gray-500 placeholder:text-gray-500"
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button disabled={loadingSubmit} onClick={loadingSubmit ? null : handleEditMarkup}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger>
            <Trash className="cursor-pointer" size={22} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this markup?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this markup.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteMarkup}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MobileMarkups;
