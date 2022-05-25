import { RocketFunction } from '@boostercloud/framework-types'
import { RoleInterface } from '@boostercloud/framework-types/dist/concepts/role'
import { Class } from '@boostercloud/framework-types/dist/typelevel'

export interface BackgroundOptions {
  batchSize: number
  checkJobsDelayInMinutes: number,
  authorizeReadEvents: 'all' | Array<Class<RoleInterface>>,
  authorizeReadModels: 'all' | Array<Class<RoleInterface>>,
  backgroundFunctions: Record<string, RocketFunction>
}
