import { Entity } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Entity({
  authorizeReadEvents: 'all',
})
export class Cart {
  public constructor(readonly id: UUID) {}

}
