import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = () => {
    const blogs = useSelector(state => {
        let blogsToSort = [...state.blogs]
        return blogsToSort.sort((a, b) => b.likes - a.likes)
    })

    const linkStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 2,
        marginBottom: 5
    }

    return (
        <div>
            {blogs.map(blog =>
                <div key={blog.id} style={linkStyle}>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </div>
            )}
        </div>
    )
}

export default BlogList