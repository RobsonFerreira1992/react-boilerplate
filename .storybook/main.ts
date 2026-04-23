import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  staticDirs: ['../public'],
  stories: ['../src/**/stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
}

export default config
