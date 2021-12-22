import { Subject } from 'rxjs'

import { mergeCollection } from '@scripts/collection'
import { ICollectionSet } from '@models/dataset'
import { ICommandBase } from '@models/command'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { extractQuerySource, loadSourceSet } from '@scripts/source'

interface IMonke {
  commands: ICommandBase[]
  sources: string[]
  collections: ICollectionSet[]
}

interface IMonkeSubjects {
  cmd: Subject<ICommandBase>
  commands: Subject<ICommandBase[]>
  sources: Subject<string[]>
  collections: Subject<ICollectionSet[]>
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

  async removeSource(url: string) {
    const index = this.data.sources.findIndex(s => s === url)
    if (index === -1) return
    this.data.sources.splice(index)
    this.subject.sources.next(this.data.sources)
  }

  addCommand(command: ICommandBase) {
    this.data.commands.push(command)
    this.subject.commands.next(this.data.commands)
  }

  get subjectSources() {
    return this.subject.sources
  }
  get subjectCollections() {
    return this.subject.collections
  }
  get subjectCommands() {
    return this.subject.commands
  }
  get subjectCMD() {
    return this.subject.cmd
  }
  get subjectIsLoading() {
    return this.subject.isLoading
  }

  getCommands() {
    return this.data.commands
  }
  getSources() {
    return this.data.sources
  }
  getCollections() {
    return this.data.collections
  }

  private data: IMonke = {
    commands: [],
    sources: [],
    collections: [],
  }
  private subject: IMonkeSubjects = {
    cmd: new Subject<ICommandBase>(),
    commands: new Subject<ICommandBase[]>(),
    sources: new Subject<string[]>(),
    collections: new Subject<ICollectionSet[]>(),
    isLoading: new Subject<boolean>(),
  }
}

