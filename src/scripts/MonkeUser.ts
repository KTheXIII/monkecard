
export class MonkeUser {
  async save(): Promise<void> {
    throw new Error('Not implemented')
  }

  async login(id?: string): Promise<void> {
    if (id) {
      throw new Error('Not implemented')
    } else {
      throw new Error('Not implemented')
    }
  }

  async logout(): Promise<void> {
    throw new Error('Not implemented')
  }

  private id!: string
}
