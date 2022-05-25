import { BoosterConfig, RocketFunction, RoleAccess } from '@boostercloud/framework-types'
import { Booster } from '@boostercloud/framework-core/dist/booster'
import { Job } from './entities/job'
import { JobCreated } from './events/job-created'
import { JobStatusChanged } from './events/job-status-changed'
import { HandleStarted } from './event-handlers/handle-started'
import { getClassMetadata } from '@boostercloud/framework-core/dist/decorators/metadata'
import { JobReadModel } from './read-models/job-read-model'
import { JobScheduledCommand } from './scheduled-commands/job-scheduled-command'
import { BackgroundOptions } from './types/background-options'
import { backgroundOptionsID } from './types/constants'

export { BackgroundOptions } from './types/background-options'
export { JobOptions } from './types/job-options'
export { JobStatus } from './types/job-status'
export { Background } from './engine/background'
export { Job } from './entities/job'

export function configure(config: BoosterConfig, backgroundOptions: BackgroundOptions) {
  registerBackgroundFunctions(config, backgroundOptions)
  registerBackgroundOptions(config, backgroundOptions)
  registerBoosterArtifacts(backgroundOptions)
}

function registerBackgroundFunctions(config: BoosterConfig, backgroundOptions: BackgroundOptions) {
  const params: Record<string, RocketFunction> = backgroundOptions.backgroundFunctions
  Object.entries(params).forEach(entry => {
    const [key, value] = entry;
    config.registerRocketFunction(key, async (config: BoosterConfig, request: unknown) => {
      return value(config, request)
    })
  })
}

function  registerBackgroundOptions(config: BoosterConfig, backgroundOptions: BackgroundOptions) {
  config.registerRocketFunction(backgroundOptionsID, async (config: BoosterConfig, request: unknown) => {
    return (config: BoosterConfig, request: unknown) => Promise.resolve(backgroundOptions)
  })
}

function  registerBoosterArtifacts(backgroundOptions: BackgroundOptions) {
  Booster.configureCurrentEnv((config): void => {
    const authorizeReadEvents: RoleAccess['authorize'] = backgroundOptions.authorizeReadEvents
    config.entities[Job.name] = {
      class: Job,
      authorizeReadEvents,
    }

    config.events[JobCreated.name] = {
      class: JobCreated,
    }
    config.events[JobStatusChanged.name] = {
      class: JobStatusChanged,
    }

    const registeredEventHandlers = config.eventHandlers[HandleStarted.name] || []
    registeredEventHandlers.push(HandleStarted)
    config.eventHandlers['JobStatusChanged'] = registeredEventHandlers

    config.scheduledCommandHandlers[JobScheduledCommand.name] = {
      class: JobScheduledCommand,
      scheduledOn: {
        minute: `0/${backgroundOptions.checkJobsDelayInMinutes}`,
      },
    }

    const authorizeReadModels: RoleAccess['authorize'] = backgroundOptions.authorizeReadModels
    config.readModels[JobReadModel.name] = {
      class: JobReadModel,
      properties: getClassMetadata(JobReadModel).fields,
      authorizedRoles: authorizeReadModels,
      before: [],
    }
  })
}
