import { Register, UUID } from '@boostercloud/framework-types'
import { JobOptions } from '../types/job-options'
import { JobCreated } from '../events/job-created'
import { DEFAULT_JOB_OPTIONS } from '../types/constants'
import { JobStatus } from '../types/job-status'
import { JobStatusChanged } from '../events/job-status-changed'

export class Background {
  constructor(readonly register: Register) {}

  public async runAsync(
    jobFunctionName: string,
    parameters: Record<string, any>,
    jobOptions?: JobOptions
  ): Promise<void> {
    const event = new JobCreated(
      UUID.generate(),
      new Date().toISOString(),
      JobStatus.PENDING,
      jobOptions || DEFAULT_JOB_OPTIONS,
      jobFunctionName,
      parameters
    )
    console.debug('[Background Jobs] Registered new job', event.jobId, event.when)
    this.register.events(event)
  }

  public async schedule(
    when: string,
    jobFunctionName: string,
    parameters: Record<string, any>,
    jobOptions?: JobOptions
  ): Promise<void> {
    const event = new JobCreated(
      UUID.generate(),
      when,
      JobStatus.PENDING,
      jobOptions || DEFAULT_JOB_OPTIONS,
      jobFunctionName,
      parameters
    )
    console.debug('[Background Jobs] Registered new job', event.jobId, event.when)
    this.register.events(event)
  }

  public async restart(jobId: UUID): Promise<void> {
    const event = new JobStatusChanged(
      jobId,
      JobStatus.PENDING,
      0
    )
    console.debug('[Background Jobs] Restarting job', event.jobId)
    this.register.events(event)
  }

  public async delete(jobId: UUID, retried: number): Promise<void> {
    const event = new JobStatusChanged(
      jobId,
      JobStatus.DELETED,
      retried
    )
    console.debug('[Background Jobs] Deleting job', event.jobId)
    this.register.events(event)
  }
}
