const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max( ...blogs.map(blog => blog.likes) )

    return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
    const uniqueBlogAuthors = new Map()

    blogs.forEach(blog => {
        uniqueBlogAuthors.set(blog.author, 0)
    })

    blogs.forEach(blog => {
        const author = blog.author

        if (uniqueBlogAuthors.has(author)) {
            const freq = uniqueBlogAuthors.get(author)
            uniqueBlogAuthors.set(author, freq + 1)
        }
    })

    const mostBlogsEntry = 
        [...uniqueBlogAuthors.entries()].reduce((a, e) => e[1] > a[1] ? e : a)

    return {
        author: mostBlogsEntry[0],
        blogs: mostBlogsEntry[1]
    }
}

const mostLikes = (blogs) => {
    const uniqueBlogAuthors = new Map()

    blogs.forEach(blog => {
        uniqueBlogAuthors.set(blog.author, 0)
    })

    blogs.forEach(blog => {
        const author = blog.author

        if (uniqueBlogAuthors.has(author)) {
            const likes = uniqueBlogAuthors.get(author)
            uniqueBlogAuthors.set(author, likes + blog.likes)
        }
    })

    const mostBlogsEntry = 
        [...uniqueBlogAuthors.entries()].reduce((a, e) => e[1] > a[1] ? e : a)

    return {
        author: mostBlogsEntry[0],
        likes: mostBlogsEntry[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}