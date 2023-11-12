import {useStepperContext} from "../../../contexts/StepperContext";

import {
  Box,
  Button,
  ContentLayout,
  Grid,
  GridItem,
  IconButton,
  Layout,
  Typography,
  Flex,
} from '@strapi/design-system';
import Profile from "../../Settings/Profile/Profile";
import Currency from "../../Settings/Currency/Currency";
import Timezone from "../../Settings/Timezone/Timezone";

export const General = () => {
  const {userData, setUserData} = useStepperContext();
  const handleChange = (e) => {
    const {name, value} = e.target;
    // @ts-ignore
    setUserData({...userData, [name]: value});
  };
  return (
    <Layout>
      <Profile/>
      <Currency/>
      <Timezone/>
    </Layout>
  )
}
