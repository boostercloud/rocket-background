# Booster Rocket Background Jobs

## Description

This Rocket adds a background job engine to your Booster application. You will be able to run async methods or schedule them to be run in the future.

## Supported Providers
This Rocket supports any provider as non infrastructure is needed.

## Application configuration

Configure your rocket on your `config.ts` file invoking to the `configure` method with a `backgroundOptions`:

```typescript
Booster.configure('local', (config: BoosterConfig): void => {
  config.appName = 'rocket-background-example'
  config.providerPackage = '@boostercloud/framework-provider-local'
  const backgroundFunctions: Record<string, RocketFunction> = {
    asyncFunction: asyncFunction,
    asyncFailedFunction: asyncFailedFunction,
  }
  const backgroundOptions = {
    authorizeReadEvents: 'all',
    authorizeReadModels: 'all',
    backgroundFunctions: backgroundFunctions,
    checkJobsDelayInMinutes: 1,
    batchSize: 10,
  } as BackgroundOptions
  configure(config, backgroundOptions)
})
```

### Parameters

* **authorizeReadEvents**: Roles allowed querying Job events
* **authorizeReadModels**: Roles allowed querying Job read model
* **backgroundFunctions**: A Record of the async methods to be run
* **checkJobsDelayInMinutes**: Configure delay to check job status.
* **batchSize**: Number of jobs processed in each interval

## Usage

* Invoking the `runAsync` command with the name of the function to be run creates and handle a job to invoke the method.
* Invoking the `schedule` command with the name of the function to be run creates and handle a job to invoke the method after the `when` date.

You can configure the retry times on both methods. 

```typescript
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
```

Check folder `rocket-background-example` with more examples. Start the example calling to this GraphQL mutation:

```
mutation {
  StartJobs
}
```

Check job status:

```

{
  ListJobReadModels(filter: {
    
  }) {
    items {
      id
      createdOn
      when
      status
      jobFunctionName
      params
      retried
    }
    count
    cursor
  }
}
```

Other examples includes: deleting and restarting a job

## Compile

lerna clean --yes \
&& lerna bootstrap \
&& lerna run clean --stream \
&& lerna run compile --stream

## Run example

> cd packages/rocket-background-example

> boost start -e local
