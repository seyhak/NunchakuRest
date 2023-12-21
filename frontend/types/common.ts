import { UUID } from "crypto"

export interface Timestamped {
  createdAt: Date | null,
  updatedAt: Date | null,
}

export interface NamedUUID {
  id: UUID
  name: string
}
