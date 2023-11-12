export default [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'settings.getSettings',
    config: {policies: []}
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'settings.setSettings',
    config: {policies: []}
  },
  {
    method: "GET",
    path: "/profile/find",
    handler: "profile.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/profile/create",
    handler: "profile.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/profile/update/:id",
    handler: "profile.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/billing/find",
    handler: "billing.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/billing/create",
    handler: "billing.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/billing/update/:id",
    handler: "billing.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/currency/find",
    handler: "currency.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/currency/create",
    handler: "currency.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/currency/update/:id",
    handler: "currency.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/timezone/find",
    handler: "timezone.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/timezone/create",
    handler: "timezone.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/timezone/update/:id",
    handler: "timezone.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/shippingzone/find",
    handler: "shippingzone.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/shippingzone/create",
    handler: "shippingzone.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/shippingzone/update/:id",
    handler: "shippingzone.update",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: "/shippingzone/delete/:id",
    handler: "shippingzone.delete",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/shippingrate/find",
    handler: "shippingrate.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/shippingrate/create",
    handler: "shippingrate.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/shippingrate/update/:id",
    handler: "shippingrate.update",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: "/shippingrate/delete/:id",
    handler: "shippingrate.delete",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/shippingpackage/find",
    handler: "shippingpackage.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/shippingpackage/create",
    handler: "shippingpackage.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/shippingpackage/update/:id",
    handler: "shippingpackage.update",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: "/shippingpackage/delete/:id",
    handler: "shippingpackage.delete",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/tax/find",
    handler: "tax.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/tax/create",
    handler: "tax.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/tax/update/:id",
    handler: "tax.update",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: "/tax/delete/:id",
    handler: "tax.delete",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: "/payment/orders",
    handler: "payment.orders",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/payment/capture",
    handler: "payment.capture",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "GET",
    path: "/product/find",
    handler: "product.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "GET",
    path: "/product/find/:id",
    handler: "product.findOne",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/product/create",
    handler: "product.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/product/update/:id",
    handler: "product.update",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: "/product/delete/:id",
    handler: "product.delete",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/order/find",
    handler: "order.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "GET",
    path: "/order/find/:id",
    handler: "order.findOne",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/order/create",
    handler: "order.create",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "PUT",
    path: "/order/update/:id",
    handler: "order.update",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "DELETE",
    path: "/order/delete/:id",
    handler: "order.delete",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "GET",
    path: "/legal/find",
    handler: "legal.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/legal/create",
    handler: "legal.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/legal/update/:id",
    handler: "legal.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/setup/find",
    handler: "setup.find",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: "/setup/create",
    handler: "setup.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/setup/update/:id",
    handler: "setup.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/paypalsetup/find",
    handler: "paypalsetup.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/paypalsetup/create",
    handler: "paypalsetup.create",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "PUT",
    path: "/paypalsetup/update/:id",
    handler: "paypalsetup.update",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/shippingcalculator/calculate",
    handler: "shippingcalculator.calculate",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "GET",
    path: "/category/find",
    handler: "category.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "GET",
    path: "/category/find/:id",
    handler: "category.findOne",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/category/create",
    handler: "category.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/category/update/:id",
    handler: "category.update",
    config: {
      policies: [],
    },
  },
  {
    method: "DELETE",
    path: "/category/delete/:id",
    handler: "category.delete",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/subcategory/find",
    handler: "subcategory.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "GET",
    path: "/subcategory/find/:id",
    handler: "subcategory.findOne",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/subcategory/create",
    handler: "subcategory.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/subcategory/update/:id",
    handler: "subcategory.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/social/find/:id",
    handler: "social.findOne",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/social/create",
    handler: "social.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/social/update/:id",
    handler: "social.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/conversionrate/find",
    handler: "conversionrate.find",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: "/conversionrate/create",
    handler: "conversionrate.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/conversionrate/update/:id",
    handler: "conversionrate.update",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/gmail/find",
    handler: "gmail.find",
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: "POST",
    path: "/gmail/create",
    handler: "gmail.create",
    config: {
      policies: [],
    },
  },
  {
    method: "PUT",
    path: "/gmail/update/:id",
    handler: "gmail.update",
    config: {
      policies: [],
    },
  },
];
