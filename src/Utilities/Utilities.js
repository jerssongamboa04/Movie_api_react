
const fetchData = async (url) => {
    const data = await fetch(url)
    return data.json()
}

const promiseAll = async (array) => {
    const data = await Promise.all(array.map(element => fetchData(element.url)))
    return data
}


export {
    fetchData,
    promiseAll
}