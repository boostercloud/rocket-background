import { Reduces } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { JobCreated } from '../events/job-created'
import { JobStatusChanged } from '../events/job-status-changed'
import { JobOptions } from '../types/job-options'
import { JobStatus } from '../types/job-status'

export class Job {
  public constructor(
    readonly id: UUID,
    public createdOn: string,
    public when: string,
    public status: JobStatus,
    public jobOptions: JobOptions,
    public jobFunctionName: string,
    public params?: Record<string, any>,
    public retried: number = 0,
    public lastRetryAt: string = '',
    public lastStartedAt: string = ''
  ) {}

  public getId(): UUID {
    return this.id
  }

  public getFunctionName(): string {
    return this.jobFunctionName
  }

  @Reduces(JobCreated)
  public static jobCreated(event: JobCreated, currentJob: Job): Job {
    if (currentJob !== null) {
      throw new Error(`Duplicate job ${JSON.stringify(currentJob)}`)
    }
    return new Job(
      event.jobId,
      new Date().toISOString(),
      event.when,
      event.status,
      event.jobOptions,
      event.jobFunctionName,
      event.params
    )
  }

  @Reduces(JobStatusChanged)
  public static jobStatusChanged(event: JobStatusChanged, currentJob: Job): Job {
    if (currentJob === null) {
      throw new Error('Could not find job')
    }
    currentJob.status = event.status
    currentJob.retried = event.retried
    currentJob.lastRetryAt = event.lastRetryAt
    currentJob.lastStartedAt = event.lastStartedAt
    return currentJob
  }
}
