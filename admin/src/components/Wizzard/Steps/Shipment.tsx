import {
  Box,
  Button,
  ContentLayout,
  Grid,
  GridItem,
  IconButton,
  Layout,
  Typography,
  Flex, Checkbox,
} from '@strapi/design-system';
import Shipping from "../../../pages/Shipping";
import React, {useState} from "react";
import ShippingZones from "../../Shipping/ShippingZones/ShippingZones";
const Shipment = () => {
  const [shippingStatus, setShippingStatus] = useState(false);
  const handleDefaultCheckboxChange = (value: boolean) => {
    setShippingStatus(value);
  };

  return (
    <Layout>
      <>
        <Layout>
          <ContentLayout >

            <Box marginTop="1rem" style={{paddingLeft: "28px"}}>
              <Flex paddingleft="112px">

                <Typography style={{paddingRight: "10px"}}>Do you offer shipping?</Typography>
                <Checkbox
                  id="shipping-status"
                  name="shipping-status"
                  onValueChange={handleDefaultCheckboxChange}
                  value={shippingStatus}
                >
                </Checkbox>
              </Flex>
            </Box>
          </ContentLayout>
        </Layout>

        {shippingStatus &&
          <Box>
            <ShippingZones/>
          </Box>
        }
      </>
    </Layout>
  );
}

export default Shipment;



