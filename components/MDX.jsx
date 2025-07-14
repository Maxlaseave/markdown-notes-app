import Markdown from "markdown-to-jsx";
import TopNav from "./TopNav";

export default function MDX(props) {
    const { text } = props
//     const md = `# this is a header
// ## this is a header 2
//  hello world [clicke me](https://www.google.com)
//         `
    return (
        <section className="mdx-container">
            <TopNav {...props}/>
            <article>
                <Markdown>
                    {text.trim() || 'Create a new note in the editor'}
                </Markdown>
            </article>
        </section>
    )
}