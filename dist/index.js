import { resolve } from 'path';
import { existsSync, ensureDirSync, removeSync, ensureSymlinkSync, lstatSync } from 'fs-extra';
import consola from 'consola';
import chalk from 'chalk';
const vendorMapper = function (options) {
    var _a, _b, _c, _d, _e, _f;
    const mergedModules = [...((_a = options === null || options === void 0 ? void 0 : options.modules) !== null && _a !== void 0 ? _a : []), ...((_c = (_b = this.options.vendor) === null || _b === void 0 ? void 0 : _b.modules) !== null && _c !== void 0 ? _c : [])].filter(m => m);
    const targetDir = resolve(this.options.srcDir, (_f = (_d = options.target) !== null && _d !== void 0 ? _d : (_e = this.options.vendor) === null || _e === void 0 ? void 0 : _e.target) !== null && _f !== void 0 ? _f : 'static/vendor');
    removeSync(targetDir);
    if (mergedModules.length === 0) {
        consola.warn('No proxied modules found. Skipping...');
        return;
    }
    const vendorList = mergedModules.map(vend => {
        const proto = { src: '', dest: '', module: vend };
        const res = this.options.modulesDir.reduce((acc, cur) => (existsSync(resolve(cur, vend)) ? Object.assign(Object.assign({}, acc), { src: resolve(cur, vend), dest: resolve(targetDir, vend) }) : acc), proto);
        return res;
    });
    ensureDirSync(targetDir);
    vendorList.forEach(({ src, dest, module }) => {
        removeSync(dest);
        const winProfile = lstatSync(src).isDirectory() ? 'junction' : 'file';
        ensureSymlinkSync(src, dest, winProfile);
        consola.info(chalk.blue('Symlinked:'), module, '=>', dest);
    });
};
export default vendorMapper;
