import React, { useEffect, useState } from 'react';
import productImage from '../../assets/product.webp';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/auth-context';
import { useContext } from 'react';
import { UserInfoContext } from '@/context/userInfosContext';
import { Select } from '../ui/select';

const ProductCard2 = ({ product }) => {
  const [uniqueGauges, setUniqueGauges] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);
  const [uniqueLengths, setUniqueLengths] = useState([]);
  const [uniqueSize1, setUniqueSize1] = useState([]);
  const [uniqueSize2, setUniqueSize2] = useState([]);
  const [uniqueSubBrands, setUniqueSubBrands] = useState([]);
  const [selectedVValues, setSelectedVValues] = useState([]);
  const [vOptions, setVOptions] = useState([]);

  const [selectedGauge, setSelectedGauge] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize1, setSelectedSize1] = useState('');
  const [selectedSize2, setSelectedSize2] = useState('');
  const [selectedSubBrand, setSelectedSubBrand] = useState('');
  const [selectedWidth, setSelectedWidth] = useState('');

  const [availableGauges, setAvailableGauges] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableLengths, setAvailableLengths] = useState([]);
  const [availableSize1, setAvailableSize1] = useState([]);
  const [availableSize2, setAvailableSize2] = useState([]);
  const [availableSubBrands, setAvailableSubBrands] = useState([]);
  const [availableWidths, setAvailableWidths] = useState([]);
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState('');
  const [equationResult, setEquationResult] = useState('');

  const [iFilm, setIFilm] = useState(false);
  const [iEmbossed, setIEmbossed] = useState(false);

  const [lengthInch, setLengthInch] = useState('');
  const [lengthFT, setLengthFT] = useState('');
  const [lengthMM, setLengthMM] = useState('');

  const [bMeasurement, setBMeasurement] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    setPopoverOpen(false)
  }, [selectedColor])

  const { user } = useAuth();

  const XYValues = [
    { label: 'Laurentian 5/8"', value: '5/8' },
    { label: 'Corrugated 1"', value: '1' },
    { label: 'Security 5/8"', value: '5/8' },
    { label: 'Ameri-Cana 7/8"', value: '7/8' },
    { label: 'Canadiana 7/8"', value: '7/8' },
    { label: 'Fundy 7/8"', value: '7/8' }
  ];

  const convertFractionToNumber = (fraction) => {
    const [numerator, denominator] = fraction.split('/').map(Number);
    return denominator ? numerator / denominator : numerator;
  };

  const handleXYChange = (e, setter) => {
    setter(e.target.value);
  };

  const [NS, setNS] = useState(false);
  const [RV, setRV] = useState(false);
  const [WSR, setWSR] = useState(false);
  const [RVNS, setRVNS] = useState(false);
  const [COND, setCOND] = useState(false);

  const [length, setLength] = useState('');
  const [quantity, setQuantity] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [equation, setEquation] = useState('');
  const [inLength, setInLength] = useState(true);

  const [selectedPartNum, setSelectedPartNum] = useState(null);
  const [availablePartNums, setAvailablePartNums] = useState(null);

  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [unit, setUnit] = useState('IN');

  const { userInfos } = useContext(UserInfoContext);

  const evaluateEquation = (equation) => {
    // Replace variable names in the equation with their current values
    let evalString = equation
      .replace('A', a || 0)
      .replace('B', b || 0)
      .replace('C', c || 0)
      .replace('X', selectedX || 0)
      .replace('Y', selectedY || 0);

    // Evaluate the expression using the JavaScript `eval` function
    try {
      return eval(evalString);
    } catch (error) {
      console.error('Invalid equation:', equation);
      return null;
    }
  };

  const { options } = product.product;

  useEffect(() => {
    if (product?.product?.options_list?.V) {
      // Generate options based on the value of v
      const letters = 'ABCDEFGHI'.split('');
      const numOptions = product.product.options_list.V;
      setVOptions(letters.slice(0, numOptions));
    }
  }, [product]);

  const handleVCheckboxChange = (letter) => {
    setSelectedVValues((prevSelectedVValues) =>
      prevSelectedVValues.includes(letter)
        ? prevSelectedVValues.filter((value) => value !== letter)
        : [...prevSelectedVValues, letter]
    );
  };

  useEffect(() => {
    if (product) {
      setUniqueGauges(Array.from(new Set(product?.parts.map((part) => part.gauge))));
      setUniqueColors(Array.from(new Set(product?.parts.map((part) => part.color))));
      setUniqueLengths(Array.from(new Set(product?.parts.map((part) => part.length))));
      setUniqueSize1(Array.from(new Set(product?.parts.map((part) => part.size1))));
      setUniqueSize2(Array.from(new Set(product?.parts.map((part) => part.size2))));
      setUniqueSubBrands(Array.from(new Set(product?.parts.map((part) => part.sub_brand))));
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const filteredParts = product.parts.filter((part) => {
      return (
        (!selectedLength || part.length === selectedLength) &&
        (!selectedColor || part.color === selectedColor) &&
        (!selectedSize1 || part.size1 === selectedSize1) &&
        (!selectedSize2 || part.size2 === selectedSize2) &&
        (!selectedSubBrand || part.sub_brand === selectedSubBrand)
      );
    });

    setAvailableGauges(Array.from(new Set(filteredParts.map((part) => part.gauge))));
    if (selectedGauge && !filteredParts.some((part) => part.gauge === selectedGauge)) {
      setAvailableGauges((prev) => [...prev, selectedGauge]);
    }
  }, [
    product,
    selectedLength,
    selectedColor,
    selectedSize1,
    selectedSize2,
    selectedSubBrand,
    selectedWidth
  ]);

  // Update available lengths based on other selected values
  useEffect(() => {
    if (!product) return;

    const filteredParts = product.parts.filter((part) => {
      return (
        (!selectedGauge || part.gauge === selectedGauge) &&
        (!selectedColor || part.color === selectedColor) &&
        (!selectedSize1 || part.size1 === selectedSize1) &&
        (!selectedSize2 || part.size2 === selectedSize2) &&
        (!selectedSubBrand || part.sub_brand === selectedSubBrand) &&
        (!selectedWidth || part.width === selectedWidth)
      );
    });

    setAvailableLengths(Array.from(new Set(filteredParts.map((part) => part.length))));
    if (selectedLength && !filteredParts.some((part) => part.length === selectedLength)) {
      setAvailableLengths((prev) => [...prev, selectedLength]);
    }
  }, [
    product,
    selectedGauge,
    selectedColor,
    selectedSize1,
    selectedSize2,
    selectedSubBrand,
    selectedWidth
  ]);

  // Update available widths based on other selected values
  useEffect(() => {
    if (!product) return;

    const filteredParts = product.parts.filter((part) => {
      return (
        (!selectedGauge || part.gauge === selectedGauge) &&
        (!selectedColor || part.color === selectedColor) &&
        (!selectedSize1 || part.size1 === selectedSize1) &&
        (!selectedSize2 || part.size2 === selectedSize2) &&
        (!selectedLength || part.length === selectedLength) &&
        (!selectedSubBrand || part.sub_brand === selectedSubBrand)
      );
    });

    setAvailableWidths(Array.from(new Set(filteredParts.map((part) => part.width))));
    if (selectedWidth && !filteredParts.some((part) => part.width === selectedWidth)) {
      setAvailableWidths((prev) => [...prev, selectedWidth]);
    }
  }, [
    product,
    selectedGauge,
    selectedColor,
    selectedSize1,
    selectedSize2,
    selectedSubBrand,
    selectedLength
  ]);

  // Update available colors based on other selected values
  useEffect(() => {
    if (!product) return;

    const filteredParts = product.parts.filter((part) => {
      return (
        (!selectedGauge || part.gauge === selectedGauge) &&
        (!selectedLength || part.length === selectedLength) &&
        (!selectedSize1 || part.size1 === selectedSize1) &&
        (!selectedSize2 || part.size2 === selectedSize2) &&
        (!selectedSubBrand || part.sub_brand === selectedSubBrand) &&
        (!selectedWidth || part.width === selectedWidth)
      );
    });

    setAvailableColors(Array.from(new Set(filteredParts.map((part) => part.color))));
    if (selectedColor && !filteredParts.some((part) => part.color === selectedColor)) {
      setAvailableColors((prev) => [...prev, selectedColor]);
    }
  }, [
    product,
    selectedGauge,
    selectedLength,
    selectedSize1,
    selectedSize2,
    selectedSubBrand,
    selectedWidth
  ]);

  // Update available size1 based on other selected values
  useEffect(() => {
    if (!product) return;

    const filteredParts = product.parts.filter((part) => {
      return (
        (!selectedGauge || part.gauge === selectedGauge) &&
        (!selectedLength || part.length === selectedLength) &&
        (!selectedColor || part.color === selectedColor) &&
        (!selectedSize2 || part.size2 === selectedSize2) &&
        (!selectedSubBrand || part.sub_brand === selectedSubBrand) &&
        (!selectedWidth || part.width === selectedWidth)
      );
    });

    setAvailableSize1(Array.from(new Set(filteredParts.map((part) => part.size1))));
    if (selectedSize1 && !filteredParts.some((part) => part.size1 === selectedSize1)) {
      setAvailableSize1((prev) => [...prev, selectedSize1]);
    }
  }, [
    product,
    selectedGauge,
    selectedLength,
    selectedColor,
    selectedSize2,
    selectedSubBrand,
    selectedWidth
  ]);

  // Update available size2 based on other selected values
  useEffect(() => {
    if (!product) return;

    const filteredParts = product.parts.filter((part) => {
      return (
        (!selectedGauge || part.gauge === selectedGauge) &&
        (!selectedLength || part.length === selectedLength) &&
        (!selectedColor || part.color === selectedColor) &&
        (!selectedSize1 || part.size1 === selectedSize1) &&
        (!selectedSubBrand || part.sub_brand === selectedSubBrand) &&
        (!selectedWidth || part.width === selectedWidth)
      );
    });

    setAvailableSize2(Array.from(new Set(filteredParts.map((part) => part.size2))));
    if (selectedSize2 && !filteredParts.some((part) => part.size2 === selectedSize2)) {
      setAvailableSize2((prev) => [...prev, selectedSize2]);
    }
  }, [
    product,
    selectedGauge,
    selectedLength,
    selectedColor,
    selectedSize1,
    selectedSubBrand,
    selectedWidth
  ]);

  // Update available sub-brands based on other selected values
  useEffect(() => {
    if (!product) return;

    const filteredParts = product.parts.filter((part) => {
      return (
        (!selectedGauge || part.gauge === selectedGauge) &&
        (!selectedLength || part.length === selectedLength) &&
        (!selectedColor || part.color === selectedColor) &&
        (!selectedSize1 || part.size1 === selectedSize1) &&
        (!selectedSize2 || part.size2 === selectedSize2) &&
        (!selectedWidth || part.width === selectedWidth)
      );
    });

    setAvailableSubBrands(Array.from(new Set(filteredParts.map((part) => part.sub_brand))));
    if (selectedSubBrand && !filteredParts.some((part) => part.sub_brand === selectedSubBrand)) {
      setAvailableSubBrands((prev) => [...prev, selectedSubBrand]);
    }
  }, [
    product,
    selectedGauge,
    selectedLength,
    selectedColor,
    selectedSize1,
    selectedSize2,
    selectedWidth
  ]);

  const [disableBrand, setDisableBrand] = useState(false);
  const [disableLength, setDisableLength] = useState(false);
  const [disableWidth, setDisableWidth] = useState(false);
  const [disableColor, setDisableColor] = useState(false);
  const [disableSize1, setDisableSize1] = useState(false);
  const [disableSize2, setDisableSize2] = useState(false);
  const [disableGauge, setDisableGauge] = useState(false);
  const [noColor, setNoColor] = useState(false);

  useEffect(() => {
    if (product) {
      const brands = Array.from(new Set(product?.parts?.map((part) => part.sub_brand)));
      const lengths = Array.from(new Set(product?.parts?.map((part) => part.length)));
      const widths = Array.from(new Set(product?.parts?.map((part) => part.width)));
      const colors = Array.from(new Set(product?.parts?.map((part) => part.color)));
      const gauges = Array.from(new Set(product?.parts?.map((part) => part.gauge)));
      const size1 = Array.from(new Set(product?.parts?.map((part) => part.size1)));
      const size2 = Array.from(new Set(product?.parts?.map((part) => part.size2)));

      if (brands.length === 1) {
        setSelectedSubBrand(brands[0]);
        setDisableBrand(true);
      }

      if (lengths.length === 1) {
        setSelectedLength(lengths[0]);
        setDisableLength(true);
      }

      if (widths.length === 1) {
        setSelectedWidth(widths[0]);
        setDisableWidth(true);
      }

      if (colors.length === 1) {
        setSelectedColor(colors[0]);
        setDisableColor(true);
      }

      if (size1.length === 1) {
        setSelectedSize1(size1[0]);
        setDisableSize1(true);
      }

      if (size2.length === 1) {
        setSelectedSize2(size2[0]);
        setDisableSize2(true);
      }

      if (gauges.length === 1) {
        setSelectedGauge(gauges[0]);
        setDisableGauge(true);
      }
    }
  }, [product]);

  useEffect(() => {
    if (product?.product?.options_list?.EQU) {
      setEquation(product?.product?.options_list?.EQU);
    }
  }, [product]);

  const getPartNum = (e) => {
    e.preventDefault();

    // Validation
    if (product?.product?.options_list?.LEN) {
      if (!lengthInch && !lengthFT && !lengthMM) {
        console.log('One of the length variables (Inch, FT, MM) must be provided.');
        return;
      }
    }

    if (product?.parts[0]?.color && !selectedColor) {
      console.log('A color must be selected.');
      return;
    }

    // Existing logic
    if (equation) {
      const result = evaluateEquation(equation.replace('EQU:', ''));
      setEquationResult(result);
      console.log('Equation result:', result);
    }

    let substrings = [];
    if (RV && NS && product?.product?.options_list.RVNS) {
      substrings.push('RVNS');
    } else {
      if (RV && (product?.product?.options_list.REV || product?.product?.options_list.RVNS))
        substrings.push('RV');
      if (NS && (product?.product?.options_list.NSR || product?.product?.options_list.RVNS))
        substrings.push('NS');
    }
    if (WSR && product?.product?.options_list.WSR) substrings.push('WSR');
    if (COND && product?.product?.options_list.COND) substrings.push('COND');

    let substringsToExclude = [];
    if (!RV && (product?.product?.options_list.REV || product?.product?.options_list.RVNS))
      substringsToExclude.push('RV');
    if (!NS && (product?.product?.options_list.NSR || product?.product?.options_list.RVNS))
      substringsToExclude.push('NS');
    if (!WSR && product?.product?.options_list.WSR) substringsToExclude.push('WSR');
    if (!COND && product?.product?.options_list.COND) substringsToExclude.push('COND');

    const containsAllSubstrings = (partnum, substrings) => {
      return substrings.every((substring) => partnum.includes(substring));
    };

    const containsNoSubstrings = (partnum, substrings) => {
      return substrings.every((substring) => !partnum.includes(substring));
    };

    const matchingParts = product?.parts?.filter((part) => {
      const isGaugeMatch = selectedGauge ? part.gauge === selectedGauge : true;
      const isLengthMatch = selectedLength ? part.length === selectedLength : true;
      const isColorMatch = selectedColor ? part.color === selectedColor : true;
      const isSize1Match = part.size1 ? part.size1 === selectedSize1 : true;
      const isSize2Match = part.size2 ? part.size2 === selectedSize2 : true;
      const isWidthMatch = part.width && !equation ? part.width === selectedWidth : true;
      const isSubBrandMatch = part.sub_brand ? part.sub_brand === selectedSubBrand : true;
      const partnumPrefix = part.partnum.split('-')[0];
      const isPrefixMatch =
        containsAllSubstrings(part.partnum, substrings) &&
        containsNoSubstrings(part.partnum, substringsToExclude);

      return (
        isGaugeMatch &&
        isLengthMatch &&
        isColorMatch &&
        isSize1Match &&
        isSize2Match &&
        isSubBrandMatch &&
        isWidthMatch &&
        isPrefixMatch
      );
    });

    const partNums = matchingParts.map((part) => part.partnum);

    setAvailablePartNums(partNums);

    console.log('partNums', partNums);
  };

  useEffect(() => {
    if (availablePartNums) selectPartNum(availablePartNums);
  }, [availablePartNums]);

  function selectPartNum(partNums) {
    if (partNums?.length === 1) {
      setSelectedPartNum(partNums[0]);
      setAvailablePartNums(null);
    } else if (equationResult) {
      const maxOption = product?.product?.options_list?.MAX;
      const parts = product?.parts || [];

      let filteredParts;

      if (maxOption !== undefined) {
        const maxVal = parseFloat(8.88);

        if (equationResult >= maxVal) {
          // If equationResult is greater than or equal to max, find the part with width equal to max
          filteredParts = parts.filter(
            (part) => parseFloat(part.width) === maxVal && partNums.includes(part.partnum)
          );
        } else {
          filteredParts = parts.filter(
            (part) =>
              parseFloat(part.width) >= equationResult &&
              parseFloat(part.width) <= maxVal &&
              partNums.includes(part.partnum)
          );
        }
      } else {
        filteredParts = parts.filter(
          (part) => parseFloat(part.width) >= equationResult && partNums.includes(part.partnum)
        );
      }

      if (filteredParts.length > 0) {
        // Find the closest part that is greater than or equal to equationResult
        const closestPart = filteredParts.reduce((prev, curr) => {
          const currWidth = parseFloat(curr.width);
          if (currWidth >= equationResult) {
            return Math.abs(currWidth - equationResult) <
              Math.abs(parseFloat(prev.width) - equationResult)
              ? curr
              : prev;
          }
          return prev; // Keep the previous if currWidth is not >= equationResult
        });

        if (closestPart) {
          setSelectedPartNum(closestPart.partnum);
          setAvailablePartNums(null);
        }
      } else {
        console.log('No matching parts found');
      }
    }
  }

  function convertToInches(length) {
    if (typeof length !== 'string') return null;

    let value;
    if (length?.endsWith('mm')) {
      // Convert mm to inches (1 inch = 25.4 mm)
      value = parseFloat(length.split('mm')[0]);
      return value / 25.4;
    } else if (length?.endsWith('ft')) {
      // Convert feet to inches (1 foot = 12 inches)
      value = parseFloat(length.split('ft')[0]);
      return value * 12;
    } else {
      // If no conversion is needed, return the numeric part
      value = parseFloat(length);
      return value;
    }
  }

  const addToCart = async () => {
    setLoadingAddToCart(true);
    const productVariables = {
      V: selectedVValues.length ? selectedVValues : undefined,
      X: selectedX || undefined,
      Y: selectedY || undefined,
      A: a || undefined,
      B: b || undefined,
      C: c || undefined,
      P1: p1 || undefined,
      P2: p2 || undefined
    };

    // Remove undefined values
    const filteredProductVariables = Object.fromEntries(
      Object.entries(productVariables).filter(([_, v]) => v !== undefined)
    );

    const LouvVariables = selectedVValues?.length
      ? `Louv: ${Number(selectedVValues.length)}: ${selectedVValues.sort().join('')}`
      : '';
    const AVariable = a ? `A=${a}"` : '';
    const BVariable = b ? `B=${b}"` : '';
    const CVariable = c ? `C=${c}"` : '';
    const P1Variable = p1 ? `P1=${p1}"` : '';
    const P2Variable = p2 ? `P2=${p2}"` : '';
    const XVariable = selectedX ? `X=${selectedX}"` : '';
    const YVariable = selectedY ? `Y=${selectedY}"` : '';
    const formattedVariables = [
      LouvVariables,
      AVariable,
      BVariable,
      CVariable,
      P1Variable,
      P2Variable,
      XVariable,
      YVariable
    ]
      .filter(Boolean)
      .join(' ');

    const length =
      convertToInches(lengthFT || 0 + 'ft') +
      convertToInches(lengthMM || 0 + 'mm') +
      convertToInches(lengthInch || 0);

    await axios
      .post(
        `${import.meta.env.VITE_REACT_API_URL}/cart/line/add`,
        {
          product: {
            product_name: product?.product?.title_enc,
            product_tag: 'tag',
            product_partNum: selectedPartNum,
            //product_variables: JSON.stringify(filteredProductVariables),
            product_variables: formattedVariables || 'k',

            unity_price: 0, //check
            product_entryQty: Number(quantity),
            product_salesQty: product?.product?.options_list?.QTYFT
              ? selectedLength
                ? (Number(selectedLength) * Number(quantity)) / 12
                : (convertToInches(length) * Number(quantity)) / 12
              : Number(quantity),
            product_entryLen: selectedLength
              ? `${selectedLength + `"`}`
              : length
                ? //`${length}${unit === 'MM' ? 'mm' : unit === 'FT' ? 'ft' : '"'}`
                  [
                    lengthFT ? lengthFT + 'ft' : '',
                    lengthInch ? lengthInch + '"' : '',
                    lengthMM ? lengthMM + 'mm' : ''
                  ]
                    ?.filter(Boolean)
                    ?.join(' ')
                : `1`,

            product_calculated_Len: selectedLength ? 1 : length ? Number(length.toFixed(2)) : 1, //check
            product_cost: 0, //check
            product_forced_pricePer: 0, //check
            product_forced_price: 0, //check
            line_full_cost: 0,
            line_full_price: 0,
            product_condenstop_fee: 0,
            product_vented_fee: 0,
            product_industrial_fee: 0,
            product_short_fee: 0,
            product_long_fee: 0,
            product_ifilm_fee: 0,
            product_iEmbossed_fee: 0,
            product_safir_drawing: 'random value',
            product_safir_image: 'some value',
            product_brand: product?.product?.brand,
            product_category: product?.product?.category,
            product_options: product?.product?.options,
            product_description: product?.product?.desc_enc
          },

          pricing: {
            PartNum: selectedPartNum,
            //CustID: userInfos?.customer_id,
            CustID: '210745',
            Currency: 'CAD',
            Qty: product?.product?.options_list?.QTYFT
              ? selectedLength
                ? (Number(selectedLength) * Number(quantity)) / 12
                : (convertToInches(length) * Number(quantity)) / 12
              : Number(quantity),

            Length: selectedLength ? 1 : length ? Number(length.toFixed(2)) : 1,
            Options: product?.product?.options,
            UOM: product?.product?.uom_default,
            iFilm: quantity >= 25 && iFilm ? 1 : 0,
            iEmbossed: quantity >= 50 && iEmbossed ? 1 : 0,
            iBend: 0,
            iNbOfBends: 0
          },

          fees: {
            iPartNum: selectedPartNum,
            iQty: product?.product?.options_list?.QTYFT
              ? selectedLength
                ? (Number(selectedLength) * Number(quantity)) / 12
                : (convertToInches(length) * Number(quantity)) / 12
              : Number(quantity),
            iLength: selectedLength ? 1 : length ? Number(length.toFixed(2)) : 1,
            iOptions: selectedVValues.length ? `Louv: ${selectedVValues.length}` : 'Louv: 0', // louvering:nb (number of v selected if v exists)
            iUOM: product?.product?.uom_default,
            iFilm: false,
            iEmbossed: false,
            iBend: false,
            iNbOfBends: 0
          }
        },
        {
          headers: {
            Authorization: `Bearer ${user}`
          }
        }
      )
      .then((res) => {
        setLoadingAddToCart(false);
        setSelectedPartNum(null);
        toast.success('Product added to cart successfully');
      })
      .catch((e) => {
        setLoadingAddToCart(false);
        setSelectedPartNum(null);
        toast.error('Erro adding product to cart');
      });
  };

  useEffect(() => {
    if (selectedPartNum) addToCart();
  }, [selectedPartNum]);

  useEffect(() => {
    if (product?.parts?.find((p) => p.color === 'img:NONE')) {
      setNoColor(true);
      setSelectedColor(product?.parts?.find((p) => p.color === 'img:NONE')?.color);
    }
  }, [product]);

  useEffect(() => {
    if (b) {
      setBMeasurement(Number(b));
    } else if (a) {
      setBMeasurement(Number(a));
    } else {
      setBMeasurement(0);
    }
  }, [a, b]);

  useEffect(() => {
    console.log(a, b, bMeasurement);
  }, [a, b]);

  useEffect(() => {
    if (
      product?.product?.options_list?.V &&
      (product?.product?.options_list?.B || product?.product?.options_list?.A)
    ) {
      let row = 0;
      if (bMeasurement < 5.875 && bMeasurement >= 2.75) row = 1;
      else if (bMeasurement < 9 && bMeasurement >= 5.875) row = 2;
      else if (bMeasurement < 12.125 && bMeasurement >= 9) row = 3;
      else if (bMeasurement < 15.325 && bMeasurement >= 12.125) row = 4;
      else if (bMeasurement < 18.375 && bMeasurement >= 15.25) row = 5;
      else if (bMeasurement < 21.5 && bMeasurement >= 18.375) row = 6;
      else if (bMeasurement < 24.625 && bMeasurement >= 21.5) row = 7;
      else if (bMeasurement < 27.75 && bMeasurement >= 24.625) row = 8;
      else if (bMeasurement >= 27.75 && bMeasurement < 48) row = 9;
      else if (!bMeasurement) row = 0;

      const letters = 'ABCDEFGHI'.split('');
      const numOptions = row;
      setVOptions(letters.slice(0, numOptions));
      setSelectedVValues([]);
    }
  }, [bMeasurement]);
  useEffect(() => {
    console.log('noColor', noColor);
  }, [noColor]);

  return (
    <div className="flex flex-col justify-center w-full productCard">
      <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 border border-white bg-white">
        <Link className='className="w-full bg-white grid mt-5' to="/product/9">
          <div className="w-[130px] h-[130px] border-gris-claire border rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={
                product?.product?.category?.toLowerCase() === 'flashings' ||
                product?.product?.category?.toLowerCase() === 'accessories'
                  ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/trim/${product?.product?.brand.toLowerCase()}.webp`
                  : product?.product?.category?.toLowerCase() === 'flat stock'
                    ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/flat/${product?.product?.brand.toLowerCase()}.webp`
                    : product?.product?.category?.toLowerCase() === 'screws'
                      ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/screws/${product?.product?.brand.toLowerCase()}.webp`
                      : product?.product?.category?.toLowerCase() === 'sliding door hardwar'
                        ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/west/${product?.product?.brand.toLowerCase()}.webp`
                        : product?.product?.category?.toLowerCase() === 'panels & profiles'
                          ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/${product?.product?.brand?.toLowerCase()}/panel.webp`
                          : product?.product?.category?.toLowerCase() === 'steel deck'
                            ? `${import.meta.env.VITE_REACT_PRODUCT_IMAGES_URL}/${product?.product?.brand?.toLowerCase()}/diagram.webp`
                            : productImage
              }
              alt="Product Image"
              className="  rounded-lg w-full "
            />
          </div>
        </Link>
        <div className="w-full  bg-white flex flex-col space-y-2 p-3">
          <Link to="/product/9">
            <h3 className="font-black md:text-2xl text-xl">{product?.product?.title_enc}</h3>
          </Link>

          <form onSubmit={loadingAddToCart ? null : getPartNum}>
            <div className="grid lg:grid-cols-2">
              <div className="border-b pb-4 lg:border-r lg:border-b-0 lg:pb-0 lg:pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-4">
                  {product?.parts[0]?.gauge && (
                    <label className="flex gap-1 items-center">
                      <span className="w-[100px]">Gauge:</span>
                      <select
                        required
                        disabled={disableGauge}
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:bg-gray-300"
                        value={selectedGauge}
                        onChange={(e) => setSelectedGauge(e.target.value)}>
                        <option value="">Gauge</option>
                        {availableGauges.map((gauge, index) => (
                          <option key={index} value={gauge}>
                            {gauge}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {product?.parts[0]?.length && (
                    <label className="flex gap-1 items-center">
                      <span className="w-[100px]">Length:</span>
                      <select
                        required
                        disabled={disableLength}
                        value={selectedLength}
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:bg-gray-300"
                        onChange={(e) => setSelectedLength(e.target.value)}>
                        <option value="">Length</option>
                        {availableLengths.map((length, index) => (
                          <option key={index} value={length}>
                            {length}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {product?.product?.options_list?.Size1 && (
                    <label className="flex gap-1 items-center">
                      <span className="w-[100px]">Size1:</span>
                      <select
                        required
                        disabled={disableSize1}
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:bg-gray-300"
                        value={selectedSize1}
                        onChange={(e) => setSelectedSize1(e.target.value)}>
                        <option value="">Size 1</option>
                        {availableSize1.map((size1, index) => (
                          <option key={index} value={size1}>
                            {size1}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {product?.product?.options_list?.Size2 && (
                    <label className="flex gap-1 items-center">
                      <span className="w-[100px] ">Size2:</span>
                      <select
                        required
                        disabled={disableSize2}
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:bg-gray-300"
                        value={selectedSize2}
                        onChange={(e) => setSelectedSize2(e.target.value)}>
                        <option value="">Size 2</option>
                        {availableSize2.map((size2, index) => (
                          <option key={index} value={size2}>
                            {size2}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {product?.parts[0]?.sub_brand && (
                    <label className="flex gap-1 items-center">
                      <span className="w-[100px]">Profile:</span>
                      <select
                        required
                        disabled={disableBrand}
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:bg-gray-300"
                        value={selectedSubBrand}
                        onChange={(e) => setSelectedSubBrand(e.target.value)}>
                        <option value="">Profile</option>
                        {availableSubBrands.map((subBrand, index) => {
                          // Find the first part that matches the sub_brand and get its desc_enc
                          const descEnc = product?.parts?.find(
                            (part) => part.sub_brand === subBrand
                          )?.sub_brand_desc_enc;

                          return (
                            <option key={index} value={subBrand}>
                              {descEnc} {/* Display the desc_enc value */}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                  )}

                  {product?.parts[0]?.width && !equation ? (
                    <label className="flex gap-1 items-center">
                      <span className="w-[100px]">Width:</span>
                      <select
                        required
                        disabled={disableWidth}
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full disabled:bg-gray-300"
                        value={selectedWidth}
                        onChange={(e) => setSelectedWidth(e.target.value)}>
                        <option value="">Width</option>
                        {availableWidths.map((width, index) => (
                          <option key={index} value={width}>
                            {width}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  {noColor && (
                    <div className="w-[50px] h-[50px] rounded-md cursor-not-allowed relative  ring-1 ring-gray-300 ">
                      <div className="absolute w-[50px] h-[3px] bg-red-500 rotate-45  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 " />
                    </div>
                  )}
                  {product?.parts[0]?.color && !noColor ? (
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild className="w-[60px]">
                            <PopoverTrigger className="w-[60px]">
                              {selectedColor ? (
                                <div
                                  style={{
                                    background: selectedColor?.startsWith('img')
                                      ? `url(${import.meta.env.VITE_REACT_COLOR_IMAGES_URL}/${selectedColor?.substring(4)}.webp)`
                                      : `#${selectedColor}`
                                  }}
                                  className="w-[50px] h-[50px] rounded-md cursor-pointer ring-1 ring-gray-300 relative">
                                  <div className="absolute w-[55px] h-[55px] rounded-md ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                              ) : (
                                <div className="w-[50px] h-[50px] rounded-md cursor-pointer relative  ring-1 ring-gray-300 ">
                                  <div className="absolute w-[50px] h-[3px] bg-red-500 rotate-45  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                              )}
                            </PopoverTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {product?.parts?.find((p) => p.color === selectedColor)?.color_enc ||
                                'No color selected'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <PopoverContent>
                        <h3 className="font-semibold mb-3">Please choose a color</h3>
                        <div className="flex gap-2 flex-wrap max-h-[200px] overflow-auto pl-2 py-2">
                          <div
                            onClick={() => setSelectedColor('')}
                            style={{ backgroundColor: 'white' }}
                            className="w-[50px] h-[50px] rounded-md cursor-pointer ring-1 ring-gray-300 relative">
                            {selectedColor === '' ? (
                              <div className="absolute w-[55px] h-[55px] rounded-md ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            ) : null}

                            <div className="absolute w-[50px] h-[3px] bg-red-500 rotate-45  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          {availableColors?.map((color, index) => (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      key={index}
                                      onClick={() => {
                                        setSelectedColor(color);
                                        console.log(
                                          `${import.meta.env.VITE_REACT_COLOR_IMAGES_URL}/${color?.substring(4)}.webp`
                                        );
                                      }}
                                      style={{
                                        background: color?.startsWith('img')
                                          ? `url(${import.meta.env.VITE_REACT_COLOR_IMAGES_URL}/${color?.substring(4)}.webp)`
                                          : `#${color}`
                                      }}
                                      className="w-[50px] h-[50px] rounded-md cursor-pointer ring-1 ring-gray-300 relative">
                                      {color === selectedColor ? (
                                        <div className="absolute w-[55px] h-[55px] rounded-md ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                      ) : null}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {product?.parts?.find((p) => p.color === color)?.color_enc}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : null}
                </div>
              </div>

              <div className="pt-4 lg:pt-0 lg:pl-4">
                <div className="grid md:grid-cols-2 justify-between gap-4">
                  {product?.product?.options_list?.LEN && (
                    <>
                      <div
                        className="cursor-pointer rounded-md bg-green-primary text-white p-2 max-w-max text-sm"
                        onClick={() => setInLength(!inLength)}>
                        {inLength ? 'Swicth to surface' : 'Switch to length'}
                      </div>
                      {inLength ? (
                        <div className="flex gap-2 col-span-2">
                          <div className="flex gap-0 items-center">
                            <span className="w-[100px]">Length:</span>
                            <input
                              value={lengthInch}
                              onChange={(e) => setLengthInch(e.target.value)}
                              className="border rounded-md rounded-r-none px-1 text-sm py-1 w-full"
                            />
                            <div className="border rounded-md rounded-l-none px-1 text-sm py-1 h-full">
                              IN
                            </div>
                          </div>

                          <div className="flex gap-0 items-center">
                            <input
                              value={lengthFT}
                              onChange={(e) => setLengthFT(e.target.value)}
                              className="border rounded-md rounded-r-none px-1 text-sm py-1 w-full"
                            />
                            <div className="border rounded-md rounded-l-none px-1 text-sm py-1 h-full">
                              FT
                            </div>
                          </div>

                          <div className="flex gap-0 items-center">
                            <input
                              value={lengthMM}
                              onChange={(e) => setLengthMM(e.target.value)}
                              className="border rounded-md rounded-r-none px-1 text-sm py-1 w-full"
                            />
                            <div className="border rounded-md rounded-l-none px-1 text-sm py-1 h-full">
                              MM
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 col-span-2">
                          <div className="flex gap-0 items-center">
                            <span className="w-[100px]">Length:</span>
                            <input
                              //value={lengthInch}
                              //onChange={(e) => setLengthInch(e.target.value)}
                              className="border rounded-md rounded-r-none px-1 text-sm py-1 w-full"
                            />
                            <div className="border rounded-md rounded-l-none px-1 text-sm py-1 h-full">
                              SQFT
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {product?.product?.options_list?.QTY || product?.product?.options_list?.QTYFT ? (
                    <div className="flex gap-1 items-center">
                      <span className="w-[100px]">
                        {product?.product?.options_list?.QTY ? 'Quantity:' : 'QuantityFt:'}
                      </span>
                      <input
                        required
                        value={quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,7}$/.test(value)) {
                            setQuantity(value);
                          }
                        }}
                        className="border rounded-md px-1 text-sm py-1 w-full"
                        type="text" // Use text to allow controlling the input
                        inputMode="numeric" // Brings up the numeric keyboard on mobile devices
                        maxLength={7} // Ensures that no more than 7 digits can be entered
                      />
                      <br />
                    </div>
                  ) : null}
                  {product?.product?.options_list?.A && (
                    <div className="flex gap-1 items-center">
                      <span className="w-[100px]">A:</span>
                      <input
                        required
                        value={a}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,2}(\.\d{0,3})?$/.test(value)) {
                            setA(value);
                          }
                        }}
                        className="border rounded-md px-1 text-sm py-1 w-full"
                        type="text" // Use text to control the input more precisely
                        inputMode="decimal" // Brings up the decimal keyboard on mobile devices
                        placeholder="00.000" // Optional: to give users a hint about the format
                      />
                    </div>
                  )}
                  {product?.product?.options_list?.B && (
                    <div className="flex gap-1 items-center">
                      <span className="w-[100px]">B:</span>
                      <input
                        required
                        value={b}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,2}(\.\d{0,3})?$/.test(value)) {
                            setB(value);
                          }
                        }}
                        className="border rounded-md px-1 text-sm py-1 w-full"
                        type="text" // Use text to control the input more precisely
                        inputMode="decimal" // Brings up the decimal keyboard on mobile devices
                        placeholder="00.000" // Optional: to give users a hint about the format
                      />
                    </div>
                  )}
                  {product?.product?.options_list?.C && (
                    <div className="flex gap-1 items-center">
                      <span className="w-[100px]">C:</span>
                      <input
                        required
                        value={c}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,2}(\.\d{0,3})?$/.test(value)) {
                            setC(value);
                          }
                        }}
                        className="border rounded-md px-1 text-sm py-1 w-full"
                        type="text" // Use text to control the input more precisely
                        inputMode="decimal" // Brings up the decimal keyboard on mobile devices
                        placeholder="00.000" // Optional: to give users a hint about the format
                      />
                    </div>
                  )}
                  {product?.product?.options_list?.P1 && (
                    <div className="flex gap-1 items-center">
                      <span className="w-[100px]">Pitch/Angle 1:</span>
                      <div className="flex gap-0 items-center">
                        <input
                          required
                          value={p1}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,6}$/.test(value)) {
                              setP1(value);
                            }
                          }}
                          className="border rounded-md px-1 text-sm py-1 w-full"
                          type="text" // Use text to allow controlling the input
                          inputMode="numeric" // Brings up the numeric keyboard on mobile devices
                          maxLength={7} // Ensures that no more than 7 digits can be entered
                        />
                        <select className="border rounded-md rounded-l-none px-1 text-sm py-1 h-full">
                          <option>Deg</option>
                          <option>/12</option>
                        </select>
                      </div>
                    </div>
                  )}
                  {product?.product?.options_list?.P2 && (
                    <div className="flex gap-1 items-center">
                      <span className="w-[100px]">Pitch/Angle 2:</span>
                      <div className="flex gap-0 items-center">
                        <input
                          required
                          value={p2}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,6}$/.test(value)) {
                              setP2(value);
                            }
                          }}
                          className="border rounded-md px-1 text-sm py-1 w-full"
                          type="text" // Use text to allow controlling the input
                          inputMode="numeric" // Brings up the numeric keyboard on mobile devices
                          maxLength={7} // Ensures that no more than 7 digits can be entered
                        />
                        <select className="border rounded-md rounded-l-none px-1 text-sm py-1 h-full">
                          <option>Deg</option>
                          <option>/12</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {product?.product?.options_list?.X && (
                    <div className="flex gap-1 items-center">
                      <span className="w-[100px]">X:</span>
                      <select
                        required
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full"
                        value={selectedX}
                        onChange={(e) => handleXYChange(e, setSelectedX)}>
                        <option value="">Select X</option>
                        {XYValues?.map((option, index) => (
                          <option key={index} value={convertFractionToNumber(option.value)}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {product?.product?.options_list?.Y && (
                    <div className="flex gap-1 items-center">
                      <span className="w-[100px]">Y:</span>

                      <select
                        className="bg-white border border-gray-300 rounded-md py-1 px-2 w-full"
                        value={selectedY}
                        onChange={(e) => handleXYChange(e, setSelectedY)}>
                        <option value="">Select Y</option>
                        {XYValues?.map((option, index) => (
                          <option key={index} value={convertFractionToNumber(option.value)}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {vOptions && (
                    <div className="flex gap-3 flex-wrap ">
                      {vOptions.map((letter, index) => (
                        <label key={index} className="flex items-center gap-1">
                          <span>{letter}</span>
                          <input
                            type="checkbox"
                            value={letter}
                            checked={selectedVValues.includes(letter)}
                            onChange={() => handleVCheckboxChange(letter)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-2 justify-between gap-4">
                    {product?.product?.options_list?.COND && (
                      <div className="flex gap-2 items-center">
                        <label>Condenstop</label>
                        <input checked={COND} onChange={() => setCOND(!COND)} type="checkbox" />
                      </div>
                    )}

                    {(product?.product?.options_list?.NSR ||
                      product?.product?.options_list?.RVNS) && (
                      <div className="flex gap-2 items-center">
                        <label>No Stiffener </label>
                        <input checked={NS} onChange={() => setNS(!NS)} type="checkbox" />
                      </div>
                    )}

                    {(product?.product?.options_list?.REV ||
                      product?.product?.options_list?.RVNS) && (
                      <div className="flex gap-2 items-center">
                        <label>Reversed</label>
                        <input checked={RV} onChange={() => setRV(!RV)} type="checkbox" />
                      </div>
                    )}

                    {product?.product?.options_list?.WSR && (
                      <div className="flex gap-2 items-center">
                        <label>With Stiffener</label>
                        <input checked={WSR} onChange={() => setWSR(!WSR)} type="checkbox" />
                      </div>
                    )}

                    {product?.product?.category?.toLowerCase() === 'Flat Stock ' &&
                    Number(quantity) >= 25 ? (
                      <div className="flex gap-3 flex-wrap">
                        {Number(quantity) >= 25 && (
                          <div className="flex gap-2">
                            <label>IFilm</label>
                            <input
                              type="checkbox"
                              checked={iFilm}
                              onChange={() => setIFilm(!iFilm)}
                            />
                          </div>
                        )}

                        {Number(quantity) >= 50 && (
                          <div className="flex gap-2">
                            <label>IEmbossed</label>
                            <input
                              type="checkbox"
                              checked={iEmbossed}
                              onChange={() => setIEmbossed(!iEmbossed)}
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Button
                type={'submit'}
                disabled={loadingAddToCart}
                className="bg-green-primary text-white rounded-lg py-1 px-2 text-sm border-green-primary hover:bg-green-primary/90 mt-4">
                {loadingAddToCart ? 'Adding to cart ...' : 'Add to cart'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCard2;
