import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig, RocketFunction } from '@boostercloud/framework-types'
import { BackgroundOptions, configure } from '@boostercloud/rocket-background-core'
import { asyncFunction } from '../async-commands/async-function'
import { asyncFailedFunction } from '../async-commands/async-failed-function'

Booster.configure('local', (config: BoosterConfig): void => {
  config.appName = 'rocket-background-example'
  config.providerPackage = '@boostercloud/framework-provider-local'
  const backgroundFunctions: Record<string, RocketFunction> = {
    asyncFunction: asyncFunction,
    asyncFailedFunction: asyncFailedFunction,
  }
  const backgroundOptions = {
    authorizeReadEvents: 'all',
    authorizeReadModels: 'all',
    backgroundFunctions: backgroundFunctions,
    checkJobsDelayInMinutes: 1,
    batchSize: 10,
  } as BackgroundOptions
  configure(config, backgroundOptions)
})
