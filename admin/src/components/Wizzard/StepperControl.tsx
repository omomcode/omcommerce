import React from "react";
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

interface StepperControlProps {
  handleClick: (action?: string) => void;
  currentStep: number;
  steps: string[];
}

const StepperControl: React.FC<StepperControlProps> = ({ handleClick, currentStep, steps }) => {


  return (
     <Layout>
      <ContentLayout>
        {/*<div style={{ marginTop: "4px", marginBottom: "8px", display: "flex", justifyContent: "space-around" }}>*/}
        <Flex justifyContent={"space-between"}>
          <Box >
            <Button
              onClick={() => handleClick()}
              disabled={currentStep === 1}
              style={{
                cursor: currentStep === 1 ? "not-allowed" : "pointer",
                opacity: currentStep === 1 ? 0.5 : 1,
              }}
            >
              Back
            </Button>
          </Box>
          <Box>
            <Button
              onClick={() => handleClick("next")}
            >
              {currentStep === steps.length - 1 ? "Confirm" : "Next"}
            </Button>
          </Box>
        </Flex>
      </ContentLayout>
     </Layout>
  );
};

export default StepperControl;
