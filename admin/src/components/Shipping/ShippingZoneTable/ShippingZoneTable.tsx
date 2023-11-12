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
import {IShippingZoneTableProps} from "../../../../../types/zonetable";

export default function ShippingZoneTable ({ shippingRatesData,
                             deleteShippingRate,
                             editShippingRate,
                             setShowModal,
                             selectedZone,
                             setSelectedZone,
                            }: IShippingZoneTableProps) {


  const handleAddRateClick = () => {
    setSelectedZone(selectedZone);
    setShowModal(true)
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
          <TFooter onClick={() => handleAddRateClick()} icon={<Plus/>}>
            Add rate
          </TFooter>
        }
      >
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Rate name</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Condition</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Price</Typography>
            </Th>

            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {shippingRatesData.map((rate) => {
            return (

              <Tr key={rate.id}>

                <Td>
                  <Typography textColor="neutral800">{rate.name}</Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">{rate.condition}</Typography>
                </Td>

                <Td>
                  <Typography textColor="neutral800">
                    {rate.price === 0 ? 'Free' : rate.price}
                  </Typography>
                </Td>

                <Td>
                  <Flex style={{justifyContent: "end"}}>
                    <IconButton
                      onClick={() => editShippingRate(rate.id, rate)}
                      label="Edit"
                      noBorder
                      icon={<Pencil/>}
                    />

                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={() => deleteShippingRate(rate.id)}
                        label="Delete"
                        noBorder
                        icon={<Trash/>}
                      />
                    </Box>
                  </Flex>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>

    </Box>
  );
}

