import {
  Box,
  Button,
  ContentLayout,
  Grid,
  GridItem,
  Layout,
  Checkbox,
  Textarea
} from '@strapi/design-system';
import React, {ChangeEvent, useEffect, useState} from "react";


import legalRequests from "../../../api/legal";
import ReturnRulesModal from "../ReturnRulesModal/ReturnRulesModal";
import {ILegal} from "../../../../../types/legal";

const initialData: ILegal = {
  id: 0,
  checked: false,
  returnWindow: "",
  returnShippingCost: "",
  restockingFee: 0,
  returnRules: "",
  returnPolicy: "",
  privacyPolicy: "",
  termsOfService: "",
  shippingPolicy: "",
  online: ""
};

const Legal = () => {
  const [isNew, setIsNew] = useState(true);
  const [id, setId] = useState(0);
  const [checked, setChecked] = useState(initialData.checked);
  const [isLoading, setIsLoading] = useState(true);
  const [legalData, setLegalData] = useState<ILegal>(initialData);
  const [modalShow, setModalShow] = useState(false);
  const [radioOne, setRadioOne] = useState();
  const [radioTwo, setRadioTwo] = useState();
  const [restockingFee, setRestockingFee] = useState(0);
  const [returnPolicy, setReturnPolicy] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsOfService, setTermsOfService] = useState("");
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [online, setOnline] = useState("");

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);


    try {
      const lr : any = await legalRequests.getAllLegals();
      if(lr !== undefined) {
        setIsNew(false);
        setLegalData(lr);
        setId(lr.id);
        setChecked(() => lr.enabled);
        setOnline(lr.online);
        setRadioOne((prevState) => lr.returnWindow)
        setRadioTwo((prevState) => lr.returnShippingCost)
        setRestockingFee((prevState) => lr.restockingFee)
        setReturnPolicy((prevState) => lr.returnPolicy)
        setPrivacyPolicy((prevState) => lr.privacyPolicy)
        setTermsOfService((prevState) => lr.termsOfService)
        setShippingPolicy((prevState) => lr.shippingPolicy)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const editLegal = async (data: any) => {
    if(!isNew)
      await legalRequests.editLegal(id, data);
    else {
      await legalRequests.addLegal(data);
      setIsNew(false);
    }
    await fetchData();
}

  const putData = async () => {
    if (!isLoading) setIsLoading(true);

    try {
      if(!isNew)
        await legalRequests.editLegal(id, {
          enabled: checked,
          returnPolicy: returnPolicy,
          privacyPolicy: privacyPolicy,
          termsOfService: termsOfService,
          shippingPolicy: shippingPolicy,
          restockingFee: restockingFee,
          returnWindow: radioOne,
          returnShippingCost: radioTwo,
          online: online
      });
      else {
        await legalRequests.addLegal({
          enabled: checked,
          returnPolicy: returnPolicy,
          privacyPolicy: privacyPolicy,
          termsOfService: termsOfService,
          shippingPolicy: shippingPolicy,
          restockingFee: restockingFee,
          returnWindow: radioOne,
          returnShippingCost: radioTwo,
          online: online
        });
        setIsNew(false);
      }
      await fetchData();

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }


  const handleCheckboxChange = () => {
    setChecked((prevState: any) => !prevState);
  }

  const handleSave = () => {
    putData().then(r => console.log(r));
  }

  const handleRulesShow = () => {
    setModalShow((prevState) => !prevState)
  }

  const handleReturnPolicyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setReturnPolicy((prevState) => value
    );
  };
  const handlePrivacyPolicyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setPrivacyPolicy((prevState) => value
    );
  };
  const handleTermsOfServiceInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setTermsOfService((prevState) => value
    );
  };
  const handleShippingPolicyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setShippingPolicy((prevState) => value
    );
  };

  const handleOnline = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setOnline((prevState) => value)
  }

  return (

    <Layout>
      <ContentLayout>
        <Box padding={10}>
          <Grid paddingTop={10}>
            <GridItem padding={1} col={8}>
              <Checkbox id="enable" onValueChange={handleCheckboxChange} value={checked}>
                Enable return rules
              </Checkbox>
            </GridItem>
            <GridItem padding={1} col={4}>
              <Button variant="default" onClick={handleSave}>Save</Button>
            </GridItem>
            {checked && !isLoading && (<><GridItem padding={1} col={12}>
            </GridItem>
              <GridItem padding={1} col={12}>
                <Button variant="default" onClick={handleRulesShow}>Return Rules</Button>
              </GridItem>
              {modalShow && <GridItem>
                <ReturnRulesModal handleRulesShow={handleRulesShow} setRadioOne={setRadioOne} setRadioTwo={setRadioTwo}
                                  setRestockingFee={setRestockingFee} radioOne={radioOne} radioTwo={radioTwo}
                                  restockingFee={restockingFee} editLegal={editLegal}/>
              </GridItem>}
              <GridItem padding={1} col={12}>
                <Textarea
                  label="Return and refund policy"
                  name="name"
                  value={returnPolicy}
                  onChange={handleReturnPolicyInputChange}
                />
              </GridItem>
              <GridItem padding={1} col={12}>
                <Textarea
                  label="Privacy Policy"
                  name="name"
                  value={privacyPolicy}
                  onChange={handlePrivacyPolicyInputChange}
                />
              </GridItem>
              <GridItem padding={1} col={12}>
                <Textarea
                  label="Terms of service"
                  name="name"
                  value={termsOfService}
                  onChange={handleTermsOfServiceInputChange}
                />
              </GridItem>
              <GridItem padding={1} col={12}>
                <Textarea
                  label="Shipping Policy"
                  name="name"
                  value={shippingPolicy}
                  onChange={handleShippingPolicyInputChange}
                />
              </GridItem>
              <GridItem padding={1} col={12}>
                <Textarea
                  label="Online Shopping Policy"
                  name="name"
                  value={online}
                  onChange={handleOnline}
                />
              </GridItem>
            </>)}
          </Grid>
        </Box>
      </ContentLayout>
    </Layout>
  )
}

export default Legal
