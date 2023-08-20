'use strict'
const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 5

var idx = 1
var gBooks
var gSortBy = ''
var gPageIdx = 0
var gFilterBy = { rate: 0, search: '' }
createBooks()

let gViewBy = 'table'

function getBooks() {
    var books = gBooks.filter(book => book.rate >= gFilterBy.rate && book.title.includes(gFilterBy.search))

    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function setViewBy(viewBy) {
    gViewBy = viewBy
}

function getViewBy() {
    return gViewBy
}

function getExpansiveBooks() {
    var books = gBooks.filter(book => book.price >= 70)
    return books
}

function getNormalBooks() {
    var books = gBooks.filter(book => book.price >= 50 && book.price <= 70)
    return books
}

function getCheapBooks() {
    var books = gBooks.filter(book => book.price <= 50)
    return books
}
function createBooks() {
    gBooks = loadBooks(STORAGE_KEY)
    gBooks = [
        createBook('The Bible'),
        createBook('The Catcher in the Rye'),
        createBook('Things Fall Apart'),
        createBook('The Great Gatsby'),
        createBook('Lord of the Rings'),
        createBook('Alice\'s Adventures in Wonderland'),
        createBook('Beloved'),
        createBook('Great Expectations'),
        createBook('The Handmaid\'s Tale')
    ]
    console.log(gBooks);
    saveBooks()
}
function createBook(title, price = getRandomInt(5, 99), action) {
    return {
        id: idx++,
        title,
        price,
        action,
        rate: getRandomInt(0, 10)
    }
}
function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE > gBooks.length) gPageIdx = 0
}

function saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}
function loadBooks() {
    return loadFromStorage(STORAGE_KEY)
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    saveBooks()
    flashMsg('Succesfuly removed!')
}

function addBook(name, price) {
    const book = createBook(name, price)
    gBooks.push(book)
    saveBooks()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function updateBook(bookId, bookPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = bookPrice
    saveBooks()
    return book
}

function setBookFilter(filterBy = {}) {
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
    if (filterBy.search !== undefined) gFilterBy.search = filterBy.search
    return gFilterBy
}

function setBookSort(sortBy) {
    console.log(sortBy);
    if (sortBy === 'price') {
        console.log(sortBy);
        gBooks.sort((b1, b2) => (b1.price - b2.price))
    } else if (sortBy === 'title') {
        gBooks.sort((b1, b2) => b1.title.localeCompare(b2.title))
    } else gBooks.sort((b1, b2) => b1.id - b2.id)
}
