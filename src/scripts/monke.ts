import {
  VERSION, COMMIT_HASH, REPOSITORY_URL
} from './env'
import {
  ECommandType,
  ICommandBase,
  ICommandNormal,
  ICommandInput,
  ICommandOption,
} from '@models/command'
import { mergeCollection } from '@scripts/collection'
import { ICollectionSet } from '@models/dataset'
import { ISourceSet } from '@models/dataset'
import { getLocalSourceList, saveLocalSourceList } from '@scripts/cache'
import { extractQuerySource, loadSourceSet } from '@scripts/source'
/**
 * monke.ts is a management system for flash cards.
 */

export class Monke {
  async init() {
    // Exract the source list from the query string.
    const urls = extractQuerySource(window.location.search)
      .reduce((acc, url) => acc.add(url), new Set<string>())
    await getLocalSourceList().then(list =>
      list.forEach(url => urls.add(url))
    )
    this.sourceList = Array.from(urls)
    await saveLocalSourceList(this.sourceList)

    // Load data
    await this.load()
  }

  async load() {
    // Load the data from the server.
    try {
      this.srcSetList = await loadSourceSet(this.sourceList)
      this.collectionList = mergeCollection(this.setList)

      console.dir(this.collectionList)
      console.log('?source=' + this.sourceList.reduce((acc, cur) => `${acc}${acc && '+'}${cur}`, ''))
    } catch (e) {
      console.error(e)
    }
  }
  async addSource(url: string) {
    const urls = new Set(this.sourceList)
    urls.add(url)
    await saveLocalSourceList(Array.from(urls))
    this.sourceList = await getLocalSourceList()
    await this.load()
  }

  async removeSource(url: string) {
    const urls = new Set(this.sourceList)
    urls.delete(url)
    await saveLocalSourceList(Array.from(urls))
    this.sourceList = await getLocalSourceList()
    await this.load()
  }

  addCommandN(name: string, fn: () => void) {
    this.commandList.push({
      type: ECommandType.Normal,
      name,
      fn,
    } as ICommandNormal)
  }
  addCommandI(name: string, hint: string, fn: (input: string) => void) {
    this.commandList.push({
      type: ECommandType.Input,
      name,
      hint,
      fn,
    } as ICommandInput)
  }
  addCommandO(name: string, hint: string,
    list: string[] | (() => string[]), fn: (value: string) => void) {
    this.commandList.push({
      type: ECommandType.Option,
      name,
      hint,
      list,
      fn,
    } as ICommandOption)
  }
  addInternalCommands() {
    const monkeVersion = `${VERSION}-${COMMIT_HASH.substring(0, 7)}`
    this.addCommandN(`monke: v${monkeVersion}`, () => {
      console.log(`v${monkeVersion}`)
    })
    this.addCommandN('github repository', () => {
      window.open(`${REPOSITORY_URL}`, '_blank', 'noreferrer')
    })
    this.addCommandN('report bugs', () => {
      window.open(`${REPOSITORY_URL}/issues`, '_blank', 'noreferrer')
    })
  }

  get collectionSet(): ICollectionSet[] {
    return this.collectionList
  }
  get setList(): ISourceSet[] {
    return this.srcSetList
  }
  getUrls(): string[] {
    return this.sourceList
  }
  get commands(): ICommandBase[] {
    return this.commandList
  }

  private cb?: () => void  = undefined
  private sourceList: string[] = []
  private srcSetList: ISourceSet[] = []
  private collectionList: ICollectionSet[] = []
  private commandList: ICommandBase[] = []
}

