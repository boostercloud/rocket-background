import { BoosterConfig } from '@boostercloud/framework-types/dist/config'

export async function asyncFailedFunction(config: BoosterConfig, request: unknown): Promise<unknown> {
  console.log(`Failed Job executed with parameters: ${JSON.stringify(request)}`)
  throw new Error('Job error')
}
