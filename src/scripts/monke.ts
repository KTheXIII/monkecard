import { number } from 'fp-ts'
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
  selected: number
}

interface IMonkeSubjects {
  cmd: Subject<ICommandBase>
  commands: Subject<ICommandBase[]>
  sources: Subject<string[]>
  collectionSets: Subject<ICollectionSet[]>
  collection: Subject<number>
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
    this.subject.collection.subscribe(c => this.data.selected = c)
    this.subject.collectionSets.subscribe(c => this.data.collections = c)
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
      this.subject.collectionSets.next(mergeCollection(sets))

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
    this.data.sources.splice(index, 1)
    this.subject.sources.next(this.data.sources)
  }

  addCommand(command: ICommandBase) {
    this.data.commands.push(command)
    this.subject.commands.next(this.data.commands)
  }

  get subjectSources() {
    return this.subject.sources
  }
  get subjectCollectionSets() {
    return this.subject.collectionSets
  }
  get subjectCollection() {
    return this.subject.collection
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
  getCollectionByName(name: string) {
    return this.data.collections.find(c => c.collection.title === name)
  }
  getCollection() {
    if (this.data.selected === -1) return null
    return this.data.collections[this.data.selected]
  }

  private data: IMonke = {
    commands: [],
    sources: [],
    collections: [],
    selected: -1
  }

  private subject: IMonkeSubjects = {
    cmd: new Subject<ICommandBase>(),
    commands: new Subject<ICommandBase[]>(),
    sources: new Subject<string[]>(),
    collectionSets: new Subject<ICollectionSet[]>(),
    collection: new Subject<number>(),
    isLoading: new Subject<boolean>(),
  }
}

