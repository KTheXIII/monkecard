import { Command } from '@scripts/command'
import { ECommandMode, TCommand } from '@models/command'
import { REPOSITORY_URL } from '@scripts/env'
import { Subject } from 'rxjs'

import { ICollectionSet } from '@models/dataset'
import { mergeCollection } from '@scripts/collection'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { extractQuerySource, loadSourceSet } from '@scripts/source'

interface IMonke {
  sources: string[]
  collections: ICollectionSet[]
  selected: number
}

interface IMonkeSubjects {
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

  register(command: Command<TCommand>) {
    command.addBase('collection', async () => {
      command.next(this.data.collections.map(({ collection }, i) => [
        collection.title,
        async () => this.subject.selected.next(i)
      ]))
      return {
        success: false,
        hint: 'select a collection to open',
        restore: command.restore.bind(command)
      }
    })

    command.addBase('sources', async () => {
      command.next(this.data.sources.map((url, i) => [
        url,
        async () => {
          command.next([
            ['edit', async () => ({
              success: false,
              hint: 'edit the source url',
              mode: ECommandMode.Input,
              default: url,
              fn: async (input: string) => this.editSource(i, input)
            })],
            ['remove', async () => this.removeSource(i)]
          ])
          return { success: false, hint: 'select mode' }
        }
      ]))
      return {
        success: false,
        hint: 'select a source to edit',
        restore: command.restore.bind(command)
      }
    })

    command.addBase('add source', async () => ({
      success: false,
      mode: ECommandMode.Input,
      hint: 'enter url source to add',
      fn: async (input: string) => this.addSource(input)
    }))

    command.addBase('remove source', async () => {
      command.next(this.data.sources.map((url, i) => [
        url,
        async () => this.removeSource(i)
      ]))
      return {
        success: false,
        hint: 'select a source to remove',
        restore: command.restore.bind(command)
      }
    })

    command.addBase('reload', async () => await this.load(this.data.sources))
    command.addBase('repository', async () => {
      window.open(`${REPOSITORY_URL}`, '_blank')
    })
    command.addBase('report bugs', async () => {
      window.open(`${REPOSITORY_URL}/issues`, '_blank')
    })
    command.addBase('docs', async () => {
      window.open(`${REPOSITORY_URL}/tree/trunk/docs`, '_blank')
    })
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

  editSource(index: number, url: string) {
    this.data.sources[index] = url
    this.subject.sources.next(this.data.sources)
  }

  removeSource(index: number) {
    this.data.sources.splice(index, 1)
    this.subject.sources.next(this.data.sources)
  }

  private data: IMonke = {
    sources: [],
    collections: [],
    selected: -1,
  }

  private subject: IMonkeSubjects = {
    sources: new Subject<string[]>(),
    collections: new Subject<ICollectionSet[]>(),
    selected: new Subject<number>(),
    isLoading: new Subject<boolean>(),
  }
}
