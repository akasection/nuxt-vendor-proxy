import { resolve } from 'path'
import { existsSync, ensureDirSync, removeSync, ensureSymlinkSync, lstatSync } from 'fs-extra'
import consola from 'consola'
import chalk from 'chalk'
import { Module } from '@nuxt/types'
import { VendorModuleOptions } from './types/vendor'

declare const MODULE_NAME = 'vendor'

declare module '@nuxt/types' {
  interface NuxtConfig {
    [MODULE_NAME]?: VendorModuleOptions
  }
  interface Configuration {
    [MODULE_NAME]?: VendorModuleOptions
  }
}

const vendorMapper: Module<VendorModuleOptions> = function (options) {
  // const { nuxt } = this // TODO: maybe use nuxt lifecycle
  const mergedModules = [...(options?.modules ?? []), ...(this.options.vendor?.modules ?? [])].filter(m => m)
  const targetDir = resolve(this.options.srcDir, options.target ?? this.options.vendor?.target ?? 'static/vendor')

  // cleanup first
  removeSync(targetDir)

  if (mergedModules.length === 0) {
    consola.warn('No proxied modules found. Skipping...')
    return
  }

  // process
  const vendorList = mergedModules.map(vend => {
    const proto = { src: '', dest: '', module: vend }
    const res = this.options.modulesDir.reduce(
      (acc, cur) => (existsSync(resolve(cur, vend)) ? { ...acc, src: resolve(cur, vend), dest: resolve(targetDir, vend) } : acc),
      proto
    )
    return res
  })

  ensureDirSync(targetDir)

  vendorList.forEach(({ src, dest, module }) => {
    removeSync(dest)
    const winProfile = lstatSync(src).isDirectory() ? 'junction' : 'file'
    ensureSymlinkSync(src, dest, winProfile)
    consola.info(chalk.blue('Symlinked:'), module, '=>', dest)
  })
}

export default vendorMapper
