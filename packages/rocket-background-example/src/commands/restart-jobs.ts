import { Register } from '@boostercloud/framework-types'
import { Booster, Command } from '@boostercloud/framework-core'
import { Background } from '@boostercloud/rocket-background-core'
import { JobReadModel } from '@boostercloud/rocket-background-core/dist/read-models/job-read-model'

@Command({
  authorize: 'all',
})
export class RestartJobs {
  public static async handle(command: RestartJobs, register: Register): Promise<void> {
    const job = (await Booster.readModel(JobReadModel).limit(1).search()) as Array<JobReadModel>
    if (job && job.length > 0) {
      const background = new Background(register)
      console.log('Restarting job', job[0].id)
      await background.restart(job[0].id)
    }
  }
}
