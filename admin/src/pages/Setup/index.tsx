import {
  Box,
  Button,
  ContentLayout,
  Layout,
  Flex, RadioGroup, Radio,  Typography,
} from '@strapi/design-system';


import {General} from "../../components/Wizzard/Steps/General";
import Payment from "../../components/Wizzard/Steps/Payment";
import {Final} from "../../components/Wizzard/Steps/Final";
import React, {useEffect, useState} from "react";
import Stepper from "../../components/Wizzard/Stepper";
import {UseContextProvider} from "../../contexts/StepperContext";
import StepperControl from "../../components/Wizzard/StepperControl";
import Shipment from "../../components/Wizzard/Steps/Shipment";
import TaxStep from "../../components/Wizzard/Steps/TaxStep";
;
import setupRequests from "../../api/setup";
import {ISetup} from "../../../../types/setup";
import {LoadingIndicatorPage} from "@strapi/helper-plugin";
import Home from "../Home";
import shippingZoneRequests from "../../api/shippingzone";
import {findShippingZoneBasedOnCountry} from "../../utils/country-helper/country-helper";
import {IShippingZone} from "../../../../types/zonetable";
import shippingcalclulatorRequests from "../../api/shippingcalculator";


const SetupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  // const [isLoading, setIsLoading] = useState(true);
  const [setup, setSetup] = useState<ISetup | undefined>(undefined);
  const [steps, setSteps] = useState([]);
  const [selected, setSelected] = useState("pGood");
  const [showHome, setShowHome] = useState(false);
  const [st, setSt] = useState(0);
  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {

    try {

      const s : any = await setupRequests.getAllSetups();
      setSetup(s);
      setShowHome(!s.wizard_open);
      setCurrentStep(s.wizard_state);

      if(s.product_type === 1)
      {
        // @ts-ignore
        setSteps(stepsPsychical)
        setSt(1);
      }
      else if (s.product_type === 2)
      {
        // @ts-ignore
        setSteps(stepsTechnical)
        setSt(2);
      }
      // setIsLoading(false);
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {

    }
  };

  const stepsPsychical = [
    "General",
    "Payment",
    "Shipping",
    "Tax",
    "Final"
  ];

  const stepsTechnical = [
    "General",
    "Payment",
    "Final"
  ];

  const displayStepPsychical = (step: number) => {
    switch (step) {
      case 1:
        return <General/>;
      case 2:
        return <Payment handleSetSteps={handleSetSteps} st={st} steps={steps}/>
      case 3:
        return <Shipment/>;
      case 4:
        return <TaxStep/>;
      case 5:
        return <Final/>;
      default:
        return null;
    }
  };

  const displayStepDigital = (step: number) => {
    switch (step) {
      case 1:
        return <General/>;
      case 2:
        let st = 0;
        if(steps)
        return <Payment handleSetSteps={handleSetSteps} st={st} steps={steps}/>;
      case 3:
        return <Final/>;
      default:
        return null;
    }
  };

  const initializeSetup = async () => {
    await fetchData();
  }

  const handleClick = (direction?: string) => {
    if (direction === "next" && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);

      // @ts-ignore
      setupRequests.editSetup(setup.id,
        {
          wizard_state: currentStep+1,
        });

      if(currentStep === steps.length-1)
      {
        // @ts-ignore
        setupRequests.editSetup(setup.id,
          {
            wizard_open: false
          });


      }

    } else if (direction !== "next" && currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // @ts-ignore
      setupRequests.editSetup(setup.id,
        {
          wizard_state: currentStep-1,
        });
    }


  };

  // if (isLoading) return <LoadingIndicatorPage />;
  if (showHome) return <Home />;

  const setSetupState = (number: number) => {

    // @ts-ignore
    setupRequests.editSetup(setup.id,
      {
        wizard_option: 1,
        product_type: (selected === "pGood"? 1 : 2 )
      });
    fetchData();
  }

  const handleSetSteps = (steps: any) => {
    setSteps(steps);
  }

  return (
    <>
      { !setup  ? (
        <Layout>
          <ContentLayout justifyContent="center" textAlign="center">
            <Box padding="1rem">
              <Flex>
                <Typography> Initialize setup </Typography>
                <Button onClick={() => initializeSetup()} variant="tertiary">
                  Initialize
                </Button>
              </Flex>
            </Box>
          </ContentLayout>
        </Layout>
      ) : (
        setup.wizard_option === 0 ? (
            <Layout>
              <ContentLayout justifyContent="center" textAlign="center">
                <Flex padding="1rem" direction="column">
                  <Typography>What are you selling?</Typography>
                  <Box margin="1rem" justifyContent="center" textAlign="center">
                    <RadioGroup labelledBy="trophy-champions" onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSelected(e.target.value)} value={selected} name="goods">
                      <Radio marginBottom="1rem" marginTop="1rem" value="pGood">Psychical goods (This will include Taxes and Shipping if you choose Paypal)  </Radio>
                      <Radio marginBottom="1rem" marginTop="1rem" value="dGood">Digital goods</Radio>
                    </RadioGroup>

                    <Button marginTop="1rem" onClick={() => setSetupState(1)} variant="tertiary">
                      Continue
                    </Button>
                  </Box>
                </Flex>
              </ContentLayout>
            </Layout>

          ) : (
            <Layout>
              <ContentLayout>
                <Flex padding="1rem" direction="column">
                  <Stepper steps={steps} currentStep={currentStep}/>
                  <Box padding="1rem" style={{width: "100%", paddingLeft: 0, paddingRight: 0}}>
                    <UseContextProvider>
                      {setup?.product_type===1? displayStepPsychical(currentStep) : displayStepDigital(currentStep)}
                    </UseContextProvider>
                  </Box>
                </Flex>

                {currentStep !== steps.length && (
                  <Layout>
                    <ContentLayout style={{paddingLeft:"48px"}}>
                      <StepperControl
                        handleClick={handleClick}
                        currentStep={currentStep}
                        steps={steps}
                      />
                    </ContentLayout>
                  </Layout>
                )}

              </ContentLayout>
            </Layout>
          )
      )};



    </>
  );
};

export default SetupPage;
