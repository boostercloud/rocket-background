import { Register } from '@boostercloud/framework-types'
import { Command } from '@boostercloud/framework-core'
import { Background } from '@boostercloud/rocket-background-core'

@Command({
  authorize: 'all',
})
export class StartJobs {
  public static async handle(command: StartJobs, register: Register): Promise<void> {
    const background = new Background(register)
    await background.runAsync('asyncFunction', { parameterA: '1' }, { retryTimes: 1 })
    await background.runAsync('asyncFailedFunction', { parameterB: '2' }, { retryTimes: 2 })
    const when = new Date()
    when.setMinutes(when.getMinutes() + 3)
    await background.schedule(
      when.toISOString(),
      'asyncFunction',
      { scheduledAt: when.toISOString() },
      { retryTimes: 2 }
    )
  }
}
