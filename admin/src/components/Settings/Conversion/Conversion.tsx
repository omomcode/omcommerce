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

const initialData: IConversionRate = {
  id: 1,
  conversion_currency: "USD",
  rate: 0,
  spread: 0
};

const Currency = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IConversionRate>(initialData)
  const [value, setValue] = useState<string | undefined>(undefined);

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
  };

  const fetchData = async () => {

    try {
      const currency : any = await conversionRequests.getAllConversionRate();
      setIsNew(false);
      setData(currency);
      setValue(currency.conversion_currency);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrency = async (data: IConversionRate) => {
    if (!isNew) await conversionRequests.editConversion(data.id, data);
    else await conversionRequests.addConversion(data);

    await fetchData();
  };

  if (isLoading) return <LoadingIndicatorPage />;
  return (
    <Layout>
      <ContentLayout>
        <Box padding="2rem">
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
            >
              {options.map((option) => (
                <SingleSelectOption key={option.value} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            <TextInput
              name="rate"
              value={data.rate}
              onChange={handleInputChange}
              fullWidth
              placeholder="Rate"
              label="Rate"
            />
            <TextInput
              name="spread"
              value={data.spread}
              onChange={handleInputChange}
              fullWidth
              placeholder="Spread"
              label="Spread"
            />
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

export default Currency;
