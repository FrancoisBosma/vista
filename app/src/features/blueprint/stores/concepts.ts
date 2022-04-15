import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Concept } from '@SRC/types'

export const useConceptStore = defineStore('concepts', () => {
  const helloWorld: Concept = {
    title: 'Hello World!',
    subTiles: [
      {
        title: 'first subtile',
        subTiles: [
          {
            title: 'a leaf',
            subTiles: [
              { title: 'AAA', subTiles: [{ title: 'abc', subTiles: [] }] },
              { title: 'BBB', subTiles: [] },
            ],
          },
          { title: 'another leaf', subTiles: [{ title: 'xyz', subTiles: [] }] },
        ],
      },
      {
        title: 'some leaf',
        subTiles: [
          {
            title: 'Hey',
            subTiles: [
              { title: 'YYY', subTiles: [] },
              { title: 'ZZZ', subTiles: [] },
            ],
          },
        ],
      },
      { title: 'last leaf', subTiles: [] },
    ],
  }

  return {
    helloWorld,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useConceptStore, import.meta.hot))
