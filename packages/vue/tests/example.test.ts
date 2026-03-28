import { describe, it, expect } from 'vitest'
import { createBartender } from '../src/index'

describe('vue-bartender.js', () => {
  it('should export createBartender', () => {
    expect(createBartender).toBeDefined()
    expect(typeof createBartender).toBe('function')
  })

  it('should create a plugin', () => {
    const plugin = createBartender()
    expect(plugin).toBeDefined()
    expect(plugin.install).toBeDefined()
  })
})
