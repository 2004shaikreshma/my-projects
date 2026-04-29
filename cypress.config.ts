import { defineConfig } from 'cypress'
import * as fs from 'fs'
import * as path from 'path'

// 🔹 Load environment-specific JSON config
function getConfigurationByFile(env: string) {
  const filePath = path.resolve(__dirname, 'config', `testdata.${env}.json`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ Config file not found: ${filePath}`)
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',

    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',

    setupNodeEvents(on, config) {
      // 🔹 Get env name (default: dev)
      const envName = config.env.configFile || 'dev'
      console.log('🔧 Loading configuration for environment:', envName)

      // 🔹 Load JSON config
      const appConfigs = getConfigurationByFile(envName)

      // 🔹 Merge configs safely (Node context ✅)
      config.env = {
        ...config.env,
        ...appConfigs,
        API_KEY: process.env.API_KEY // ✅ Safe here
      }

      // 🔹 Override baseUrl if provided
      if (appConfigs.baseUrl) {
        config.baseUrl = appConfigs.baseUrl
      }

      return config
    },

    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  }
})