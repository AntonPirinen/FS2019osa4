const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    let likes = 0
    blogs.forEach(blog => {
        likes = likes + blog.likes
    });
    return likes
}

const favoriteBlog = (blogs) => {
    let favorite = blogs[0]
    blogs.forEach(blog => {
        if (favorite.likes < blog.likes) {
            favorite = blog
        }
    });
    return favorite
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}