import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Typography,
  Tbody,
  Td, GridItem,
  Button,
  Link,
  BaseHeaderLayout,
  Divider,
  FieldInput,
  SingleSelect,
  SingleSelectOption,
  Flex, VisuallyHidden, IconButton
} from '@strapi/design-system';
import {
  Plus,
  ArrowLeft,
  CarretDown,
  Pencil,
  Trash,
  Play
} from '@strapi/icons';

import { NextLink, PageLink, Pagination, PreviousLink } from '@strapi/design-system';

import productcmsRequests from "../../../api/productcms";
import { IProduct } from "../../../../../types/product";
import {IShippingZone} from "../../../../../types/zonetable";
import {ITaxes} from "../../../../../types/taxes";
import React, {ChangeEvent, useEffect, useState} from "react";
import shippingZoneRequests from "../../../api/shippingzone";
import taxRequests from "../../../api/tax";
import ProductsModal from "../ProductsModal/ProductsModal";
import productRequests from "../../../api/product";
import NewProductModal from "../NewProductModal/NewProductModal";
import profileRequests from "../../../api/profile";
import paypalSetupRequests from "../../../api/paypalsetup";
import {IPaypalSetup} from "../../../../../types/paypalsetup";

const initialData: IProduct = {
  id: 0,
  title: "",
  slug: "",
  description: "",
  SKU: "",
  amount_currency_code: "",
  amount_value: 1,
  tax_currency_code: "EUR",
  tax_value: 0,
  media: [],
  compare_at_price: "",
  cost_per_item: "",
  chargeTax: false,
  Quantity: 0,
  Barcode: "",
  showQuantity: false,
  weight: 0,
  measurement_unit: "",
  omcommerce_tax: {} as ITaxes,
  omcommerce_shippingzones: [],
}

const initialPaymentData: IPaypalSetup = {
  id: 1,
  live_paypal_client_id: '',
  live_paypal_client_secret: '',
  sandbox_paypal_client_id: '',
  sandbox_paypal_client_secret: '',
  live: false,
  paypalSelected: false,
  payProGlobalSelected: false,
  paymentThreeSelected: false
};

