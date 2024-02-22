import {
  Layout,
  BaseHeaderLayout,
  ContentLayout,
  Box,
  Typography,
  TextInput,
  Grid,
  GridItem,
  Button,
  SingleSelect, SingleSelectOption, RadioGroup, Radio,
} from "@strapi/design-system";
import React, {ChangeEvent, useEffect, useState} from "react";
import {LoadingIndicatorPage} from "@strapi/helper-plugin";
import {IGmail} from "../../../../../../../../types/gmail";
import gmailRequests from "../../../api/gmail";
import { Alert } from '@strapi/design-system';


const Gmail = () => {

  const initialData: IGmail = {
    id: 1,
    client_id: "",
    client_secret: "",
    refresh_token: "",
    from: "",
    languageRadio: "English"
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IGmail>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect( () => {
    fetchData();
  }, []);



  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("name and value", name + " " + value)
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
    if (!isLoading) setIsLoading(true);

    try {
      const gmail: any = await gmailRequests.getAllGmail();

      if(gmail !== undefined) {
        setIsNew(false);
        setData(gmail);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGmail = async (data: IGmail) => {
    // Validate if all required fields are filled
    const newErrors: Record<string, string> = {};
    if (!data.client_id) {
      newErrors.client_id = "CLIENT_ID is required";
    }
    if (!data.client_secret) {
      newErrors.client_secret = "CLIENT_SECRET is required";
    }
    if (!data.refresh_token) {
      newErrors.refresh_token = "REFRESH_TOKEN is required";
    }
    if (!data.from) {
      newErrors.from = "EMAIL is required";
    } else if (!emailRegex.test(data.from)) {
      newErrors.from = "Enter a valid email address";
    }
    if (!data.languageRadio) {
      newErrors.languageRadio = "Choose language first!"
    }

    setErrors(newErrors);

    // Check if there are any errors before saving
    if (Object.keys(newErrors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }
    if(!isNew) {
      setNoSubmit(false);
      await gmailRequests.editGmail(data.id, data);
    }
    else {
      setNoSubmit(false);
      await gmailRequests.addGmail(data);
      setIsNew(false)
    }
    await fetchData();
  }

  if (isLoading) return <LoadingIndicatorPage />;



  return (
    <Layout>
      <ContentLayout>
        {nosubmit &&<Alert closeLabel="Close" onClose={() => setNoSubmit(false)} title="Error" variant="danger">
          Fill all required fields.
        </Alert>}
        <Box padding="3rem" background="neutral0" borderRadius="4px" style={{ boxShadow: "rgba(3, 3, 5, 0.35) 1px 1px 10px" }}>
          <Typography variant="beta">Gmail</Typography>
          <Grid gap={5} marginBottom="2rem">
            <GridItem padding={1} col={8}>
              <Box marginTop="1rem">
              <RadioGroup
                labelledBy="return-window"
                onChange={handleInputChange}
                value={data.languageRadio}
                name="languageRadio"
              >
                <Radio value="English">English</Radio>
                <Radio value="Serbian">Serbian</Radio>
              </RadioGroup>
              </Box>
            </GridItem>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <TextInput
                  name="client_id"
                  value={data.client_id}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="CLIENT_ID"
                  label="CLIENT_ID"
                  hint="Client id from google console"
                  type="password"
                  required
                />
                {errors.client_id && (
                  <Typography textColor="danger600">
                    {errors.client_id}
                  </Typography>
                )}
              </Box>
            </GridItem>

            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <TextInput
                  name="client_secret"
                  value={data.client_secret}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="CLIENT_SECRET"
                  label="CLIENT_SECRET"
                  hint="Client secret from google console"
                  type="password"
                  required
                />
                {errors.client_secret && (
                  <Typography textColor="danger600">
                    {errors.client_secret}
                  </Typography>
                )}
              </Box>
            </GridItem>

          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="refresh_token"
                value={data.refresh_token}
                onChange={handleInputChange}
                fullWidth
                placeholder="REFRESH_TOKEN"
                label="REFRESH_TOKEN"
                hint="Refresh token from google console"
                type="password"
                required
              />
              {errors.refresh_token && (
                <Typography textColor="danger600">
                  {errors.refresh_token}
                </Typography>
              )}
            </Box>
          </GridItem>
          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="from"
                value={data.from}
                onChange={handleInputChange}
                fullWidth
                placeholder="Email"
                label="EMAIL"
                hint="Email you want to send your purchase details from"
                required
              />
              {errors.from && (
                <Typography textColor="danger600">{errors.from}</Typography>
              )}
            </Box>
          </GridItem>
          </Grid>
          <Button size="L" onClick={() => saveGmail(data)} variant="secondary">
            Save
          </Button>
        </Box>
      </ContentLayout>
    </Layout>
  )
}

export default Gmail;
