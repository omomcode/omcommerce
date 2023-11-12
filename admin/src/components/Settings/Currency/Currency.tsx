import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Layout,
  ContentLayout,
  Box,
  Typography,
  SingleSelect,
  SingleSelectOption,
  Button,
} from "@strapi/design-system";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import currencyRequests from "../../../api/currency";
import { ICurrency } from "../../../../../types/currency";
import { currencies } from "currencies.json";

const initialData: ICurrency = {
  id: 0,
  currency: ""
};

const Currency = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<ICurrency>(initialData)
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
  };

  const fetchData = async () => {
    try {
      const currency : any = await currencyRequests.getAllCurrency();
      setIsNew(false);
      setData(currency);
      setValue(currency.currency);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrency = async (data: ICurrency) => {
    if (!isNew) await currencyRequests.editCurrency(data.id, data);
    else await currencyRequests.addCurrency(data);

    await fetchData();
  };

  if (isLoading) return <LoadingIndicatorPage />;
  return (
    <Layout>
      <ContentLayout>
        <Box padding="2rem">
          <Typography variant="title">Store currency</Typography>

          <Box marginTop="1rem">
            <SingleSelect
              label="Currency"
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