const InitialData: IProduct[] = [{
  id: 0,
  title: "",
  slug: "",
  description: "",
  SKU: "",
  amount_currency_code: "",
  amount_value: 1,
  tax_currency_code: "EUR",
  tax_value: 0,
  media: [],
  compare_at_price: "",
  cost_per_item: "",
  chargeTax: false,
  Quantity: 0,
  Barcode: "",
  showQuantity: false,
  weight: 0,
  measurement_unit: "",
  omcommerce_tax: {} as ITaxes,
  omcommerce_shippingzones: [],
  categories: [],
  subcategory: 0,
  amount_value_converted: 0,
  amount_value_converted_currency_code: "EUR"
}]
const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>(InitialData);
  const [currentProduct, setCurrentProduct] = useState<IProduct>();
  const [shippingZones, setShippingZones] = useState<IShippingZone[]>([]);
  const [taxes, setTaxes] = useState<number>(0);
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState<IProduct>(initialData);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);
  const [newProductModalShow, setNewProductModalShow] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [payments, setPayments] = useState<IPaypalSetup>(initialPaymentData);

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);


    try {
      const pr: any = await productcmsRequests.getAllProductscms();
      const tax: any = await taxRequests.getAllTaxes();
      const sh: any = await shippingZoneRequests.getAllShippingZones();
      const pays: any = await paypalSetupRequests.getAllPaypalSetups();

      setPayments(pays);

      let arr = new Array<IProduct>()

      pr.map((entry: { id: any,title: any,
        slug: any,
        description: any,
        SKU: any,
        amount_currency_code: any,
        amount_value: any,
        tax_currency_code: any,
        tax_value: any,
        media: any,
        compare_at_price: any,
        cost_per_item: any,
        chargeTax: any,
        Quantity: any,
        Barcode: any,
        showQuantity: any,
        weight: any,
        measurement_unit: any,
        omcommerce_tax: any,
        omcommerce_shippingzones: any,
        categories: any,
        subcategory: any,
        amount_value_converted: any,
        amount_value_converted_currency_code: any }) =>
        arr.push({
          id: entry.id,
          title: entry.title,
          slug: entry.slug,
          description: entry.description,
          SKU: entry.SKU,
          amount_currency_code: entry.amount_currency_code,
          amount_value: entry.amount_value,
          tax_currency_code: entry.tax_currency_code,
          tax_value: entry.tax_value,
          media: entry.media,
          compare_at_price: entry.compare_at_price,
          cost_per_item: entry.cost_per_item,
          chargeTax: entry.chargeTax,
          Quantity: entry.Quantity,
          Barcode: entry.Barcode,
          showQuantity: entry.showQuantity,
          weight: entry.weight,
          measurement_unit: entry.measurement_unit,
          omcommerce_tax: entry.omcommerce_tax,
          omcommerce_shippingzones: entry.omcommerce_shippingzones,
          categories: entry.categories,
          subcategory: entry.subcategory,
          amount_value_converted: entry.amount_value_converted,
          amount_value_converted_currency_code: entry.amount_value_converted_currency_code
        }))
        setProducts(arr);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productRequests.deleteProduct(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  const handleClick = (product: IProduct | React.SetStateAction<IProduct | undefined>) => {
    setModalShow((prevState) => !prevState)
    // @ts-ignore
    setCurrentProduct(product);
  }

  // const handleSave = async () => {
  //   try {
  //     if(!isNew)
  //       await productRequests.editProduct(currentProduct?.id, data);
  //     else {
  //       await productRequests.addProduct(data);
  //       setIsNew(false);
  //     }
  //     await fetchData();
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    // Clear validation error when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
    setNoSubmit(false);
  };

  const handleCreateProduct = async (data: IProduct) => {
    try {
      setNoSubmit(false);
      await productRequests.addProduct(data)
      setNewProductModalShow(false);
      await fetchData();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleUpdateProduct = async (data: IProduct) => {
    try {
      setNoSubmit(false);

      if(currentProduct?.id !== undefined) {
        await productRequests.editProduct(currentProduct.id, data)
        await fetchData();
      }
      setModalShow(false);

    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }

  const handleSort = async () => {
    if (sortOrder === "asc") {
      setProducts(products.sort((a, b) => a.id - b.id));
      setSortOrder("desc");
    } else {
      setProducts(products.sort((a, b) => b.id - a.id));
      setSortOrder("asc");
    }
  }


  return (
    <Box padding={8} background="neutral100">
      {payments?.paypalSelected && <BaseHeaderLayout navigationAction={<Link startIcon={<ArrowLeft />} to="/">
        Go back
      </Link>} primaryAction={<Button onClick={() => setNewProductModalShow(true)} startIcon={<Plus />}>Add an entry</Button>} title="Products" subtitle={products.length + " entries found"} as="h2" />}
      {!payments?.paypalSelected && <BaseHeaderLayout navigationAction={<Link startIcon={<ArrowLeft />} to="/">
        Go back
      </Link>}  title="Products" subtitle={products.length + " entries found"} as="h2" />}
      <Table colCount={4}>
        <Thead>
          <Tr>
            <Th onClick={() => handleSort()}>
              <Typography variant="sigma">ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">SKU</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">TITLE</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">PRICE</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">QUANTITY</Typography>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map(entry => <Tr  key={entry.id}>

            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.id}</Typography>
            </Td>
            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.SKU}</Typography>
            </Td>
            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.title}</Typography>
            </Td >
            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.amount_value + " " + entry.amount_currency_code}</Typography>
            </Td>
            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.Quantity}</Typography>
            </Td>

          </Tr>)}
        </Tbody>
      </Table>

      {modalShow && <GridItem>
        <ProductsModal showModal={setModalShow} paypalSelected={payments?.paypalSelected} product={currentProduct} handleUpdateProduct={handleUpdateProduct}/>
      </GridItem>}
      {newProductModalShow && <GridItem>
        <NewProductModal showModal={setNewProductModalShow} handleCreateProduct={handleCreateProduct}/>
      </GridItem>
      }

      {/*<Box paddingTop={4}>*/}
      {/*  <Flex alignItems="stretch" justifyContent="space-between" gap={11}>*/}
      {/*    <Flex>*/}
      {/*      <SingleSelect value={'10'} >*/}
      {/*        <SingleSelectOption value="10">10</SingleSelectOption>*/}
      {/*        <SingleSelectOption value="20">20</SingleSelectOption>*/}
      {/*        <SingleSelectOption value="50">50</SingleSelectOption>*/}
      {/*        <SingleSelectOption value="100">100</SingleSelectOption>*/}
      {/*      </SingleSelect>*/}
      {/*      <Box paddingLeft={2}>*/}
      {/*        <Typography textColor="neutral600">Entries per page</Typography>*/}
      {/*      </Box>*/}
      {/*    </Flex>*/}
      {/*    <Flex>*/}
      {/*      <Pagination activePage={1} pageCount={26}>*/}
      {/*        <PreviousLink to="/1">Go to previous page</PreviousLink>*/}
      {/*        <PageLink number={1} to="/1">*/}
      {/*          Go to page 1*/}
      {/*        </PageLink>*/}
      {/*        <NextLink to="/3">Go to next page</NextLink>*/}
      {/*      </Pagination>,*/}
      {/*    </Flex>*/}

      {/*  </Flex>*/}
      {/*</Box>*/}
    </Box>
  )
};
export default Products;
