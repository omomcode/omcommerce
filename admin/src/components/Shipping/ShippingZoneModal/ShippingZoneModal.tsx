import React, { ChangeEvent, useEffect, useState } from "react";
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
} from "@strapi/design-system";
import Countries from "../Countries/Countries";
import {IShippingZoneModalProps} from "../../../../../types/zonetable";


export default function ShippingZoneModal({
                                            setShowModal,
                                            addShippingZone,
                                            editShippingZone,
                                            assignedZone,
                                            nonAssignedCountries,
                                            errors
                                          } : IShippingZoneModalProps) {
  const [selectedZone, setSelectedZone] = useState({
    name: "",
    countries: [],
  });

  useEffect(() => {
    if (assignedZone) {
      setSelectedZone((prevSelectedZone) => ({
        ...prevSelectedZone,
        name: assignedZone.name,
      }));
    }
  }, [assignedZone]);

  const handleSubmit = async (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      handleSave();
      if(!errors.name)
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSave = () => {
    if (assignedZone) {
      editShippingZone(assignedZone.id, selectedZone);
    } else {
      addShippingZone(selectedZone);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedZone((prevSelectedZone) => ({
      ...prevSelectedZone,
      [name]: value,
    }));
  };


  const getSelectedCountries = (selectedCountries : any) => {
    setSelectedZone((prevSelectedZone) => ({
      ...prevSelectedZone,
      countries: selectedCountries,
    }));
  };


  return (
      <ModalLayout
          onClose={() => setShowModal(false)}
          labelledBy="title"
          as="form"
          onSubmit={handleSubmit}
      >
        <ModalHeader>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            {assignedZone ? "Edit shipping zone" : "Add shipping zone"}
          </Typography>
        </ModalHeader>

        <ModalBody>
          <TextInput
              label="Name"
              name="name"
              value={selectedZone.name}
              onChange={handleInputChange}
          />
          {errors.name && <Typography textColor="danger600">{errors.name}</Typography>}
            <Countries
              assignedCountries={assignedZone?.countries}
              nonAssignedCountries={nonAssignedCountries}
              getSelectedCountries={getSelectedCountries}
            />

        </ModalBody>

        <ModalFooter
            startActions={
              <Button onClick={() => setShowModal(false)} variant="tertiary">
                Cancel
              </Button>
            }
            endActions={
              <Button type="submit">
                {assignedZone ? "Edit shipping zone" : "Add shipping zone"}
              </Button>
            }
        />
      </ModalLayout>
  );
}
