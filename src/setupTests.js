import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import './i18n.js'

afterEach(() => {
  cleanup()
})
