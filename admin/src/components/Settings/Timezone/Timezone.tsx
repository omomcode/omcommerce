import {
  Layout,
  ContentLayout,
  Box,
  Typography,
  SingleSelect,
  SingleSelectOption,
  Grid,
  GridItem,
  Button
} from "@strapi/design-system";
import React, { ChangeEvent, useEffect, useState } from "react";
import timezones from "timezones.json";
import timezoneRequests from "../../../api/timezone";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";

import { IZoneData, IUnitsData } from "../../../../../types/timezone";
import { Alert } from '@strapi/design-system';



const unitsData: IUnitsData = {
  Metric: [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
  ],
  Imperial: [
    { value: 'lb', label: 'Pound (lb)' },
    { value: 'oz', label: 'Ounce (oz)' },
  ],
};

const weightUnitsData: IUnitsData = {
  Metric: [
    { value: 'm', label: 'Meter (m)' },
    { value: 'cm', label: 'Centimeter (cm)' }
  ],
  Imperial: [
    { value: 'in', label: 'Inches (in)' },
    { value: 'ft', label: 'Feet (ft)' },
  ],
}

const initialData: IZoneData = {
  id: 0,
  timezone: "",
  measurement: "Metric",
  unit: "",
  lengthUnit: ""
};

const Timezone = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IZoneData>(initialData)
  const [system, setSystem] = useState<string>('Metric');
  const [unit, setUnit] = useState<string>('');
  const [lengthUnit, setLengthUnit] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);


  useEffect(() => {


    fetchData();
  }, []);


  const handleSystemChange = (newSystem: string) => {
    setSystem(newSystem);
    setData((prevData : any) => ({
      ...prevData,
      measurement: newSystem,
    }));
    setErrors({
      ...errors,
      measurement: "",
    });

    setUnit('');
  };

  const options = timezones.map((timezone) => ({
    value: timezone.value,
    label: `${timezone.text} (UTC ${timezone.offset >= 0 ? '+' : ''}${timezone.offset}:00)`,
    key: `${timezone.text} (UTC ${timezone.offset >= 0 ? '+' : ''}${timezone.offset}:00)`
  }));

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const timezone: any = await timezoneRequests.getAllTimezone();
      if(timezone !== undefined) {
        setIsNew(false);
        setData(timezone);
        setValue(timezone.timezone);
        setSystem(timezone.measurement);
        setUnit(timezone.unit);
        setLengthUnit(timezone.lengthUnit)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTimezone = async (data: IZoneData) => {
    if (!isNew)
      await timezoneRequests.editTimezone(data.id, data);
    else {
      const timezone = await timezoneRequests.addTimezone(data);

      setIsNew(false)
    }
    await fetchData();
  }

  const handleSingleSelectChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue !== undefined) {
      const fakeEvent = {
        target: { name: "timezone", value: newValue }
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
    setErrors({
      ...errors,
      [name]: "",
    });
    setNoSubmit(false);
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);

    // Update the data state with the new unit value
    setData((prevData) => ({
      ...prevData,
      unit: newUnit,
    }));
    setErrors({
      ...errors,
      unit: "",
    });

    setNoSubmit(false);
  };

  const handleLengthUnitChange = (newUnit: string) => {
    setLengthUnit(newUnit);

    // Update the data state with the new unit value
    setData((prevData) => ({
      ...prevData,
      lengthUnit: newUnit,
    }));
    setErrors({
      ...errors,
      lengthUnit: "",
    });
    setNoSubmit(false);

  };

  if (isLoading) return <LoadingIndicatorPage />;

  return (
    <Layout>
      <ContentLayout>
        {nosubmit &&<Alert closeLabel="Close" onClose={() => setNoSubmit(false)} title="Error" variant="danger">
          Fill all required fields.
        </Alert>}
        <Box padding="3rem">
          <Typography variant="title">Time zone and units of measurement</Typography>
          <Box marginTop="1rem">
            <SingleSelect
              label="Timezone"
              placeholder="Select a timezone"
              onClear={() => {
                handleSingleSelectChange(undefined);
              }}
              value={value}
              onChange={handleSingleSelectChange}
              required
            >
              {options.map((option) => (
                <SingleSelectOption key={option.key} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            {errors.timezone && <Typography textColor="danger600">{errors.timezone}</Typography>}
          </Box>

          <Grid gap={5}>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <SingleSelect
                  label="Measurement System"
                  placeholder="Select a system"
                  value={system}
                  onChange={handleSystemChange}
                  required
                >
                  {[
                    { value: 'Metric', label: 'Metric System' },
                    { value: 'Imperial', label: 'Imperial System' },
                  ].map((option) => (
                    <SingleSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
                {errors.measurement && <Typography textColor="danger600">{errors.measurement}</Typography>}
              </Box>
            </GridItem>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <SingleSelect
                  label={`Measurement Unit (${system})`}
                  placeholder={`Select a unit (${system})`}
                  value={unit}
                  onChange={handleUnitChange}
                  required
                >
                  {unitsData[system].map((option) => (
                    <SingleSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
                {errors.unit && <Typography textColor="danger600">{errors.unit}</Typography>}
              </Box>
            </GridItem>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <SingleSelect
                  label={`Length Unit (${system})`}
                  placeholder={`Select a unit (${system})`}
                  value={lengthUnit}
                  onChange={handleLengthUnitChange}
                  required
                >
                  {weightUnitsData[system].map((option) => (
                    <SingleSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
                {errors.lengthUnit && <Typography textColor="danger600">{errors.lengthUnit}</Typography>}
              </Box>
            </GridItem>
          </Grid>
          <br />
          <Button onClick={() => saveTimezone(data)} variant="secondary">
            Save
          </Button>
        </Box>
      </ContentLayout>
    </Layout>
  )
}

export default Timezone;
