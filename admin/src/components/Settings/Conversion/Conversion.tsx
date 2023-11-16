import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Layout,
  ContentLayout,
  Box,
  Typography,
  SingleSelect,
  SingleSelectOption,
  Button, TextInput,
} from "@strapi/design-system";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import conversionRequests from "../../../api/conversionrate";
import { IConversionRate } from "../../../../../types/conversionrate";
import { currencies } from "currencies.json";
import { Alert } from '@strapi/design-system';

const initialData: IConversionRate = {
  id: 1,
  conversion_currency: "USD",
  rate: "",
  spread: ""
};

const Conversion = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IConversionRate>(initialData)
  const [value, setValue] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);

  const options = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.name} (${currency.code})`,
  }));

  useEffect(() => {
    fetchData();
  }, []);

  const handleSingleSelectChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue !== undefined) {
      const fakeEvent = {
        target: { name: "conversion_currency", value: newValue },
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
      const currency : any = await conversionRequests.getAllConversionRate();
      if(currency !== undefined) {
        setIsNew(false);
        setData(currency);
        setValue(currency.conversion_currency);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrency = async (data: IConversionRate) => {
    // Validate if all required fields are filled
    const newErrors: Record<string, string> = {};
    if (!data.conversion_currency) {
      newErrors.conversion_currency = "Conversion Currency is required";
    }
    if (!data.rate) {
      newErrors.rate = "Rate is required";
    }
    if (!data.spread) {
      newErrors.spread = "Spread is required";
    }

    setErrors(newErrors);

    // Check if there are any errors before saving
    if (Object.keys(newErrors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }
    if (!isNew) await conversionRequests.editConversion(data.id, data);
    else {
      const conv = await conversionRequests.addConversion(data);
      console.log("conv", conv)
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
        <Box padding="3rem">
          <Typography variant="title">Store conversion currency</Typography>

          <Box marginTop="1rem">
            <SingleSelect
              label="Conversion Currency"
              placeholder="Select a currency"
              onClear={() => {
                handleSingleSelectChange(undefined);
              }}
              value={value}
              onChange={handleSingleSelectChange}
              required
            >
              {options.map((option) => (
                <SingleSelectOption key={option.value} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            {errors.conversion_currency && (
              <Typography textColor="danger600">{errors.conversion_currency}</Typography>
            )}
              <TextInput
              name="rate"
              value={data.rate}
              onChange={handleInputChange}
              fullWidth
              placeholder="Rate"
              label="Rate"
              required
            />
            {errors.rate && <Typography textColor="danger600">{errors.rate}</Typography>}
            <TextInput
              name="spread"
              value={data.spread}
              onChange={handleInputChange}
              fullWidth
              placeholder="Spread"
              label="Spread"
              required
            />
            {errors.spread && <Typography textColor="danger600">{errors.spread}</Typography>}
          </Box>
          <br/>
          <Button onClick={() => saveCurrency(data)} variant="secondary">
            Save
          </Button>
        </Box>
      </ContentLayout>
    </Layout>
  );
};

export default Conversion;
