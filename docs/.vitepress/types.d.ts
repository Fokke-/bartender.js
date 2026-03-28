import type { BartenderBarDefaultOptions } from '../../src/index'

interface Bar extends BartenderBarDefaultOptions {
  name: string
  title?: string
}
