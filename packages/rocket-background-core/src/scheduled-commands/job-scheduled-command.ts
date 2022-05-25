import { Booster } from '@boostercloud/framework-core'
import { Register, FilterFor, SortFor} from '@boostercloud/framework-types'
import { JobReadModel } from '../read-models/job-read-model'
import { JobStatusChanged } from '../events/job-status-changed'
import { backgroundOptionsID, DEFAULT_BATCH_SIZE } from '../types/constants'
import { BackgroundOptions } from '../types/background-options'
import { JobStatus } from '../types/job-status'

export class JobScheduledCommand {
  public static async handle(register: Register): Promise<void> {
    const filters = {
      status: {
        eq: JobStatus.PENDING,
      },
      when: {
        lte: new Date().toISOString(),
      },
    } as FilterFor<JobReadModel>

    const sortBy = {
      when: 'ASC',
    } as SortFor<JobReadModel>

    let limit = await this.getLimit()
    const jobReadModelSearcher = Booster.readModel(JobReadModel)
    jobReadModelSearcher.filter(filters)
    jobReadModelSearcher.sortBy(sortBy)
    jobReadModelSearcher.limit(limit)
    const pendingJobs = (await jobReadModelSearcher.search()) as Array<JobReadModel>
    console.debug(`[Background Jobs] Found ${pendingJobs?.length} jobs on ${JobStatus.PENDING} status`)

    const jobsStatusChanged = pendingJobs.map((job) => {
      console.debug(`[Background Jobs] Job ${job.id} changed to ${JobStatus.RUNNING} status`)
      return new JobStatusChanged(job.id, JobStatus.RUNNING, job.retried, undefined, new Date().toISOString())
    })
    register.events(...jobsStatusChanged)
  }

  private static async getLimit() {
    const optionsFunction = Booster.config.getRegisteredRocketFunction(backgroundOptionsID)
    if (!optionsFunction) {
      return DEFAULT_BATCH_SIZE
    }
    const options = await optionsFunction(Booster.config, undefined) as BackgroundOptions
    return options.batchSize || DEFAULT_BATCH_SIZE
  }
}
