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

import TaxesTable from "../TaxesTable/TaxesTable";
import React, {ChangeEvent, useEffect, useState} from "react";
import {ITaxes} from "../../../../../types/taxes";
import TaxesModal from "../TaxesModal/TaxesModal";
import taxRequests from "../../../api/tax";

const Taxes = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [taxesData,setTaxesData] = useState<ITaxes[]>([]);
  const [selectedTax,setSelectedTax] = useState<ITaxes>();
  const [showTaxesModal,setShowTaxesModal] = useState(false);
  const [mode,setMode] = useState("Add");

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    try {

      const taxes : any = await taxRequests.getAllTaxes();
      setTaxesData(taxes);

    } catch (error) {
      console.error('Error fetching taxes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTax = async (id: number) => {
    await taxRequests.deleteTax(id);
    await fetchData();
  }
  const editTax = (id: number,data: any) =>{
    setSelectedTax(data);
    setMode("Edit");
    setShowTaxesModal(true);
  }

  const addTax = async (data: ITaxes) => {
    if (mode === 'Add') {
      const formattedTaxData = {
        name: data.name,
        country_code: data.country_code.toUpperCase(),
        state_code: data.state_code,
        rate: data.rate,
        shipping: data.shipping ?? true,
      };
      await taxRequests.addTax(formattedTaxData);
    } else if (mode === 'Edit') {
      const formattedTaxData = {
        name: data.name,
        country_code: data.country_code.toUpperCase(),
        state_code: data.state_code,
        rate: data.rate,
        shipping: data.shipping ?? true,
      };
      await taxRequests.editTax(data.id, formattedTaxData);
    }
    setShowTaxesModal(false);
    await fetchData();
  };


  return(<>
    <Layout>
      <ContentLayout>
        <Box padding="2rem">
          <Typography variant="alpha">Taxes</Typography>
          <Box>
            <Typography variant="omega">Create a shipping zone first then find the region in this to manage its tax settings</Typography>
          </Box>
        <TaxesTable taxesData={taxesData} deleteTax={deleteTax} editTax={editTax} setShowTaxesModal={setShowTaxesModal} />
        </Box>
      </ContentLayout>
    </Layout>
    {showTaxesModal && <TaxesModal setShowTaxesModal={setShowTaxesModal} addTax={addTax} taxId={undefined} taxData={selectedTax} mode={mode}></TaxesModal>}

  </>)
}
export default Taxes
