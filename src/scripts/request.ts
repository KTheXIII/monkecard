import * as yaml from 'js-yaml'
import {
  IYAMLFiles,
  IYAMLSubject,
  IYAMLQuestions
} from '@models/yaml.model'
import { FILES_URL } from './config'

/**
 * Request the YAML file from the server and parse it to a JavaScript object.
 *
 * @param path File path
 * @returns Promise with JavaScript Object
 */
export async function YAML<T>(path: string): Promise<T> {
  try {
    const res = await fetch(path)
    if (!res.ok) return Promise.reject(`Error fetching file: ${path}`)

    const text = await res.text()
    const data = yaml.load(text) as any
    if (data.version === '0.0.0')
      return Promise.resolve(data)

    return Promise.reject(`File with path: ${path} is not supported`)
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * Request root YAML file from the server and parse it to a JavaScript Object.
 *
 * @description This file is needed to request all other files.
 *              The main one being the subjects.yaml.
 *
 * @returns Promise with JavaScript Object
 */
export async function files(): Promise<IYAMLFiles> {
  return YAML(FILES_URL)
}

/**
 * Request the subjects YAML file from the server and parse it to a JavaScript
 * Object.
 *
 * @description This file is needed to request questions yaml files.
 *
 * @returns Promise with Subjects Object
 */
export async function subject(path: string): Promise<IYAMLSubject> {
  return YAML(path)
}

export async function questions(path: string): Promise<IYAMLQuestions> {
  return YAML(path)
}
