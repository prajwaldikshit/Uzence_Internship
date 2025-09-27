import type { Preview } from '@storybook/react'
import '../client/src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'hsl(210, 40%, 98%)',
        },
        {
          name: 'dark',
          value: 'hsl(222, 84%, 5%)',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'
      
      // Apply theme to document
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
      }
      
      return React.createElement('div', 
        { className: `${theme} bg-background text-foreground min-h-screen p-4` },
        React.createElement(Story)
      )
    },
  ],
}

export default preview
