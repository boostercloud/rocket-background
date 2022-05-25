import { Register } from '@boostercloud/framework-types'
import { Booster, Command } from '@boostercloud/framework-core'
import { Background } from '@boostercloud/rocket-background-core'
import { JobReadModel } from '@boostercloud/rocket-background-core/dist/read-models/job-read-model'

@Command({
  authorize: 'all',
})
export class DeleteJobs {
  public static async handle(command: DeleteJobs, register: Register): Promise<void> {
    const job = (await Booster.readModel(JobReadModel).limit(1).search()) as Array<JobReadModel>
    if (job && job.length > 0) {
      const background = new Background(register)
      console.log('Deleting job', job[0].id)
      await background.delete(job[0].id, job[0].retried)
    }
  }
}
