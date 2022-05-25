import { Projects } from '@boostercloud/framework-core'
import { ProjectionResult, UUID } from '@boostercloud/framework-types'
import { Job } from '../entities/job'
import { JobStatus } from '../types/job-status'

export class JobReadModel {
  public constructor(
    readonly id: UUID,
    public createdOn: string,
    public when: string,
    public status: JobStatus,
    public jobFunctionName: string,
    public retried: number = 0,
    public lastRetryAt: string = '',
    public lastStartedAt: string = '',
    public params?: Record<string, any>
  ) {}

  @Projects(Job, 'id')
  public static update(job: Job, oldJobReadModel?: JobReadModel): ProjectionResult<JobReadModel> {
    return new JobReadModel(job.id, job.createdOn, job.when, job.status, job.jobFunctionName, job.retried, job.lastRetryAt, job.lastStartedAt, job.params)
  }
}
