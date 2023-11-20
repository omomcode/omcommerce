import React, {ChangeEvent, useEffect, useState} from "react";

import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
  Checkbox,
  RadioGroup,
  Radio, GridItem, Box, Grid
} from "@strapi/design-system";
import {IShippingRate, IShippingRateModalProps} from "../../../../../types/rate";
import currencyRequests from "../../../api/currency";
import timezoneRequests from "../../../api/timezone";

export default function ShippingRateModal({
                                            setShowRateModal,
                                            addShippingRate,
                                            zoneId,
                                            rateData,
                                            mode,
                                          } : IShippingRateModalProps)  {
  const initialData: IShippingRate = {
    id: 1,
    name: "standard",
    condition: "",
    price: 0,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [rate, setRate] = useState<IShippingRate>(initialData);
  const [selected, setSelected] = useState("weight");
  const [checked, setChecked] = useState([false, true]);
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');

  const [minPrice, setMinPrice] = useState<number | string>('');
  const [maxPrice, setMaxPrice] = useState<number | string>('');
  const [currency, setCurrency] = useState<string>("");
  const [measurement, setMeasurement] = useState<string>("");

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    if (rateData !== null) {
      // @ts-ignore
      setRate(rateData);
    }

    try {
      const c: any = await currencyRequests.getAllCurrency();
      const tz: any = await timezoneRequests.getAllTimezone();
      setCurrency(c.currency);
      setMeasurement(tz.unit);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCondition = (min: any, max: any, unit: string | undefined, prefix?: string) => {
    const formatValue = (value: any) => (typeof value === 'number' ? value : `${value}${unit}`);
    return `${prefix ? prefix + ' ' : ''}${formatValue(min)}-${prefix ? prefix + ' ' : ''}${max ? formatValue(max) : 'No limit'}`;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'minWeight') {
      setMinWeight(value);
      setRate({
        ...rate,
        ["condition"]: setCondition(value, maxWeight, measurement),
      });
    } else if (name === "maxWeight") {
      setMaxWeight(value);
      setRate({
        ...rate,
        ["condition"]: setCondition(minWeight, value, measurement),
      });
    } else if (name === "minPrice") {
      setMinPrice(value);
      setRate({
        ...rate,
        ["condition"]: setCondition(value, maxPrice, currency, currency),
      });
    } else if (name === "maxPrice") {
      setMaxPrice(value);
      setRate({
        ...rate,
        ["condition"]: setCondition(minPrice, value, currency, currency),
      });
    } else {
      setRate({
        ...rate,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setShowRateModal(false);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <ModalLayout
      onClose={() => setShowRateModal(false)}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {mode} rate
        </Typography>
      </ModalHeader>

      <ModalBody>
        <TextInput
          label="Name"
          name="name"
          onChange={handleInputChange}
          value={rate.name}
          required
        />
        <br />

        <TextInput
          label={`Price (${currency})`}
          name="price"
          onChange={handleInputChange}
          value={rate.price}
        />
        <br />
        <Checkbox id="conditions" name="conditions" onValueChange={(value: boolean) => setChecked([value, checked[1]])} value={checked[0]}>
          Add conditional pricing
        </Checkbox>
        <br />
        {checked[0] && (
          <>
            <RadioGroup
              labelledBy="trophy-champions"
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSelected(e.target.value)}
              value={selected}
              name="meal"
            >
              <Radio value="weight">Based on items weight</Radio>
              <Radio value="price">Based on order price</Radio>
            </RadioGroup>

            {selected==="weight" && (
              <>
                <Grid gap={5}>
                  <GridItem col={6} s={12}>
                    <Box marginTop="1rem">
                      <TextInput
                        name="minWeight"
                        onChange={handleInputChange}
                        fullWidth
                        placeholder={`0 ${measurement}`}
                        label={`Minimum weight (${measurement})`}
                      />
                    </Box>
                  </GridItem>
                  <GridItem col={6} s={12}>
                    <Box marginTop="1rem">
                      <TextInput
                        name="maxWeight"
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="No limit"
                        label={`Maximum weight (${measurement})`}
                      />
                    </Box>
                  </GridItem>
                </Grid>
              </>
            )}

            {selected==="price" && (
              <>
                <Grid gap={5}>
                  <GridItem col={6} s={12}>
                    <Box marginTop="1rem">
                      <TextInput
                        name="minPrice"
                        onChange={handleInputChange}
                        fullWidth
                        placeholder={`0 ${currency}`}
                        label={`Minimum price (${currency})`}
                      />
                    </Box>
                  </GridItem>

                  <GridItem col={6} s={12}>
                    <Box marginTop="1rem">
                      <TextInput
                        name="maxPrice"
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="No limit"
                        label={`Maximum price (${currency})`}
                      />
                    </Box>
                  </GridItem>
                </Grid>
              </>
            )}
          </>
        )}
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => setShowRateModal(false)} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={<Button type="submit" onClick={() => addShippingRate(zoneId?parseInt(zoneId as string): 0,rate)}>{mode} rate</Button>}
      />
    </ModalLayout>
  );
}
