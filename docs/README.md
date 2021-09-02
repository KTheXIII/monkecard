# docs

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

`description`: Description for the collection (optional), this will be ignore if the `title` is not defined.

`lang`: Language of the collection (optional), ignored if `title` is not defined.

`created`: ISO-8601 format or unix time in milliseconds.

`updated`: ISO 8601 format or unix time in millisedconds.

`datas`: Question datas. Check [Question Source](#question-source) for template.

### Question Source

```yml
text: string
description: string (optional)
options: array of option
keywords: array of string
id: string
```

#### Option Source

```yml
text: string
correct: boolean
```
