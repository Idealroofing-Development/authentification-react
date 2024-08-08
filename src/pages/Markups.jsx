import MobileMarkups from '@/components/Markups/MobileMarkups';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Markup from '@/components/Markups/Markup';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MultiSelect } from 'react-multi-select-component';
import { useAuth } from '@/context/auth-context';

const Markups = () => {
  const [loading, setLoading] = useState(false);
  const [markups, setMarkups] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [percentage, setPercentage] = useState('');
  const [description, setDescription] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [forAllProducts, setForAllProducts] = useState(false);
  const [forSomeProducts, setForSomeProducts] = useState(false);
  const [forSomeBrands, setForSomeBrands] = useState(false);
  const [categories, setCategories] = useState(null);
  const [editCategories, setEdirCategories] = useState(null);

  const [filteredBrands, setFilteredBrands] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesWithLabel, setCategoriesWithLabel] = useState([]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandsWithLabel, setBrandsWithLabel] = useState([]);

  const [selectedCategoriesForCopy, setSelectedCategoriesForCopy] = useState([]);
  const [categoriesWithLabeForCopyl, setCategoriesWithLabelForCopy] = useState([]);

  const [selectedBrandsForCopy, setSelectedBrandsForCopy] = useState([]);
  const [brandsWithLabelForCopy, setBrandsWithLabelForCopy] = useState([]);
  const [filteredBrandsForCopy, setFilteredBrandsForCopy] = useState([]);

  const [markupToCopy, setMarkupToCopy] = useState(null);

  const [forSomeBrandToCopy, setForSomeBrandsToCopy] = useState(null);
  const [endUsers, setEndUsers] = useState(null);
  const [selectedEndUser, setSelectedEndUser] = useState(null);

  const {user} = useAuth()


  const customValueRendererCategories = (selected, options) => {
    if (selected?.length === options?.length) {
      return 'All categories selected';
    }
    return selected?.length > 0 ? `${selected?.length} item(s) selected` : 'Select Categories';
  };

  const customValueRendererBrands = (selected, options) => {
    if (selected?.length === options?.length) {
      return 'All brands selected';
    }
    return selected?.length > 0 ? `${selected?.length} item(s) selected` : 'Select Brands';
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

  useEffect(() => {
    const getCategories = async () => {
      await axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/products/categories/brands`, {
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          setCategories(res.data);
          setEdirCategories(res.data);
          const allBrands = res?.data?.reduce((acc, cat) => acc.concat(cat.category.brands), []);
          setFilteredBrands(allBrands);
          setFilteredBrandsForCopy(allBrands);
        })
        .catch((e) => {
          toast.error('Error getting categories');
        });
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCategories?.length > 0 && categories) {
      const filteredBrands = selectedCategories.reduce((acc, selectedCat) => {
        const categoryData = categories.find((cat) => cat.category.name === selectedCat.value);
        if (categoryData) {
          return [...acc, ...categoryData.category.brands];
        }
        return acc;
      }, []);
      setFilteredBrands(filteredBrands);
      setBrand('');
    } else {
      const allBrands = categories?.reduce((acc, cat) => acc.concat(cat.category.brands), []);
      setFilteredBrands(allBrands);
      setBrand('');
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (selectedCategoriesForCopy?.length > 0 && categories) {
      const filteredBrands = selectedCategoriesForCopy.reduce((acc, selectedCat) => {
        const categoryData = categories.find((cat) => cat.category.name === selectedCat.value);
        if (categoryData) {
          return [...acc, ...categoryData.category.brands];
        }
        return acc;
      }, []);
      setFilteredBrandsForCopy(filteredBrands);
      setBrand('');
      console.log('firstTest');
    } else {
      const allBrands = categories?.reduce((acc, cat) => acc.concat(cat.category.brands), []);
      setFilteredBrands(allBrands);
      setBrand('');
      console.log('SecondTest');
    }
  }, [selectedCategoriesForCopy]);

  const handleAddMarkup = async () => {
    setLoadingSubmit(true);

    const data = forSomeBrands
      ? selectedBrands.map((brand) => ({
          is_fixed: isFixed ? 1 : 0,
          category: '',
          brand: brand?.value,
          description: description,
          pourcentage: percentage,
          end_user_id: selectedEndUser,
          start_date: isFixed ? null : startDate ? format(startDate, 'yyyy-MM-dd') : null,
          end_date: isFixed ? null : endDate ? format(endDate, 'yyyy-MM-dd') : null
        }))
      : selectedCategories.map((cat) => ({
          is_fixed: isFixed ? 1 : 0,
          category: cat.value,
          brand: '',
          description: description,
          pourcentage: percentage,
          end_user_id: selectedEndUser,
          start_date: isFixed ? null : startDate ? format(startDate, 'yyyy-MM-dd') : null,
          end_date: isFixed ? null : endDate ? format(endDate, 'yyyy-MM-dd') : null
        }));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_API_URL}/markups/store`,
        { markups: data }, // Send the array in the request body
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      );

      setLoadingSubmit(false);
      toast.success('Markup(s) added successfully');

      const newMarkups = response.data.markups.map((markup) => {
        //const { markup: markupDetails, end_user } = markup;
        
     
        return {
          ...markup?.markup,
          enduser: markup?.end_user,
          is_fixed: markup?.markup.is_fixed === 0 || markup?.markup.is_fixed === false ? false : true
        };
      });

      
      setMarkups([...newMarkups, ...markups]);
    } catch (e) {
      setLoadingSubmit(false);
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(markups)
  }, [markups])

  useEffect(() => {
    if (categories) {
      const formattedCategories = categories.map((cat) => ({
        label: cat.category.name,
        value: cat.category.epicor_category_name
      }));
      setCategoriesWithLabel(formattedCategories);
    }
  }, [categories]);

  useEffect(() => {
    if (categories) {
      const formattedCategories = categories.map((cat) => ({
        label: cat.category.name,
        value: cat.category.epicor_category_name
      }));
      setCategoriesWithLabelForCopy(formattedCategories);
    }
  }, [categories]);

  useEffect(() => {
    if (filteredBrands) {
      setBrandsWithLabel(
        filteredBrands.map((brand) => ({
          label: brand,
          value: brand
        }))
      );
    }
  }, [filteredBrands]);

  useEffect(() => {
    if (filteredBrandsForCopy) {
      setBrandsWithLabelForCopy(
        filteredBrandsForCopy.map((brand) => ({
          label: brand,
          value: brand
        }))
      );
    }
  }, [filteredBrandsForCopy]);

  useEffect(() => {
    if (selectedCategories?.length > 0 && categories) {
      const selectedCategoryNames = selectedCategories.map((cat) => cat.value);

      // Filter out brands from unselected categories
      const updatedSelectedBrands = selectedBrands.filter((brand) => {
        const brandCategory = categories.find((cat) => cat.category.brands.includes(brand.value));
        return brandCategory && selectedCategoryNames.includes(brandCategory.category.name);
      });

      setSelectedBrands(updatedSelectedBrands);
    } else {
      // Clear selected brands if no categories are selected
      setSelectedBrands([]);
    }
  }, [selectedCategories, categories]);

  useEffect(() => {
    if (selectedCategoriesForCopy?.length > 0 && categories) {
      const selectedCategoryNames = selectedCategoriesForCopy.map((cat) => cat.value);

      // Filter out brands from unselected categories
      const updatedSelectedBrands = selectedBrandsForCopy.filter((brand) => {
        const brandCategory = categories.find((cat) => cat.category.brands.includes(brand.value));
        return brandCategory && selectedCategoryNames.includes(brandCategory.category.name);
      });

      setSelectedBrandsForCopy(updatedSelectedBrands);
    } else {
      // Clear selected brands if no categories are selected
      setSelectedBrandsForCopy([]);
    }
  }, [selectedCategoriesForCopy, categories]);

  useEffect(() => {
    setLoading(true);
    const getMarkups = async () => {
      await axios
        .get(`${import.meta.env.VITE_REACT_API_URL}/markups`, {
          headers: {
            Authorization: `Bearer ${user}`
          }
        })
        .then((res) => {
          const updatedMarkups = res.data.data.map((markup) => {
            return {
              ...markup,
              is_fixed: markup.is_fixed == 0 || markup.is_fixed == false ? false : true
            };
          });

          setMarkups(updatedMarkups);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    };

    getMarkups();
  }, []);
  return (
    <div className="wrapper">
      <div className="flex gap-4 justify-between items-center">
        <h4 className="capitalize text-xl font-bold">My markups</h4>

        <Dialog>
          <DialogTrigger>
            <Button className="text-white bg-green-primary hover:bg-green-primary/90 border-none">
              <PlusIcon size={16} />
              <div className="text-sm">Add new markup</div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new markup</DialogTitle>
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
                  </div>*/}

                  <div className="w-full">
                    {/*<select
                      disabled={forAllProducts}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:opacity-50">
                      <option value={''}>Category</option>
                      {categories?.map((category, index) => (
                        <option key={index} value={category?.category?.name}>
                          {category?.category?.name}
                        </option>
                      ))}
                    </select>*/}
                    <MultiSelect
                      options={categoriesWithLabel}
                      value={selectedCategories}
                      onChange={setSelectedCategories}
                      labelledBy={'Select'}
                      overrideStrings={{
                        selectSomeItems: 'Select categories...',
                        allItemsAreSelected: 'All categories are selected',
                        selectAll: 'Select all',
                        search: 'Search',
                        clearSearch: 'Clear Search'
                      }}
                      valueRenderer={customValueRendererCategories}
                    />
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
                    {/*<select
                      disabled={!forSomeBrands || forAllProducts}
                      onChange={(e) => setBrand(e.target.value)}
                      value={brand}
                      className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:opacity-50">
                      <option value={''}>Brand</option>
                      {filteredBrands?.map((brand, index) => (
                        <option value={brand}>{brand}</option>
                      ))}
                    </select>*/}

                    <MultiSelect
                      disabled={!forSomeBrands}
                      options={brandsWithLabel}
                      value={selectedBrands}
                      onChange={setSelectedBrands}
                      labelledBy={'Select'}
                      overrideStrings={{
                        selectSomeItems: 'Select brands...',
                        allItemsAreSelected: 'All brands are selected',
                        selectAll: 'Select all',
                        search: 'Search',
                        clearSearch: 'Clear Search'
                      }}
                      valueRenderer={customValueRendererBrands}
                    />
                  </div>

                  <div>
                    <select
                      className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:opacity-50"
                      onChange={(e) => setSelectedEndUser(e.target.value)}
                      value={selectedEndUser}>
                      <option value="">Select an End User</option>
                      {endUsers?.map((user) => (
                        <option key={user?.id} value={user?.id}>
                          {user?.name}
                        </option>
                      ))}
                    </select>
                  </div>

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
                  <div>
                    <input
                      onChange={() => setIsFixed(!isFixed)}
                      type="checkbox"
                      checked={isFixed}
                    />{' '}
                    <label>Make this markup as default</label>
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
                  </div>

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
              <Button
                //onClick={console.log(format(startDate, 'dd/MM/yyyy') )}
                disabled={loadingSubmit}
                onClick={handleAddMarkup}>
                Add Markup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 md:hidden my-8">
        {markups?.map((markup) => (
          <MobileMarkups
            setMarkups={setMarkups}
            categories={editCategories}
            filteredBrands={filteredBrands}
            markup={markup}
            key={markup?.id}
          />
        ))}
      </div>

      <div className="hidden md:block">
        <div className="mt-4 lg:mt-8">
          <Table className="whitespace-nowrap w-full">
            <TableHeader className="capitalize">
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>End User</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {markups?.map((markup) => (
                <Markup
                  setMarkups={setMarkups}
                  markups={markups}
                  categories={editCategories}
                  filteredBrands={filteredBrands}
                  markup={markup}
                  markupToCopy={markupToCopy}
                  setMarkupToCopy={setMarkupToCopy}
                  filteredBrandsForCopy={filteredBrandsForCopy}
                  setFilteredBrandsForCopy={setFilteredBrandsForCopy}
                  selectedBrandsForCopy={selectedBrandsForCopy}
                  setSelectedBrandsForCopy={setSelectedBrandsForCopy}
                  selectedCategoriesForCopy={selectedCategoriesForCopy}
                  setSelectedCategoriesForCopy={setSelectedCategoriesForCopy}
                  brandsWithLabelForCopy={brandsWithLabelForCopy}
                  setBrandsWithLabelForCopy={setBrandsWithLabelForCopy}
                  categoriesWithLabeForCopyl={categoriesWithLabeForCopyl}
                  setCategoriesWithLabelForCopy={setCategoriesWithLabelForCopy}
                  setForSomeBrandsToCopy={setForSomeBrandsToCopy}
                  forSomeBrandToCopy={forSomeBrandToCopy}
                  key={markup?.id}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Markups;
