'use client'

import type { Dictionary } from '@/dictionaries'

function Content({ dictionary }: {
  dictionary: Dictionary
}) {
  return (<>
    <div>{dictionary[404].title}</div>
  </>)
}

export default Content
