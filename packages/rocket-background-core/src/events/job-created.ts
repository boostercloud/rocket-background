import { UUID } from '@boostercloud/framework-types'
import { JobOptions } from '../types/job-options'
import { JobStatus } from '../types/job-status'

export class JobCreated {
  public constructor(
    readonly jobId: UUID,
    readonly when: string,
    readonly status: JobStatus,
    readonly jobOptions: JobOptions,
    readonly jobFunctionName: string,
    readonly params?: Record<string, any>
  ) {}

  public entityID(): UUID {
    return this.jobId
  }
}
