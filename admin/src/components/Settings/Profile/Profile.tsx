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
import {Information} from "@strapi/icons";
import React, {ChangeEvent, useEffect, useState} from "react";
import countriesData from "../../../data/countries.json";
import profileRequests from "../../../api/profile";
import {LoadingIndicatorPage} from "@strapi/helper-plugin";
import {IProfile} from "../../../../../types/profile";


const cOptions = countriesData.map((country) => ({
  value: country.code,
  label: country.name,
  key: country.code,
}));

const Profile = () => {
  const initialData: IProfile = {
    id: 1,
    name: "Your Store Namex",
    phone: "123-456-7890",
    email: "store@example.com",
    region: "",
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IProfile>(initialData);
  const [options, setOptions] = useState<{ value: string; label: string; key: string }[]>(cOptions);
  const [value, setValue] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const profile: any = await profileRequests.getAllProfiles();
      setIsNew(false);
      setData(profile);
      setValue(profile.region);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSingleSelectChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue !== undefined) {
      const fakeEvent = {
        target: { name: "region", value: newValue },
      } as ChangeEvent<HTMLInputElement>;
      handleInputChange(fakeEvent);
    }
  };

  const saveProfile = async (data: IProfile) => {
    try {
      if (!isNew) {
        const zez = await profileRequests.editProfile(data.id, data);
      } else {
        await profileRequests.addProfile(data);
      }

      await fetchData();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (isLoading) return <LoadingIndicatorPage />;

  return (
    <Layout>
      <ContentLayout>
        <Box padding="2rem">
          <Typography variant="title">Profile</Typography>

          <Grid gap={5}>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <TextInput
                  name="name"
                  value={data.name}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Store Name"
                  label="Store Name"
                  hint="Appears on your website"
                />
              </Box>
            </GridItem>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <TextInput
                  name="phone"
                  value={data.phone}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Store Phone"
                  label="Store Phone"
                  hint="Appears on your website"
                />
              </Box>
            </GridItem>
          </Grid>
          <Box marginTop="1rem">
            <TextInput name="email" aria-label="storeEmail" value={data.email} onChange={handleInputChange} fullWidth placeholder="Store Email" />
          </Box>

          <Box marginTop="1rem">
            <SingleSelect
              label="Domestic region"
              placeholder="Select a home country/region"
              hint="Will be used as a domestic country for shipping zone"
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
            </SingleSelect>
            ;
          </Box>
          <Button onClick={() => saveProfile(data)} variant="secondary">
            Save
          </Button>
        </Box>
      </ContentLayout>
    </Layout>
  );
};

export default Profile;
