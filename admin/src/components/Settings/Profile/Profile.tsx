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
import { Alert } from '@strapi/design-system';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const profile: any = await profileRequests.getAllProfiles();
      if(profile !== undefined) {
        setIsNew(false);
        setData(profile);
        setValue(profile.region);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Phone should start with '+' and have at least 4 digits (possible change)
    const phoneRegex = /^\+\d{4,}$/;
    return phoneRegex.test(phone);
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    // Clear validation error when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
    setNoSubmit(false);
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
      const newErrors: Record<string, string> = {};
      if (!data.name) {
        newErrors.name = "Legal business name is required";
      }
      if (!data.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(data.phone)) {
        newErrors.phone = "Phone number should start with '+'";
      }
      if (!data.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(data.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!data.region) {
        newErrors.region = "Region code is required";
      }

      setErrors(newErrors);

      // Check if there are any errors before saving
      if (Object.keys(newErrors).length > 0) {
        setNoSubmit(true);
      }
      if (!isNew) {
        await profileRequests.editProfile(data.id, data);
      } else {
        const profile = await profileRequests.addProfile(data);
        console.log("profile", profile)
        setIsNew(false)
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
        {nosubmit &&<Alert closeLabel="Close" onClose={() => setNoSubmit(false)} title="Error" variant="danger">
          Fill all required fields.
        </Alert>}
        <Box padding="3rem">
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
                  required
                />
                {errors.name && <Typography textColor="danger600">{errors.name}</Typography>}
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
                />
                {errors.phone && <Typography textColor="danger600">{errors.phone}</Typography>}
              </Box>
            </GridItem>
          </Grid>
          <Box marginTop="1rem">
            <TextInput name="email" aria-label="storeEmail" value={data.email} onChange={handleInputChange} fullWidth placeholder="Store Email" />
            {errors.email && <Typography textColor="danger600">{errors.email}</Typography>}
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
              required
            >
              {options.map((option) => (
                <SingleSelectOption key={option.key} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            {errors.region && <Typography textColor="danger600">{errors.region}</Typography>}
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
