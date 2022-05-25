import { UUID } from '@boostercloud/framework-types'
import { JobStatus } from '../types/job-status'

export class JobStatusChanged {
  public constructor(
    readonly jobId: UUID,
    public status: JobStatus,
    public retried: number,
    public lastRetryAt: string = '',
    public lastStartedAt: string = ''
  ) {}

  public entityID(): UUID {
    return this.jobId
  }

  public getStatus(): JobStatus {
    return this.status
  }

  public getRetried(): number {
    return this.retried
  }

  public getLastRetryAt(): string | undefined {
    return this.lastRetryAt
  }
}
