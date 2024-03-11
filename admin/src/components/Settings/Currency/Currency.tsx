import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Layout,
  ContentLayout,
  Box,
  Typography,
  SingleSelect,
  SingleSelectOption,
  Button,
  Grid,
  GridItem
} from "@strapi/design-system";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import currencyRequests from "../../../api/currency";
import { ICurrency } from "../../../../../types/currency";
import currencies from "../../../data/paypalcurrencies.json";
import { Alert } from '@strapi/design-system';

const initialData: ICurrency = {
  id: 0,
  currency: ""
};

const Currency = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<ICurrency>(initialData)
  const [value, setValue] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);

  const options = currencies.map((currency: { label: any; value: any; }) => ({
    value: currency.value,
    label: `${currency.label} (${currency.value})`,
  }));


  useEffect(() => {
    fetchData();
  }, []);

  const handleSingleSelectChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue !== undefined) {
      const fakeEvent = {
        target: { name: "currency", value: newValue },
      } as ChangeEvent<HTMLInputElement>;
      handleInputChange(fakeEvent);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    // Clear the error message when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
    setNoSubmit(false);
  };

  const fetchData = async () => {
    try {
      const currency : any = await currencyRequests.getAllCurrency();
      if(currency !== undefined) {
        setIsNew(false);
        setData(currency);
        setValue(currency.currency);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const saveCurrency = async (data: ICurrency) => {
    // Validate if all required fields are filled
    const newErrors: Record<string, string> = {};
    if (!data.currency) {
      newErrors.currency = "Currency is required";
    }

    setErrors(newErrors);

    // Check if there are any errors before saving
    if (Object.keys(newErrors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }
    if (!isNew){
      setNoSubmit(false);
      await currencyRequests.editCurrency(data.id, data);
    }
    else {
      setNoSubmit(false);
      await currencyRequests.addCurrency(data)
      setIsNew(false)
    }
    await fetchData();
  };

  if (isLoading) return <LoadingIndicatorPage />;
  return (
    <Layout>
      <ContentLayout>
        {nosubmit &&<Alert closeLabel="Close" onClose={() => setNoSubmit(false)} title="Error" variant="danger">
          Fill all required fields.
        </Alert>}
        <Box padding="3rem" background="neutral0" borderRadius="4px" style={{ boxShadow: "rgba(3, 3, 5, 0.35) 1px 1px 10px" }}>
          <Typography variant="beta">Paypal currency</Typography>
          <Grid gap={5} marginBottom="2rem">
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
            <SingleSelect
              label="Currency"
              placeholder="Select a currency"
              hint="Currency used in paypal payment"
              onClear={() => {
                handleSingleSelectChange(undefined);
              }}
              value={value}
              onChange={handleSingleSelectChange}
              required
            >
              {options.map((option : any) => (
                <SingleSelectOption key={option.value} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            {errors.currency && (
              <Typography textColor="danger600">{errors.currency}</Typography>
            )}
          </Box>
            </GridItem>
      </Grid>
          <Button size="L" onClick={() => saveCurrency(data)} variant="secondary">
            Save
          </Button>
        </Box>
      </ContentLayout>
    </Layout>
  );
};

export default Currency;
