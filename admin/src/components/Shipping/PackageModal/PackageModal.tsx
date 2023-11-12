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
  Radio, GridItem, Box, Grid, SingleSelect, SingleSelectOption
} from "@strapi/design-system";
import currencyRequests from "../../../api/currency";
import timezoneRequests from "../../../api/timezone";
import {IPackage, IPackageModalProps} from "../../../../../types/package";

export default function PackageModal({setShowPackageModal, addPackage, packageId, packageData, mode} : IPackageModalProps) {


  const initialData: IPackage = {
    id: 1,
    name: "standard",
    height: 0,
    length: 0,
    type: "Box",
    weight: 0,
    width: 0,
    default: false
  };

  const options = [
    {key: 'box', value: 'Box', label: 'Box'},
    {key: 'envelope', value: 'Envelope', label: 'Envelope'},
    {key: 'soft_package', value: 'Soft package or satchel', label: 'Soft package or satchel'},
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<string>("");
  const [measurement, setMeasurement] = useState<string>("");
  const [lengthUnit, setLength] = useState<string>("");
  const [packageD, setPackageD] = useState<IPackage>(initialData);
  const [value, setValue] = useState<string | undefined>("Box");

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    if (packageData !== null) {
      // @ts-ignore
      setPackageD(packageData);
    }

    try {
      const c : any = await currencyRequests.getAllCurrency();
      const tz : any = await timezoneRequests.getAllTimezone();
      setCurrency(c.currency);
      setMeasurement(tz.unit);
      setLength(tz.lengthUnit);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; stopPropagation: () => void; }) => {

    e.preventDefault();
    e.stopPropagation();

    try {
      setShowPackageModal(false);
    } catch (e) {
      console.log("error", e);
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setPackageD({
      ...packageD,
      [name]: value,
    });

  };

  const handleSingleSelectChange = (newValue: string | undefined) => {

    setValue(newValue);
    if (newValue !== undefined) {
      const fakeEvent = {
        target: {name: "type", value: newValue}
      } as ChangeEvent<HTMLInputElement>;
      handleInputChange(fakeEvent);
    }
  };

  const handleDefaultCheckboxChange = (value: boolean) => {
    setPackageD({
      ...packageD,
      default: value,
    });
  };

  return (
    <ModalLayout
      onClose={() => setShowPackageModal(false)}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {mode} package
        </Typography>
      </ModalHeader>

      <ModalBody>

        <Box marginTop="1rem">
          <TextInput
            name="name"
            value={packageD.name}
            onChange={handleInputChange}
            label="Name"

          />
        </Box>
        <br/>

        <Box marginTop="1rem">
          <SingleSelect
            label="Type"
            placeholder="Select a package type"
            onClear={() => {
              handleSingleSelectChange(undefined);
            }}
            value={value}
            onChange={handleSingleSelectChange}
          >
            {options.map((option) => (
              <SingleSelectOption key={option.key} value={option.value}>
                {option.label}
              </SingleSelectOption>
            ))}
          </SingleSelect>;
        </Box>

        <Grid gap={5}>
          <GridItem col={2} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="length"
                value={packageD.length}
                onChange={handleInputChange}
                fullWidth
                label="Length"
              />
            </Box>
          </GridItem>
          <GridItem col={2} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="width"
                value={packageD.width}
                onChange={handleInputChange}
                fullWidth
                label="Width"
              />
            </Box>
          </GridItem>
          {value !== "Envelope" &&
            <GridItem col={2} s={12}>
              <Box marginTop="1rem">
                <TextInput
                  name="height"
                  value={packageD.height}
                  onChange={handleInputChange}
                  fullWidth
                  label="Height"
                />
              </Box>
            </GridItem>
          }
          <GridItem col={2} s={12}>
            <Box marginTop="1rem">
              <TextInput
                disabled
                name="lengthunit"
                value={lengthUnit}
                fullWidth
                label="Unit"
              />
            </Box>
          </GridItem>
          {value === "Envelope" &&
            <GridItem col={2} s={12}>
              <Box marginTop="1rem">
              </Box>
            </GridItem>
          }
          <GridItem col={2} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="weight"
                value={packageD.weight}
                onChange={handleInputChange}
                fullWidth
                label="Weight (optional)"
              />
            </Box>
          </GridItem>
          <GridItem col={2} s={12}>
            <Box marginTop="1rem">
              <TextInput
                disabled
                name="massunit"
                value={measurement}
                fullWidth
                label="Unit"
              />
            </Box>
          </GridItem>

        </Grid>
        <Box marginTop="1rem">
          <Checkbox
            id="default"
            name="default"
            onValueChange={handleDefaultCheckboxChange}
            value={packageD.default}
          >
            Make this the default store package
          </Checkbox>
        </Box>

      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={() => setShowPackageModal(false)} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={<Button type="submit" onClick={() => addPackage(packageD)}> {mode} package </Button>}
      />
    </ModalLayout>
  );
}
