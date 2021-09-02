# docs

## Adding sources

Sources can be add with `query` parameter in the URL.

```
?sources=url1+url2
```

multiple urls can be separate with `+`

## Collection Source

Check the [collection-sample.yml](./collection-sample.yml) for a sample file.

```yml
title: string (optional)
description: string (optional)
lang: string (optional)

created: string or number
updated: string or number

datas: array of questions
```

`title`: Title of the collection file. If this is not defined then the question will show in unknown collection. If there are multiple collection files with the same title, then the `datas` will be merge together.

`description`: Description for the collection (optional), this will be ignored if the `title` is not defined. Markdown is supported with Latex Math.

`lang`: Language of the collection (optional), ignored if `title` is not defined.

`created`: ISO-8601 format or unix time in milliseconds.

`updated`: ISO-8601 format or unix time in millisedconds.

`datas`: Question datas. Check [Question Source](#question-source) for template.

### Question Source

```yml
text: string
description: string (optional)
options: array of option
keywords: array of string (optional)
id: string
lang: string (optional)
```

`text`: Question main text, supports Latex Math.

`description`: More text for the question (optional), supports Markdown and Latex Math.

`options`: Array of options, check [Option Source](#option-source).

`keywords`: Question keywords (optional), if there are no keyword the question will be in the unknown keywords.

`id`: Question id, this must unique, if it's not then another id will be generated when the questions are merged.

`lang`: Question language.

#### Option Source

```yml
text: string
correct: boolean
```

`text`: Option text, supports Markdown and Latex Math

`correct`: Determine if the question is correct or not, bool value `true` or `false`.
