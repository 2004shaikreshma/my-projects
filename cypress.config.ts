import { defineConfig } from 'cypress'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Loads the test data from the config directory based on the environment name.
 * @param {string} env - Environment name (dev, prod, stage)
 */
function getConfigurationByFile(env: string) {
  const pathToConfigFile = path.resolve(__dirname, 'config', `testdata.${env}.json`)
  if (!fs.existsSync(pathToConfigFile)) {
    throw new Error(`File not found: ${pathToConfigFile}`)
  }
  return JSON.parse(fs.readFileSync(pathToConfigFile, 'utf8'))
}

export default defineConfig({
  allowCypressEnv: true,
  e2e: {
    baseUrl: 'https://www.saucedemo.com/',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    headed: true,
    setupNodeEvents(on, config) {
      // Logic for environment switching
      const envName = config.env.configFile || 'dev'
      console.log('Loading configuration for environment:', envName);
      const appConfigs = getConfigurationByFile(envName)

      // Merge environment variables
      config.env = {
        ...config.env,
        ...appConfigs
      }

      // Explicitly set baseUrl from config if it exists
      if (appConfigs.baseUrl) {
        config.baseUrl = appConfigs.baseUrl
        console.log('Base URL set to:', config.baseUrl);
      }

      return config
    },
    // Viewport and other settings
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
})
