import React, {useEffect, useState} from 'react';
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
import ShippingZoneModal from '../ShippingZoneModal/ShippingZoneModal';
import ShippingZoneTable from '../ShippingZoneTable/ShippingZoneTable';
import {IShippingRate} from '../../../../../types/rate';
import ShippingRateModal from '../ShippingRateModal/ShippingRateModal';
import profileRequests from '../../../api/profile';
import shippingZoneRequests from '../../../api/shippingzone';
import {IShippingZone} from '../../../../../types/zonetable';
import shippingRateRequests from '../../../api/shippingrate';
import {ICountry} from '../../../../../types/country';
import {Pencil, Trash} from '@strapi/icons';
import {LoadingIndicatorPage} from "@strapi/helper-plugin";

import {
  countriesNotInShippingZones,
} from "../../../utils/country-helper/country-helper";
import PackageTable from "../PackageTable/PackageTable";
import {IPackage} from "../../../../../types/package";
import PackageModal from "../PackageModal/PackageModal";
import packagesRequests from "../../../api/packages";


const ShippingZones = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showRateModal, setShowRateModal] = useState<boolean>(false);
  const [showPackageModal, setShowPackageModal] = useState<boolean>(false);
  const [shippingZones, setShippingZones] = useState<IShippingZone[]>();
  const [editRate, setEditRate] = useState(null);
  const [selectedZone, setSelectedZone] = useState<number>();
  const [selectedRateMode, setSelectedRateMode] = useState<string>('Add');
  const [selectedPackageMode, setSelectedPackageMode] = useState<string>('Add');
  const [nonAssignedCountries, setNonAssignedCountries] = useState<ICountry[]>();
  const [assignedZone, setAssignedZone] = useState<IShippingZone>();
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // @ts-ignore
  useEffect( () => {
     fetchData();
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    try {
      const profile: any = await profileRequests.getAllProfiles();
      const sz : any = await shippingZoneRequests.getAllShippingZones();
      const pkg : any = await packagesRequests.getAllPackages();
      console.log("pkg", pkg);
      setPackages(pkg);

      const notInZone = countriesNotInShippingZones(sz);
      setNonAssignedCountries(notInZone);

      const shippingZone: IShippingZone[] = sz.map((item: any) => ({
        id: item.id,
        name: item.name,
        countries: item.countries,
        shippingRatesData: item.shippingrate,
      }));

      setShippingZones(shippingZone);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCountriesText = (countries: ICountry[]) => {
    return countries.map((country) => country.name).join(', ');
  };

  async function addShippingZone(data: any) {
    const zones = await shippingZoneRequests.getAllShippingZones();
    const tempRes = zones.filter((zone: any) => zone.name === data.name)
    if(tempRes || !data.name) {
      const newErrors: Record<string, string> = {};
      newErrors.name = "Shipping zone name is required and has to be different from existing names";
      setErrors(newErrors);
    }
    else {
      await shippingZoneRequests.addShippingZone(data);
    }
    await fetchData();
  }

  async function editShippingZone(id: number, data: any) {

    await shippingZoneRequests.editShippingZone(id, data);
    await fetchData();
  }

  async function selectShippingZone(id: number) {
    setSelectedZone(id);
    setSelectedRateMode('Add');
  }

  async function addShippingRate(zoneId: number, data: IShippingRate) {
    console.log("addShippingRateZoneId", zoneId)
    console.log("addShippingRateData", data)
    if (selectedRateMode === 'Add') {

      const d = {
        name: data.name,
        condition: data.condition,
        price: data.price,
        shippingzone: [zoneId],
      };

      const rates = await shippingRateRequests.getAllShippingRates()
      const tempRates = rates.filter((rate:any) => rate.name === data.name)
      console.log("tempRates", tempRates)
      const zones = await shippingZoneRequests.getAllShippingZones()
      const tempRes = zones.filter((zone: any) => zone.id === zoneId)
      console.log("tempRes", tempRes)
      if(!data.name || tempRates.length > 0) {
        console.log("prvo")
        const newErrors: Record<string, string> = {};
        newErrors.rate = "Name missing or not unique";
        setErrors(newErrors);
      }
      else
      if(!tempRes){
        console.log("drugo")
        const newErrors: Record<string, string> = {};
        newErrors.rate = "Trying to create a shipping rate for a non existing shipping zone";
        setErrors(newErrors);
      }
      else {
        console.log("proso")
        const newErrors: Record<string, string> = {};
        newErrors.rate = "";
        setErrors(newErrors);
        setShowRateModal(false)
        await shippingRateRequests.addShippingRate(d);
      }
    } else if (selectedRateMode === 'Edit') {
      const d = {
        name: data.name,
        condition: data.condition,
        price: data.price,
      };

      const rates = await shippingRateRequests.getAllShippingRates()
      const tempRates = rates.filter((rate:any) => rate.name === data.name)
      console.log("tempRatesEdit", tempRates)
      const zones = await shippingZoneRequests.getAllShippingZones()
      const tempRes = zones.filter((zone: any) => zone.id === zoneId)
      console.log("tempResEdit", tempRes)
      if(!data.name || tempRates.length > 0) {
        console.log("prvoEdit")
        const newErrors: Record<string, string> = {};
        newErrors.rate = "Name missing or not unique";
        setErrors(newErrors);
      }
      else
      if(!tempRes){
        console.log("drugoEdit")
        const newErrors: Record<string, string> = {};
        newErrors.rate = "Trying to create a shipping rate for a non existing shipping zone";
        setErrors(newErrors);
      }
      else {
        console.log("proso")
        const newErrors: Record<string, string> = {};
        newErrors.rate = "";
        setErrors(newErrors);
        setShowRateModal(false)
        await shippingRateRequests.editShippingRate(data.id, d);
      }
    }
    await fetchData();

  }

  async function deleteShippingRate(id: number) {
    await shippingRateRequests.deleteShippingRate(id);
    await fetchData();
  }

  async function deleteShippingZone(id: number) {
    await shippingZoneRequests.deleteShippingZone(id);
    await fetchData();
  }

  async function editShippingRate(id: any, data: any) {
    setSelectedZone(id);
    setEditRate(data);
    setSelectedRateMode('Edit');
    setShowRateModal(true);
  }


  function handleAddNewZone() {
    setAssignedZone(undefined);
    setShowModal(true);
  }

  function handleEditZone(zone: IShippingZone) {
    setAssignedZone(zone);
    setShowModal(true);
  }

  if (isLoading) return <LoadingIndicatorPage/>;

  async function addPackage(data: IPackage) {
    console.log("addPackage", data)
    const defaultPackage = packages.find(p => p.default);

    if (defaultPackage && data.default && data.id !== defaultPackage.id) {
      const def = {
        default: false
      };
      await packagesRequests.editPackages(defaultPackage.id, def);
    }

    if (selectedPackageMode === 'Add') {

      const d = {
        name: data.name ?? "standard",
        type: data.type ?? "Box",
        length: data.length ?? "1",
        width: data.width ?? "1",
        height: data.height ?? "1",
        weight: data.weight ?? "1",
        default: data.default ?? "false"
      };

      const packages = await packagesRequests.getAllPackages()
      const tempPackages = packages.filter((pack: any) => (pack.name === data.name && pack.type === data.type))
      console.log("tempPackages", tempPackages)
      if (tempPackages.length > 0 || !data.name) {
        console.log("prvocreatepackage")
        const newErrors: Record<string, string> = {};
        newErrors.packages = "Name cannot be empty or the same as another package's name with the same package type";
        setErrors(newErrors);
      } else {
        console.log("drugocreatepackage")
        const newErrors: Record<string, string> = {};
        newErrors.packages = "";
        setErrors(newErrors);
        setShowPackageModal(false)
        await packagesRequests.addPackages(d);
      }
      await fetchData();

    } else if (selectedPackageMode === 'Edit') {


      const d = {
        name: data.name,
        type: data.type,
        length: data.length,
        width: data.width,
        height: data.height,
        weight: data.weight,
        default: data.default
      };
      const packages = await packagesRequests.getAllPackages()
      const tempPackages = packages.filter((pack: any) => (pack.name === data.name && pack.type === data.type))
      if (tempPackages.length > 0 || !data.name) {
        console.log("prvoeditpackage")
        const newErrors: Record<string, string> = {};
        newErrors.packages = "Name cannot be empty or the same as another package's name with the same package type";
        setErrors(newErrors);
      } else {
        console.log("drugoeditpackage")
        const newErrors: Record<string, string> = {};
        newErrors.packages = "";
        setErrors(newErrors);
        setShowPackageModal(false)
        await packagesRequests.editPackages(data.id, d);
      }
      await fetchData();
    }
  }
  async function editPackage(id: number, data: any) {
    setSelectedPackage(data);
    setSelectedPackageMode("Edit");
    setShowPackageModal(true);
  }

  async function deletePackage(id: number) {
    await packagesRequests.deletePackages(id);
    await fetchData();
  }


  return (
    <>
      <Layout>
        <ContentLayout>
          <Box padding="2rem">
            <Typography variant="title">Shipping zones</Typography>
            <br/>
            <br/>

            {shippingZones &&
              shippingZones.map((zone) => (
                <>
                  <Grid gap={1}>
                    <GridItem col={6} s={12}>
                      <Typography variant="beta">{zone.name} shipping</Typography>
                    </GridItem>
                    <GridItem col={6} s={12}>
                      <Flex style={{justifyContent: 'end'}}>
                        <IconButton onClick={() => handleEditZone(zone)} label="Edit" noBorder icon={<Pencil/>}/>
                        <Box paddingLeft={1}>
                          <IconButton
                            label="Delete"
                            onClick={() => deleteShippingZone(zone.id)}
                            noBorder
                            icon={<Trash/>}
                          />
                        </Box>
                      </Flex>
                    </GridItem>
                    <GridItem col={12} s={12}>
                      <Box maxWidth="250px">
                        <Typography ellipsis variant="omega">
                          {setCountriesText(zone.countries)}
                        </Typography>
                      </Box>
                    </GridItem>
                  </Grid>
                  <ShippingZoneTable
                    key={zone.id}
                    shippingRatesData={zone.shippingRatesData}
                    setShowModal={setShowRateModal}
                    deleteShippingRate={deleteShippingRate}
                    editShippingRate={editShippingRate}
                    selectedZone={zone.id}
                    setSelectedZone={selectShippingZone}
                  />
                  <br/>
                </>
              ))}
            <br/>

            <Grid>
              <GridItem col={12} s={12}>
                <Box display="flex" alignItems="center">
                  <Button onClick={() => handleAddNewZone()} variant="secondary">
                    Add custom shipping zone
                  </Button>
                </Box>
              </GridItem>
              <br/>
              <GridItem col={12} s={12}>
                <Typography ellipsis variant="omega">
                  {nonAssignedCountries?.length} countries and regions not covered by your shipping zones
                </Typography>
              </GridItem>
            </Grid>
          </Box>

          <Box padding="2rem">
            <Typography variant="beta">Packages</Typography>
            <Box padding="1rem">
              <Typography variant="omega">Used to calculate shipping rates at checkout</Typography>
            </Box>

            <PackageTable
              deletePackage={deletePackage}
              editPackage={editPackage}
              packageData={packages}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
              setShowPackageModal={setShowPackageModal}/>
          </Box>


        </ContentLayout>
      </Layout>
      {showModal && <ShippingZoneModal setShowModal={setShowModal} addShippingZone={addShippingZone}
                                       editShippingZone={editShippingZone} nonAssignedCountries={nonAssignedCountries}
                                       assignedZone={assignedZone} errors={errors}/>}
      {showRateModal && (
        <ShippingRateModal
          setShowRateModal={setShowRateModal}
          addShippingRate={addShippingRate}
          zoneId={selectedZone}
          rateData={editRate}
          mode={selectedRateMode}
          errors={errors}
        />
      )}

      {showPackageModal && (
        <PackageModal
          setShowPackageModal={setShowPackageModal}
          addPackage={addPackage}
          packageId={selectedPackage}
          packageData={selectedPackage}
          mode={selectedPackageMode}
          errors={errors}
        />
      )}
    </>
  );
};


export default ShippingZones;