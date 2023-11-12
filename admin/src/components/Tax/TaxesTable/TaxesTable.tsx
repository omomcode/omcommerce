import {
  Table,
  Thead,
  TFooter,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
  Flex,
  Typography,
  IconButton,
  VisuallyHidden,

} from "@strapi/design-system";

import {Plus,Pencil,Trash} from "@strapi/icons";
import {ITaxesTableProps} from "../../../../../types/taxes";

export default function TaxesTable ({
                                             taxesData,
                                             deleteTax,
                                             editTax,
                                             setShowTaxesModal,
                                           }: ITaxesTableProps) {

  const handleAddTax = () => {

    // console.log(selectedPackage);
    // setSelectedPackage(selectedPackage);
    setShowTaxesModal(true)
  }

  return (
    <Box
      background="neutral0"
      hasRadius={true}
      shadow="filterShadow"
      padding={8}
      style={{marginTop: "10px"}}
    >
      <Table
        colCount={4}
        rowCount={10}
        footer={
          <TFooter onClick={() => handleAddTax()} icon={<Plus/>}>
            Add tax
          </TFooter>
        }
      >
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Tax name</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Country Code</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">State Code</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Rate</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Shipping</Typography>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {taxesData.map((tax) => {

            return (

              <Tr key={tax.id}>

                <Td>
                  <Typography textColor="neutral800">{tax.name}</Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">{tax.country_code}</Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">{tax.state_code}</Typography>
                </Td>



                <Td>
                  <Typography textColor="neutral800">{tax.rate}%</Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">{tax.shipping? "Applied" : "Not applied"}</Typography>
                </Td>


                <Td>
                  <Flex style={{justifyContent: "end"}}>
                    <IconButton
                      onClick={() => editTax(tax.id, tax)}
                      label="Edit"
                      noBorder
                      icon={<Pencil/>}
                    />

                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => deleteTax(tax.id)}
                        label="Delete"
                        noBorder
                        icon={<Trash/>}
                      />
                    </Box>
                  </Flex>
                </Td>
              </Tr>
            )
          })
          }
        </Tbody>
      </Table>

    </Box>
  );
}

