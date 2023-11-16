import React, { ChangeEvent, useEffect, useState } from "react";
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  RadioGroup,
  Radio,
  NumberInput,
  Box,
  Grid,
  GridItem,
} from "@strapi/design-system";

export default function ReturnRulesModal({
                                           handleRulesShow,
                                           setRadioOne,
                                           setRadioTwo,
                                           setRestockingFee,
                                           radioOne,
                                           radioTwo,
                                           restockingFee,
                                           editLegal,
                                         }: any) {
  const [restockingFeeError, setRestockingFeeError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!validateRestockingFee()) {
        return;
      }

      handleSave();
      handleRulesShow();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSave = () => {
    editLegal({
      returnWindow: radioOne,
      returnShippingCost: radioTwo,
      restockingFee: restockingFee,
    });
  };

  const handleNumberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRestockingFee((prevState: any) => parseInt(value, 10));

    // Clear the error message when the user starts typing
    setRestockingFeeError(null);
  };

  const validateRestockingFee = () => {
    if (isNaN(restockingFee) || restockingFee < 0) {
      setRestockingFeeError("Enter a valid restocking fee percentage");
      return false;
    }
    return true;
  };

  return (
    <ModalLayout
      onClose={handleRulesShow}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Return Rules
        </Typography>
      </ModalHeader>

      <ModalBody>
        <Grid padding={1}>
          <GridItem padding={1} col={8}>
            <Typography variant="beta" id="return-window">
              Return window
            </Typography>
          </GridItem>
          <GridItem padding={1} col={8}>
            <RadioGroup
              labelledBy="return-window"
              onChange={(e: { target: { value: any } }) => setRadioOne(e.target.value)}
              value={radioOne}
              name="radio-one"
            >
              <Radio value="14 days">14 days</Radio>
              <Radio value="30 days">30 days</Radio>
              <Radio value="90 days">90 days</Radio>
              <Radio value="Unlimited">Unlimited</Radio>
            </RadioGroup>
          </GridItem>
          <GridItem padding={1} col={8}>
            <Typography variant="beta" id="return-shipping-cost">
              Return shipping cost
            </Typography>
          </GridItem>
          <GridItem padding={1} col={8}>
            <RadioGroup
              labelledBy="return-shipping-cost"
              onChange={(e: { target: { value: any } }) => setRadioTwo(e.target.value)}
              value={radioTwo}
              name="radio-two"
            >
              <Radio value="Customer provides return shipping">Customer provides return shipping</Radio>
              <Radio value="Free return shipping">Free return shipping</Radio>
              <Radio value="Flat rate return shipping">Flat rate return shipping</Radio>
            </RadioGroup>
          </GridItem>
          <GridItem padding={1} col={8}>
            <Typography paddingTop={1} variant="beta">
              Restocking fee %
            </Typography>
          </GridItem>
          <GridItem padding={1} col={8}>
            <NumberInput
              name="restocking-fee"
              onChange={handleNumberInputChange}
              value={restockingFee}
            />
            {restockingFeeError && (
              <Typography textColor="danger600">{restockingFeeError}</Typography>
            )}
          </GridItem>
        </Grid>
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={handleRulesShow} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <Button type="submit">
            Save Rules
          </Button>
        }
      />
    </ModalLayout>
  );
}
