import React, {useState} from "react";
import {Box, Checkbox, ContentLayout, Flex, Layout, Typography} from "@strapi/design-system";
import ShippingZones from "../../Shipping/ShippingZones/ShippingZones";
import Taxes from "../../Tax/Taxes/Taxes";

const TaxStep = () => {
  const [taxStatus, setTaxStatus] = useState(false);
  const handleDefaultCheckboxChange = (value: boolean) => {
    setTaxStatus(value);
  };
  return (
    <Layout>
      <>

        <Layout>
          <ContentLayout>

            <Box marginTop="1rem" style={{paddingLeft: "28px"}}>
              <Flex paddingleft="112px">

                <Typography style={{paddingRight: "10px"}}>Do you need to include taxes?</Typography>
                <Checkbox
                  id="shipping-status"
                  name="shipping-status"
                  onValueChange={handleDefaultCheckboxChange}
                  value={taxStatus}
                >
                </Checkbox>
              </Flex>
            </Box>
          </ContentLayout>
        </Layout>

        {taxStatus &&
          <Box>
            <Taxes/>
          </Box>
        }
      </>
    </Layout>
  );
}


export default TaxStep;
