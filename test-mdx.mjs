import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { renderToStaticMarkup } from 'react-dom/server'

const source = `
| A | B |
|---|---|
| 1 | 2 |
`

async function run() {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    }
  })
  console.log(renderToStaticMarkup(content))
}
run()
