import { Register } from '@boostercloud/framework-types'
import { Booster } from '@boostercloud/framework-core'
import { JobStatusChanged } from '../events/job-status-changed'
import { Job } from '../entities/job'
import { JobStatus } from '../types/job-status'

export class HandleStarted {
  public static async handle(event: JobStatusChanged, register: Register): Promise<void> {
    event.getStatus()

    if (event.status === JobStatus.RUNNING) {
      await this.handleRunningJob(event, register)
    }
  }

  private static async handleRunningJob(event: JobStatusChanged, register: Register) {
    const job = (await Booster.entity(Job, event.jobId)) as Job
    try {
      const functionName = job.getFunctionName()
      const registeredRocketFunction = Booster.config.getRegisteredRocketFunction(functionName)
      if (registeredRocketFunction) {
        await registeredRocketFunction(Booster.config, job.params)
      } else {
        throw new Error(`function ${functionName} not found`)
      }
      console.log(`[Background Jobs] job ${job.id} executed successfully`)
      register.events(new JobStatusChanged(job?.id, JobStatus.SUCCESS, job.retried, job.lastRetryAt, job.lastStartedAt))
    } catch (e) {
      console.log(`[Background Jobs] job ${job.id} FAILED`, e)
      const newStatus = this.calculateNewStatus(job)
      const retried = this.calculateRetriedTimes(newStatus, job)
      register.events(new JobStatusChanged(event.jobId, newStatus, retried, new Date().toISOString(), event.lastStartedAt))
    }
  }

  private static calculateRetriedTimes(newStatus: JobStatus, job: Job): number {
    return newStatus === JobStatus.PENDING ? job.retried + 1 : job.retried
  }

  private static calculateNewStatus(job: Job): JobStatus {
    return job.retried < job.jobOptions.retryTimes ? JobStatus.PENDING : JobStatus.DEAD
  }
}
