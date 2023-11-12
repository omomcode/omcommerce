import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
  Typography,
  Checkbox,
} from "@strapi/design-system";
import {ICountriesProps, ICountry} from "../../../../../types/country";

export default function Countries({

                                    assignedCountries = [],
                                    nonAssignedCountries = [],
                                    getSelectedCountries
                                  } : ICountriesProps) {
  const [checkedCountries, setCheckedCountries] = useState<ICountry[]>([]);

  useEffect(() => {
    if (assignedCountries) {
      setCheckedCountries(assignedCountries);
    }
  }, [assignedCountries]);

  const toggleCheckbox = (country: ICountry) => {
    // Toggle the checkbox for the selected country
    let updatedCheckedCountries: ICountry[];

    if (checkedCountries.some((c) => c.code === country.code)) {
      updatedCheckedCountries = checkedCountries.filter((c) => c.code !== country.code);
    } else {
      updatedCheckedCountries = [...checkedCountries, country];
    }

    setCheckedCountries((prevCheckedCountries) => {
      // @ts-ignore
      getSelectedCountries(updatedCheckedCountries);
      return updatedCheckedCountries;
    });

  };


  return (
    <Box
      background="neutral0"
      hasRadius={true}
      shadow="filterShadow"
      padding={8}
      style={{ marginTop: "10px" }}
    >
      <Table colCount={4} rowCount={10}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Country</Typography>
            </Th>

            <Th>
              <Typography variant="sigma">Include</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {assignedCountries &&
            assignedCountries.map((country: ICountry) => (
              <Tr key={country.code}>
                <Td>
                  <Typography textColor="neutral800">{country.name}</Typography>
                </Td>

                <Td>
                  <Checkbox
                    checked={checkedCountries.some((c) => c.code === country.code)}
                    onChange={() => toggleCheckbox(country)}
                  />
                </Td>
              </Tr>
            ))}

          {nonAssignedCountries &&
            nonAssignedCountries.map((country: ICountry) => (
              <Tr key={country.code}>
                <Td>
                  <Typography textColor="neutral800">{country.name}</Typography>
                </Td>

                <Td>
                  <Checkbox
                    checked={checkedCountries.some((c) => c.code === country.code)}
                    onChange={() => toggleCheckbox(country)}
                  />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
}
