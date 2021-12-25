import { ECommandMode } from './../models/command'
import { REPOSITORY_URL } from './env'
import { Subject } from 'rxjs'

import { ICollectionSet } from '@models/dataset'
import {
  ICommandResult,
  TCommandMap,
  TCommand
} from '@models/command'
import { mergeCollection } from '@scripts/collection'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { extractQuerySource, loadSourceSet } from '@scripts/source'

interface IMonke {
  sources: string[]
  collections: ICollectionSet[]
  selected: number
}

interface IMonkeSubjects {
  commands: Subject<TCommandMap>

  sources: Subject<string[]>
  collections: Subject<ICollectionSet[]>
  selected: Subject<number>
  isLoading: Subject<boolean>
}

/**
 * Monke is a management system for flash cards.
 */
export class Monke {
  async init() {
    // Exract the source list from the query string.
    const urls = extractQuerySource(window.location.search)
      .reduce((acc, url) => acc.add(url), new Set<string>())
    await getLocalSourceList().then(list =>
      list.forEach(url => urls.add(url))
    )

    this.subject.selected.subscribe(c => this.data.selected = c)
    this.subject.collections.subscribe(c => this.data.collections = c)
    this.subject.sources.subscribe(s => this.data.sources = s)
    this.subject.sources.subscribe(s => saveLocalSourceList(s))
    this.subject.sources.subscribe(s => this.load(s))
    this.subject.sources.next(Array.from(urls))
  }

  async load(sources: string[]) {
    // Load the data from the server.
    this.subject.isLoading.next(true)
    try {
      const sets = await loadSourceSet(sources)
      this.subject.collections.next(mergeCollection(sets))

      // console.dir(this.data.collections)
      // console.log('?source=' + this.data.sources.reduce((acc, cur) => `${acc}${acc && '+'}${cur}`, ''))
    } catch (e) {
      console.error(e)
    }
    this.subject.isLoading.next(false)
  }

  async addSource(url: string) {
    const index = this.data.sources.findIndex(s => s === url)
    if (index !== -1) return
    this.data.sources.push(url)
    this.subject.sources.next(this.data.sources)
  }

  registerCommands() {
    this.addCommand('collection', async () => {
      this.subject.commands.next(new Map(
        this.data.collections.map(({ collection }, index) => [
          collection.title,
          async () => this.subject.selected.next(index)
        ])
      ))
      return {
        success: false,
        hint: 'select collection to open',
        restore: () => this.restoreCommands()
      }
    })
    this.addCommand('sources', async () => {
      this.subject.commands.next(new Map(
        this.getSources().map((url, index) => [url, async () => {
          this.subject.commands.next(this.editSourceCommands(url, index))
          return { success: false, hint: 'select mode' }
        }])
      ))
      return {
        success: false,
        hint: 'select source to edit',
        restore: () => this.restoreCommands()
      }
    })
    this.addCommand('add source', async () => {
      return {
        success: false,
        mode: ECommandMode.Input,
        hint: 'enter url of the source',
        fn: async (value) => this.addSource(value)
      }
    })
    this.addCommand('remove source', async () => {
      this.subject.commands.next(new Map(
        this.data.sources.map((url, index) => [
          url, async () => this.removeSource(index)
        ])
      ))
      return { success: false, restore: () => this.restoreCommands() }
    })
    this.addCommand('remove source', async () => {
      this.subject.commands.next(new Map(
        this.getSources().map((url, index) => [
          url, async () => {
            const sources = this.getSources()
            sources.splice(index, 1)
            this.subject.sources.next(sources)
          }
        ])
      ))
      return {
        success: false,
        restore: () => this.restoreCommands()
      }
    })
    this.addCommand('reload', async () => {
      await this.load(this.getSources())
    })
    this.addCommand('repository', async () => {
      window.open(`${REPOSITORY_URL}`, '_blank')
    })
    this.addCommand('report bugs', async () => {
      window.open(`${REPOSITORY_URL}/issues`, '_blank')
    })
    this.addCommand('docs', async () => {
      window.open(`${REPOSITORY_URL}/tree/trunk/docs`, '_blank')
    })

    this.subject.commands.subscribe(map => this.currCommands = map)
    this.subject.commands.next(this.baseCommands)
  }

  addCommand(name: string, cmd: TCommand) {
    this.baseCommands.set(name, cmd)
  }
  async runCommand(cmd: string): Promise<ICommandResult | void> {
    const command = this.currCommands.get(cmd)
    if (!command) return { success: false }
    return await command(cmd)
  }

  get subjectCommands() {
    return this.subject.commands
  }
  get subjectSources() {
    return this.subject.sources
  }
  get subjectCollectionSets() {
    return this.subject.collections
  }
  get subjectCollection() {
    return this.subject.selected
  }

  get subjectIsLoading() {
    return this.subject.isLoading
  }

  getSources() {
    return this.data.sources
  }
  getCollections() {
    return this.data.collections
  }
  getCollectionByName(name: string) {
    return this.data.collections.find(c => c.collection.title === name)
  }
  getSelectedCollection() {
    if (this.data.selected === -1) return null
    return this.data.collections[this.data.selected]
  }
  restoreCommands() {
    this.subject.commands.next(this.baseCommands)
  }

  editSource(index: number, url: string) {
    this.data.sources[index] = url
    this.subject.sources.next(this.data.sources)
  }

  removeSource(index: number) {
    this.data.sources.splice(index, 1)
    this.subject.sources.next(this.data.sources)
  }

  private editSourceCommands(source: string, index: number) {
    const edit: TCommand = async (cmd) => ({
      success: false,
      mode: ECommandMode.Input,
      default: source,
      fn: async (input) => {
        if (input === '') return { success: false }
        this.editSource(index, input)
      }
    })
    return new Map([
      ['edit', edit],
      ['remove', async () => this.removeSource(index)],
    ])
  }

  private baseCommands: TCommandMap = new Map<string, TCommand>()
  private currCommands: TCommandMap = new Map<string, TCommand>()

  private data: IMonke = {
    sources: [],
    collections: [],
    selected: -1,
  }

  private subject: IMonkeSubjects = {
    commands: new Subject(),
    sources: new Subject<string[]>(),
    collections: new Subject<ICollectionSet[]>(),
    selected: new Subject<number>(),
    isLoading: new Subject<boolean>(),
  }
}
