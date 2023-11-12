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
      // setData(paypalS);

      const d = {
        id: paypalS.id,
        live_paypal_client_id: '',
        live_paypal_client_secret: '',
        sandbox_paypal_client_id: '',
        sandbox_paypal_client_secret: '',
        live: paypalS.live

      }
      setData(d);

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

  const savePaypalLiveSettings = async (data: IPaypalSetup) => {
    // const updatedData = { ...data, live_paypal_client_id: encryptData(data.live_paypal_client_id), live_paypal_client_secret: encryptData(data.live_paypal_client_secret) };
    const updatedData = { ...data, live_paypal_client_id: data.live_paypal_client_id, live_paypal_client_secret: data.live_paypal_client_secret};

    const d = {
      // live_paypal_client_id: updatedData.live_paypal_client_id ? encryptData(updatedData.live_paypal_client_id) : undefined,
      live_paypal_client_id: updatedData.live_paypal_client_id ? updatedData.live_paypal_client_id : undefined,
      // live_paypal_client_secret: updatedData.live_paypal_client_secret ? encryptData(updatedData.live_paypal_client_secret) : undefined,
      live_paypal_client_secret: updatedData.live_paypal_client_secret ? updatedData.live_paypal_client_secret : undefined,
      live: selected !== "sandbox"
    };

    Object.keys(d).forEach(key => d[key] === undefined && delete d[key]);

    if(!isNew)
    {
      await paypalSetupRequests.editPaypalSetup(data.id, d);
    }
    else
    {
      await paypalSetupRequests.addPaypalSetup(d);
    }

    fetchData();
  };

  const savePaypalSandboxSettings = async (data: IPaypalSetup) => {

    console.log(isNew);
    const d = {
      // sandbox_paypal_client_id: data.sandbox_paypal_client_id ? encryptData(data.sandbox_paypal_client_id) : undefined,
      sandbox_paypal_client_id: data.sandbox_paypal_client_id ? data.sandbox_paypal_client_id : undefined,

      // sandbox_paypal_client_secret: data.sandbox_paypal_client_secret ? encryptData(data.sandbox_paypal_client_secret) : undefined,
      sandbox_paypal_client_secret: data.sandbox_paypal_client_secret ? data.sandbox_paypal_client_secret : undefined,
      live: selected !== "sandbox"
    }
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

            <Box marginTop="1rem" style={{paddingLeft: "28px"}}>
                <Typography style={{paddingRight: "10px"}}>Currently we support only paypal</Typography>

              <RadioGroup labelledBy="trophy-champions" onChange={e => setSelected(e.target.value)} value={selected} name="meal">
                <Radio value="sandbox">Sandbox</Radio>
                <Radio value="live">Live</Radio>
              </RadioGroup>

                <Box marginTop="1rem">
                  <TextInput
                    name="live_paypal_client_id"
                    type="password"
                    value={data.live_paypal_client_id}
                    onChange={handleInputChange}
                    fullWidth
                    label="live_paypal_client_id"
                    hint="Will be used when store goes live"
                  />
                </Box>
                <Box marginTop="1rem">
                  <TextInput
                    name="live_paypal_client_secret"
                    type="password"
                    value={data.live_paypal_client_secret}
                    onChange={handleInputChange}
                    fullWidth
                    label="live_paypal_client_secret"
                    hint="Will be used when store goes live"
                  />
                </Box>
              <Button onClick={() => savePaypalLiveSettings(data)} variant="secondary">
                Save
              </Button>
                <Box marginTop="1rem">
                  <TextInput
                    name="sandbox_paypal_client_id"
                    type="password"
                    value={data.sandbox_paypal_client_id}
                    onChange={handleInputChange}
                    fullWidth
                    label="sandbox_paypal_client_id"
                    hint="Will be used when store is in sandbox mode"
                  />
                </Box>
                <Box marginTop="1rem">
                  <TextInput
                    name="sandbox_paypal_client_secret"
                    type="password"
                    value={data.sandbox_paypal_client_secret}
                    onChange={handleInputChange}
                    fullWidth
                    label="sandbox_paypal_client_secret"
                    hint="Will be used when store is in sandbox mode"
                  />
                </Box>
                <Button onClick={() => savePaypalSandboxSettings(data)} variant="secondary">
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
