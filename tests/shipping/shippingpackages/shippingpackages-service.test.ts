import shippingPackageService from "../../../server/services/shippingpackage";
import {IPackage} from "../../../types/package";

describe('Shipping Package Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findMany: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of find method
          // Return an array of data based on your test scenario
          return [
            {
              id: 1,
              name: 'Example Package 1',
              type: 'Box',
              length: 10.5,
              width: 8.2,
              height: 5.0,
              weight: 2.3,
              default: true,
            },
            {
              id: 2,
              name: 'Example Package 2',
              type: 'Envelope',
              length: 7.0,
              width: 5.0,
              height: 0.5,
              weight: 0.8,
              default: false,
            },
            // Add more package objects as needed
          ];
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of the update method
          // Return updated data based on your test scenario
          const updatedPackage = {
            id: id,
            name: data.name !== undefined ? data.name : 'Updated Example Package',
            type: data.type !== undefined ? data.type : 'Updated Type',
            length: data.length !== undefined ? data.length : 15.0,
            width: data.width !== undefined ? data.width : 12.5,
            height: data.height !== undefined ? data.height : 8.0,
            weight: data.weight !== undefined ? data.weight : 3.5,
            default: data.default !== undefined ? data.default : false,
          };
          return updatedPackage;
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return created data based on your test scenario
          return {
            id: 3,
            name: data.name,
            type: data.type,
            length: data.length,
            width: data.width,
            height: data.height,
            weight: data.weight,
            default: data.default,
          };
        }),
        delete: jest.fn().mockImplementation((model: string, id: any) => {
          // Mock the behavior of delete method
          // Return true if deletion is successful, otherwise, throw an error
          if (id === 3) {
            return true;
          } else {
            throw new Error('Failed to delete package');
          }
        }),
      },
    };
  });

  it('should create a shipping package', async function () {
    const newPackageData = {
      name: 'New Package',
      type: 'Box',
      length: 12.0,
      width: 9.5,
      height: 6.0,
      weight: 2.8,
      default: false,
    };

    // @ts-ignore
    const createdPackage: IPackage = await shippingPackageService({strapi}).create(newPackageData);

    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdPackage).not.toBeNull();
    expect(createdPackage.id).toBe(3);
    expect(createdPackage.name).toBe(newPackageData.name);
    // Add similar expectations for other properties of the created package
  });

  it('shipping packages: create. Should throw an error when strapi.entityService is not defined', async function () {
    // Arrange
    const newPackageData = {
      name: 'New Package',
      type: 'Box',
      length: 12.0,
      width: 9.5,
      height: 6.0,
      weight: 2.8,
      default: false,
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingPackageService({ strapi } ).create(newPackageData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should find all shipping packages', async function () {

    // @ts-ignore
    const foundPackages: IPackage[] = await shippingPackageService({strapi}).find();

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(foundPackages).not.toBeNull();
    expect(foundPackages.length).toBe(2);
    expect(foundPackages[0].id).toBe(1);
    expect(foundPackages[1].id).toBe(2);
  });

  it('should throw an error when strapi.entityService is not defined (find)', async function () {
    // Arrange
    const query = { /* your query here */ };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingPackageService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update a shipping package record', async function () {
    const packageId = 1;
    const updateData = {
      name: 'Updated Example Package',
      type: 'Updated Box',
      length: 12.0,
      width: 10.0,
      height: 6.5,
      weight: 4.0,
      default: false,
    };

    // @ts-ignore
    const updatedPackage = await shippingPackageService({strapi}).update(packageId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedPackage).not.toBeNull();
    expect(updatedPackage!.id).toBe(1);
    expect(updatedPackage!.name).toBe('Updated Example Package');
    // Add similar expectations for other properties
  });

  it('should throw an error when strapi.entityService is not defined (update)', async function () {
    // Arrange
    const id = 1; // Replace with a valid ID for your update operation
    const data = { /* your update data here */ };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingPackageService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });



  it('should delete a shipping package', async function () {
    const packageIdToDelete = 3;

    // @ts-ignore
    const isDeleted: boolean = await shippingPackageService({strapi}).delete(packageIdToDelete);

    expect(strapi.entityService.delete).toBeCalledTimes(1);
    expect(isDeleted).toBe(true);
  });

  it('should throw an error when strapi.entityService is not defined (delete)', async function () {
    // Arrange
    const id = 1; // Replace with a valid ID for your delete operation

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingPackageService({ strapi }).delete(id);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


});
