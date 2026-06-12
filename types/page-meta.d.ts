import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    pageBackground?: 'blue' | 'dark' | 'white' | 'cyan'
  }
}

export {}
