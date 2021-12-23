export interface VendorModuleOptions {
  /**  List of node_modules directories/files that wants to be proxied */
  modules?: string[]
  /** Output directory (target) where symlink will lands (defaults to `~/static/vendor`) */
  target?: string
}
