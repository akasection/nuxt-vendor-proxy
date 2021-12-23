import { Module } from '@nuxt/types';
import { VendorModuleOptions } from 'types/vendor';
declare const MODULE_NAME = "vendor";
declare module '@nuxt/types' {
    interface NuxtConfig {
        [MODULE_NAME]?: VendorModuleOptions;
    }
    interface Configuration {
        [MODULE_NAME]?: VendorModuleOptions;
    }
}
declare const vendorMapper: Module<VendorModuleOptions>;
export default vendorMapper;
