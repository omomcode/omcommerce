import {
  Box,
  Button,
  ContentLayout,
  Grid,
  GridItem,
  IconButton,
  Layout,
  Typography,
  Flex, Checkbox, TextInput, RadioGroup, Radio,
} from '@strapi/design-system';
import React, {ChangeEvent, useEffect, useState} from "react";
import {IPaypalSetup} from "../../../../../types/paypalsetup";
import paypalSetupRequests from "../../../api/paypalsetup";
import Currency from "../../Settings/Currency/Currency";
import {LoadingIndicatorPage} from "@strapi/helper-plugin";
// import {decryptData, encryptData} from "../../../../../server/utils/payment/paypalPaymentSettings";

const Payment = ({handleSetSteps, st, steps} : {handleSetSteps: any, st: any, steps: any}) => {

  const initialData: IPaypalSetup = {
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

  const [data, setData] = useState<IPaypalSetup>(initialData);
  const [isNew, setIsNew] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("sandbox");
  const [paypalSelected, setPaypalSelected] = useState(false);
  const [payProGlobalSelected, setPayProGlobalSelected] = useState(false);
  const [paymentThreeSelected, setPaymentThreeSelected] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);
    try {
      const paypalS: any = await paypalSetupRequests.getAllPaypalSetups();
      if(st === 1 && !paypalS.paypalSelected){
        handleSetSteps(stepsTechnical)
      }
      {
        setData(paypalS);
        setPaypalSelected(paypalS.paypalSelected);
        setPayProGlobalSelected(paypalS.payProGlobalSelected);
        setPaymentThreeSelected(paypalS.paymentThreeSelected);
        setSelected(paypalS.live===true?"live":"sandbox");
      }
      setIsNew(false);
      setData(paypalS);
      setPaypalSelected(paypalS.paypalSelected);
      setPayProGlobalSelected(paypalS.payProGlobalSelected);
      setPaymentThreeSelected(paypalS.paymentThreeSelected);
      setSelected(paypalS.live===true?"live":"sandbox");

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };


  const savePaypalSettings = async (data: IPaypalSetup) => {

    const d = {
      // sandbox_paypal_client_id: data.sandbox_paypal_client_id ? encryptData(data.sandbox_paypal_client_id) : undefined,

      sandbox_paypal_client_id: data.sandbox_paypal_client_id ? data.sandbox_paypal_client_id : undefined,

      // sandbox_paypal_client_secret: data.sandbox_paypal_client_secret ? encryptData(data.sandbox_paypal_client_secret) : undefined,
      sandbox_paypal_client_secret: data.sandbox_paypal_client_secret ? data.sandbox_paypal_client_secret : undefined,
      live_paypal_client_id: data.live_paypal_client_id ? data.live_paypal_client_id : undefined,
      // live_paypal_client_secret: updatedData.live_paypal_client_secret ? encryptData(updatedData.live_paypal_client_secret) : undefined,
      live_paypal_client_secret: data.live_paypal_client_secret ? data.live_paypal_client_secret : undefined,
      live: selected !== "sandbox",
      paypalSelected: paypalSelected,
      payProGlobalSelected: payProGlobalSelected,
      paymentThreeSelected: paymentThreeSelected
    }
    // @ts-ignore
    Object.keys(d).forEach(key => d[key] === undefined && delete d[key]);

    if(!isNew)
    {
      await paypalSetupRequests.editPaypalSetup(data.id,d);
    }
    else
    {
      await paypalSetupRequests.addPaypalSetup(d);
    }
    fetchData();
  }
  const stepsPsychical = [
    "General",
    "Payment",
    "Shipping",
    "Tax",
    "Final"
  ];

  const stepsTechnical = [
    "General",
    "Payment",
    "Final"
  ];

  // if (isLoading) return <LoadingIndicatorPage />;

  return (
      <>
        <Layout>
          <ContentLayout >

            <Box padding="3rem" marginTop="3rem" background="neutral0" borderRadius="4px" style={{ boxShadow: "rgba(3, 3, 5, 0.35) 1px 1px 10px" }}>
                <Typography variant="beta">Select payment methods</Typography>
              <Grid gap={5} marginBottom="2rem">
                <GridItem col={12}>
                  <Box marginTop="1rem">
                    <ul>
                      <li>
                        <Checkbox id="paypalSelected" name="paypalSelected"
                                  onValueChange={(value: boolean) => {setPaypalSelected(value); if (value && st === 1)
                                    handleSetSteps(stepsPsychical)
                                  else if (!value && st === 1) handleSetSteps(stepsTechnical)
                                  ;}}
                                  value={paypalSelected}>
                          Paypal
                        </Checkbox>
                      </li>
                      <li>
                        <Checkbox id="payProGlobalSelected" name="payProGlobalSelected"
                                  onValueChange={(value: boolean) => setPayProGlobalSelected(value)}
                                  value={payProGlobalSelected}>
                          Fast Spring
                        </Checkbox>

                      </li>
                      <li>
                        <Checkbox id="paymentThreeSelected" name="paymentThreeSelected"
                                  onValueChange={(value: boolean) => setPaymentThreeSelected(value)}
                                  value={paymentThreeSelected}>
                          Stripe
                        </Checkbox>
                      </li>
                    </ul>
                  </Box>
                </GridItem>
                {paypalSelected && (<> <GridItem padding={1} col={8}>
                  <Box marginTop="1rem">
                    <RadioGroup onChange={(e: {
                      target: { value: React.SetStateAction<string>; };
                    }) => setSelected(e.target.value)} value={selected} name="meal">
                      <Radio value="sandbox">Sandbox</Radio>
                      <Radio value="live">Live</Radio>
                    </RadioGroup>
                  </Box>
                </GridItem>
                <GridItem col={6} s={12}>
                <Box marginTop="1rem">
                  <TextInput
                    name="live_paypal_client_id"
                    type="password"
                    value={data.live_paypal_client_id}
                    onChange={handleInputChange}
                    fullWidth
                    label="Live paypal client id"
                    hint="Will be used when store goes live"
                  />
                </Box>
                </GridItem>
                <GridItem col={6} s={12}>
                <Box marginTop="1rem">
                  <TextInput
                    name="live_paypal_client_secret"
                    type="password"
                    value={data.live_paypal_client_secret}
                    onChange={handleInputChange}
                    fullWidth
                    label="Live paypal client secret"
                    hint="Will be used when store goes live"
                  />
                </Box>
                </GridItem>
              {/*<Button onClick={() => savePaypalLiveSettings(data)} variant="secondary">*/}
              {/*  Save*/}
              {/*</Button>*/}
                <GridItem col={6} s={12}>
                <Box marginTop="1rem">
                  <TextInput
                    name="sandbox_paypal_client_id"
                    type="password"
                    value={data.sandbox_paypal_client_id}
                    onChange={handleInputChange}
                    fullWidth
                    label="Sandbox paypal client id"
                    hint="Will be used when store is in sandbox mode"
                  />
                </Box>
                </GridItem>
                <GridItem col={6} s={12}>
                <Box marginTop="1rem">
                  <TextInput
                    name="sandbox_paypal_client_secret"
                    type="password"
                    value={data.sandbox_paypal_client_secret}
                    onChange={handleInputChange}
                    fullWidth
                    label="Sandbox paypal client secret"
                    hint="Will be used when store is in sandbox mode"
                  />
                </Box>
                </GridItem>
                </>)}
              </Grid>
              <Button onClick={() => savePaypalSettings(data)} variant="secondary">
                  Save
                </Button>
            </Box>
          </ContentLayout>
        </Layout>
        {paypalSelected  && <Currency/>}
        </>
  );
};

export default Payment;
