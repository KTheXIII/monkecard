# docs

## Adding sources

Sources can be add with `query` parameter in the URL.

```
?source=url1+url2
```

multiple urls can be separate with `+`, this means that any url that uses `+` will not work.

## Collection Source

Check the [collection-sample.yml](./collection-sample.yml) for a sample file. The app also supports JSON, with the same key name as yaml file.

```yml
title: string (optional)
description: string (optional)
lang: string (optional)

created: string or number
updated: string or number

items: Item[]
```

`title`: Title of the collection file. If this is not defined then the question will show in unknown collection. If there are multiple collection files with the same title, then the `datas` will be merge together.

`description`: Description for the collection (optional), this will be ignored if the `title` is not defined. Markdown is supported with Latex Math.

`lang`: Language of the collection (optional), ignored if `title` is not defined, uses [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

`created`: ISO-8601 format or unix time in milliseconds.

`updated`: ISO-8601 format or unix time in millisedconds.

`items`: An item can be either a question or a memo.

### Item

`item` object is the base to other type of items. For now we only supports `Memo` and `Question` type of items.

`Item object`

```yml
type: ItemType
id: string
keywords: string[]
lang: string (optional)
```

 - `type`: `ItemType:` `[ Unknwon, Question, Memo ]`
 - `id`: Unqiue ID, if it's not unique in the collection then it'll be generated to avoid conflict.
 - `keywords`: string of keywords, if it's empty then the default will be `unknown`.
 - `lang`: Item language uses [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

#### Question Item

```yml
text: string
description: string (optional)
options: Option[]
note: string (optional)

type: ItemType
id: string
keywords: string[]
lang: string (optional)
```

Option type

```ts
interface Option {
  text: string
  correct: boolean
}
```

#### Memo Item

```yml
front: string
back: string

type: ItemType
id: string
keywords: string[]
lang: string (optional)
```
