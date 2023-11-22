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
import { Alert } from '@strapi/design-system';

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
  const [alert, setAlert] = useState<string>("")

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
      console.dir(pkg);
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

    } catch(error:any){
      setAlert("Error fetching data")
    } finally {
      setIsLoading(false);
    }
  };

  const setCountriesText = (countries: ICountry[]) => {
    return countries.map((country) => country.name).join(', ');
  };

  async function addShippingZone(data: any) {
    try {
      const zones: any = await shippingZoneRequests.getAllShippingZones();
      const tempRes = zones.filter((zone: any) => zone.name === data.name)
      if (tempRes.length > 0 || !data.name) {
        const newErrors: Record<string, string> = {};
        newErrors.name = "Shipping zone name is required and has to be different from existing names";
        setErrors(newErrors);
      } else {
        await shippingZoneRequests.addShippingZone(data);
      }
      await fetchData();
    } catch (error: any) {
      setAlert(error.message)
    }
  }
  async function editShippingZone(id: number, data: any) {
    try {
      const zones: any = await shippingZoneRequests.getAllShippingZones();
      const tempRes = zones.filter((zone: any) => (zone.name === data.name && id !== zone.id))

      if (tempRes.length > 0 || !data.name) {
        const newErrors: Record<string, string> = {};
        newErrors.name = "Shipping zone name is required and has to be different from existing names";
        setErrors(newErrors);
      } else {
        await shippingZoneRequests.editShippingZone(id, data);
      }
      await fetchData();
    }
  catch(error:any){
    setAlert(error.message)
  }
  }

  async function selectShippingZone(id: number) {
    setSelectedZone(id);
    setSelectedRateMode('Add');
  }

  async function addShippingRate(zoneId: number, data: IShippingRate) {

try{
    if (selectedRateMode === 'Add') {

      const d = {
        name: data.name,
        condition: data.condition,
        price: data.price,
        shippingzone: [zoneId],
      };
      const rates: any = await shippingRateRequests.getAllShippingRates()
      const tempRates = rates.filter((rate: any) => rate.name === d.name)

      const zones: any = await shippingZoneRequests.getAllShippingZones()
      const tempRes = zones.filter((zone: any) => zone.id === zoneId)

      if (!d.name || tempRates.length > 0) {

        const newErrors: Record<string, string> = {};
        newErrors.rate = "Shipping rate name missing or not unique";
        setErrors(newErrors);
        setSelectedRateMode('Add')
      } else if (!tempRes) {

        const newErrors: Record<string, string> = {};
        newErrors.rate = "Trying to create a shipping rate for a non existing shipping zone";
        setErrors(newErrors);
        setSelectedRateMode('Add')
      } else {

        const newErrors: Record<string, string> = {};
        newErrors.rate = "";
        setErrors(newErrors);
        await shippingRateRequests.addShippingRate(d);
      }
    } else if (selectedRateMode === 'Edit') {
      const d = {
        name: data.name,
        condition: data.condition,
        price: data.price,
      };
      const rates: any = await shippingRateRequests.getAllShippingRates()
      const tempRates = rates.filter((rate: any) => (rate.name === d.name && rate.id !== data.id))

      const zones: any = await shippingZoneRequests.getAllShippingZones()
      const tempRes = zones.filter((zone: any) => zone.id === zoneId)

      if (!d.name || tempRates.length > 0) {

        const newErrors: Record<string, string> = {};
        newErrors.rate = "Shipping rate name missing or not unique";
        setErrors(newErrors);
        setSelectedRateMode('Add')
      } else if (!tempRes) {

        const newErrors: Record<string, string> = {};
        newErrors.rate = "Trying to create a shipping rate for a non existing shipping zone";
        setErrors(newErrors);
        setSelectedRateMode('Add')
      } else {

        const newErrors: Record<string, string> = {};
        newErrors.rate = "";
        setErrors(newErrors);
        await shippingRateRequests.editShippingRate(data.id, d);
      }
    }
    await fetchData();
  }catch(error:any){
      setAlert(error.message)
  }
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

      const packages: any = await packagesRequests.getAllPackages()
      const tempPackages = packages.filter((pack: any) => (pack.name === d.name && pack.type === d.type))

      if (tempPackages.length > 0 || !d.name) {

        const newErrors: Record<string, string> = {};
        newErrors.packages = "Name cannot be empty or the same as another package's name with the same package type";
        setErrors(newErrors);
        setSelectedPackageMode('Add')
      } else {

        const newErrors: Record<string, string> = {};
        newErrors.packages = "";
        setErrors(newErrors);
        await packagesRequests.addPackages(d);
        setSelectedPackageMode('Add')
      }



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

      const packages: any = await packagesRequests.getAllPackages()
      const tempPackages = packages.filter((pack: any) => (pack.name === data.name && pack.type === data.type))
      if (tempPackages.length > 0 || !data.name) {

        const newErrors: Record<string, string> = {};
        newErrors.packages = "Name cannot be empty or the same as another package's name with the same package type";
        setErrors(newErrors);
        setSelectedPackageMode('Add')
      } else {

        const newErrors: Record<string, string> = {};
        newErrors.packages = "";
        setErrors(newErrors);
        await packagesRequests.editPackages(data.id, d);
        setSelectedPackageMode('Add')
      }
    }
    await fetchData();

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
          {alert &&<Alert closeLabel="Close" onClose={() => setAlert("")} title="PageError" variant="danger">
            {alert}
          </Alert>}
          <Box padding="2rem">
            <Typography variant="title">Shipping zones</Typography>
            <br/>
            <br/>
            {errors.name &&<Alert closeLabel="Close" onClose={() => setErrors({})} title="Error" variant="danger">
              {errors.name}
            </Alert>}
            {errors.rate &&<Alert closeLabel="Close" onClose={() => setErrors({})} title="Error" variant="danger">
              {errors.rate}
            </Alert>}
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
            {errors.packages &&<Alert closeLabel="Close" onClose={() => setErrors({})} title="Error" variant="danger">
              {errors.packages}
            </Alert>}
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
                                       assignedZone={assignedZone}/>}
      {showRateModal && (
        <ShippingRateModal
          setShowRateModal={setShowRateModal}
          addShippingRate={addShippingRate}
          zoneId={selectedZone}
          rateData={editRate}
          mode={selectedRateMode}
        />
      )}

      {showPackageModal && (
        <PackageModal
          setShowPackageModal={setShowPackageModal}
          addPackage={addPackage}
          packageId={selectedPackage}
          packageData={selectedPackage}
          mode={selectedPackageMode}
        />
      )}
    </>
  );
};

export default ShippingZones;
