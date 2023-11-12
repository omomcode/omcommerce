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
  SingleSelect, SingleSelectOption
} from "@strapi/design-system";
import React, {ChangeEvent, useEffect, useState} from "react";
import {LoadingIndicatorPage} from "@strapi/helper-plugin";
import {IGmail} from "../../../../../../../../types/gmail";
import gmailRequests from "../../../api/gmail";


const Gmail = () => {

  const initialData: IGmail = {
    id: 1,
    client_id: "",
    client_secret: "",
    refresh_token: "",
    from: ""
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IGmail>(initialData);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    try {
      const gmail: any = await gmailRequests.getAllGmail();
      setIsNew(false);
      if(gmail !== undefined) {
        setData(gmail);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect( () => {
    fetchData();
  }, []);



  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const saveGmail = async (data: IGmail) => {

    if(!isNew) {
      const zez: any = await gmailRequests.editGmail(data.id, data);
    }
    else
      await gmailRequests.addGmail(data);

    await fetchData();
  }

  if (isLoading) return <LoadingIndicatorPage />;



  return (
    <Layout>
      <ContentLayout>

        <Box padding="2rem">
          <Typography variant="title">Gmail</Typography>

          <Grid gap={5}>
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
                />
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
                />
              </Box>
            </GridItem>
          </Grid>
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
              />
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
              />
            </Box>
          </GridItem>
          <Button onClick={() => saveGmail(data)} variant="secondary">
            Save
          </Button>
        </Box>
      </ContentLayout>
    </Layout>
  )
}

export default Gmail;
