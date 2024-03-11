import {prefixPluginTranslations} from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import getTrad from "./utils/getTrad";

import {ChartPie, ShoppingCart, Folder, PriceTag, Heart} from '@strapi/icons';
import React from "react";
import CustomField from "./components/Input";
import mutateEditViewHook from "./utils/mutateEditViewHook";

const name = pluginPkg.strapi.name;

const ChartIcon = () => <ChartPie />;
const ShoppingCartIcon = () => <ShoppingCart />;

export default {
  register(app: any) {

    app.addFields({
      Component: CustomField,
      type: pluginId
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "OmCommerce",
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/Setup/index');
        return component;
      },
      permissions: [
      ],
    });

    app.addMenuLink({
      to: `/products/plugins/${pluginId}`,
      icon: Folder,
      intlLabel: {
        id: `products.${pluginId}.plugin.name`,
        defaultMessage: "Products",
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/Products/index');
        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });

    app.addMenuLink({
      to: `/orders/plugins/${pluginId}`,
      icon: ShoppingCartIcon,
      intlLabel: {
        id: `setup.${pluginId}.plugin.name`,
        defaultMessage: "Orders",
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/Order/index');
        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });

    app.addMenuLink({
      to: `/analytics/plugins/${pluginId}`,
      icon: ChartIcon,
      intlLabel: {
        id: `analytics.${pluginId}.plugin.name`,
        defaultMessage: "Analytics",
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/Analytics/index');
        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });


    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {id: getTrad('plugin.name'), defaultMessage: 'omcommerce'},
      },
      [
        {
          intlLabel: {
            id: getTrad("plugin.settings.help.title"),
            defaultMessage: "Store settings"
          },
          id: 'settings',
          to: `/settings/${pluginId}/settings`,
          Component: async () => {
            return import("./pages/Settings/index");
          },
          //NEXT TIME -> permissions: pluginPermissions.settings,
        },
        // {
        //   intlLabel: {
        //     id: getTrad("plugin.settings.help.title"),
        //     defaultMessage: "Shipping"
        //   },
        //   id: 'settings',
        //   to: `/settings/${pluginId}/shipping`,
        //   Component: async () => {
        //     return import("./pages/Shipping/index");
        //   },
        //   //NEXT TIME -> permissions: pluginPermissions.settings,
        // },
        // {
        //   intlLabel: {
        //     id: getTrad("plugin.settings.help.title"),
        //     defaultMessage: "Taxes"
        //   },
        //   id: 'settings',
        //   to: `/settings/${pluginId}/taxes`,
        //   Component: async () => {
        //     return import("./pages/Taxes/index");
        //   },
        //   //NEXT TIME -> permissions: pluginPermissions.settings,
        // },


        // {
        //   intlLabel: {
        //     id: getTrad("plugin.settings.help.title"),
        //     defaultMessage: "Orders"
        //   },
        //   id: 'settings',
        //   to: `/settings/${pluginId}/order`,
        //   Component: async () => {
        //     return import("./pages/Order/index");
        //   },
        //   //NEXT TIME -> permissions: pluginPermissions.settings,
        // },
        {
          intlLabel: {
            id: getTrad("plugin.settings.help.title"),
            defaultMessage: "Payment"
          },
          id: 'settings',
          to: `/settings/${pluginId}/payment`,
          Component: async () => {
            return import("./components/Wizzard/Steps/Payment");
          },
          //NEXT TIME -> permissions: pluginPermissions.settings,
        },
        {
          intlLabel: {
            id: getTrad("plugin.settings.help.title"),
            defaultMessage: "Additional Settings"
          },
          id: 'settings',
          to: `/settings/${pluginId}/additional`,
          Component: async () => {
            return import("./pages/AdditionalSettings/index");
          },
          //NEXT TIME -> permissions: pluginPermissions.settings,
        },
        // {
        //   intlLabel: {
        //     id: getTrad("plugin.settings.help.title"),
        //     defaultMessage: "Analytics"
        //   },
        //   id: 'settings',
        //   to: `/settings/${pluginId}/analytics`,
        //   Component: async () => {
        //     return import("./components/Analytics/Analytics/Analytics");
        //   },
        //   //NEXT TIME -> permissions: pluginPermissions.settings,
        // },
        // {
        //   intlLabel: {
        //     id: getTrad("plugin.settings.help.title"),
        //     defaultMessage: "Legal pages"
        //   },
        //   id: 'settings',
        //   to: `/settings/${pluginId}/legal`,
        //   Component: async () => {
        //     return import("./pages/Legal/index");
        //   },
        //   //NEXT TIME -> permissions: pluginPermissions.settings,
        // },
      ]
    );


    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {
    app.registerHook(
      "Admin/CM/pages/EditView/mutate-edit-view-layout",
      mutateEditViewHook
    )

  },

  async registerTrads(app: any) {
    const {locales} = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map(async (locale) => {
        try {
          const {default: data} = await import(`./translations/${locale}.json`);
          return {
            data: prefixPluginTranslations(data, pluginId),
            locale,
          };
        } catch {
          return {
            data: {},
            locale,
          };
        }
      })
    );

    return Promise.resolve(importedTrads);
  },
};
