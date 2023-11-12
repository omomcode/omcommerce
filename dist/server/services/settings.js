"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    const getPluginStore = () => {
        return strapi.store({
            environment: '',
            type: 'plugin',
            name: 'omcommerce',
        });
    };
    const createDefaultConfig = async () => {
        const pluginStore = getPluginStore();
        const value = {
            enabled: false,
        };
        await pluginStore.set({ key: 'settings', value });
        return pluginStore.get({ key: 'settings' });
    };
    const getSettings = async () => {
        const pluginStore = getPluginStore();
        let config = await pluginStore.get({ key: 'settings' });
        if (!config) {
            config = await createDefaultConfig();
        }
        return config;
    };
    const setSettings = async (settings) => {
        const value = settings;
        const pluginStore = getPluginStore();
        await pluginStore.set({ key: 'settings', value });
        return pluginStore.get({ key: 'settings' });
    };
    return {
        getSettings,
        setSettings
    };
};
