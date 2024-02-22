"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let slugify = require('slugify');
let uniqueSlug = require('unique-slug');
// @ts-ignore
const countries_json_1 = __importDefault(require("./data/countries.json"));
const findSetup = async (query) => {
    return await strapi.entityService.findOne("plugin::omcommerce.setup", query);
};
const findCurrency = async (query) => {
    return await strapi.entityService.findOne("plugin::omcommerce.currency", query);
};
const findTax = async (query) => {
    return await strapi.entityService.findMany("plugin::omcommerce.tax", query);
};
const findProfile = async (query) => {
    return await strapi.entityService.findMany("plugin::omcommerce.profile", query);
};
const findShippingZone = async (query) => {
    return await strapi.entityService.findMany("plugin::omcommerce.shippingzone", query);
};
const createShippingZone = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.shippingzone", { data });
};
const findShippingRate = async (query) => {
    return await strapi.entityService.findMany("plugin::omcommerce.shippingrate", query);
};
const createShippingRate = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.shippingrate", { data });
};
const createSetup = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.setup", { data });
};
const createProfile = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.profile", { data });
};
const createCurrency = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.currency", { data });
};
const createTimezone = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.zone", { data });
};
const findTimezone = async (query) => {
    return await strapi.entityService.findMany("plugin::omcommerce.zone", query);
};
const findBilling = async (query) => {
    return await strapi.entityService.findMany("plugin::omcommerce.billing", query);
};
const createBilling = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.billing", { data });
};
const findConversionRate = async (query) => {
    return await strapi.entityService.findOne("plugin::omcommerce.conversionrate", query);
};
const createConversionRate = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.conversionrate", { data });
};
const convertFromEURtoRSD = async (rate, spreadPercentage, amount) => {
    // const spreadPercentage = 0.025 / 100;
    // const rate = 0.0082327;
    //
    const spread = amount * spreadPercentage;
    const amountWithoutSpread = amount + spread;
    return amountWithoutSpread / rate;
};
const findConversionCurrencyCode = async (query) => {
};
const findGmail = async (query) => {
    return await strapi.entityService.findOne("plugin::omcommerce.gmail", query);
};
const createGmail = async (data) => {
    return await strapi.entityService.create("plugin::omcommerce.gmail", { data });
};
const convertFromRSDtoEUR = async (rate, spreadPercentage, amount) => {
    // const spreadPercentage = 0.025 / 100;
    // const rate = 0.0082327;
    const amountWithoutSpread = amount * rate;
    const spread = amountWithoutSpread * spreadPercentage;
    return amountWithoutSpread - spread;
};
let DomesticZone = {
    name: "Domestic",
    countries: [],
};
let InternationalZone = {
    name: "International",
    countries: [],
};
const initialRateData = {
    id: 1,
    name: "standard",
    condition: "",
    price: 0
};
exports.default = async ({ strapi }) => {
    strapi.db.lifecycles.subscribe({
        models: ["plugin::omcommerce.setup"],
        async afterFindOne(event) {
            if (event.result === null) {
                const setup = {
                    wizard_open: true,
                    wizard_option: 0,
                    product_type: 0,
                    wizard_state: 1,
                    initialized: true
                };
                await createSetup(setup);
            }
            else if (event.result.wizard_open && event.result.wizard_option === 0 && event.result.product_type === 0 && event.result.wizard_state === 1) {
                const p = await findProfile({});
                if (p === null) {
                    const profile = {
                        name: '',
                        phone: '',
                        email: '',
                        region: '',
                    };
                    await createProfile(profile);
                    const country = countries_json_1.default.find((country) => country.code === profile.region);
                    if (country !== undefined)
                        DomesticZone.countries.push(country);
                    const domesticZone = await createShippingZone(DomesticZone);
                    InternationalZone.countries = countries_json_1.default.filter(country => country.code !== profile.region);
                    const internationalZone = await createShippingZone(InternationalZone);
                    await createShippingRate({
                        name: initialRateData.name,
                        condition: initialRateData.condition,
                        price: initialRateData.price,
                        shippingzone: [domesticZone.id]
                    });
                    await createShippingRate({
                        name: initialRateData.name,
                        condition: initialRateData.condition,
                        price: initialRateData.price,
                        shippingzone: [internationalZone.id]
                    });
                }
                // Gmail
                const gm = await findGmail({});
                if (gm === null) {
                    const gmail = {
                        client_id: "CLIENTID",
                        client_secret: "CLIENTSECRET",
                        refresh_token: "SECRETREFRESHCODE",
                        from: "info@example.com"
                    };
                    await createGmail(gmail);
                }
                // Currency
                const c = await findCurrency({});
                if (c === null) {
                    const currency = {
                        currency: "EUR"
                    };
                    await createCurrency(currency);
                }
                // Timezone
                const t = await findTimezone({});
                if (t === null) {
                    const timezone = {
                        timezone: "Central Europe Standard Time",
                        measurement: "Metric",
                        unit: "g",
                        length_unit: "cm"
                    };
                    await createTimezone(timezone);
                }
                const b = await findBilling({});
                if (b === null) {
                    const billing = {
                        name: "",
                        country: "",
                        address: "",
                        apartment: "",
                        postal: "",
                        city: ""
                    };
                    await createBilling(billing);
                }
                const cr = await findConversionRate({});
                if (cr === null) {
                    const conversionRate = {
                        rate: 0.0082327,
                        spread: 0,
                        conversion_currency: "RSD"
                    };
                    await createConversionRate(conversionRate);
                }
            }
        }
    });
    strapi.db.lifecycles.subscribe({
        models: ["plugin::omcommerce.product"],
        async afterFindOne(event) {
            const { where, select, populate } = event.params;
        },
        async beforeCreate(event) {
            const { data, where, select, populate } = event.params;
            console.log("beforecreate", data);
            const randomSlug = uniqueSlug();
            if (data.title) {
                data.slug = slugify(data.title + randomSlug, { lower: true });
            }
            if (!data.measurement_unit) {
                data.measurement_unit = 'g';
            }
            let query;
            if (!data.omcommerce_shippingzones || data.omcommerce_shippingzones.connect === undefined) {
                query = { populate: '*' };
            }
            else {
                query = { populate: '*', filters: { id: { '$eq': data.omcommerce_shippingzones.connect[0].id.toString() } } };
            }
            let val;
            const cr = await findConversionRate({});
            if (data.amount_value === null || data.amount_value === undefined) {
                data.amount_value = 0;
            }
            if (cr.rate !== null || cr.rate !== undefined) {
                val = await convertFromEURtoRSD(cr.rate, cr.spread, data.amount_value);
            }
            else {
                val = await convertFromEURtoRSD(0.0082327, cr.spread, data.amount_value);
            }
            await findShippingZone(query);
            const currency = await findCurrency({});
            if (currency) {
                data.amount_currency_code = currency.currency;
                data.tax_currency_code = currency.currency;
            }
            else {
                data.amount_currency_code = "EUR";
                data.tax_currency_code = "EUR";
            }
            data.amount_value_converted_currency_code = cr.conversion_currency;
            data.amount_value_converted = parseFloat(val).toFixed(2);
            let tQuery;
            if (!data.omcommerce_tax || data.omcommerce_tax.connect === undefined) {
                tQuery = { populate: '*' };
            }
            else if (data.chargeTax) {
                {
                    const tQuery = { populate: '*', filters: { id: { '$eq': data.omcommerce_tax.connect[0].id.toString() } } };
                    const tax = await findTax(tQuery);
                    if (tax !== null && tax !== undefined && tax[0].rate !== null) {
                        data.tax_value = (data.amount_value * tax[0].rate) / 100;
                    }
                    else {
                        data.tax_value = (data.amount_value_converted);
                    }
                }
            }
        },
        async beforeUpdate(event) {
            const { data, where, select, populate } = event.params;
            const cr = await findConversionRate({});
            let val;
            if (data.amount_value) {
                if (cr.rate !== null || cr.rate !== undefined) {
                    val = await convertFromEURtoRSD(cr.rate, cr.spread, data.amount_value);
                    data.amount_value_converted = parseFloat(val).toFixed(2);
                    data.amount_value_converted_currency_code = cr.conversion_currency;
                }
                else {
                    val = await convertFromEURtoRSD(0.0082327, cr.spread, data.amount_value);
                    data.amount_value_converted = parseFloat(val).toFixed(2);
                    data.amount_value_converted_currency_code = cr.conversion_currency;
                }
            }
        }
    });
    strapi.db.lifecycles.subscribe({
        models: ["plugin::omcommerce.productcms"],
        async afterFindOne(event) {
            const { where, select, populate } = event.params;
        },
        async beforeCreate(event) {
            const { data, where, select, populate } = event.params;
            console.log("beforecreateprcms", data);
            if (data.title) {
                data.slug = slugify(data.title, { lower: true });
            }
            let query;
            if (!data.omcommerce_shippingzones || data.omcommerce_shippingzones.connect === undefined) {
                query = { populate: '*' };
            }
            else {
                query = { populate: '*', filters: { id: { '$eq': data.omcommerce_shippingzones.connect[0].id.toString() } } };
            }
            let val;
            const cr = await findConversionRate({});
            if (cr.rate !== null || cr.rate !== undefined) {
                val = await convertFromEURtoRSD(cr.rate, cr.spread, data.amount_value);
            }
            else {
                val = await convertFromEURtoRSD(0.0082327, cr.spread, data.amount_value);
            }
            await findShippingZone(query);
            const currency = await findCurrency({});
            data.amount_currency_code = currency.currency;
            data.tax_currency_code = currency.currency;
            data.amount_value_converted_currency_code = cr.conversion_currency;
            data.amount_value_converted = parseFloat(val).toFixed(2);
            let tQuery;
            if (!data.omcommerce_tax || data.omcommerce_tax.connect === undefined) {
                tQuery = { populate: '*' };
            }
            else if (data.chargeTax) {
                {
                    const tQuery = { populate: '*', filters: { id: { '$eq': data.omcommerce_tax.connect[0].id.toString() } } };
                    const tax = await findTax(tQuery);
                    if (tax !== null && tax !== undefined && tax[0].rate !== null) {
                        data.tax_value = (data.amount_value * tax[0].rate) / 100;
                    }
                    else {
                        data.tax_value = (data.amount_value_converted);
                    }
                }
            }
        },
        async beforeUpdate(event) {
            console.log("beforeupdateprcms");
            const { data, where, select, populate } = event.params;
            const cr = await findConversionRate({});
            if (data.title && !data.slug) {
                data.slug = slugify(data.title, { lower: true });
            }
            let val;
            if (data.amount_value) {
                if (cr.rate !== null || cr.rate !== undefined) {
                    val = await convertFromEURtoRSD(cr.rate, cr.spread, data.amount_value);
                    data.amount_value_converted = parseFloat(val).toFixed(2);
                    data.amount_value_converted_currency_code = cr.conversion_currency;
                }
                else {
                    val = await convertFromEURtoRSD(0.0082327, cr.spread, data.amount_value);
                    data.amount_value_converted = parseFloat(val).toFixed(2);
                    data.amount_value_converted_currency_code = cr.conversion_currency;
                }
            }
        }
    });
};
