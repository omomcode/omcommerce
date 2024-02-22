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
import {LoadingIndicatorPage} from "@strapi/helper-plugin";
// import {decryptData, encryptData} from "../../../../../server/utils/payment/paypalPaymentSettings";

const Payment = () => {

  const initialData: IPaypalSetup = {
    id: 1,
    live_paypal_client_id: '',
    live_paypal_client_secret: '',
    sandbox_paypal_client_id: '',
    sandbox_paypal_client_secret: '',
    live: false
  };

  const [data, setData] = useState<IPaypalSetup>(initialData);
  const [isNew, setIsNew] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("sandbox");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    try {
      const paypalS: any = await paypalSetupRequests.getAllPaypalSetups();
      setIsNew(false);
      setData(paypalS);
      console.log("paypalS", paypalS)

      // const d = {
      //   id: paypalS.id,
      //   live_paypal_client_id: '',
      //   live_paypal_client_secret: '',
      //   sandbox_paypal_client_id: '',
      //   sandbox_paypal_client_secret: '',
      //   live: paypalS.live
      //
      // }
      // setData(d);

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

  // const savePaypalLiveSettings = async (data: IPaypalSetup) => {
  //   // const updatedData = { ...data, live_paypal_client_id: encryptData(data.live_paypal_client_id), live_paypal_client_secret: encryptData(data.live_paypal_client_secret) };
  //   const updatedData = { ...data, live_paypal_client_id: data.live_paypal_client_id, live_paypal_client_secret: data.live_paypal_client_secret};
  //
  //   const d = {
  //     // live_paypal_client_id: updatedData.live_paypal_client_id ? encryptData(updatedData.live_paypal_client_id) : undefined,
  //     live_paypal_client_id: updatedData.live_paypal_client_id ? updatedData.live_paypal_client_id : undefined,
  //     // live_paypal_client_secret: updatedData.live_paypal_client_secret ? encryptData(updatedData.live_paypal_client_secret) : undefined,
  //     live_paypal_client_secret: updatedData.live_paypal_client_secret ? updatedData.live_paypal_client_secret : undefined,
  //     live: selected !== "sandbox"
  //   };
  //
  //   // @ts-ignore
  //   Object.keys(d).forEach(key => d[key] === undefined && delete d[key]);
  //
  //   if(!isNew)
  //   {
  //     await paypalSetupRequests.editPaypalSetup(data.id, d);
  //   }
  //   else
  //   {
  //     await paypalSetupRequests.addPaypalSetup(d);
  //   }
  //
  //   fetchData();
  // };

  const savePaypalSettings = async (data: IPaypalSetup) => {

    const d = {
      // sandbox_paypal_client_id: data.sandbox_paypal_client_id ? encryptData(data.sandbox_paypal_client_id) : undefined,
      sandbox_paypal_client_id: data.sandbox_paypal_client_id ? data.sandbox_paypal_client_id : undefined,

      // sandbox_paypal_client_secret: data.sandbox_paypal_client_secret ? encryptData(data.sandbox_paypal_client_secret) : undefined,
      sandbox_paypal_client_secret: data.sandbox_paypal_client_secret ? data.sandbox_paypal_client_secret : undefined,
      live_paypal_client_id: data.live_paypal_client_id ? data.live_paypal_client_id : undefined,
      // live_paypal_client_secret: updatedData.live_paypal_client_secret ? encryptData(updatedData.live_paypal_client_secret) : undefined,
      live_paypal_client_secret: data.live_paypal_client_secret ? data.live_paypal_client_secret : undefined,
      live: selected !== "sandbox"
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


  // if (isLoading) return <LoadingIndicatorPage />;

  return (
    <Layout>
      <>
        <Layout>
          <ContentLayout >

            <Box padding="3rem" marginTop="3rem" background="neutral0" borderRadius="4px" style={{ boxShadow: "rgba(3, 3, 5, 0.35) 1px 1px 10px" }}>
                <Typography variant="beta">Currently we only support paypal</Typography>
              <Grid gap={5} marginBottom="2rem">
                <GridItem padding={1} col={8}>
                  <Box marginTop="1rem">
              <RadioGroup labelledBy="trophy-champions" onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSelected(e.target.value)} value={selected} name="meal">
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
              </Grid>
              <Button onClick={() => savePaypalSettings(data)} variant="secondary">
                  Save
                </Button>
            </Box>
          </ContentLayout>
        </Layout>
        </>
    </Layout>
  );
};

export default Payment;
