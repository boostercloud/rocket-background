import { BoosterConfig } from '@boostercloud/framework-types/dist/config'

export async function asyncFunction(config: BoosterConfig, request: unknown): Promise<unknown> {
  console.log(`Job executed with parameters: ${JSON.stringify(request)}`)
  return
}
