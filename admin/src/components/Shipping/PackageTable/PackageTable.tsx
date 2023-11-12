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
import {IPackage, IPackageTableProps} from "../../../../../types/package";

export default function ShippingZoneTable({
                                            packageData,
                                            deletePackage,
                                            editPackage,
                                            setShowPackageModal,
                                          }: IPackageTableProps) {
  const handleAddPackage = () => {
    setShowPackageModal(true);
  };

  const renderDimensions = (packageD: IPackage) => {
    if (packageD.type && packageD.type === 'Envelope') {
      return (
        <Typography textColor="neutral800">
          {packageD.length} x {packageD.width} cm, {packageD.weight} kg
        </Typography>
      );
    } else {
      return (
        <Typography textColor="neutral800">
          {packageD.length} x {packageD.width} x {packageD.height} cm, {packageD.weight} kg
        </Typography>
      );
    }
  };

  return (
    <Box background="neutral0" hasRadius={true} shadow="filterShadow" padding={8} style={{ marginTop: "10px" }}>
      <Table colCount={4} rowCount={10} footer={<TFooter onClick={handleAddPackage} icon={<Plus />}>Add package</TFooter>}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Package name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Type</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Dimensions</Typography>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {packageData.map((packageD) => (
            <Tr key={packageD.id}>
              <Td>
                <Typography textColor="neutral800">
                  {packageD.name} {packageD.default ? "(Default)" : ""}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">{packageD.type}</Typography>
              </Td>
              <Td>{renderDimensions(packageD)}</Td>
              <Td>
                <Flex style={{ justifyContent: "end" }}>
                  <IconButton onClick={() => editPackage(packageD.id, packageD)} label="Edit" noBorder icon={<Pencil />} />
                  <Box paddingLeft={1}>
                    <IconButton onClick={() => deletePackage(packageD.id)} label="Delete" noBorder icon={<Trash />} />
                  </Box>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
